import { useQuery } from "@tanstack/react-query";
import { fetchProductData } from "@/api/product";
import type { ProductFilters, ProductData } from "@/api/product";

export function useProducts(filters: ProductFilters = {}) {
  return useQuery<ProductData[], Error>({
    queryKey: ["products", filters],
    queryFn: () => fetchProductData(filters),
  });
}
