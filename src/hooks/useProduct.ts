import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProductData,
  addProductData,
  addProductImage,
  updateProductData,
  deleteProductData,
  deleteProductImage,
} from "@/api/product";
import type {
  ProductFilters,
  ProductListResponse,
  ProductOut,
  ProductData,
  ProductDataUpdate,
  ProductImage,
} from "@/api/product";
import toast from "react-hot-toast";

export function useProducts(filters: ProductFilters = {}) {
  return useQuery<ProductListResponse, Error>({
    queryKey: ["products", filters],
    queryFn: () => fetchProductData(filters),
  });
}

export function useAddProductData() {
  return useMutation<ProductOut, Error, ProductData>({
    mutationFn: addProductData,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Blog added!!");
    },
  });
}

export function useDeleteProductData() {
  return useMutation({
    mutationFn: deleteProductData,
    onSuccess: () => {
      toast.success("Item removed!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateProduct() {
  return useMutation<
    ProductOut,
    Error,
    { productId: number; data: ProductDataUpdate }
  >({
    mutationFn: ({ productId, data }) => updateProductData(data, productId),
    onSuccess: () => {
      toast.success("Update Done!!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useAddProductImage() {
  return useMutation<ProductImage[], Error, { productId: number; file: File }>({
    mutationFn: ({ productId, file }) => addProductImage(productId, file),
    onSuccess: () => {
      toast.success("Add Done!!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProductImage,
    onMutate: async (imageId: number) => {
      await queryClient.cancelQueries({ queryKey: ["product"] });
      const previousProduct = queryClient.getQueryData(["product"]);
      queryClient.setQueryData(["product"], (old: unknown) => {
        if (!old) return old;
        const oldData = old as { images?: Array<{ id: number }> };
        return {
          ...oldData,
          images: oldData.images?.filter((img: { id: number }) => img.id !== imageId),
        };
      });
      return { previousProduct };
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Image Deleted!!!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
}
