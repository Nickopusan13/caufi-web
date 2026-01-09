from app.db.models.product import ProductImage, ProductMaterial, ProductVariant
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends, Query, UploadFile, File
from app.schemas.product import (
    ProductDataOut,
    ProductListResponse,
    ProductDataBase,
    ProductDeleteMany,
    ProductListFilters,
    ProductImageOut,
    ProductUpdate,
)
from app.db.models.user import User
from app.security.jwt import get_admin_user
from app.db.session import AsyncSession
from app.db.dependencies import get_db
from app.db.models import Product
from app.utils.slug import get_product_slug, get_sku
from app.crud.product import get_product
from sqlalchemy import select, func
from app.utils.filters import apply_product_filters, get_base_product_query
from app.utils.r2_service import (
    upload_product_images,
    delete_image_from_r2,
    R2_PUBLIC_URL,
)
from app.security.r2_config import CLOUDFLARE_BUCKET_NAME_1
from app.core.redis import redis_client
from fastapi.encoders import jsonable_encoder
import json

router = APIRouter(prefix="/api/product")


@router.post(
    "/add",
    response_model=ProductDataOut,
    status_code=status.HTTP_201_CREATED,
)
async def api_product_add(
    data: ProductDataBase,
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    product_dict = data.model_dump(exclude={"materials", "images", "variants"})
    product_dict["slug"] = await get_product_slug(product_dict["name"], db=db)
    product = Product(**product_dict)
    product.variants = []
    for v in data.variants or []:
        variant_dict = v.model_dump()
        variant_dict["sku"] = get_sku()
        variant = ProductVariant(**variant_dict)
        product.variants.append(variant)
    product.materials = [ProductMaterial(**m.model_dump()) for m in data.materials]
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
    admin: User = Depends(get_admin_user),
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
        )
        for img in uploaded_images
    ]
    db.add_all(new_images)
    await db.commit()
    for img in new_images:
        await db.refresh(img)
    return new_images


@router.delete("/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_image(
    image_id: int,
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(ProductImage).where(ProductImage.id == image_id))
    image = result.scalar_one_or_none()
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Image not found."
        )
    key = image.image_url.replace(f"{R2_PUBLIC_URL}/", "")
    delete_image_from_r2(key)
    await db.delete(image)
    await db.commit()

    return


@router.get("/get/all", response_model=ProductListResponse)
async def api_product_all(
    f: ProductListFilters = Depends(),
    page: int = Query(1, ge=1),
    limit: int = Query(24, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    filters = f.model_dump(exclude_none=True)
    filters_key = "&".join([f"{k}={filters[k]}" for k in sorted(filters)])
    cache_key = f"products:all:{filters_key}:page={page}:limit={limit}"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    filtered_query = get_base_product_query()
    filtered_query = apply_product_filters(filtered_query, f)
    filtered_sub = filtered_query.subquery()
    total = await db.scalar(select(func.count()).select_from(filtered_sub))
    all_query = get_base_product_query()
    all_sub = all_query.subquery()
    full_total = await db.scalar(select(func.count()).select_from(all_sub))
    cat_rows = await db.execute(
        select(all_sub.c.category, func.count(all_sub.c.id)).group_by(
            all_sub.c.category
        )
    )
    category_counts = {"": full_total}
    for category, count in cat_rows.all():
        category_counts[category] = count
    products = (
        (await db.execute(filtered_query.offset((page - 1) * limit).limit(limit)))
        .scalars()
        .all()
    )
    product_data = [ProductDataOut.model_validate(p).model_dump() for p in products]
    response = {
        "products": product_data,
        "total": total,
        "category_counts": category_counts,
        "current_page": page,
        "total_pages": (total + limit - 1) // limit,
    }
    json_data = jsonable_encoder(response)
    await redis_client.setex(cache_key, 43200, json.dumps(json_data))
    return response


@router.get(
    "/featured",
    response_model=List[ProductDataOut],
    status_code=status.HTTP_200_OK,
)
async def api_product_featured(
    limit: int = Query(12, ge=1, le=24), db: AsyncSession = Depends(get_db)
):
    cache_key = f"products:featured:limit={limit}"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
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
    products_data = [ProductDataOut.model_validate(p).model_dump() for p in product]
    json_data = jsonable_encoder(products_data)
    await redis_client.setex(cache_key, 43200, json.dumps(json_data))
    return json_data


@router.get(
    "/get/{identifier}",
    response_model=ProductDataOut,
    status_code=status.HTTP_200_OK,
)
async def api_product_detail(identifier: str, db: AsyncSession = Depends(get_db)):
    cache_key = f"products:identifier={identifier}"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
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
    products_data = ProductDataOut.model_validate(product).model_dump()
    json_data = jsonable_encoder(products_data)
    await redis_client.setex(cache_key, 43200, json.dumps(json_data))
    return json_data


@router.delete(
    "/delete/all",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def api_delete_all_product(
    data: ProductDeleteMany,
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    if not data.product_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product not found.",
        )
    result = await db.execute(select(Product).where(Product.id.in_(data.product_ids)))
    products = result.scalars().all()
    if not products:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )
    result_img = await db.execute(
        select(ProductImage).where(ProductImage.product_id.in_(data.product_ids))
    )
    images = result_img.scalars().all()
    for img in images:
        key = img.image_url.replace(f"{R2_PUBLIC_URL}/", "")
        delete_image_from_r2(key)
    for img in images:
        await db.delete(img)
    for product in products:
        await db.delete(product)
    await db.commit()
    return


@router.delete(
    "/delete/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def api_delete_product(
    product_id: int,
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    product = await get_product(db=db, product_id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found."
        )
    result_img = await db.execute(
        select(ProductImage).where(ProductImage.product_id == product_id)
    )
    images = result_img.scalars().all()
    for img in images:
        key = img.image_url.replace(f"{R2_PUBLIC_URL}/", "")
        delete_image_from_r2(key)
    for img in images:
        await db.delete(img)
    await db.delete(product)
    await db.commit()
    return


@router.patch(
    "/update/{product_id}",
    status_code=status.HTTP_200_OK,
    response_model=ProductDataOut,
)
async def api_update_product(
    product_id: int,
    data: ProductUpdate,
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    product = await get_product(db=db, product_id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found."
        )
    payload = data.model_dump(exclude_unset=True, exclude={"materials", "images"})
    if "name" in payload and payload["name"] != product.name:
        product.slug = await get_product_slug(payload["name"], db=db)
    for field, value in payload.items():
        setattr(product, field, value)
    if data.materials is not None:
        product.materials.clear()
        for m in data.materials:
            product.materials.append(ProductMaterial(**m.model_dump()))
    if data.images is not None:
        product.images.clear()
        for i in data.images:
            product.images.append(ProductImage(**i.model_dump()))
    await db.commit()
    await db.refresh(product)
    return product
