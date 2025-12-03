"use client";

import { FaBagShopping } from "react-icons/fa6";
import { LuBaggageClaim } from "react-icons/lu";
import { motion } from "framer-motion";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 py-10 px-6 rounded-2xl shadow-xl dark:shadow-gray-800">
      <LuBaggageClaim className="text-gray-400 text-[100px] lg:text-[180px] dark:text-gray-500 animate-bounce" />
      <div className="text-center space-y-2">
        <h1 className="text-2xl lg:text-4xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100">
          Your Cart is{" "}
          <span className="text-red-600 dark:text-red-400">Empty</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-300 md:text-lg lg:text-lg">
          Looks like you haven’t added anything yet.
        </p>
      </div>
      <motion.a
        href="/"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 inline-flex items-center gap-3 px-6 py-3 bg-red-600 dark:bg-red-500 text-white dark:text-gray-900 font-semibold rounded-lg shadow-lg dark:shadow-red-900 
        hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-300"
      >
        <FaBagShopping size={20} />
        <span>Return to Shop</span>
      </motion.a>
    </div>
  );
}
