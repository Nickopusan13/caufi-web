from sqlalchemy.orm import selectinload
from app.db.models.product import Product, ProductColor, ProductSize
from app.db.models.user import User
from app.schemas.user import UserListFilters
from app.schemas.product import ProductListFilters
from sqlalchemy import select


def get_base_product_query():
    query = select(Product).options(
        selectinload(Product.colors),
        selectinload(Product.sizes),
        selectinload(Product.material),
        selectinload(Product.images),
    )
    return query


def apply_product_filters(query, f: ProductListFilters):
    if f.only_active is not None:
        query = query.where(Product.is_active.is_(f.only_active))
    if f.search:
        term = f"%{f.search.strip()}%"
        query = query.where(
            (Product.name.ilike(term)) | (Product.description.ilike(term))
        )
    if f.category is not None:
        query = query.where(Product.category == f.category)
    if f.min_price is not None:
        query = query.where(Product.regular_price >= f.min_price)
    if f.max_price is not None:
        query = query.where(Product.regular_price <= f.max_price)
    if f.color:
        colors = [c.strip().lower() for c in f.color.split(",") if c.strip()]
        if colors:
            query = query.where(Product.colors.any(ProductColor.color.in_(colors)))
    if f.size:
        sizes = [s.strip().upper() for s in f.size.split(",") if s.strip()]
        if sizes:
            query = query.where(Product.sizes.any(ProductSize.size.in_(sizes)))
    return query


def apply_user_filters(query, f: UserListFilters):
    if f.search:
        term = f"%{f.search.strip()}%"
        query = query.where((User.email.ilike(term)) | (User.name.ilike(term)))
    if f.is_active is not None:
        query = query.where(User.is_active.is_(f.is_active))
    return query
