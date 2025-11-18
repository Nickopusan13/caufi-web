from typing import List, Optional
from app.db.base import Base
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import String, Integer, DateTime, Date, Boolean, ForeignKey

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    password: Mapped[str] = mapped_column(String(1000), nullable=False)
    created_at: Mapped[str] = mapped_column(DateTime, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    birthday: Mapped[Optional[str]] = mapped_column(Date, nullable=True)
    addresses = relationship(
        "UserAddress",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin"
    )

class UserAddress(Base):
    __tablename__ = "user_addresses"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id = Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    address_line1: Mapped[str] = mapped_column(String(255), nullable=False)
    adrress_line2: Mapped[Optional[str]] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(20), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=False)
    user: Mapped["User"] = relationship("User", back_populates="addresses")