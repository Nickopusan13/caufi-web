from sqlalchemy.orm import selectinload
from app.db.models.product import Product, ProductVariant
from app.db.models.user import User
from app.schemas.user import UserListFilters
from app.schemas.product import ProductListFilters
from sqlalchemy import select, func


def get_base_product_query():
    query = select(Product).options(
        selectinload(Product.materials),
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
        subq = (
            select(func.min(ProductVariant.regular_price))
            .where(ProductVariant.product_id == Product.id)
            .scalar_subquery()
        )
        query = query.where(subq >= f.min_price)
    if f.max_price is not None:
        subq = (
            select(func.max(ProductVariant.regular_price))
            .where(ProductVariant.product_id == Product.id)
            .scalar_subquery()
        )
        query = query.where(subq <= f.max_price)
    match f.sort:
        case "newest":
            query = query.order_by(Product.created_at.desc())
        case "price_high":
            subq = (
                select(func.min(ProductVariant.regular_price))
                .where(ProductVariant.product_id == Product.id)
                .scalar_subquery()
            )
            query = query.order_by(subq.desc())  # highest first
        case "price_low":
            subq = (
                select(func.min(ProductVariant.regular_price))
                .where(ProductVariant.product_id == Product.id)
                .scalar_subquery()
            )
            query = query.order_by(subq.asc())  # lowest first
        case "asc":
            query = query.order_by(Product.name.asc())
        case "desc":
            query = query.order_by(Product.name.desc())
        case _:
            query = query.order_by(Product.created_at.desc())
    return query


def apply_user_filters(query, f: UserListFilters):
    if f.search:
        term = f"%{f.search.strip()}%"
        query = query.where((User.email.ilike(term)) | (User.name.ilike(term)))
    if f.is_active is not None:
        query = query.where(User.is_active.is_(f.is_active))
    return query
