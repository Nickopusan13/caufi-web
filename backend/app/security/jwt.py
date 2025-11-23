from jose import JWTError, jwt
from dotenv import load_dotenv
from fastapi import HTTPException, status
import logging
import pendulum
import os

logger = logging.getLogger(__name__)
load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
JWT_TOKEN_EXPIRE_DAYS = int(os.getenv("JWT_TOKEN_EXPIRE_DAYS"))


async def create_jwt_token(data: dict) -> str:
    to_encode = data.copy()
    expire = pendulum.now().add(days=JWT_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire.int_timestamp})
    return jwt.encode(to_encode, key=JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


async def verify_jwt_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError as e:
        logger.error("JWT verification failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
