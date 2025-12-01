import { useQuery } from "@tanstack/react-query";
import { getUserOrder } from "@/api/order";
import type { OrderListOut } from "@/api/order";

export function useGetCurrentOrder() {
  return useQuery<OrderListOut>({
    queryKey: ["currentUserOrder"],
    queryFn: getUserOrder,
  });
}
