from app.schemas.to_camel import BaseConfigModel
from typing import Optional
from datetime import datetime
from pydantic import Field
from decimal import Decimal


class ProductMaterial(BaseConfigModel):
    material: str = Field(min_length=1, max_length=100)


class ProductSize(BaseConfigModel):
    size: str = Field(min_length=1, max_length=255)


class ProductImage(BaseConfigModel):
    image_url: str = Field(min_length=1, max_length=255)
    image_size: int = Field(gt=0)
    image_name: str = Field(min_length=1, max_length=255)


class ProductColor(BaseConfigModel):
    color: str = Field(min_length=1, max_length=255)
    hex: str = Field(min_length=1, max_length=255)


class ProductMaterialOut(BaseConfigModel):
    id: Optional[int] = Field(default=None)
    material: str = Field(min_length=1, max_length=100)


class ProductSizeOut(BaseConfigModel):
    id: Optional[int] = Field(default=None)
    size: str = Field(min_length=1, max_length=255)


class ProductImageOut(BaseConfigModel):
    id: Optional[int] = Field(default=None)
    image_url: str = Field(min_length=1, max_length=255)
    image_size: int = Field(gt=0)
    image_name: str = Field(min_length=1, max_length=255)


class ProductColorOut(BaseConfigModel):
    id: Optional[int] = Field(default=None)
    color: str = Field(min_length=1, max_length=255)
    hex: str = Field(min_length=1, max_length=255)


class ProductDataBase(BaseConfigModel):
    name: str = Field(min_length=1, max_length=100)
    stock: int = Field(gt=0)
    stock_type: str = Field(min_length=1, max_length=100)
    shipping_type: str = Field(min_length=1, max_length=100)
    motif: str = Field(min_length=1, max_length=100)
    regular_price: Decimal = Field(gt=0)
    discount_price: Decimal | None = Field(default=None, ge=0)
    category: str = Field(min_length=1, max_length=255)
    product_summary: str = Field(min_length=1)
    manufacturer: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    care_guide: str = Field(min_length=1)
    is_featured: bool = Field(default=False)
    is_active: bool = Field(default=True)


class ProductData(ProductDataBase):
    material: list[ProductMaterial] = Field(default_factory=list)
    sizes: list[ProductSize] = Field(default_factory=list)
    images: Optional[list[ProductImage]] = None
    colors: list[ProductColor] = Field(default_factory=list)


class ProductDataOut(ProductDataBase):
    id: int = Field(gt=0)
    slug: str = Field(min_length=1, max_length=255)
    sku: str = Field(min_length=1, max_length=255)
    material: list[ProductMaterialOut] = Field(default_factory=list)
    sizes: list[ProductSizeOut] = Field(default_factory=list)
    images: list[ProductImageOut] = Field(default_factory=list)
    colors: list[ProductColorOut] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

class ProductUpdate(BaseConfigModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    stock: Optional[int] = Field(None, gt=0)
    stock_type: Optional[str] = Field(None, min_length=1, max_length=100)
    shipping_type: Optional[str] = Field(None, min_length=1, max_length=100)
    motif: Optional[str] = Field(None, min_length=1, max_length=100)
    regular_price: Optional[Decimal] = Field(None, gt=0)
    discount_price: Optional[Decimal] = Field(None, ge=0)
    category: Optional[str] = Field(None, min_length=1, max_length=255)
    product_summary: Optional[str] = Field(None, min_length=1)
    manufacturer: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    care_guide: Optional[str] = Field(None, min_length=1)
    is_featured: Optional[bool] = Field(None)
    is_active: Optional[bool] = Field(None)
    material: Optional[list[ProductMaterial]] = Field(default_factory=list)
    sizes: Optional[list[ProductSize]] = Field(default_factory=list)
    images: Optional[list[ProductImage]] = None
    colors: Optional[list[ProductColor]] = Field(default_factory=list)

class CartItemCreate(BaseConfigModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0)
    size: Optional[str] = Field(default=None, max_length=50)
    color: Optional[str] = Field(default=None, max_length=50)


class CartItemOut(CartItemCreate):
    id: int = Field(gt=0)
    price: Decimal = Field(gt=0)
    product: ProductDataOut


class CartOut(BaseConfigModel):
    cart_items: list[CartItemOut] = Field(default_factory=list)
    total_items: int = 0
    cart_total: Decimal = Field(default=0)


class CartItemUpdate(BaseConfigModel):
    product_id: int
    quantity: int = Field(ge=0)
    size: Optional[str] = Field(default=None, max_length=50)
    color: Optional[str] = Field(default=None, max_length=50)


class ProductDeleteMany(BaseConfigModel):
    product_ids: list[int]


class ProductListFilters(BaseConfigModel):
    search: Optional[str] = None
    category: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    color: Optional[str] = None
    size: Optional[str] = None
    only_active: bool = True
