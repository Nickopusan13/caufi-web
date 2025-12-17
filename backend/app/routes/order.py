from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.db.models.user import User, UserAddress
from app.security.jwt import get_current_user
from app.utils.midtrans import create_midtrans_transaction
from app.db.session import AsyncSession
from app.db.dependencies import get_db
from sqlalchemy.orm import selectinload
from sqlalchemy import select, update
from app.db.models.order import Order, OrderStatus, OrderItem
from app.schemas.order import OrderOut, OrderCreate
from app.db.models.product import Product, ProductVariant
from decimal import Decimal

router = APIRouter(prefix="/api/orders")


@router.post("/create", status_code=status.HTTP_200_OK, response_model=OrderOut)
async def api_order_create(
    payload: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    addr = await db.get(UserAddress, payload.address_id)
    if not addr or addr.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Invalid address")

    variant_ids = [item.variant_id for item in payload.items]
    result = await db.execute(
        select(ProductVariant, Product)
        .join(Product, ProductVariant.product_id == Product.id)
        .where(ProductVariant.id.in_(variant_ids), Product.is_active.is_(True))
    )
    variants = result.all()
    variants_map = {v[0].id: (v[0], v[1]) for v in variants}
    print(variants_map)
    total_amount = Decimal("0")
    order_items = []
    for item in payload.items:
        if item.variant_id not in variants_map:
            raise HTTPException(
                status_code=400,
                detail=f"Variant {item.variant_id} not found or product inactive",
            )
        variant, product = variants_map[item.variant_id]
        if variant.product_id != item.product_id:
            raise HTTPException(
                status_code=400,
                detail=f"Variant {item.variant_id} does not belong to product {item.product_id}",
            )
        if variant.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for {product.name} (variant {item.variant_id})",
            )
        price = variant.discount_price or variant.regular_price
        total_amount += price * item.quantity
        order_items.append(
            OrderItem(
                variant_id=item.variant_id,
                quantity=item.quantity,
                price_at_purchase=price,
                name=product.name,
                image_url=variant.image_url
                or product.image_url,
            )
        )

    order = Order(
        user_id=current_user.id,
        address_id=payload.address_id,
        total_amount=total_amount,
        status=OrderStatus.PENDING,
    )
    db.add(order)
    await db.flush()
    for item in order_items:
        item.order_id = order.id
    db.add_all(order_items)

    for item in payload.items:
        await db.execute(
            update(ProductVariant)
            .where(ProductVariant.id == item.variant_id)
            .values(stock=ProductVariant.stock - item.quantity)
        )

    await db.commit()
    await db.refresh(order)
    return OrderOut.model_validate(order)


@router.post("/{order_id}/pay", status_code=status.HTTP_200_OK)
async def api_order_pay(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Order)
        .where(Order.id == order_id, Order.user_id == current_user.id)
        .options(
            selectinload(Order.user),
            selectinload(Order.address),
            selectinload(Order.items),
        )
    )
    order = result.scalars().first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status != OrderStatus.PENDING:
        raise HTTPException(status_code=400, detail="Order cannot be paid")
    order_out = OrderOut.model_validate(order)
    try:
        payment = create_midtrans_transaction(order_out)
    except Exception as e:
        print("Midtrans Error:", e)
        raise HTTPException(status_code=500, detail=f"Midtrans error: {e}")
    return {"success": True, "payment": payment}


@router.get("/me", response_model=list[OrderOut], status_code=status.HTTP_200_OK)
async def api_get_my_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(24, ge=1, le=100),
):
    query = (
        select(Order)
        .where(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .options(
            selectinload(Order.address),
            selectinload(Order.items)
            .selectinload(OrderItem.product)
            .selectinload(Product.images),
        )
    )
    result = await db.execute(query.offset((page - 1) * limit).limit(limit))
    orders = result.scalars().all()
    return [OrderOut.model_validate(order) for order in orders]
