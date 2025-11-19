from app.schemas.to_camel import BaseConfigModel
from datetime import datetime, date
from pydantic import Field
from decimal import Decimal

class ProductMaterial(BaseConfigModel):
    material: str = Field(min_length=1, max_length=100)

class ProductSize(BaseConfigModel):
    size: str = Field(min_length=1, max_length=255)

class ProductImage(BaseConfigModel):
    image_url: str = Field(min_length=1, max_length=255)
    image_size: int = Field(min_length=1)
    image_name: int = Field(min_length=1, max_length=255)

class ProductColor(BaseConfigModel):
    color: str = Field(min_length=1, max_length=255)
    hex: str = Field(min_length=1, max_length=255)

class ProductData(BaseConfigModel):
    name: str = Field(min_length=1, max_length=100, pattern="^[A-Za-z ]+$")
    stock: int = Field(gt=0)
    stock_type: str = Field(min_length=1, max_length=100)
    shipping_type: str = Field(min_length=1, max_length=100)
    motif: str = Field(min_length=1, max_length=100)
    material: list[ProductMaterial] = Field(default_factory=list)
    sizes: list[ProductSize] = Field(default_factory=list)
    images: list[ProductImage] = Field(default_factory=list)
    colors: list[ProductColor] = Field(default_factory=list)
    regular_price: Decimal = Field(gt=0)
    discount_price: Decimal | None = Field(default=None, ge=0)
    category: str = Field(min_length=1, max_length=255)
    product_summary: str = Field(min_length=1)
    manufacturer: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    care_guide: str = Field(min_length=1)
    slug: str = Field(min_length=1, max_length=255)
    sku: str = Field(min_length=1, max_length=255)

class ProductDataOut(ProductData):
    id: int = Field(gt=0)
    created_at: datetime
    updated_at: datetime
    is_active: bool

class CartItem(BaseConfigModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0)
    size: str | None = Field(default=None, max_length=50)
    color: str | None = Field(default=None, max_length=50)

class CartItemOut(CartItem):
    id: int = Field(gt=0)
    price: Decimal = Field(gt=0)
    product: ProductDataOut

class CartOut(BaseConfigModel):
    id: int = Field(gt=0)
    user_id: int = Field(gt=0)
    created_at: datetime
    updated_at: datetime
    cart_items: list[CartItemOut] = Field(default_factory=list)
    cart_total: Decimal = Field(default=0)