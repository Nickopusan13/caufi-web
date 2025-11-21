from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from app.db.init_db import create_table
from starlette.middleware.sessions import SessionMiddleware
from app.routes import user, chatbot, product
import os

load_dotenv()
@asynccontextmanager
async def lifespan(app:FastAPI):
    await create_table()
    yield

app = FastAPI(title="Caufi Web Backend", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY")
)

app.include_router(user.router)
app.include_router(chatbot.router)
app.include_router(product.router)