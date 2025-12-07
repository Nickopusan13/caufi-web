from sqlalchemy.dialects.postgresql import insert
from app.db.models import CartItem, Product
from app.schemas.product import CartItemCreate
from app.db.session import AsyncSession


async def upsert_cart_item(
    db: AsyncSession, cart_id: int, product: Product, data: CartItemCreate
):
    stmt = (
        insert(CartItem)
        .values(
            cart_id=cart_id,
            product_id=data.product_id,
            quantity=data.quantity,
            price=product.regular_price,
        )
        .on_conflict_do_update(
            constraint="uix_cart_product_variant",
            set_={
                "quantity": CartItem.quantity + data.quantity,
                "price": product.regular_price,
            },
        )
        .returning(CartItem.id)
    )
    result = await db.execute(stmt)
    return result.scalar_one()
