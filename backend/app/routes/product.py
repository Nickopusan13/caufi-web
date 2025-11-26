from app.db.models.product import (
    ProductColor,
    ProductImage,
    ProductMaterial,
    ProductSize,
)
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends, Query, UploadFile, File
from app.schemas.product import (
    ProductDataOut,
    ProductData,
    ProductDeleteMany,
    ProductListFilters,
    ProductImageOut,
)
from app.db.session import AsyncSession
from app.db.dependencies import get_db
from app.db.models import Product
from app.utils.slug import get_slug, get_sku
from app.crud.product import get_product
from sqlalchemy import select
from app.utils.filters import apply_product_filters, get_base_product_query
from app.utils.r2_service import upload_product_images
from app.security.r2_config import CLOUDFLARE_BUCKET_NAME_1

router = APIRouter(prefix="/api/product")


@router.post(
    "/add",
    response_model=ProductDataOut,
    status_code=status.HTTP_201_CREATED,
)
async def api_product_add(data: ProductData, db: AsyncSession = Depends(get_db)):
    product_dict = data.model_dump(exclude={"material", "sizes", "images", "colors"})
    product_dict["slug"] = await get_slug(product_dict["name"], db=db)
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


@router.post(
    "/{product_id}/images",
    response_model=List[ProductImageOut],
    status_code=status.HTTP_201_CREATED,
    summary="Add images to existing product",
)
async def add_images_to_product(
    product_id: int,
    files: List[UploadFile] = File(..., description="Select product images"),
    db: AsyncSession = Depends(get_db),
):
    product = await db.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    uploaded_images = await upload_product_images(
        files, folder=f"products/{product_id}", bucket=CLOUDFLARE_BUCKET_NAME_1
    )
    if not uploaded_images:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No valid images uploaded"
        )
    new_images = [
        ProductImage(
            product_id=product_id,
            image_url=img["image_url"],
            image_size=img["image_size"],
            image_name=img["image_name"],
        )
        for img in uploaded_images
    ]
    db.add_all(new_images)
    await db.commit()
    for img in new_images:
        await db.refresh(img)
    return new_images


@router.get(
    "/get/all", response_model=List[ProductDataOut], status_code=status.HTTP_200_OK
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
    "/featured",
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
    "/get/{identifier}",
    response_model=ProductDataOut,
    status_code=status.HTTP_200_OK,
)
async def api_product_detail(identifier: str, db: AsyncSession = Depends(get_db)):
    query = get_base_product_query()
    if identifier.isdigit():
        query = query.where(Product.id == int(identifier))
    else:
        query = query.where(Product.slug == identifier)
    result = await db.execute(query)
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    return product


@router.delete(
    "/delete/all",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def api_delete_all_product(
    data: ProductDeleteMany, db: AsyncSession = Depends(get_db)
):
    if not data.product_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Product not found."
        )
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
    "/delete/{product_id}",
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
    "/update/{product_id}",
    status_code=status.HTTP_200_OK,
    response_model=ProductDataOut,
)
async def api_update_product(
    product_id: int, data: ProductData, db: AsyncSession = Depends(get_db)
):
    product = await get_product(db=db, product_id=product_id)
    if not product:
        raise HTTPException(404, "Product not found.")
    payload = data.model_dump(
        exclude_unset=True, exclude={"colors", "sizes", "material", "images"}
    )
    if "name" in payload and payload["name"] != product.name:
        product.slug = await get_slug(payload["name"], db=db)
    for field, value in payload.items():
        setattr(product, field, value)
    if data.colors is not None:
        product.colors.clear()
        for c in data.colors:
            product.colors.append(ProductColor(**c.model_dump()))
    if data.sizes is not None:
        product.sizes.clear()
        for s in data.sizes:
            product.sizes.append(ProductSize(**s.model_dump()))
    if data.material is not None:
        product.material.clear()
        for m in data.material:
            product.material.append(ProductMaterial(**m.model_dump()))
    if data.images is not None:
        product.images.clear()
        for i in data.images:
            product.images.append(ProductImage(**i.model_dump()))
    await db.commit()
    await db.refresh(product)
    return product