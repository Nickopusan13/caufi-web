from typing import Optional
from app.db.base import Base
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import String, Integer, DateTime, Date, Boolean, ForeignKey, func, Text

class Product(Base):
    __tablename__ = "product"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    stock: Mapped[int] = mapped_column(Integer, default=0)
    stock_type: Mapped[str] = mapped_column(String(100), nullable=False)
    shipping_type: Mapped[str] = mapped_column(String(100), nullable=False)
    motif: Mapped[str] = mapped_column(String(100), nullable=False)
    material: Mapped["ProductMaterial"] = relationship(
        "ProductMaterial",
        back_populates="product",
        lazy="selectin"
    )
    sizes: Mapped["ProductSize"] = relationship(
        "ProductSize",
        back_populates="product",
        lazy="selectin"
    )
    images: Mapped["ProductImage"] = relationship(
        "ProductImage",
        back_populates="product",
        lazy="selectin"
    )
    colors: Mapped["ProductColor"] = relationship(
        "ProductColor",
        back_populates="product",
        lazy="selectin"
    )
    regular_price: Mapped[int] = mapped_column(Integer, nullable=False)
    discount_price: Mapped[int] = mapped_column(Integer, nullable=True)
    category: Mapped[str] = mapped_column(String(255), nullable=False)
    product_summary: Mapped[str] = mapped_column(Text, nullable=False)
    manufacturer: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    care_guide = Mapped[str] = mapped_column(Text, nullable=True)
    slug: Mapped[str] = mapped_column(String(255), nullable=False)
    sku: mapped_column[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[str] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at: Mapped[str] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True, nullable= False)

class ProductMaterial(Base):
    __tablename__ = "product_material"
    id: Mapped[int] = mapped_column(primary_key=True)
    material: Mapped[str] = mapped_column(String(100), nullable=False)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("product.id"))
    product: Mapped["Product"] = relationship("User", back_populates="material")

class ProductSize(Base):
    __tablename__ = "product_size"
    id: Mapped[int] = mapped_column(primary_key=True)
    size: Mapped[str] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("product.id"))
    product: Mapped["Product"] = relationship("User", back_populates="sizes")

class ProductImage(Base):
    __tablename__ = "product_image"
    id: Mapped[int] = mapped_column(primary_key=True)
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)
    image_size: Mapped[int] = mapped_column(Integer, nullable=False)
    image_name: Mapped[str] = mapped_column(String(255), nullable=False)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("product.id"))
    product: Mapped["Product"] = relationship("User", back_populates="images")

class ProductColor(Base):
    __tablename__ = "product_color"
    id: Mapped[int] = mapped_column(primary_key=True)
    color: Mapped[str] = mapped_column(String(255), nullable=False)
    hex: Mapped[str] = mapped_column(String(255), nullable=False)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("product.id"))
    product: Mapped["Product"] = relationship("User", back_populates="colors")