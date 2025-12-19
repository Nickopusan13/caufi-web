from datetime import datetime
from app.db.base import Base
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import Integer, ForeignKey, Numeric, DateTime, func, Enum, String
from app.db.models.user import User, UserAddress
from typing import TYPE_CHECKING
from enum import StrEnum
from decimal import Decimal

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
    REFUNDED = "refunded"


class Order(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False
    )
    total_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    address_id: Mapped[int] = mapped_column(ForeignKey("user_addresses.id"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
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
    payment_status: Mapped[str] = mapped_column(String(50), nullable=True)
    payment_method: Mapped[str] = mapped_column(String(50), nullable=True)
    transaction_id: Mapped[str] = mapped_column(String(50), nullable=True)
    order_id_midtrans: Mapped[str] = mapped_column(String(50), nullable=True)
    snap_token: Mapped[str] = mapped_column(String(255), nullable=True)
    snap_redirect_url: Mapped[str] = mapped_column(String(255), nullable=True)


class OrderItem(Base):
    __tablename__ = "order_items"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    variant_id: Mapped[int] = mapped_column(ForeignKey("product_variant.id"))
    quantity: Mapped[int] = mapped_column(Integer)
    price_at_purchase: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    order: Mapped["Order"] = relationship("Order", back_populates="items")
    variant: Mapped["ProductVariant"] = relationship(
        "ProductVariant", back_populates="order_items", lazy="joined"
    )

    @property
    def product_id(self) -> int | None:
        try:
            return self.variant.product_id if self.variant is not None else None
        except Exception:
            return None

    @property
    def subtotal(self) -> Decimal:
        return (self.price_at_purchase or Decimal(0)) * (self.quantity or 0)
