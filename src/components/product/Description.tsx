// components/ProductDescription.tsx
"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Package, Heart, Truck, ShieldCheck } from "lucide-react";
import type { ProductData } from "@/api/product";
import { useState } from "react";

export default function ProductDescription({
  product,
  selectedColor,
  selectedSize,
}: {
  product: ProductData;
  selectedColor: string | null;
  selectedSize: string | null;
}) {
  const [activeTab, setActiveTab] = useState<"details" | "care" | "info">(
    "details"
  );

  // Find the currently selected variant to show its SKU
  const currentVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return product.variants[0] || null;

    return (
      product.variants.find(
        (v) =>
          v.color?.toLowerCase() === selectedColor.toLowerCase() &&
          v.size?.trim() === selectedSize.trim()
      ) || product.variants[0] // fallback
    );
  }, [product.variants, selectedColor, selectedSize]);

  const tabs = [
    { id: "details", label: "Product Details" },
    { id: "care", label: "Care Guide" },
    { id: "info", label: "Product Info" },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative px-8 py-5 text-lg font-medium transition-colors"
          >
            <span
              className={
                activeTab === tab.id
                  ? "text-black dark:text-white"
                  : "text-zinc-500"
              }
            >
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-purple-600 to-pink-600 rounded-full"
              />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="pt-10 pb-16"
        >
          {activeTab === "details" && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          )}
          Care Guide
          {activeTab === "care" && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown>
                {product.careGuide || "_No care guide provided._"}
              </ReactMarkdown>
            </div>
          )}
          Product Info
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <InfoItem
                  icon={<Package className="w-5" />}
                  label="SKU"
                  value={currentVariant?.sku || "—"}
                />
                <InfoItem
                  icon={<Heart className="w-5" />}
                  label="Motif"
                  value={product.motif || "—"}
                />
                <InfoItem
                  icon={<Truck className="w-5" />}
                  label="Category"
                  value={product.category}
                />
                <InfoItem
                  icon={<ShieldCheck className="w-5" />}
                  label="Brand"
                  value={product.manufacturer}
                />
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 mb-3">
                    Materials
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {product.material && product.material.length > 0 ? (
                      product.material.map((mat, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm font-medium"
                        >
                          {mat.material}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-500 italic">
                        Not specified
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-zinc-500">
                  Selected: {selectedColor} • {selectedSize || "—"}
                  {currentVariant?.stock !== undefined && (
                    <span className="ml-2">
                      • Stock:{" "}
                      {currentVariant.stock > 0
                        ? currentVariant.stock
                        : "Out of stock"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-purple-600">{icon}</div>
      <div>
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
