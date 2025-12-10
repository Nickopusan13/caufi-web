import { useQuery } from "@tanstack/react-query";
import { fetchProductData } from "@/api/product";
import type { ProductFilters, ProductListResponse } from "@/api/product";

export function useProducts(filters: ProductFilters = {}) {
  return useQuery<ProductListResponse, Error>({
    queryKey: ["products", filters],
    queryFn: () => fetchProductData(filters),
  });
}
