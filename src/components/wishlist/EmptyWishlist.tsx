"use client";

import { motion, spring } from "framer-motion";
import { FaHeart } from "react-icons/fa6";

export default function EmptyWishlist() {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-24 bg-gray-200 dark:bg-zinc-800 rounded-2xl shadow-sm"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <FaHeart className="w-24 h-24 text-pink-500 stroke-1" />
      </motion.div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">
        Your wishlist is empty
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        Discover amazing products and add your favorites to build your perfect
        wishlist.
      </p>
      <motion.a
        href="/shop"
        whileHover={{ scale: 1.05, y: -8 }}
        whileTap={{ scale: 0.95, y: 0 }}
        transition={{
          type: spring,
          ease: "easeIn",
          stiffness: 300,
          damping: 5,
        }}
        className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-full shadow-md hover:bg-blue-700 transition"
      >
        Start Shopping
      </motion.a>
    </motion.div>
  );
}
