"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Package, Heart, Truck, ShieldCheck, Info } from "lucide-react";
import type { ProductData } from "@/api/product";

const TAB_HEIGHT = "480px";

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

  const currentVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return product.variants[0] ?? null;

    return (
      product.variants.find(
        (v) =>
          v.color?.toLowerCase() === selectedColor.toLowerCase() &&
          v.size?.trim() === selectedSize.trim()
      ) ?? product.variants[0]
    );
  }, [product.variants, selectedColor, selectedSize]);

  const tabs = [
    { id: "details" as const, label: "Product Details" },
    { id: "care" as const, label: "Care Guide" },
    { id: "info" as const, label: "Product Info" },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4">
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative px-8 py-5 text-lg font-medium transition-all duration-200 hover:text-black dark:hover:text-white"
            aria-selected={activeTab === tab.id}
            role="tab"
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
                className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-purple-600 to-pink-600 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="relative" style={{ minHeight: TAB_HEIGHT }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 pt-10 pb-16 overflow-y-auto"
          >
            {activeTab === "details" && (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown>{product.description}</ReactMarkdown>
              </div>
            )}
            {activeTab === "care" && (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {product.careGuide ? (
                  <ReactMarkdown>{product.careGuide}</ReactMarkdown>
                ) : (
                  <p className="text-zinc-500 italic flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    No care guide provided for this product.
                  </p>
                )}
              </div>
            )}
            {activeTab === "info" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-7">
                  <InfoItem
                    icon={<Package className="w-5 h-5" />}
                    label="SKU"
                    value={currentVariant?.sku ?? "—"}
                  />
                  <InfoItem
                    icon={<Heart className="w-5 h-5" />}
                    label="Motif"
                    value={product.motif ?? "—"}
                  />
                  <InfoItem
                    icon={<Truck className="w-5 h-5" />}
                    label="Category"
                    value={product.category}
                  />
                  <InfoItem
                    icon={<ShieldCheck className="w-5 h-5" />}
                    label="Brand"
                    value={product.manufacturer}
                  />
                </div>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-500 mb-4 uppercase tracking-wider">
                      Materials
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {product.material && product.material.length > 0 ? (
                        product.material.map((mat, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm font-medium transition-transform hover:scale-105"
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
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium">Selected variant:</span>{" "}
                      {selectedColor} • {selectedSize || "—"}
                    </p>
                    {currentVariant?.stock !== undefined && (
                      <p className="mt-2 text-sm font-medium">
                        Stock:{" "}
                        <span
                          className={
                            currentVariant.stock > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {currentVariant.stock > 0
                            ? `${currentVariant.stock} in stock`
                            : "Out of stock"}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
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
    <div className="group flex items-center gap-4 rounded-lg p-2 -m-2 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
      <div className="text-purple-600 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="font-medium text-black dark:text-white">{value || "—"}</p>
      </div>
    </div>
  );
}
