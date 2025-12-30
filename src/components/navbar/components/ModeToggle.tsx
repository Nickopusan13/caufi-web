"use client";

import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  if (!resolvedTheme) return null;
  const isDark = resolvedTheme === "dark";
  return (
    <motion.button
      className="rounded-full p-3 flex items-center justify-center transition-colors duration-500
        bg-linear-to-tr from-yellow-400 via-orange-300 to-yellow-200
        dark:from-gray-700 dark:via-gray-800 dark:to-gray-900
        shadow-lg hover:shadow-xl"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? (
          <FaMoon className="text-3xl sm:text-4xl text-yellow-100" />
        ) : (
          <FaSun className="text-3xl sm:text-4xl text-orange-600" />
        )}
      </motion.div>
    </motion.button>
  );
}
