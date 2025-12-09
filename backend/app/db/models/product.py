from typing import Optional
from decimal import Decimal
from app.db.base import Base
from datetime import datetime
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.db.models.order import OrderItem
from sqlalchemy import (
    String,
    Integer,
    DateTime,
    Boolean,
    ForeignKey,
    func,
    Text,
    Numeric,
    UniqueConstraint,
)


class Product(Base):
    __tablename__ = "product"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    stock_type: Mapped[str] = mapped_column(String(100), nullable=False)
    shipping_type: Mapped[str] = mapped_column(String(100), nullable=False)
    motif: Mapped[str] = mapped_column(String(100), nullable=False)
    variants: Mapped[list["ProductVariant"]] = relationship(
        "ProductVariant",
        back_populates="product",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    materials: Mapped[list["ProductMaterial"]] = relationship(
        "ProductMaterial",
        back_populates="product",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    images: Mapped[list["ProductImage"]] = relationship(
        "ProductImage",
        back_populates="product",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    category: Mapped[str] = mapped_column(String(255), nullable=False)
    product_summary: Mapped[str] = mapped_column(Text, nullable=False)
    manufacturer: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    care_guide: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    slug: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    is_featured: Mapped[bool] = mapped_column(Boolean(), default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True, nullable=False)


class ProductMaterial(Base):
    __tablename__ = "product_material"
    id: Mapped[int] = mapped_column(primary_key=True)
    material: Mapped[str] = mapped_column(String(100), nullable=False)
    product_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("product.id", ondelete="CASCADE")
    )
    product: Mapped["Product"] = relationship(
        "Product", back_populates="materials", lazy="selectin"
    )


class ProductVariant(Base):
    __tablename__ = "product_variant"
    id: Mapped[int] = mapped_column(primary_key=True)
    sku: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    regular_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    discount_price: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 2), nullable=True
    )
    size: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    stock: Mapped[int] = mapped_column(Integer, default=0)
    color: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    hex: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    product_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("product.id", ondelete="CASCADE"), nullable=False
    )
    product: Mapped["Product"] = relationship("Product", back_populates="variants")
    cart_items: Mapped[list["CartItem"]] = relationship(
        "CartItem",
        back_populates="variant",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    order_items: Mapped[list["OrderItem"]] = relationship(
        "OrderItem",
        back_populates="variant",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class ProductImage(Base):
    __tablename__ = "product_image"
    id: Mapped[int] = mapped_column(primary_key=True)
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)
    position: Mapped[int] = mapped_column(Integer, default=0)
    product_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("product.id", ondelete="CASCADE"), nullable=False
    )
    product: Mapped["Product"] = relationship(
        "Product", back_populates="images", lazy="selectin"
    )


class Cart(Base):
    __tablename__ = "cart"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
    cart_items: Mapped[list["CartItem"]] = relationship(
        "CartItem", back_populates="cart", cascade="all, delete-orphan", lazy="selectin"
    )


class CartItem(Base):
    __tablename__ = "cart_item"
    id: Mapped[int] = mapped_column(primary_key=True)
    cart_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("cart.id", ondelete="CASCADE"), nullable=False
    )
    variant_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("product_variant.id", ondelete="CASCADE"), nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    variant: Mapped["ProductVariant"] = relationship(
        "ProductVariant", back_populates="cart_items", lazy="selectin"
    )
    cart: Mapped["Cart"] = relationship(
        "Cart", back_populates="cart_items", lazy="selectin"
    )
    
    @property
    def price(self) -> Decimal:
        # derive current price from the variant; prefer discount if present
        if not getattr(self, "variant", None):
            return Decimal("0")
        return self.variant.discount_price or self.variant.regular_price

    @property
    def product(self):
        return getattr(self.variant, "product", None)
    __table_args__ = (
        UniqueConstraint("cart_id", "variant_id", name="uix_cart_product_variant"),
    )
