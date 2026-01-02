"use client";

import { motion } from "framer-motion";
import { IoBagHandleOutline } from "react-icons/io5";

export default function EmptyShop() {
  return (
    <div className="flex flex-col items-center justify-center py-10 lg:py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-3 lg:mb-6"
      >
        <IoBagHandleOutline className="w-24 h-24 text-gray-400" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2"
      >
        No products found
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="text-gray-500 dark:text-gray-400"
      >
        Try adjusting your filters or explore other categories.
      </motion.p>
    </div>
  );
}
