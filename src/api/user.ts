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

export interface UserAddressOut {
  id: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserAddressUpdate {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface UserProfileOut {
  id: number;
  name: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  birthday: string;
  profileImage: string;
  gender?: string;
  addresses: UserAddressOut[];
  createdAt: string;
  isActive: boolean;
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
  placeid: string;
  description: string;
  structuredFormatting: StructuredFormatting;
}
export interface AutocompleteResponse {
  predictions: AutocompleteResult[];
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

export async function createUserAddress(data: UserAddress) {
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
