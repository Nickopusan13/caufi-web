import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import type { WishlistCreate } from "@/api/wishlist";
import {
  addToWishlist,
  fetchUserWishlist,
  removeFromWishlist,
  WishlistOut,
} from "@/api/wishlist";

export function useGetWishlist(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<
    WishlistOut[],
    Error,
    WishlistOut[],
    readonly unknown[]
  >
) {
  return useQuery<WishlistOut[], Error, WishlistOut[], readonly unknown[]>({
    queryKey: ["userWishlist", page, limit],
    queryFn: () => fetchUserWishlist(page, limit),
    ...options,
  });
}

export function useAddToWishlist() {
  return useMutation<WishlistOut, Error, WishlistCreate>({
    mutationFn: addToWishlist,
  });
}

export function useRemoveFromwishlist() {
  return useMutation({
    mutationFn: removeFromWishlist,
  });
}
