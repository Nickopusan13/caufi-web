from pydantic import Field
from app.schemas.to_camel import BaseConfigModel
from app.schemas.user import UserAddress, UserProfileOut
from app.db.models.user import OrderStatus
from datetime import datetime
from typing import Optional, List
from decimal import Decimal

class OrderItemCreate(BaseConfigModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0)
    price_at_purchase: Decimal = Field(gt=0)


class OrderCreate(BaseConfigModel):
    address_id: int = Field(gt=0)
    total_amount: Decimal = Field(gt=0)
    items: List[OrderItemCreate] = Field(default_factory=list)


class OrderItemOut(OrderItemCreate):
    id: int = Field(gt=0)
    name: str = Field(min_length=1, max_length=100)
    image_url: Optional[str] = Field(default=None)


class OrderOut(BaseConfigModel):
    id: int = Field(gt=0)
    status: OrderStatus
    total_amount: Decimal = Field(gt=0)
    created_at: datetime
    address: UserAddress
    user: UserProfileOut
    items: List[OrderItemOut] = Field(default_factory=list)
