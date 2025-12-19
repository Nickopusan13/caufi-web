import axios, { AxiosError } from "axios";
import { ProductOut } from "./product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

export interface WishlistOut {
  id: number;
  product: ProductOut;
  createdAt: string;
}

export interface WishlistCreate {
  productId: number;
}

export async function fetchUserWishlist(
  page: number = 1,
  limit: number = 24
): Promise<WishlistOut[]> {
  try {
    const res = await axios.get(`${API_URL}/api/wishlist/get`, {
      params: { page, limit },
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

export async function addToWishlist(
  data: WishlistCreate
): Promise<WishlistOut> {
  try {
    const res = await axios.post(`${API_URL}/api/wishlist/add`, data, {
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

export async function removeFromWishlist(productId: number): Promise<void> {
  try {
    const res = await axios.delete(
      `${API_URL}/api/wishlist/remove/${productId}`,
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
