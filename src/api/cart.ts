import axios, { AxiosError } from "axios";
import { ProductOut, ProductVariant } from "./product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

export interface CartItemCreate {
  variantId: number;
  quantity: number;
}

export interface CartItemOut extends CartItemCreate {
  id: number;
  price: number;
  product: ProductOut;
  variant: ProductVariant;
}

export interface CartOut {
  cartItems: CartItemOut[];
  totalItems: number;
  cartTotal: number;
}

export interface CartItemUpdate {
  variantId: number;
  quantity?: number;
}

export async function fetchUserCart(): Promise<CartOut> {
  try {
    const res = await axios.get(`${API_URL}/api/cart/get/all`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message);
  }
}

export async function updateUserCart(
  data: CartItemUpdate
): Promise<CartItemOut> {
  try {
    const res = await axios.patch(`${API_URL}/api/cart/update`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message);
  }
}

export async function deleteUserCart(itemId: number): Promise<CartItemOut> {
  try {
    const res = await axios.delete(`${API_URL}/api/cart/delete/${itemId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message);
  }
}

export async function addUserCart(data: CartItemCreate): Promise<CartOut> {
  try {
    const res = await axios.post(`${API_URL}/api/cart/add`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message);
  }
}
