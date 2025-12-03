import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CartOut } from "@/api/cart";
import { fetchUserCart, updateUserCart, deleteUserCart } from "@/api/cart";
import toast from "react-hot-toast";

export function useGetCart() {
  return useQuery<CartOut>({
    queryKey: ["userCart"],
    queryFn: () => fetchUserCart(),
  });
}

export function useUpdateUserCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserCart,
    onSuccess: (updateCart) => {
      toast.success("Update Done!!");
      queryClient.setQueryData(["userCart"], updateCart);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserCart,
    onSuccess: () => {
      toast.success("Item removed!");
      queryClient.invalidateQueries({ queryKey: ["userCart"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
