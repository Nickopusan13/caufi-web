from fastapi import APIRouter, HTTPException, status, Depends, Query, UploadFile, File
from app.db.session import AsyncSession
from app.db.models.blog import Blog, BlogImage
from app.db.models.user import User
from app.security.jwt import get_admin_user
from app.schemas.blog import BlogCreate, BlogOut, BlogUpdate, BlogImageOut
from app.db.dependencies import get_db
from app.utils.sanitize import sanitize_html
from sqlalchemy import select
from app.security.r2_config import CLOUDFLARE_BUCKET_NAME_1
from app.utils.r2_service import (
    upload_product_images,
    R2_PUBLIC_URL,
    delete_image_from_r2,
)
from app.utils.slug import get_blog_slug
from fastapi_cache.decorator import cache
from fastapi_cache import FastAPICache

router = APIRouter(prefix="/api/blog")


@router.post("/add", response_model=BlogOut, status_code=status.HTTP_201_CREATED)
async def api_blog_add(
    data: BlogCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    sanitize_content = sanitize_html(data.content)
    payload = data.model_dump()
    payload["content"] = sanitize_content
    payload["slug"] = await get_blog_slug(payload["title"], db=db)
    new_blog = Blog(**payload)
    db.add(new_blog)
    await db.commit()
    await db.refresh(new_blog)
    await FastAPICache.clear(namespace="blog:all")
    return new_blog


@router.post(
    "/{blog_id}/images",
    response_model=list[BlogImageOut],
    status_code=status.HTTP_201_CREATED,
)
async def api_blog_add_images(
    blog_id: int,
    files: list[UploadFile] = File(...),
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    blog = await db.get(Blog, blog_id)
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Blog post not found."
        )
    uploaded_images = await upload_product_images(
        files=files, bucket=CLOUDFLARE_BUCKET_NAME_1, folder=f"blogs/{blog_id}"
    )
    blog_images = [
        BlogImage(
            blog_id=blog_id,
            image_url=img["image_url"],
        )
        for img in uploaded_images
    ]
    db.add_all(blog_images)
    await db.commit()
    for img in blog_images:
        await db.refresh(img)
    await FastAPICache.clear(namespace="blog:all")
    return blog_images


@router.delete(
    "/images/{image_id}", response_model=None, status_code=status.HTTP_204_NO_CONTENT
)
async def api_blog_delete_image(
    image_id: int,
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(BlogImage).where(BlogImage.id == image_id))
    image = result.scalar_one_or_none()
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Image not found"
        )
    key = image.image_url.replace(f"{R2_PUBLIC_URL}/", "")
    delete_image_from_r2(key)
    await db.delete(image)
    await db.commit()
    await FastAPICache.clear(namespace="blog:all")
    await FastAPICache.clear(namespace="blog:single")


@router.patch(
    "/update/{blog_id}", response_model=BlogOut, status_code=status.HTTP_200_OK
)
async def api_blog_update(
    blog_id: int,
    data: BlogUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    result = await db.get(Blog, blog_id)
    old_slug = result.slug
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Blog post not found."
        )
    payload = data.model_dump(exclude_unset=True)
    if "content" in payload:
        payload["content"] = sanitize_html(payload["content"])
    if "title" in payload and payload["title"] != result.title:
        payload["slug"] = await get_blog_slug(payload["title"], db=db)
    for field, value in payload.items():
        setattr(result, field, value)
    await db.commit()
    await db.refresh(result)
    await FastAPICache.clear(namespace="blog:all")
    await FastAPICache.clear(namespace="blog:single")
    return result


@router.delete(
    "/delete/{blog_id}", response_model=None, status_code=status.HTTP_204_NO_CONTENT
)
async def api_blog_delete(
    blog_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    result = await db.get(Blog, blog_id)
    old_slug = result.slug
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Blog post not found."
        )
    await db.delete(result)
    await db.commit()
    await FastAPICache.clear(namespace="blog:all")
    await FastAPICache.clear(namespace="blog:single")


@router.get(
    "/get/{identifier}",
    response_model=BlogOut,
    status_code=status.HTTP_200_OK,
)
@cache(
    expire=43200,
    namespace="blog:single",
)
async def api_blog_get(
    identifier: str,
    db: AsyncSession = Depends(get_db),
):
    query = select(Blog)
    if identifier.isdigit():
        query = query.where(Blog.id == int(identifier))
    else:
        query = query.where(Blog.slug == identifier)

    result = await db.execute(query)
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found.",
        )
    return blog


@router.get("/all", response_model=list[BlogOut], status_code=status.HTTP_200_OK)
@cache(
    expire=43200,
    namespace="blog:all",
    key_builder=lambda func,
    *args,
    **kwargs: f"blog:all:limit={kwargs.get('limit')}:page={kwargs.get('page')}",
)
async def api_blog_get_all(
    limit: int = Query(12, ge=1, le=24),
    page: int = Query(1, ge=1),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Blog).order_by(Blog.date.desc()).limit(limit).offset((page - 1) * limit)
    )
    blogs = result.scalars().all()
    return blogs
