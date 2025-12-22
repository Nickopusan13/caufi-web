"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { BlogCreate } from "@/api/blog";
import { useAddBlog, useUpdateBlog } from "@/hooks/useBlog";
import { toast } from "react-hot-toast";
import BlogContent from "./BlogContent";

export default function AddBlog() {
  const addMutation = useAddBlog();
  const updateMutation = useUpdateBlog();
  const [formData, setFormData] = useState<BlogCreate>({
    title: "",
    description: "",
    author: "",
    category: "",
    content: "",
  });
  const [blogId, setBlogId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setIsSubmitting(true);
    try {
      if (blogId) {
        await updateMutation.mutateAsync({
          blogId: blogId,
          data: {
            title: formData.title,
            description: formData.description,
            author: formData.author,
            category: formData.category,
            content: formData.content,
          },
        });
        toast.success("Blog updated successfully!");
      } else {
        const createdBlog = await addMutation.mutateAsync(formData);
        setBlogId(createdBlog.id); // Assuming your API returns the created blog with id
        toast.success("Blog created successfully!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-8">Create New Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Short summary of your blog"
            rows={4}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Author</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Technology, Lifestyle"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <BlogContent
            value={formData.content}
            onChange={handleContentChange}
            blogId={blogId ?? undefined}
            placeholder="Start writing your blog..."
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              isSubmitting || addMutation.isPending || updateMutation.isPending
            }
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting
              ? "Saving..."
              : blogId
              ? "Update Blog"
              : "Create Blog"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
