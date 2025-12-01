from app.security.hash import hash_password
from app.db.models.user import User
from app.db.session import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import Optional


async def create_user(
    db: AsyncSession,
    name: str,
    email: str,
    user_name: str,
    password: Optional[str] = None,
) -> User:
    hashed_password = hash_password(password) if password else None
    new_user = User(
        name=name, email=email, password=hashed_password, user_name=user_name
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


async def get_user(
    db: AsyncSession, user_id: Optional[int] = None, user_email: Optional[str] = None
) -> Optional[User]:
    query = select(User).options(selectinload(User.addresses))
    if user_id is not None:
        query = query.where(User.id == user_id)
    elif user_email is not None:
        query = query.where(User.email == user_email)
    else:
        return None
    result = await db.execute(query)
    return result.scalars().first()
