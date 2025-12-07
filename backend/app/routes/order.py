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
from app.db.models.product import Product
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
    product_ids = [item.product_id for item in payload.items]
    result = await db.execute(
        select(Product).where(Product.id.in_(product_ids), Product.is_active.is_(True))
    )
    products = result.scalars().all()
    products_map = {p.id: p for p in products}
    total_amount = Decimal("0")
    order_items = []
    for item in payload.items:
        product = products_map.get(item.product_id)
        if not product:
            raise HTTPException(
                status_code=400, detail=f"Product {item.product_id} not found"
            )

        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400, detail=f"Not enough stock for {product.name}"
            )
        price = product.discount_price or product.regular_price
        total_amount += price * item.quantity
        order_items.append(
            OrderItem(
                product_id=item.product_id,
                quantity=item.quantity,
                price_at_purchase=price,
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
            update(Product)
            .where(Product.id == item.product_id)
            .values(stock=Product.stock - item.quantity)
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
