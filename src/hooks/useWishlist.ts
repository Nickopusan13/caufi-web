import { useMutation, useQuery } from "@tanstack/react-query";
import type { WishlistCreate } from "@/api/wishlist";
import {
  addToWishlist,
  fetchUserWishlist,
  removeFromWishlist,
  WishlistOut,
} from "@/api/wishlist";
import toast from "react-hot-toast";

export function useGetWishlist({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  return useQuery({
    queryKey: ["userWishlist", page, limit],
    queryFn: () => fetchUserWishlist(page, limit),
  });
}

export function useAddToWishlist() {
  return useMutation<WishlistOut, Error, WishlistCreate>({
    mutationFn: addToWishlist,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Added to Wishlist");
    },
  });
}

export function useRemoveFromwishlist() {
  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      toast.success("Item removed!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
