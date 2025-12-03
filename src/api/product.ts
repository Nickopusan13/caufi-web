import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

export interface ProductMaterial {
  material: string;
}

export interface ProductSize {
  size: string;
}

export interface ProductImage {
  imageUrl: string;
  imageSize: number;
  imageName: string;
  file?: File | null;
}

export interface ProductColor {
  color: string;
  hex: string;
}

export interface ProductData {
  name: string;
  stock: number;
  stockType: string;
  shippingType: string;
  motif: string;
  regularPrice: string;
  discountPrice: string;
  category: string;
  productSummary: string;
  manufacturer: string;
  description: string;
  careGuide: string;
  slug: string;
  sku: string;
  material: ProductMaterial[];
  sizes: ProductSize[];
  images: ProductImage[];
  colors: ProductColor[];
  isFeatured: boolean;
  isActive: boolean;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  onlyActive?: boolean;
}

export async function fetchProductData(
  filters: ProductFilters = {}
): Promise<ProductData[]> {
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
