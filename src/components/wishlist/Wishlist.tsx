"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGetWishlist } from "@/hooks/useWishlist";
import type { WishlistOut } from "@/api/wishlist";
import ProductItem from "../ProductItem";
import LoadingPage from "../LoadingPage";
import EmptyWishlist from "./EmptyWishlist";

export default function Wishlist() {
  const { data: wishlist = [], isLoading } = useGetWishlist({
    limit: 24,
    page: 1,
  });
  const items = wishlist.map((item: WishlistOut) => item.product);
  if (isLoading) {
    return <LoadingPage />;
  }
  return (
    <div className="max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
      >
        Your Wishlist
      </motion.h1>
      <AnimatePresence mode="wait">
        {items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {items.map((product, idx) => (
              <ProductItem key={idx} cloths={[product]} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
