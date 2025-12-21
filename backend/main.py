from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from app.db.init_db import create_table
from starlette.middleware.sessions import SessionMiddleware
from app.routes import user, chatbot, product, cart, order, wishlist, blog
from sqladmin import Admin, ModelView
from app.db.session import engine
from app.db.models.user import User
from app.db.models.product import Product
import os

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_table()
    yield


app = FastAPI(title="Caufi Web Backend", lifespan=lifespan)
admin = Admin(app, engine)


class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.name]


class ProductAdmin(ModelView, model=Product):
    column_list = [Product.id, Product.name]


admin.add_view(UserAdmin)
admin.add_view(ProductAdmin)
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
