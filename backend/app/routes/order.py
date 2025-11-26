from fastapi import APIRouter, HTTPException, status, Depends
from app.db.models.user import User, UserAddress
from app.security.jwt import get_current_user
from app.utils.midtrans import create_midtrans_transaction
from app.db.session import AsyncSession
from app.db.dependencies import get_db
from sqlalchemy.orm import selectinload
from sqlalchemy import select
from app.db.models.user import Order, OrderStatus, OrderItem
from app.schemas.order import OrderOut, OrderCreate

router = APIRouter(prefix="/api/orders")

@router.post("/create", status_code=status.HTTP_200_OK, response_model=OrderOut)
async def api_order_create(payload: OrderCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    addr = await db.get(UserAddress, payload.address_id)
    if not addr or addr.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Address"
        )
    order = Order(
        user_id=current_user.id,
        address_id=payload.address_id,
        total_amount=payload.total_amount,
        status=OrderStatus.PENDING
    )
    db.add(order)
    await db.flush()
    order_items = []
    for item in payload.items:
        order_items.append(OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_purchase=item.price_at_purchase
        ))
    db.add_all(order_items)
    await db.commit()
    # Re-query and eager-load items -> product -> images, plus user and address
    from app.db.models.product import Product
    result = await db.execute(
        select(Order)
        .where(Order.id == order.id)
        .options(
            selectinload(Order.user),
            selectinload(Order.address),
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.images),
        )
    )
    order_loaded = result.scalars().first()
    return OrderOut.model_validate(order_loaded)

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
