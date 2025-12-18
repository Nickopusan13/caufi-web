from pydantic import Field
from app.schemas.to_camel import BaseConfigModel
from app.schemas.user import UserAddressOut, UserProfileOut
from app.db.models.order import OrderStatus
from datetime import datetime
from typing import Optional, List
from decimal import Decimal


class OrderItemCreate(BaseConfigModel):
    product_id: int = Field(gt=0)
    variant_id: int = Field(gt=0)
    quantity: int = Field(gt=0)


class OrderCreate(BaseConfigModel):
    address_id: int = Field(gt=0)
    items: List[OrderItemCreate] = Field(default_factory=list)


class OrderItemOut(OrderItemCreate):
    id: int = Field(gt=0)
    name: str = Field(min_length=1, max_length=100)
    price_at_purchase: Decimal = Field(gt=0)
    image_url: Optional[str] = Field(default=None)
    subtotal: Decimal = Field(gt=0)


class OrderOut(BaseConfigModel):
    id: int = Field(gt=0)
    status: OrderStatus
    total_amount: Decimal = Field(gt=0)
    created_at: datetime
    updated_at: Optional[datetime] = Field(default=None)
    payment_status: Optional[str] = None
    payment_method: Optional[str] = None
    transaction_id: Optional[str] = None
    order_id_midtrans: Optional[str] = None
    snap_token: Optional[str] = None
    snap_redirect_url: Optional[str] = None
    address: UserAddressOut
    user: UserProfileOut
    items: List[OrderItemOut] = Field(default_factory=list)

class MidtransTransactionOut(BaseConfigModel):
    order_id: str = Field(gt=0)
    token: str = Field(min_length=1)
    redirect_url: str = Field(min_length=1)
    expired_at: datetime