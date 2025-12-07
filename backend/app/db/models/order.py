from datetime import datetime
from app.db.base import Base
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import (
    Integer,
    ForeignKey,
    Numeric,
    DateTime,
    func,
    Enum
)
from enum import StrEnum
from decimal import Decimal
from app.db.models.user import User, UserAddress
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.db.models.product import ProductVariant
else:
    ProductVariant = None


class OrderStatus(StrEnum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Order(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    status: Mapped[str] = mapped_column(Enum(OrderStatus), default=OrderStatus.PENDING)
    total_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    address_id: Mapped[int] = mapped_column(ForeignKey("user_addresses.id"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    user: Mapped["User"] = relationship("User", back_populates="order")
    address: Mapped["UserAddress"] = relationship(
        "UserAddress", back_populates="order_by"
    )
    items: Mapped[list["OrderItem"]] = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

class OrderItem(Base):
    __tablename__ = "order_items"
    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    variant_id: Mapped[int] = mapped_column(ForeignKey("product_variant.id"))
    quantity: Mapped[int] = mapped_column(Integer)
    price_at_purchase: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    order: Mapped["Order"] = relationship("Order", back_populates="items")
    variant: Mapped["ProductVariant"] = relationship(
        "ProductVariant", back_populates="order_items", lazy="joined"
    )
