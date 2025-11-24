from typing import Optional
from decimal import Decimal
from app.db.base import Base
from datetime import datetime
from sqlalchemy.orm import mapped_column, Mapped, relationship
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
    stock: Mapped[int] = mapped_column(Integer, default=0)
    stock_type: Mapped[str] = mapped_column(String(100), nullable=False)
    shipping_type: Mapped[str] = mapped_column(String(100), nullable=False)
    motif: Mapped[str] = mapped_column(String(100), nullable=False)
    material: Mapped[list["ProductMaterial"]] = relationship(
        "ProductMaterial",
        back_populates="product",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    sizes: Mapped[list["ProductSize"]] = relationship(
        "ProductSize",
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
    colors: Mapped[list["ProductColor"]] = relationship(
        "ProductColor",
        back_populates="product",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    cart_items: Mapped[list["CartItem"]] = relationship(
        "CartItem",
        back_populates="product",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    regular_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    discount_price: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 2), nullable=True
    )
    category: Mapped[str] = mapped_column(String(255), nullable=False)
    product_summary: Mapped[str] = mapped_column(Text, nullable=False)
    manufacturer: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    care_guide: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    slug: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    sku: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
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
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("product.id"))
    product: Mapped["Product"] = relationship(
        "Product", back_populates="material", lazy="selectin"
    )


class ProductSize(Base):
    __tablename__ = "product_size"
    id: Mapped[int] = mapped_column(primary_key=True)
    size: Mapped[str] = mapped_column(String(255), nullable=False)
    product_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("product.id"), nullable=False
    )
    product: Mapped["Product"] = relationship(
        "Product", back_populates="sizes", lazy="selectin"
    )


class ProductImage(Base):
    __tablename__ = "product_image"
    id: Mapped[int] = mapped_column(primary_key=True)
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)
    image_size: Mapped[int] = mapped_column(Integer, nullable=False)
    image_name: Mapped[str] = mapped_column(String(255), nullable=False)
    product_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("product.id"), nullable=False
    )
    product: Mapped["Product"] = relationship(
        "Product", back_populates="images", lazy="selectin"
    )


class ProductColor(Base):
    __tablename__ = "product_color"
    id: Mapped[int] = mapped_column(primary_key=True)
    color: Mapped[str] = mapped_column(String(255), nullable=False)
    hex: Mapped[str] = mapped_column(String(255), nullable=False)
    product_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("product.id"), nullable=False
    )
    product: Mapped["Product"] = relationship(
        "Product", back_populates="colors", lazy="selectin"
    )


class Cart(Base):
    __tablename__ = "cart"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
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
    cart_id: Mapped[int] = mapped_column(Integer, ForeignKey("cart.id"), nullable=False)
    product_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("product.id"), nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    size: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    color: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    product: Mapped["Product"] = relationship(
        "Product", back_populates="cart_items", lazy="selectin"
    )
    cart: Mapped["Cart"] = relationship(
        "Cart", back_populates="cart_items", lazy="selectin"
    )
    __table_args__ = (
        UniqueConstraint(
            "cart_id", "product_id", "size", "color", name="uix_cart_product_variant"
        ),
    )
