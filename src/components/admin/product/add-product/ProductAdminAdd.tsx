"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { useAddProductData, useUpdateProduct } from "@/hooks/useProduct";
import { ProductData } from "@/api/product";
import ProductDescriptionContent from "./components/ProductDescriptionContent";

export default function ProductAdminAdd({
  initialProduct,
}: {
  initialProduct?: ProductData & { id: number };
}) {
  const addMutation = useAddProductData();
  const updateMutation = useUpdateProduct();
  const [formData, setFormData] = useState<ProductData>({
    name: initialProduct?.name || "",
    stock: initialProduct?.stock || 0,
    stockType: initialProduct?.stockType || "",
    shippingType: initialProduct?.shippingType || "",
    motif: initialProduct?.motif || "",
    category: initialProduct?.category || "",
    productSummary: initialProduct?.productSummary || "",
    manufacturer: initialProduct?.manufacturer || "",
    description: initialProduct?.description || "",
    careGuide: initialProduct?.careGuide || "",
    materials: initialProduct?.materials || [],
    variants: initialProduct?.variants || [],
    isFeatured: initialProduct?.isFeatured ?? false,
    isActive: initialProduct?.isActive ?? true,
  });
  const [productId, setProductId] = useState<number | null>(
    initialProduct?.id ?? null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (productId) {
        await updateMutation.mutateAsync({
          productId,
          data: formData,
        });
      } else {
        await addMutation.mutateAsync(formData);
        // Optional: reset form after creation
        // setFormData(createEmptyProduct());
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      // You can add a toast here if you want extra feedback
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for rich text editor (assuming it returns HTML string)
  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-8">
        {productId ? "Edit Product" : "Create New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* NAME */}
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* STOCK & STOCK TYPE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Stock *</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: Number(e.target.value) })
              }
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min={0}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stock Type</label>
            <input
              type="text"
              value={formData.stockType}
              onChange={(e) =>
                setFormData({ ...formData, stockType: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. units, kg, meters"
            />
          </div>
        </div>

        {/* CATEGORY & MOTIF */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Electronics, Clothing"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Motif</label>
            <input
              type="text"
              value={formData.motif}
              onChange={(e) =>
                setFormData({ ...formData, motif: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Floral, Geometric"
            />
          </div>
        </div>

        {/* DESCRIPTION (Rich Text) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Description
          </label>
          <ProductDescriptionContent
            value={formData.description}
            onChange={handleContentChange}
            blogId={productId ?? undefined} // If your component needs it
            placeholder="Start writing your product description..."
          />
        </div>

        {/* OTHER FIELDS (you can add more as needed) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Summary
          </label>
          <textarea
            value={formData.productSummary}
            onChange={(e) =>
              setFormData({ ...formData, productSummary: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Short summary of the product"
            rows={3}
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
              : productId
              ? "Update Product"
              : "Create Product"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
