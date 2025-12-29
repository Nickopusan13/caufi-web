import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

export interface UserRegister {
  name: string;
  email: string;
  password: string;
  userName?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserAddressOut extends UserAddress {
  id: number;
}

export interface UserAddress {
  recipientName: string;
  fullAddress: string;
  addressLabel: string;
  phoneNumber: string;
  notesCourier?: string;
  isSelected: boolean;
}

export interface UserAddressUpdate {
  recipientName?: string;
  fullAddress?: string;
  addressLabel?: string;
  phoneNumber?: string;
  notesCourier?: string;
  isSelected?: boolean;
}

export interface UserProfileOut extends UserProfile {
  id: number;
  createdAt: string;
  isAdmin: boolean;
  isActive: boolean;
  isVerified: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  userName: string;
  phoneNumber?: string;
  birthday: string;
  profileImage: string;
  gender?: string;
  addresses: UserAddressOut[];
}

export interface UserToken {
  message: string;
  user: UserProfileOut;
  accessToken: string;
}

export interface UserResetPasswordRequest {
  email: string;
}

export interface UserResetPassword {
  token: string;
  newPassword: string;
  email: string;
}

export interface UserProfileUpdate {
  name?: string;
  email?: string;
  userName?: string;
  phoneNumber?: string;
  birthday?: string;
  profileImage?: string;
  gender?: string;
}

export interface ContactCaufi {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export interface PlaceDetails {
  lat: number;
  lng: number;
  formattedAddress: string;
  placeId: string;
}

export interface StructuredFormatting {
  mainText: string;
  secondaryText: string;
}

export interface AutocompleteResult {
  placeId: string;
  description: string;
  structuredFormatting: StructuredFormatting;
}

export interface AutocompleteResponse {
  predictions: AutocompleteResult[];
}

export interface ReverseGeocodingResult {
  formattedAddress: string;
  placeId?: string;
  lat: number;
  lng: number;
  streetNumber?: string;
  router?: string;
  sublocality?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  postalCode?: string;
}

export interface ReverseGeocodingResponse {
  results: ReverseGeocodingResult[];
  status: string;
}

export interface ChatRequest {
  prompt: string;
  sessionId?: string;
}

export interface ChatResponse {
  reply: string;
  sessionId?: string;
}

export async function fetchUserRegister(data: UserRegister) {
  try {
    const res = await axios.post(`${API_URL}/api/user/register`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail || "Register failed");
    } else {
      throw new Error(error.message || "Register failed");
    }
  }
}

export async function createVerifyEmail(token: string) {
  try {
    const res = await axios.get(`${API_URL}/api/user/verify-email`, {
      params: { token },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail);
    } else {
      throw new Error(error.message);
    }
  }
}

export async function createUserAddress(
  data: UserAddress
): Promise<UserAddressOut> {
  try {
    const res = await axios.post(`${API_URL}/api/user/me/addresses`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail);
    } else {
      throw new Error(error.message);
    }
  }
}

export async function addUploadImages(file: File): Promise<UserProfileOut> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(
      `${API_URL}/api/user/upload/images`,
      formData,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message);
  }
}

export async function fetchUserLogin(data: UserLogin) {
  try {
    const res = await axios.post(`${API_URL}/api/user/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail || "Login failed");
    } else {
      throw new Error(error.message || "Login failed");
    }
  }
}

export async function userLogout() {
  try {
    const res = await axios.post(
      `${API_URL}/api/user/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail || "Logout failed");
    } else {
      throw new Error(error.message || "Logout failed");
    }
  }
}

export async function userGoogleLogin() {
  window.location.href = `${API_URL}/api/user/auth/login/google`;
}

export async function fetchContactCaufi(data: ContactCaufi) {
  try {
    const res = await axios.post(`${API_URL}/api/user/contact-caufi`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail);
    } else {
      throw new Error(error.message);
    }
  }
}

export async function fetchUserResetPasswordRequest(
  data: UserResetPasswordRequest
) {
  try {
    const res = await axios.post(
      `${API_URL}/api/user/reset/password-request`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail);
    } else {
      throw new Error(error.message);
    }
  }
}

export async function fetchUserResetPassword(data: UserResetPassword) {
  try {
    const res = await axios.post(`${API_URL}/api/user/reset/password`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail);
    } else {
      throw new Error(error.message);
    }
  }
}

export async function getUserById(userId: number): Promise<UserProfile> {
  try {
    const res = await axios.get<UserProfileOut>(
      `${API_URL}/api/user/get/${userId}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail);
    } else {
      throw new Error(error.message);
    }
  }
}

export async function getCurrentUser(): Promise<UserProfile> {
  const res = await axios.get<UserProfile>(`${API_URL}/api/user/me`, {
    withCredentials: true,
  });
  return res.data;
}

export async function updateUserProfile(
  data: UserProfileUpdate
): Promise<UserProfileOut> {
  try {
    const res = await axios.patch<UserProfileOut>(
      `${API_URL}/api/user/me/profile`,
      data,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail);
    } else {
      throw new Error(error.message);
    }
  }
}

export async function updateUserAddress(
  addressId: number,
  data: UserAddressUpdate
): Promise<UserAddressOut> {
  try {
    const res = await axios.patch<UserAddressOut>(
      `${API_URL}/api/user/me/address/${addressId}`,
      data,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail);
    } else {
      throw new Error(error.message);
    }
  }
}

export async function mapsGeocode(placeId: string): Promise<PlaceDetails> {
  try {
    const res = await axios.get<PlaceDetails>(`${API_URL}/api/user/geocode`, {
      params: { place_id: placeId },
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail);
    } else {
      throw new Error(error.message);
    }
  }
}

export async function mapsAutocomplete(
  input: string
): Promise<AutocompleteResponse> {
  try {
    const res = await axios.get<AutocompleteResponse>(
      `${API_URL}/api/user/places/autocomplete`,
      {
        params: { input: input },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail);
    } else {
      throw new Error(error.message);
    }
  }
}

export async function mapsReverseGeocoding(
  lat: number,
  lng: number
): Promise<ReverseGeocodingResponse> {
  try {
    const res = await axios.get<ReverseGeocodingResponse>(
      `${API_URL}/api/user/reverse-geocode`,
      {
        params: { lat, lng },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail);
    } else {
      throw new Error(error.message);
    }
  }
}

export async function apiChatBot(data: ChatRequest) {
  try {
    const res = await axios.post<ChatResponse>(
      `${API_URL}/api/chat/bot`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail);
    } else {
      throw new Error(error.message);
    }
  }
}
