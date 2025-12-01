from pydantic import EmailStr, Field
from app.schemas.to_camel import BaseConfigModel
from datetime import date, datetime
from typing import Optional


class UserRegister(BaseConfigModel):
    name: str = Field(min_length=1, max_length=100, pattern="^[A-Za-z ]+$")
    user_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    email: EmailStr = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=100)


class UserLogin(BaseConfigModel):
    email: EmailStr = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=100)


class UserAddress(BaseConfigModel):
    id: int = Field(gt=0)
    address_line1: str = Field(min_length=1, max_length=255)
    address_line2: Optional[str] = Field(default=None, min_length=1, max_length=255)
    city: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=1, max_length=100)
    postal_code: str = Field(min_length=1, max_length=20)
    country: str = Field(min_length=1, max_length=100)


class UserProfile(BaseConfigModel):
    name: str = Field(min_length=1, max_length=100, pattern="^[A-Za-z ]+$")
    user_name: str = Field(min_length=1, max_length=100)
    gender: Optional[str] = Field(default=None, min_length=1, max_length=20)
    email: EmailStr = Field(min_length=1, max_length=100)
    phone_number: Optional[str] = Field(default=None, min_length=1, max_length=20)
    birthday: Optional[date] = Field(default=None)
    profile_image: Optional[str] = Field(default=None)
    addresses: list["UserAddress"] = Field(default_factory=list)


class UserProfileOut(UserProfile):
    id: int = Field(gt=0)
    created_at: datetime
    is_active: bool
    addresses: list[UserAddress] = Field(default_factory=list)


class UserToken(BaseConfigModel):
    message: str
    user: UserProfileOut
    access_token: str


class UserResetPasswordRequest(BaseConfigModel):
    email: EmailStr = Field(min_length=1, max_length=100)


class UserResetPassword(BaseConfigModel):
    token: str = Field(min_length=1, max_length=255)
    email: EmailStr = Field(min_length=1, max_length=100)
    new_password: str = Field(min_length=8, max_length=100)


class UserDeleteMany(BaseConfigModel):
    user_ids: list[int]


class UserListFilters(BaseConfigModel):
    search: Optional[str] = None
    is_active: Optional[bool] = None
