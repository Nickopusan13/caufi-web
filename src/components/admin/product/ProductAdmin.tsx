"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2 } from "lucide-react";
import ToasterProvider from "@/components/ToasterProvider";
import { TanStackTable } from "../TanStackTable";
import CardHeaderAdmin from "../CardHeaderAdmin";
import { useProducts, useDeleteProductData } from "@/hooks/useProduct";
import { getColumns } from "./ColumnItem";

export default function ProductAdmin() {
  const { data, isLoading, error } = useProducts();
  const deleteMutation = useDeleteProductData();
  const products = data?.products ?? [];
  const handleDelete = (productId: number) => {
    deleteMutation.mutate(productId);
  };
  const handleEdit = (product: unknown) => {
    console.log("Edit product:", product);
  };
  const columns = getColumns(handleDelete, handleEdit);
  return (
    <div className="container mx-auto p-6 space-y-8">
      <ToasterProvider />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <CardHeaderAdmin
          headTitle="Products"
          href="/admin/product/add-product"
          hrefTitle="Add New Product"
        />
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
          >
            <p className="text-lg font-medium text-red-800">
              Failed to load products
            </p>
            <p className="text-sm text-red-600 mt-2">{error.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-b-2 border-primary flex items-center justify-center"
            >
              <Loader2 className="h-8 w-8 text-primary" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {!isLoading && !error && (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <TanStackTable
              title="Products"
              data={products}
              columns={columns}
              searchColumn="name"
              filters={[
                {
                  column: "category",
                  placeholder: "Category",
                  useFaceted: true,
                },
                {
                  column: "shippingType",
                  placeholder: "Shipping Type",
                  useFaceted: true,
                },
              ]}
              bulkActions={[
                { value: "archive", label: "Archive" },
                { value: "delete", label: "Delete" },
              ]}
              onBulkApply={(action, selectedRows) => {
                console.log(
                  `Bulk action: ${action} on ${selectedRows.length} products`
                );
              }}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
