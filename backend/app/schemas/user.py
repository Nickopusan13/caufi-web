from pydantic import EmailStr, Field
from app.schemas.to_camel import BaseConfigModel
from datetime import date, datetime, timezone
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
    phone_number: str = Field(min_length=1, max_length=20)
    notes_courier: Optional[str] = Field(default=None)
    is_selected: bool = Field(default=False)


class UserAddressUpdate(BaseConfigModel):
    recipient_name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    full_address: Optional[str] = Field(default=None, min_length=1, max_length=255)
    address_label: Optional[str] = Field(default=None, min_length=1, max_length=255)
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
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_admin: bool = Field(default=False)
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    addresses: list[UserAddressOut] = Field(default_factory=list)


class UserToken(BaseConfigModel):
    message: str = Field(min_length=1)
    user: UserProfileOut = Field(...)
    access_token: str = Field(min_length=1)


class UserResetPasswordRequest(BaseConfigModel):
    email: EmailStr = Field(min_length=1, max_length=100)


class UserResetPassword(BaseConfigModel):
    token: str = Field(min_length=1, max_length=255)
    email: EmailStr = Field(min_length=1, max_length=100)
    new_password: str = Field(min_length=8, max_length=100)


class UserDeleteMany(BaseConfigModel):
    user_ids: list[int] = Field(default_factory=list)


class UserListFilters(BaseConfigModel):
    search: Optional[str] = Field(default=None)
    is_active: Optional[bool] = Field(default=None)


class PlaceDetails(BaseConfigModel):
    lat: float = Field(...)
    lng: float = Field(...)
    place_id: str = Field(...)
    formatted_address: str = Field(...)
    street_number: Optional[str] = Field(default=None)
    route: Optional[str] = Field(default=None)
    street: Optional[str] = Field(default=None)
    neighborhood: Optional[str] = Field(default=None)
    city: Optional[str] = Field(default=None)
    district: Optional[str] = Field(default=None)
    state: Optional[str] = Field(default=None)
    country_code: Optional[str] = Field(default=None)
    postal_code: Optional[str] = Field(default=None)
    best_display_address: str = Field(...)


class StructuredFormatting(BaseConfigModel):
    main_text: str = Field(min_length=1)
    secondary_text: str = Field(min_length=1)


class AutocompleteResult(BaseConfigModel):
    place_id: str = Field(...)
    description: str = Field(min_length=1)
    structured_formatting: StructuredFormatting = Field(...)


class AutocompleteResponse(BaseConfigModel):
    predictions: list[AutocompleteResult] = Field(default_factory=list)


class ReverseGeocodingResult(BaseConfigModel):
    formatted_address: str = Field(...)
    place_id: Optional[str] = Field(default=None)
    lat: float = Field(...)
    lng: float = Field(...)
    street_number: Optional[str] = Field(default=None)
    route: Optional[str] = Field(default=None)
    sublocality: Optional[str] = Field(default=None)
    city: Optional[str] = Field(default=None)
    district: Optional[str] = Field(default=None)
    state: Optional[str] = Field(default=None)
    country: Optional[str] = Field(default=None)
    country_code: Optional[str] = Field(default=None)
    postal_code: Optional[str] = Field(default=None)


class ReverseGeocodingResponse(BaseConfigModel):
    results: list[ReverseGeocodingResult] = Field(default_factory=list)
    status: str = Field(...)


class ContactCaufi(BaseConfigModel):
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)
    email: EmailStr = Field(...)
    subject: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1)
