import axios, { AxiosError } from "axios";
import { UserAddressOut, UserProfileOut } from "./user";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

export type OrderStatus =
  | "all"
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItemCreate {
  productid: number;
  variantId: number;
  quantity: number;
}

export interface OrderCreate {
  addressId: number;
  items: OrderItemCreate[];
}

export interface MidtransTransactionOut {
  orderId: string;
  token: string;
  redirectUrl: string;
  expiredAt: string;
}

export interface OrderItemOut {
  id: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number;
  name: string;
  subtotal: number;
  imageUrl?: string;
}

export interface OrderOut {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
  midtransTransaction?: MidtransTransactionOut;
  address: UserAddressOut;
  user: UserProfileOut;
  items: OrderItemOut[];
}

export type OrderListOut = OrderOut[];

export async function createOrder(data: OrderCreate): Promise<OrderOut> {
  try {
    const res = await axios.post<OrderOut>(
      `${API_URL}/api/orders/create`,
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

export async function orderPay(
  orderId: number
): Promise<MidtransTransactionOut> {
  try {
    const res = await axios.post<MidtransTransactionOut>(
      `${API_URL}/api/orders/${orderId}/pay`,
      null,
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

export async function getUserOrder(): Promise<OrderListOut> {
  const res = await axios.get<OrderListOut>(`${API_URL}/api/orders/me`, {
    withCredentials: true,
  });
  return res.data;
}
