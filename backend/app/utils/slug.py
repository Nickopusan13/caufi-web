from slugify import slugify
from app.db.session import AsyncSession
from sqlalchemy.future import select
from app.db.models import Product
from app.db.models import Blog
from typing import Optional
import uuid


async def get_product_slug(
    name: str, db: AsyncSession, product_id: Optional[int] = None
) -> str:
    base_slug = slugify(name, lowercase=True, separator="-")
    if not base_slug:
        base_slug = "product"
    slug = base_slug
    counter = 1
    while True:
        exists = await db.scalar(
            select(Product.id).where(
                Product.slug == slug, (Product.id != product_id) if product_id else True
            )
        )
        if not exists:
            return slug
        slug = f"{base_slug}-{counter}"
        counter += 1

async def get_blog_slug(name: str, db: AsyncSession, blog_id: Optional[int] = None) -> str:
    base_slug = slugify(name, lowercase=True, separator="-")
    if not base_slug:
        base_slug = "blog"
    slug = base_slug
    counter = 1
    while True:
        exists = await db.scalar(
            select(Blog.id).where(
                Blog.slug == slug, (Blog.id != blog_id) if blog_id else True
            )
        )
        if not exists:
            return slug
        slug = f"{base_slug}-{counter}"
        counter += 1

def get_sku():
    return uuid.uuid4().hex[:12].upper()
