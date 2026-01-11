from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from app.db.init_db import create_table
from starlette.middleware.sessions import SessionMiddleware
from app.routes import user, chatbot, product, cart, order, wishlist, blog
from app.core.redis import redis_client
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
import os

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_table()
    try:
        pong = await redis_client.ping()
        print("Redis connected:", pong)
    except Exception as e:
        print("Redis connection failed:", e)
    FastAPICache.init(RedisBackend(redis_client))
    yield
    await redis_client.close()
    await redis_client.connection_pool.disconnect()


app = FastAPI(title="Caufi Web Backend", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET_KEY"))

app.include_router(user.router)
app.include_router(chatbot.router)
app.include_router(product.router)
app.include_router(cart.router)
app.include_router(order.router)
app.include_router(wishlist.router)
app.include_router(blog.router)
