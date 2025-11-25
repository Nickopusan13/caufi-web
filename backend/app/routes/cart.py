from fastapi import APIRouter, HTTPException, status, Depends
from app.db.session import AsyncSession
from app.db.models.product import Cart, Product, CartItem
from app.crud.user import get_user
from app.db.models.user import User
from app.crud.cart import upsert_cart_item
from app.security.jwt import get_current_user
from app.schemas.product import CartOut, CartItemOut, CartItemCreate
from app.db.dependencies import get_db
from sqlalchemy.orm import selectinload
from sqlalchemy import select

router = APIRouter()


@router.post(
    "/api/cart/add", response_model=CartItemOut, status_code=status.HTTP_201_CREATED
)
async def api_cart_add(
    data: CartItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.quantity <= 0:
        raise HTTPException(400, "Quantity must be > 0")
    cart = (
        await db.execute(select(Cart).where(Cart.user_id == current_user.id))
    ).scalar_one_or_none()
    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        await db.flush()
    product = await db.get(Product, data.product_id)
    if not product or not product.is_active:
        raise HTTPException(404, "Product not found or unavailable")
    item_id = await upsert_cart_item(db=db, cart_id=cart.id, product=product, data=data)
    await db.commit()
    result = await db.execute(
        select(CartItem)
        .options(
            selectinload(CartItem.product).selectinload(Product.images),
            selectinload(CartItem.product).selectinload(Product.colors),
            selectinload(CartItem.product).selectinload(Product.sizes),
            selectinload(CartItem.product).selectinload(Product.material),
        )
        .where(CartItem.id == item_id)
    )
    cart_item = result.scalar_one()
    return cart_item


@router.get("/api/cart/all", response_model=CartOut, status_code=status.HTTP_200_OK)
async def api_cart_all(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    cart = (
        await db.execute(select(Cart).where(Cart.user_id == current_user.id))
    ).scalar_one_or_none()
    if not cart:
        return CartOut(cart_items=[], total_items=0, cart_total=0)
    result = await db.execute(
        select(CartItem)
        .options(
            selectinload(CartItem.product).selectinload(Product.images),
            selectinload(CartItem.product).selectinload(Product.colors),
            selectinload(CartItem.product).selectinload(Product.sizes),
            selectinload(CartItem.product).selectinload(Product.material),
        )
        .where(CartItem.cart_id == cart.id)
    )
    items = result.scalars().all()
    total_items = sum(i.quantity for i in items)
    cart_total = sum(i.quantity * i.price for i in items)
    return CartOut(cart_items=items, total_items=total_items, cart_total=cart_total)


@router.delete(
    "/api/cart/{cart_id}", response_model=CartItemOut, status_code=status.HTTP_200_OK
)
async def api_delete_cart(
    cart_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cart = (
        await db.execute(select(Cart).where(Cart.user_id == current_user.id))
    ).scalar_one_or_none()
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found"
        )
    result = await db.execute(
        select(CartItem)
        .options(
            selectinload(CartItem.product).selectinload(Product.images),
            selectinload(CartItem.product).selectinload(Product.colors),
            selectinload(CartItem.product).selectinload(Product.sizes),
            selectinload(CartItem.product).selectinload(Product.material),
        )
        .where(CartItem.id == cart_id, CartItem.cart_id == cart.id)
    )
    cart_item = result.scalar_one_or_none()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    await db.delete(cart_item)
    await db.commit()
    return cart_item


@router.patch("/api/cart/update", response_model=CartOut)
async def api_update_cart_item(
    data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cart = (
        await db.execute(select(Cart).where(Cart.user_id == current_user.id))
    ).scalar_one_or_none()
    if not cart:
        raise HTTPException(404, "Cart not found")
    result = await db.execute(
        select(CartItem).where(
            CartItem.cart_id == cart.id,
            CartItem.product_id == data.product_id,
            CartItem.size == data.size,
            CartItem.color == data.color,
        )
    )
    cart_item = result.scalar_one_or_none()
    if not cart_item:
        raise HTTPException(404, "Item not in cart")
    if data.size is not None and data.size != cart_item.size:
        raise HTTPException(400, "Cannot change size. Remove and re-add the item.")
    if data.color is not None and data.color != cart_item.color:
        raise HTTPException(400, "Cannot change color. Remove and re-add the item.")
    if data.quantity <= 0:
        await db.delete(cart_item)
    else:
        cart_item.quantity = data.quantity
    await db.commit()
    result = await db.execute(
        select(CartItem)
        .options(
            selectinload(CartItem.product).selectinload(Product.images),
            selectinload(CartItem.product).selectinload(Product.colors),
            selectinload(CartItem.product).selectinload(Product.sizes),
            selectinload(CartItem.product).selectinload(Product.material),
        )
        .where(CartItem.cart_id == cart.id)
        .order_by(CartItem.id)
    )
    cart_items = result.scalars().all()

    return CartOut(
        cart_items=cart_items,
        total_items=sum(item.quantity for item in cart_items),
        cart_total=sum(item.quantity * item.price for item in cart_items),
    )
