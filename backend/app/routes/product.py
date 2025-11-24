from app.db.models.product import (
    ProductColor,
    ProductImage,
    ProductMaterial,
    ProductSize,
)
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.schemas.product import (
    ProductDataOut,
    ProductData,
    ProductDeleteMany,
    ProductListFilters,
)
from app.db.session import AsyncSession
from app.db.dependencies import get_db
from app.db.models import Product
from app.utils.slug import get_slug, get_sku
from app.crud.product import get_product
from sqlalchemy import select
from app.utils.filters import apply_product_filters, get_base_product_query

router = APIRouter()


@router.post(
    "/api/product/add",
    response_model=ProductDataOut,
    status_code=status.HTTP_201_CREATED,
)
async def api_product_add(data: ProductData, db: AsyncSession = Depends(get_db)):
    product_dict = data.model_dump(exclude={"material", "sizes", "images", "colors"})
    product_dict["slug"] = get_slug(product_dict["name"])
    product_dict["sku"] = get_sku()
    product = Product(**product_dict)
    product.colors = [ProductColor(**c.model_dump()) for c in data.colors]
    product.sizes = [ProductSize(**s.model_dump()) for s in data.sizes]
    product.material = [ProductMaterial(**m.model_dump()) for m in data.material]
    product.images = [ProductImage(**i.model_dump()) for i in data.images]
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


@router.get(
    "/api/product", response_model=List[ProductDataOut], status_code=status.HTTP_200_OK
)
async def api_product_all(
    f: ProductListFilters = Depends(),
    page: int = Query(1, ge=1),
    limit: int = Query(24, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = get_base_product_query()
    query = apply_product_filters(query, f)
    query = query.order_by(Product.created_at.desc())
    products = (
        (await db.execute(query.offset((page - 1) * limit).limit(limit)))
        .scalars()
        .all()
    )
    return products


@router.get(
    "/api/product/featured",
    response_model=List[ProductDataOut],
    status_code=status.HTTP_200_OK,
)
async def api_product_featured(
    limit: int = Query(12, ge=1, le=24), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        get_base_product_query()
        .where(Product.is_active.is_(True), Product.is_featured.is_(True))
        .order_by(Product.created_at.desc())
        .limit(limit)
    )
    product = result.scalars().all()
    if not product:
        fallback = await db.execute(
            get_base_product_query()
            .where(Product.is_active.is_(True))
            .order_by(Product.created_at.desc())
            .limit(limit)
        )
        product = fallback.scalars().all()
    return product


@router.get(
    "/api/product/{identifier}",
    response_model=ProductDataOut,
    status_code=status.HTTP_200_OK,
)
async def api_product_detail(identifier: str, db: AsyncSession = Depends(get_db)):
    if identifier.isdigit():
        product = await get_product(db=db, product_id=int(identifier))
    else:
        product = await get_product(db=db, product_slug=identifier)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    return product


@router.delete(
    "/api/product",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def api_delete_all_product(
    data: ProductDeleteMany, db: AsyncSession = Depends(get_db)
):
    if not data.product_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Product not found."
        )
    # Load the Product objects so SQLAlchemy ORM cascade rules run
    result = await db.execute(select(Product).where(Product.id.in_(data.product_ids)))
    products = result.scalars().all()
    if not products:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found."
        )
    for product in products:
        await db.delete(product)
    await db.commit()
    return


@router.delete(
    "/api/product/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def api_delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    product = await get_product(db=db, product_id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found."
        )
    await db.delete(product)
    await db.commit()
    return


@router.patch(
    "/api/product/{product_id}",
    status_code=status.HTTP_200_OK,
    response_model=ProductDataOut,
)
async def api_update_product(
    product_id: int, data: ProductData, db: AsyncSession = Depends(get_db)
):
    product = await get_product(db=db, product_id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found."
        )
    product_dict = data.model_dump(exclude={"material", "sizes", "images", "colors"})
    product.slug = get_slug(product_dict["name"])
    product.sku = get_sku()
    for field, value in product_dict.items():
        setattr(product, field, value)
    product.colors = [ProductColor(**c.model_dump()) for c in data.colors]
    product.sizes = [ProductSize(**s.model_dump()) for s in data.sizes]
    product.material = [ProductMaterial(**m.model_dump()) for m in data.material]
    product.images = [ProductImage(**i.model_dump()) for i in data.images]
    await db.commit()
    await db.refresh(product)
    return product
