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
  id?: number;
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
  materials: ProductMaterial[];
  variants: ProductVariant[];
  isFeatured: boolean;
  isActive: boolean;
}

export interface ProductDataUpdate {
  name?: string;
  stock?: number;
  stockType?: string;
  shippingType?: string;
  motif?: string;
  category?: string;
  productSummary?: string;
  manufacturer?: string;
  description?: string;
  careGuide?: string;
  materials?: ProductMaterial[];
  variants?: ProductVariant[];
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface ProductOut extends ProductData {
  id: number;
  images: ProductImage[];
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: ProductOut[];
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

export async function addProductData(data: ProductData): Promise<ProductOut> {
  try {
    const res = await axios.post(`${API_URL}/api/product/add`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message);
  }
}

export async function addProductImage(
  productId: number,
  file: File
): Promise<ProductImage[]> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(
      `${API_URL}/api/product/${productId}/images`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message);
  }
}

export async function deleteProductData(productId: number) {
  try {
    const res = await axios.delete(
      `${API_URL}/api/product/delete/${productId}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message);
  }
}

export async function deleteProductImage(imageId: number) {
  try {
    const res = await axios.delete(`${API_URL}/api/product/images/${imageId}`);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message);
  }
}

export async function updateProductData(
  data: ProductDataUpdate,
  productId: number
): Promise<ProductOut> {
  try {
    const res = await axios.patch(
      `${API_URL}/api/product/update/${productId}`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message);
  }
}
