"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { useAddProductData, useUpdateProduct } from "@/hooks/useProduct";
import { ProductData } from "@/api/product";
import ProductDescriptionContent from "./components/ProductDescriptionContent";
import BasicInformation from "./components/BasicInformation";
import ProductInventory from "./components/inventory/ProductInventory";
import CareGuideContent from "./components/CareGuideContent";

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
        <BasicInformation
          formData={formData}
          handleChange={(key, value) =>
            setFormData({ ...formData, [key]: value })
          }
        />

        {/* STOCK & STOCK TYPE */}
        <ProductInventory
          formData={formData}
          handleChange={(key, value) =>
            setFormData({ ...formData, [key]: value })
          }
        />

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
        <div>
          <label className="block text-sm font-medium mb-2">Care Guide</label>
          <CareGuideContent
            value={formData.careGuide}
            onChange={handleContentChange}
            blogId={productId ?? undefined} // If your component needs it
            placeholder="Start writing your product description..."
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
