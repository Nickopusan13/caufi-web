from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.db.session import AsyncSession
from app.db.models.product import Product, Wishlist
from app.db.models.user import User
from app.security.jwt import get_current_user
from app.schemas.product import WishlistOut, WishlistCreate
from app.db.dependencies import get_db
from sqlalchemy.orm import selectinload
from sqlalchemy import select

router = APIRouter(prefix="/api/wishlist")


@router.post("/add", response_model=WishlistOut, status_code=status.HTTP_201_CREATED)
async def api_wishlist_add(
    data: WishlistCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product_result = await db.execute(
        select(Product)
        .where(Product.id == data.product_id)
        .options(selectinload(Product.images), selectinload(Product.materials))
    )
    product = product_result.scalar_one_or_none()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    existing_result = await db.execute(
        select(Wishlist).where(
            Wishlist.user_id == current_user.id, Wishlist.product_id == data.product_id
        )
    )
    wishlist = existing_result.scalar_one_or_none()
    if wishlist:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product already in wishlist",
        )
    wishlist = Wishlist(user_id=current_user.id, product_id=data.product_id)
    db.add(wishlist)
    await db.commit()
    await db.refresh(wishlist)
    return wishlist


@router.delete("/remove/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def api_wishlist_remove(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_result = await db.execute(
        select(Wishlist).where(
            Wishlist.user_id == current_user.id, Wishlist.product_id == product_id
        )
    )
    wishlist = existing_result.scalar_one_or_none()
    if not wishlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not in wishlist"
        )
    await db.delete(wishlist)
    await db.commit()
    return {"message": "Product removed from wishlist."}


@router.get("/get", response_model=list[WishlistOut], status_code=status.HTTP_200_OK)
async def api_wishlist_get(
    page: int = Query(1, ge=1),
    limit: int = Query(24, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Wishlist)
        .where(Wishlist.user_id == current_user.id)
        .order_by(Wishlist.created_at.desc())
        .limit(limit)
        .offset((page - 1) * limit)
        .options(
            selectinload(Wishlist.product).selectinload(Product.images),
            selectinload(Wishlist.product).selectinload(Product.materials),
        )
    )
    wishlist_items = result.scalars().all()
    return wishlist_items
