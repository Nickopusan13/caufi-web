import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

export interface ProductMaterial {
  material: string;
}
export interface ProductImage {
  imageUrl: string;
  file?: File | null;
}

export interface ProductVariant {
  id: number;
  regularPrice: string;
  discountPrice: string;
  size?: string;
  stock?: number;
  color?: string;
  hex?: string;
  sku: string;
}

export interface ProductData {
  name: string;
  stock: number;
  stockType: string;
  shippingType: string;
  motif: string;
  category: string;
  productSummary: string;
  manufacturer: string;
  description: string;
  careGuide: string;
  slug: string;
  materials: ProductMaterial[];
  images: ProductImage[];
  variants: ProductVariant[];
  isFeatured: boolean;
  isActive: boolean;
}

export interface ProductOut extends ProductData {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: ProductData[];
  total: number;
  currentPage: number;
  categoryCounts: Record<string, number>;
  totalPages: number;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  onlyActive?: boolean;
  sort?: string;
}

export async function fetchProductData(
  filters: ProductFilters = {}
): Promise<ProductListResponse> {
  if (!API_URL) {
    console.error("API_URL is not defined");
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.get(`${API_URL}/api/product/get/all`, {
      params: filters,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || "Failed to fetch products");
    }
    throw new Error(error.message || "Failed to fetch products");
  }
}

export async function getProductBySlug(slug: string): Promise<ProductOut> {
  try {
    const res = await axios.get<ProductOut>(
      `${API_URL}/api/product/get/${slug}`
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || "Failed to fetch products");
    }
    throw new Error(error.message || "Failed to fetch products");
  }
}
