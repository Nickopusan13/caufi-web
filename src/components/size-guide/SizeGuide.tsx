"use client";

import React, { useState } from "react";
import SizeClothes from "./SizeClothes";
import SizeBags from "./SizeBags";
import SizeShoes from "./SizeShoes";
import { motion, AnimatePresence, Variants } from "framer-motion";

export const contentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.98,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1], // premium cubic-bezier
    },
  },
  exit: {
    opacity: 0,
    y: -24,
    scale: 0.98,
    filter: "blur(6px)",
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

export default function SizeGuide() {
  const [activeTab, setActiveTab] = useState<"clothes" | "bags" | "shoes">(
    "clothes"
  );
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Size Guide</h1>
      <p className="mb-6 text-center">
        Find the perfect fit for your clothes, bags, and shoes. Select a
        category below.
      </p>
      <div className="flex justify-center mb-6 gap-2">
        {["clothes", "bags", "shoes"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab as "clothes" | "bags" | "shoes")}
              className="relative px-4 py-2 rounded transition-colors"
            >
              <span
                className={`relative z-10 ${
                  isActive
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {activeTab === "clothes" && <SizeClothes />}
          {activeTab === "bags" && <SizeBags />}
          {activeTab === "shoes" && <SizeShoes />}
        </motion.div>
      </AnimatePresence>
      <p className="mt-6 text-sm text-gray-500 text-center">
        Note: Sizes may vary by brand and style. Always measure yourself and
        compare to the specific product measurements.
      </p>
    </div>
  );
}
