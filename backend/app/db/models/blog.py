from app.db.base import Base
from datetime import datetime
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import String, DateTime, func, Text, ForeignKey, Integer


class Blog(Base):
    __tablename__ = "blog"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    author: Mapped[str] = mapped_column(String(255), nullable=False)
    date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )
    slug: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    category: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    images: Mapped[list["BlogImage"]] = relationship(
        "BlogImage",
        back_populates="blog",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class BlogImage(Base):
    __tablename__ = "blog_images"
    id: Mapped[int] = mapped_column(primary_key=True)
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)
    blog_id: Mapped[int] = mapped_column(Integer, ForeignKey("blog.id"), nullable=False)
    blog: Mapped["Blog"] = relationship(
        "Blog", back_populates="images", lazy="selectin"
    )
