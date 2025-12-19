"use client";

import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetWishlist, useRemoveFromwishlist } from "@/hooks/useWishlist";
import type { WishlistOut } from "@/api/wishlist";

export default function Wishlist() {
  const {
    data: wishlist = [],
    isLoading,
    isError,
    error,
  } = useGetWishlist({
    limit: 24,
    page: 1,
  });
  const removeMutation = useRemoveFromwishlist();
  const items = wishlist.map((item: WishlistOut) => item.product);
  const handleRemove = (productId: number) => {
    removeMutation.mutate(productId);
  };
  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <p className="text-gray-500">Loading your wishlist...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="py-24 text-center">
        <p className="text-red-600">
          Error loading wishlist: {(error as Error)?.message}
        </p>
      </div>
    );
  }
  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.h1>Wishlist</motion.h1>
        {items.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-24"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-24 h-24 text-gray-200 dark:text-gray-700 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Explore products and add your favorites here!
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {items.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: 0.3 },
                }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ y: -8 }}
                className="group relative bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300"
              >
                <div className="relative h-72 bg-gray-50 dark:bg-zinc-900 overflow-hidden">
                  <Image
                    src={product.images[0]?.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(product.id);
                    }}
                    className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/50 transition"
                    aria-label="Remove from wishlist"
                    disabled={removeMutation.isPending}
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </motion.button>
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${product.variants[0].discountPrice}
                    </p>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={product.stock === 0}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(product.id);
                      }}
                      className="p-3 border border-gray-200 dark:border-zinc-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                      disabled={removeMutation.isPending}
                    >
                      <Heart className="w-6 h-6 text-red-500 fill-current" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
