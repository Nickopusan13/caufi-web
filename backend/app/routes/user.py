from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import selectinload
from app.db.session import AsyncSession
from app.db.dependencies import get_db
from app.crud.user import create_user, get_user
from app.schemas.user import UserRegister, UserLogin, UserResetPasswordRequest, UserResetPassword, UserProfile, UserToken
from app.security.hash import verify_password
from app.security.jwt import create_jwt_token, JWT_TOKEN_EXPIRE_DAYS
from authlib.integrations.starlette_client import OAuthError
from app.security.oauth import oauth
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/api/user/register", response_model=UserProfile, status_code=status.HTTP_201_CREATED)
async def api_user_register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    existing_user = await get_user(db=db, user_email=data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists."
        )
    try:
        new_user = await create_user(
            db=db,
            name=data.name,
            email=data.email,
            password=data.password
        )
        return new_user
    except Exception as e:
        logger.exception("Error creating user: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the user."
        )

@router.post("/api/user/login", response_model=UserToken, status_code=status.HTTP_200_OK)
async def api_user_login(data: UserLogin, response: Response, db: AsyncSession = Depends(get_db)):
    user = await get_user(db=db, user_email=data.email)
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    jwt_token = await create_jwt_token(data={"user_id": user.id, "email": user.email })
    expire_duration = JWT_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    response.set_cookie(
        key="access_token",
        value=jwt_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=expire_duration,
        path="/"
    )
    return UserToken(
        message="Login successful",
        user=UserProfile.model_validate(user),
        access_token=jwt_token
    )

@router.post("/api/user/logout", status_code=status.HTTP_200_OK)
async def api_user_logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    return {"message": "Logout successful"}

@router.get("/api/user/{user_id}", response_model=UserProfile, status_code=status.HTTP_200_OK)
async def api_get_user_profile(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await get_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    return user

@router.get("/auth/login/google", status_code=status.HTTP_200_OK)
async def google_oauth_login(request: Request):
    redirect_uri = request.url_for("google_oauth_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback", status_code=status.HTTP_200_OK)
async def google_oauth_callback(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get("userinfo")
        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to retrieve user info from google"
            )
    except OAuthError as e:
        logger.exception("Google OAuth callback error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during Google OAuth authentication"
        )
    email = user_info.get("email")
    name = user_info.get("name")
    user = await get_user(db=db, user_email=email)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not provided by Google OAuth"
        )
    if not user:
        user = await create_user(
            db=db,
            name=name,
            email=email,
            password=None
        )
    jwt_token = await create_jwt_token(data={"user_id": user.id, "email": user.email })
    expire_duration = JWT_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    response.set_cookie(
        key="access_token",
        value=jwt_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=expire_duration,
        path="/"
    )
    return UserToken(
        message="Login successful",
        user=UserProfile.model_validate(user),
        access_token=jwt_token
    )