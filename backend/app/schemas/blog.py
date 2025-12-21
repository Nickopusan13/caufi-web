from pydantic import Field
from app.schemas.to_camel import BaseConfigModel
from datetime import datetime
from typing import Optional

class BlogImageOut(BaseConfigModel):
    id: int = Field(gt=0)
    image_url: str = Field(min_length=1, max_length=255)
    position: Optional[int] = Field(default=0)


class BlogCreate(BaseConfigModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    author: str = Field(min_length=1, max_length=255)
    category: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1)


class BlogOut(BlogCreate):
    id: int = Field(gt=0)
    images: list[BlogImageOut] = Field(default=[])
    date: datetime


class BlogUpdate(BaseConfigModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, min_length=1)
    author: Optional[str] = Field(default=None, min_length=1, max_length=255)
    category: Optional[str] = Field(default=None, min_length=1, max_length=200)
    content: Optional[str] = Field(default=None, min_length=1)
    images: Optional[list[BlogImageOut]] = Field(default=None)