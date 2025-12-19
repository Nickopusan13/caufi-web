import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserOrder } from "@/api/order";
import type { OrderListOut } from "@/api/order";
import { addUserCart, CartItemCreate, CartOut } from "@/api/cart";
import toast from "react-hot-toast";

export function useGetCurrentOrder() {
  return useQuery<OrderListOut>({
    queryKey: ["currentUserOrder"],
    queryFn: getUserOrder,
  });
}
