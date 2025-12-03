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


class UserAddressCreate(BaseConfigModel):
    recipient_name: str = Field(min_length=1, max_length=255)
    full_address: str = Field(min_length=1, max_length=255)
    address_label: str = Field(min_length=1, max_length=255)
    city: str = Field(min_length=1, max_length=255)
    phone_number: str = Field(min_length=1, max_length=20)
    notes_courier: Optional[str] = Field(default=None)
    is_selected: bool = Field(default=False)


class UserAddressUpdate(BaseConfigModel):
    recipient_name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    full_address: Optional[str] = Field(default=None, min_length=1, max_length=255)
    address_label: Optional[str] = Field(default=None, min_length=1, max_length=255)
    city: Optional[str] = Field(default=None, min_length=1, max_length=255)
    phone_number: Optional[str] = Field(default=None, min_length=1, max_length=20)
    notes_courier: Optional[str] = Field(default=None, max_length=255)
    is_selected: Optional[bool] = Field(default=False)


class UserAddressOut(UserAddressCreate):
    id: int = Field(gt=0)


class UserProfile(BaseConfigModel):
    name: str = Field(min_length=1, max_length=100, pattern="^[A-Za-z ]+$")
    user_name: str = Field(min_length=1, max_length=100)
    gender: Optional[str] = Field(default=None, min_length=1, max_length=20)
    email: EmailStr = Field(min_length=1, max_length=100)
    phone_number: Optional[str] = Field(default=None, min_length=1, max_length=20)
    birthday: Optional[date] = Field(default=None)
    profile_image: Optional[str] = Field(default=None)
    addresses: list["UserAddressOut"] = Field(default_factory=list)


class UserProfileUpdate(BaseConfigModel):
    name: Optional[str] = Field(
        default=None, min_length=1, max_length=100, pattern="^[A-Za-z ]+$"
    )
    user_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    gender: Optional[str] = Field(default=None, min_length=1, max_length=20)
    email: Optional[EmailStr] = Field(default=None, min_length=1, max_length=100)
    phone_number: Optional[str] = Field(default=None, min_length=1, max_length=20)
    birthday: Optional[date] = Field(default=None)
    profile_image: Optional[str] = Field(default=None)


class UserProfileOut(UserProfile):
    id: int = Field(gt=0)
    created_at: datetime
    is_active: bool
    addresses: list[UserAddressOut] = Field(default_factory=list)


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


class PlaceDetails(BaseConfigModel):
    lat: float = Field(..., description="Latitude of the selected place")
    lng: float = Field(..., description="Longitude of the selected place")
    formatted_address: str = Field(..., min_length=1, max_length=255)
    place_id: str = Field(..., min_length=1, max_length=255)


class StructuredFormatting(BaseConfigModel):
    main_text: str
    secondary_text: str


class AutocompleteResult(BaseConfigModel):
    place_id: str
    description: str
    structured_formatting: StructuredFormatting


class AutocompleteResponse(BaseConfigModel):
    predictions: list[AutocompleteResult]
