from sqlalchemy.dialects.postgresql import insert
from app.db.models import CartItem, ProductVariant
from app.schemas.product import CartItemCreate
from app.db.session import AsyncSession


async def upsert_cart_item(
    db: AsyncSession, cart_id: int, variant: ProductVariant, data: CartItemCreate
):
    stmt = (
        insert(CartItem)
        .values(
            cart_id=cart_id,
            variant_id=data.variant_id,
            quantity=data.quantity,
        )
        .on_conflict_do_update(
            constraint="uix_cart_product_variant",
            set_={
                "quantity": CartItem.quantity + data.quantity,
            },
        )
        .returning(CartItem.id)
    )
    result = await db.execute(stmt)
    return result.scalar_one()
