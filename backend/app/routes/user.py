from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from typing import List
from sqlalchemy.orm import selectinload
from app.db.session import AsyncSession
from app.db.dependencies import get_db
from app.db.models.user import User, UserAddress
from app.crud.user import create_user, get_user
from app.schemas.user import (
    UserRegister,
    UserLogin,
    UserResetPasswordRequest,
    UserResetPassword,
    UserProfile,
    UserToken,
    UserProfileOut,
    UserDeleteMany,
)
from app.security.hash import verify_password
from app.security.jwt import create_jwt_token, JWT_TOKEN_EXPIRE_DAYS
from authlib.integrations.starlette_client import OAuthError
from app.security.reset_password import (
    save_token_forgot_password,
    get_user_reset_passsword,
    update_password,
)
from app.utils.email_service import send_mail
from app.security.oauth import oauth
from sqlalchemy import select, delete
from dotenv import load_dotenv
import logging
import secrets
import os

logger = logging.getLogger(__name__)
router = APIRouter()
load_dotenv()
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS")


@router.post(
    "/api/user/register",
    response_model=UserProfileOut,
    status_code=status.HTTP_201_CREATED,
)
async def api_user_register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    existing_user = await get_user(db=db, user_email=data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )
    try:
        new_user = await create_user(
            db=db, name=data.name, email=data.email, password=data.password
        )
        return new_user
    except Exception as e:
        logger.exception("Error creating user: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the user.",
        )


@router.post(
    "/api/user/login", response_model=UserToken, status_code=status.HTTP_200_OK
)
async def api_user_login(
    data: UserLogin, response: Response, db: AsyncSession = Depends(get_db)
):
    user = await get_user(db=db, user_email=data.email)
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    jwt_token = await create_jwt_token(data={"user_id": user.id, "email": user.email})
    expire_duration = JWT_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    response.set_cookie(
        key="access_token",
        value=jwt_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=expire_duration,
        path="/",
    )
    return UserToken(
        message="Login successful",
        user=UserProfileOut.model_validate(user),
        access_token=jwt_token,
    )


@router.post("/api/user/logout", status_code=status.HTTP_200_OK)
async def api_user_logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    return {"message": "Logout successful"}


@router.get(
    "/api/users", response_model=List[UserProfile], status_code=status.HTTP_200_OK
)
async def api_get_all_user(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).options(selectinload(User.addresses)))
    users = result.scalars().all()
    return users


@router.get(
    "/api/user/{user_id}", response_model=UserProfile, status_code=status.HTTP_200_OK
)
async def api_get_user_profile(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await get_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found."
        )
    return user


@router.delete(
    "/api/user/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def api_delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await get_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found."
        )
    await db.delete(user)
    await db.commit()
    return


@router.delete(
    "/api/user",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def api_delete_all_user(data: UserDeleteMany, db: AsyncSession = Depends(get_db)):
    if not data.user_ids:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found."
        )
    await db.execute(delete(User).where(User.id.in_(data.user_ids)))
    await db.commit()
    return


@router.patch(
    "/api/user/{user_id}", response_model=UserProfileOut, status_code=status.HTTP_200_OK
)
async def api_update_user(
    user_id: int, data: UserProfile, db: AsyncSession = Depends(get_db)
):
    user = await get_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found."
        )
    for field, value in data.model_dump(exclude={"addresses", "email"}).items():
        setattr(user, field, value)
    if data.addresses:
        user.addresses = [UserAddress(**addr.model_dump()) for addr in data.addresses]
    db.add(user)
    await db.commit()
    await db.refresh(user)
    user = await db.execute(
        select(User).options(selectinload(User.addresses)).where(User.id == user.id)
    )
    user = user.scalar_one()
    return user


@router.get("/auth/login/google", status_code=status.HTTP_200_OK)
async def google_oauth_login(request: Request):
    redirect_uri = request.url_for("google_oauth_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/auth/google/callback", status_code=status.HTTP_200_OK)
async def google_oauth_callback(
    request: Request, response: Response, db: AsyncSession = Depends(get_db)
):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get("userinfo")
        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to retrieve user info from google",
            )
    except OAuthError as e:
        logger.exception("Google OAuth callback error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during Google OAuth authentication",
        )
    email = user_info.get("email")
    name = user_info.get("name")
    user = await get_user(db=db, user_email=email)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not provided by Google OAuth",
        )
    if not user:
        user = await create_user(db=db, name=name, email=email, password=None)
    jwt_token = await create_jwt_token(data={"user_id": user.id, "email": user.email})
    expire_duration = JWT_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    response.set_cookie(
        key="access_token",
        value=jwt_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=expire_duration,
        path="/",
    )
    return UserToken(
        message="Login successful",
        user=UserProfile.model_validate(user),
        access_token=jwt_token,
    )


@router.post("/api/reset/password-request", status_code=status.HTTP_201_CREATED)
async def api_reset_password_request(
    data: UserResetPasswordRequest, db: AsyncSession = Depends(get_db)
):
    user = await get_user(db=db, user_email=data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found."
        )
    token = secrets.token_urlsafe(32)
    expire_minutes = 10
    await save_token_forgot_password(
        db=db, token=token, email=user.email, expire_minutes=expire_minutes
    )
    reset_link = (
        f"{ALLOWED_ORIGINS}/login/reset-password?token={token}&email={user.email}"
    )
    send_mail(
        to_email=user.email,
        subject=f"Reset Password Token: {user.name}",
        html=f"Clink link down below to reset your password:\n{reset_link}\nDON'T SHARE THIS LINK TO ANYONE.",
    )


@router.post("/api/reset/password")
async def api_reset_password(
    data: UserResetPassword, db: AsyncSession = Depends(get_db)
):
    user = await get_user_reset_passsword(db=db, token=data.token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found."
        )
    await update_password(db=db, id=user.id, password=data.new_password)
    return {"message": "Password reset successfully."}
