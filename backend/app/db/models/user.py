from typing import Optional
from app.db.base import Base
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import String, Integer, DateTime, Date, Boolean, ForeignKey, func

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    password: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[str] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    birthday: Mapped[Optional[str]] = mapped_column(Date, nullable=True)
    profile_image: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    addresses: Mapped["UserAddress"] = relationship(
        "UserAddress",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin"
    )
    password_reset_token: Mapped["UserPasswordResetToken"] = relationship(
        "UserPasswordResetToken",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
        lazy="selectin"
    )

class UserAddress(Base):
    __tablename__ = "user_addresses"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    address_line1: Mapped[str] = mapped_column(String(255), nullable=False)
    address_line2: Mapped[Optional[str]] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(20), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=False)
    user: Mapped["User"] = relationship("User", back_populates="addresses")

class UserPasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    token: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    expires_at: Mapped[str] = mapped_column(DateTime(), nullable=False)
    used: Mapped[bool] = mapped_column(Boolean, default=False)
    user: Mapped["User"] = relationship("User", back_populates="password_reset_token")