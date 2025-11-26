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
}

export interface UserLogin {
  email: string;
  password: string;
}

export async function fetchUseregister(data: UserRegister) {
  try {
    const res = await axios.post(`${API_URL}/api/user/register`, data, {
      headers: {
        "Content-Type": "application/json",
      },
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
