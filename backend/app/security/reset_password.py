from app.security.hash import hash_token, hash_password
from app.db.session import AsyncSession
from app.crud.user import get_user
from fastapi import HTTPException, status
from app.db.models.user import UserPasswordResetToken
from sqlalchemy import delete, insert, select, update
from datetime import datetime, timedelta, timezone
from app.db.models.user import User

async def save_token_forgot_password(db: AsyncSession, email:str, token:str, expire_minutes:int):
    hashed_token = hash_token(token)
    user = await get_user(db=db, user_email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    await db.execute(delete(UserPasswordResetToken).where(UserPasswordResetToken.user_id == user.id))
    expire_at = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=expire_minutes)
    stmt = insert(UserPasswordResetToken).values(user_id=user.id, token=hashed_token, expires_at=expire_at)
    await db.execute(stmt)
    await db.commit()
    return user

async def get_user_reset_passsword(db: AsyncSession, token:str):
    hashed_token = hash_token(token)
    query = (select(User).join(User.password_reset_token).where(UserPasswordResetToken.token == hashed_token))
    result = await db.execute(query)
    return result.scalars().first()

async def update_password(db: AsyncSession, id:int, password:str):
    hashed_pw = hash_password(password)
    query = (update(User).where(User.id == id).values(password=hashed_pw))
    await db.execute(query)
    query_token = (delete(UserPasswordResetToken).where(UserPasswordResetToken.user_id == id))
    await db.execute(query_token)
    await db.commit()
