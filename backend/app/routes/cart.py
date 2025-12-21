from fastapi import APIRouter, HTTPException, status, Depends
from app.db.session import AsyncSession
from app.db.models.product import Cart, Product, CartItem, ProductVariant
from app.db.models.user import User
from app.crud.cart import upsert_cart_item
from app.security.jwt import get_current_user
from app.schemas.product import CartOut, CartItemOut, CartItemCreate, CartItemUpdate
from app.db.dependencies import get_db
from sqlalchemy.orm import selectinload
from sqlalchemy import select, delete

router = APIRouter(prefix="/api/cart")


@router.post("/add", response_model=CartItemOut, status_code=status.HTTP_201_CREATED)
async def api_cart_add(
    data: CartItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Quantity must be > 0"
        )
    cart = (
        await db.execute(select(Cart).where(Cart.user_id == current_user.id))
    ).scalar_one_or_none()
    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        await db.flush()
    variant_result = await db.execute(
        select(ProductVariant)
        .where(ProductVariant.id == data.variant_id)
        .options(
            selectinload(ProductVariant.product).selectinload(Product.images),
            selectinload(ProductVariant.product).selectinload(Product.materials),
        )
    )
    variant = variant_result.scalar_one_or_none()
    current_result = await db.execute(
        select(CartItem.quantity).where(
            CartItem.cart_id == cart.id,
            CartItem.variant_id == data.variant_id,
        )
    )
    current_qty = current_result.scalar_one_or_none() or 0
    if current_qty + data.quantity > variant.stock:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Not enough stock. Only {variant.stock - current_qty} available.",
        )
    item_id = await upsert_cart_item(db=db, cart_id=cart.id, variant=variant, data=data)
    await db.commit()
    result = await db.execute(
        select(CartItem)
        .options(
            selectinload(CartItem.variant),
            selectinload(CartItem.variant).selectinload(ProductVariant.product),
            selectinload(CartItem.variant)
            .selectinload(ProductVariant.product)
            .selectinload(Product.images),
            selectinload(CartItem.variant)
            .selectinload(ProductVariant.product)
            .selectinload(Product.materials),
            selectinload(CartItem.variant)
            .selectinload(ProductVariant.product)
            .selectinload(Product.variants),
        )
        .where(CartItem.id == item_id)
    )
    cart_item = result.scalar_one()
    return cart_item


@router.get("/get/all", response_model=CartOut, status_code=status.HTTP_200_OK)
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
            selectinload(CartItem.variant),
            selectinload(CartItem.variant).selectinload(ProductVariant.product),
            selectinload(CartItem.variant)
            .selectinload(ProductVariant.product)
            .selectinload(Product.images),
            selectinload(CartItem.variant)
            .selectinload(ProductVariant.product)
            .selectinload(Product.materials),
            selectinload(CartItem.variant)
            .selectinload(ProductVariant.product)
            .selectinload(Product.variants),
        )
        .where(CartItem.cart_id == cart.id)
    )
    items = result.scalars().all()
    total_items = sum(i.quantity for i in items)
    cart_total = sum(i.quantity * i.price for i in items)
    return CartOut(cart_items=items, total_items=total_items, cart_total=cart_total)


@router.delete("/delete/{item_id}", response_model=None, status_code=status.HTTP_200_OK)
async def api_delete_cart(
    item_id: int,
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
        .options(selectinload(CartItem.variant).selectinload(ProductVariant.product))
        .where(CartItem.id == item_id, CartItem.cart_id == cart.id)
    )
    cart_item = result.scalar_one_or_none()
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found"
        )
    await db.delete(cart_item)
    await db.commit()
    return


@router.delete(
    "/delete/all", response_model=None, status_code=status.HTTP_204_NO_CONTENT
)
async def api_delete_all_cart(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    cart = (
        await db.execute(select(Cart).where(Cart.user_id == current_user.id))
    ).scalar_one_or_none()
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found"
        )
    await db.execute(delete(CartItem).where(CartItem.cart_id == cart.id))
    await db.commit()
    return


@router.patch("/update", response_model=CartOut)
async def api_update_cart_item(
    data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cart = await db.execute(select(Cart).where(Cart.user_id == current_user.id))
    cart = cart.scalar_one_or_none()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    query = select(CartItem).where(
        CartItem.cart_id == cart.id,
        CartItem.variant_id == data.variant_id,
    )
    result = await db.execute(query)
    cart_item = result.scalar_one_or_none()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not in cart")
    if data.quantity <= 0:
        await db.delete(cart_item)
    else:
        variant = await db.get(ProductVariant, data.variant_id)
        if not variant:
            raise HTTPException(status_code=404, detail="Product not found")
        if data.quantity > variant.stock:
            raise HTTPException(
                status_code=400,
                detail=f"Only {variant.stock} in stock. Cannot set quantity to {data.quantity}.",
            )
        cart_item.quantity = data.quantity
    await db.commit()
    result = await db.execute(
        select(CartItem)
        .options(
            selectinload(CartItem.variant),
            selectinload(CartItem.variant).selectinload(ProductVariant.product),
            selectinload(CartItem.variant)
            .selectinload(ProductVariant.product)
            .selectinload(Product.images),
            selectinload(CartItem.variant)
            .selectinload(ProductVariant.product)
            .selectinload(Product.materials),
            selectinload(CartItem.variant)
            .selectinload(ProductVariant.product)
            .selectinload(Product.variants),
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
