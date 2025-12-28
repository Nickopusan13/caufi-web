import { useQuery, useMutation } from "@tanstack/react-query";
import type { BlogOut, BlogCreate, BlogUpdate } from "@/api/blog";
import {
  addBlog,
  deleteBlog,
  getAllBlog,
  getOneBlog,
  updateBlog,
  addBlogImage,
  BlogImageOut,
} from "@/api/blog";
import toast from "react-hot-toast";

export function useGetAllBlog({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  return useQuery({
    queryKey: ["blog", page, limit],
    queryFn: () => getAllBlog(page, limit),
  });
}

export function useGetByBlogId(blogId: number, enabled: boolean) {
  return useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => getOneBlog(blogId),
    enabled,
  });
}

export function useAddBlog() {
  return useMutation<BlogOut, Error, BlogCreate>({
    mutationFn: addBlog,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Blog added!!");
    },
  });
}

export function useDeleteBlog() {
  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      toast.success("Item removed!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateBlog() {
  return useMutation<BlogOut, Error, { blogId: number; data: BlogUpdate }>({
    mutationFn: ({ blogId, data }) => updateBlog(data, blogId),
    onSuccess: () => {
      toast.success("Update Done!!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useAddImageBlog() {
  return useMutation<BlogImageOut[], Error, { blogId: number; file: File }>({
    mutationFn: ({ blogId, file }) => addBlogImage(blogId, file),
    onSuccess: () => {
      toast.success("Add Done!!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
