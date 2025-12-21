from app.schemas.to_camel import BaseConfigModel
from typing import Optional, List
from datetime import datetime, timezone
from pydantic import Field
from decimal import Decimal


class ProductImageOut(BaseConfigModel):
    id: int = Field(default=1)
    image_url: str = Field(min_length=1, max_length=255)
    position: Optional[int] = Field(default=0)


class ProductMaterialOut(BaseConfigModel):
    material: str = Field(min_length=1, max_length=100)


class ProductVariantDataBase(BaseConfigModel):
    regular_price: Decimal = Field(gt=0)
    discount_price: Decimal | None = Field(default=None, ge=0)
    size: Optional[str] = Field(min_length=1, max_length=255)
    stock: int = Field(default=0)
    color: Optional[str] = Field(min_length=1, max_length=255)
    hex: Optional[str] = Field(min_length=1, max_length=255)


class ProductVariantDataOut(ProductVariantDataBase):
    id: Optional[int] = Field(default=None, gt=0)
    sku: Optional[str] = Field(default=None, min_length=1, max_length=255)


class ProductVariantUpdate(BaseConfigModel):
    regular_price: Optional[Decimal] = Field(default=None, gt=0)
    discount_price: Optional[Decimal] = Field(default=None, ge=0)
    size: Optional[str] = Field(default=None, min_length=1, max_length=255)
    stock: Optional[int] = Field(default=None)
    color: Optional[str] = Field(default=None, min_length=1, max_length=255)
    hex: Optional[str] = Field(default=None, min_length=1, max_length=255)


class ProductDataBase(BaseConfigModel):
    name: str = Field(min_length=1, max_length=100)
    stock_type: str = Field(min_length=1, max_length=100)
    shipping_type: str = Field(min_length=1, max_length=100)
    motif: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=255)
    product_summary: str = Field(min_length=1)
    manufacturer: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    care_guide: str = Field(min_length=1)
    materials: List[ProductMaterialOut] = Field(default_factory=list)
    variants: List[ProductVariantDataOut] = Field(default_factory=list)
    is_featured: bool = Field(default=False)
    is_active: bool = Field(default=True)


class ProductDataOut(ProductDataBase):
    id: int = Field(gt=0)
    images: List[ProductImageOut] = Field(default_factory=list)
    slug: str = Field(min_length=1, max_length=255)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProductListResponse(BaseConfigModel):
    products: list[ProductDataOut] = Field(default_factory=list)
    total: int = Field(default=0)
    current_page: int = Field(default=1)
    category_counts: dict[str, int] = Field(default_factory=dict)
    total_pages: int = Field(default=1)


class ProductUpdate(BaseConfigModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    stock_type: Optional[str] = Field(default=None, min_length=1, max_length=100)
    shipping_type: Optional[str] = Field(default=None, min_length=1, max_length=100)
    motif: Optional[str] = Field(default=None, min_length=1, max_length=100)
    category: Optional[str] = Field(default=None, min_length=1, max_length=255)
    product_summary: Optional[str] = Field(default=None, min_length=1)
    manufacturer: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, min_length=1)
    care_guide: Optional[str] = Field(default=None, min_length=1)
    is_featured: Optional[bool] = Field(default=None)
    is_active: Optional[bool] = Field(default=None)
    materials: Optional[list[ProductMaterialOut]] = Field(default_factory=list)


class CartItemCreate(BaseConfigModel):
    variant_id: int = Field(gt=0)
    quantity: int = Field(gt=0)


class CartItemOut(CartItemCreate):
    id: int = Field(gt=0)
    price: Decimal = Field(gt=0)
    product: ProductDataOut = Field(...)
    variant: ProductVariantDataOut = Field(...)


class CartOut(BaseConfigModel):
    cart_items: List[CartItemOut] = Field(default_factory=list)
    total_items: int = Field(default=0)
    cart_total: Decimal = Field(default=0)


class CartItemUpdate(BaseConfigModel):
    variant_id: int = Field(gt=0)
    quantity: Optional[int] = Field(ge=0)


class ProductDeleteMany(BaseConfigModel):
    product_ids: List[int] = Field(default_factory=list)


class ProductListFilters(BaseConfigModel):
    search: Optional[str] = Field(default=None)
    category: Optional[str] = Field(default=None)
    min_price: Optional[float] = Field(default=None)
    max_price: Optional[float] = Field(default=None)
    only_active: bool = Field(default=True)
    sort: Optional[str] = Field(default="newest")


class WishlistOut(BaseConfigModel):
    id: int = Field(gt=0)
    product: ProductDataOut = Field(...)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class WishlistCreate(BaseConfigModel):
    product_id: int = Field(gt=0)
