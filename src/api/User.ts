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
      `${API_URL}/logout`,
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
  console.log(res);
  return res.data;
}
