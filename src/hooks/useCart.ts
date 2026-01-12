import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CartItemCreate, CartOut } from "@/api/cart";
import {
  fetchUserCart,
  updateUserCart,
  deleteUserCart,
  addUserCart,
} from "@/api/cart";

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
      queryClient.setQueryData(["userCart"], updateCart);
    },
  });
}

export function useDeleteCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCart"] });
    },
  });
}

export function useAddToCart() {
  return useMutation<CartOut, Error, CartItemCreate>({
    mutationFn: addUserCart,
  });
}
