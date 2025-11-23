from sqlalchemy.orm import selectinload
from app.db.models.product import Product, ProductColor, ProductSize
from sqlalchemy import select
from typing import Optional


def get_base_product_query():
    query = select(Product).options(
        selectinload(Product.colors),
        selectinload(Product.sizes),
        selectinload(Product.material),
        selectinload(Product.images),
    )
    return query


def apply_product_filters(
    query,
    *,
    search: Optional[str] = None,
    category: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    color: Optional[str] = None,
    size: Optional[str] = None,
    only_active: bool = True,
):
    if only_active:
        query = query.where(Product.is_active.is_(True))

    if search:
        term = f"%{search.strip()}%"
        query = query.where(
            (Product.name.ilike(term)) | (Product.description.ilike(term))
        )
    if category is not None:
        query = query.where(Product.category_id == category)
    if min_price is not None:
        query = query.where(Product.price >= min_price)
    if max_price is not None:
        query = query.where(Product.price <= max_price)
    if color:
        colors = [c.strip().lower() for c in color.split(",") if c.strip()]
        if colors:
            query = query.where(Product.colors.any(ProductColor.color.in_(colors)))
    if size:
        sizes = [s.strip().upper() for s in size.split(",") if s.strip()]
        if sizes:
            query = query.where(Product.sizes.any(ProductSize.size.in_(sizes)))

    return query
