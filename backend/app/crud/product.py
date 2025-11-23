from app.db.session import AsyncSession
from typing import Optional
from sqlalchemy.orm import selectinload
from sqlalchemy.future import select
from app.db.models.product import Product


async def get_product(
    db: AsyncSession,
    product_id: Optional[int] = None,
    product_slug: Optional[int] = None,
) -> Optional[Product]:
    query = select(Product).options(
        selectinload(Product.material),
        selectinload(Product.sizes),
        selectinload(Product.images),
        selectinload(Product.colors),
    )
    if product_id is not None:
        query = query.where(Product.id == product_id)
    elif product_slug is not None:
        query = query.where(Product.slug == product_slug)
    else:
        return None
    result = await db.execute(query)
    return result.scalars().first()
