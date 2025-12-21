import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

export interface BlogImageOut {
  id: number;
  imageUrl: number;
  position?: number;
}

export interface BlogCreate {
  title: string;
  description: string;
  author: string;
  category: string;
  content: string;
}

export interface BlogOut {
  id: number;
  images: BlogImageOut[];
  date: string;
}

export interface BlogUpdate {
  title?: string;
  description?: string;
  author?: string;
  category?: string;
  content?: string;
}

export async function addBlog(data: BlogCreate): Promise<BlogOut> {
  try {
    const res = await axios.post(`${API_URL}/api/blog/add`, data, {
      headers: { "Content-Type": "application/json" },
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

export async function updateBlog(
  data: BlogUpdate,
  blogId: number
): Promise<BlogOut> {
  try {
    const res = await axios.patch(
      `${API_URL}/api/blog/update/${blogId}`,
      data,
      {
        headers: { "Content-Type": "application/json" },
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

export async function getAllBlog(
  page: number = 1,
  limit: number = 12
): Promise<BlogOut> {
  try {
    const res = await axios.get(`${API_URL}/api/blog/all`, {
      params: { page, limit },
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

export async function getOneBlog(blogId: number): Promise<BlogOut> {
  try {
    const res = await axios.get(`${API_URL}/api/blog/get/${blogId}`, {
      withCredentials: false,
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

export async function deleteBlog(blogId: number): Promise<BlogOut> {
  try {
    const res = await axios.delete(`${API_URL}/api/blog/delete/${blogId}`, {
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

export async function addBlogImage(
  blogId: number,
  file: File
): Promise<BlogImageOut[]> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(
      `${API_URL}/api/blog/${blogId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
