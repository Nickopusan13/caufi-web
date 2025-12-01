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

export interface OrderItemOut {
  id: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number;
  name: string;
  imageUrl?: string;
}

export interface OrderOut {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  address: UserAddressOut;
  user: UserProfileOut;
  items: OrderItemOut[];
}

export type OrderListOut = OrderOut[];

export async function getUserOrder(): Promise<OrderListOut> {
  const res = await axios.get<OrderListOut>(`${API_URL}/api/orders/me`, {
    withCredentials: true,
  });
  return res.data;
}
