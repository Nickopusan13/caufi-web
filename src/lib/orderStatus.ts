// lib/order-status.ts  ← create this file
import type { OrderOut } from "@/api/order";

export const ORDER_STATUS_LABEL: Record<
  NonNullable<OrderOut["status"]>,
  string
> = {
  all: "All",
  pending: "Pending Payment",
  confirmed: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
} as const;

export const ORDER_STATUS_PRIORITY: Record<
  NonNullable<OrderOut["status"]>,
  number
> = {
  all: 1,
  pending: 2,
  confirmed: 3,
  shipped: 4,
  delivered: 5,
  cancelled: 6,
  refunded: 7,
};

export const ORDER_FILTERS = [
  { label: "All", value: "all" as const },
  { label: ORDER_STATUS_LABEL.pending, value: "pending" as const },
  { label: ORDER_STATUS_LABEL.confirmed, value: "confirmed" as const },
  { label: ORDER_STATUS_LABEL.shipped, value: "shipped" as const },
  { label: ORDER_STATUS_LABEL.delivered, value: "delivered" as const },
  { label: ORDER_STATUS_LABEL.cancelled, value: "cancelled" as const },
  { label: ORDER_STATUS_LABEL.refunded, value: "refunded" as const },
] as const;

export type OrderFilterValue = "all" | OrderOut["status"];
