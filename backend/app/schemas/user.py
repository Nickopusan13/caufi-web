from pydantic import EmailStr, Field
from app.schemas.to_camel import BaseConfigModel 
from datetime import date, datetime
from typing import Optional

class UserRegister(BaseConfigModel):
    name: str = Field(min_length=1, max_length=100, pattern="^[A-Za-z ]+$")
    email: EmailStr = Field(min_length=1,max_length=100)
    password: str = Field(min_length=8, max_length=100)

class UserLogin(BaseConfigModel):
    email: EmailStr = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=100)

class UserAddress(BaseConfigModel):
    id: int = Field(gt=0)
    address_line1: str = Field(min_length=1, max_length=255)
    address_line2: str | None = Field(default=None, min_length=1, max_length=255)
    city: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=1, max_length=100)
    postal_code: str = Field(min_length=1, max_length=20)
    country: str = Field(min_length=1, max_length=100) 
    
class UserProfile(BaseConfigModel):
    name: str = Field(min_length=1, max_length=100, pattern="^[A-Za-z ]+$")
    email: EmailStr = Field(min_length=1, max_length=100)
    phone_number: str | None = Field(default=None, min_length=1, max_length=20)
    birthday: date | None = Field(default=None)
    profile_image: str | None = Field(default=None)
    addresses: list["UserAddress"] = Field(default_factory=list)

class UserProfileOut(UserProfile):
    id: int = Field(gt=0)
    created_at: datetime
    is_active: bool
    addresses: list[UserAddress] = Field(default_factory=list)
    
class UserToken(BaseConfigModel):
    message: str
    user: UserProfile
    access_token: str

class UserResetPasswordRequest(BaseConfigModel):
    email: EmailStr = Field(min_length=1, max_length=100)

class UserResetPassword(BaseConfigModel):
    token: str = Field(min_length=1, max_length=255)
    new_password: str = Field(min_length=8, max_length=100)

class UserDeleteMany(BaseConfigModel):
    user_ids: list[int]