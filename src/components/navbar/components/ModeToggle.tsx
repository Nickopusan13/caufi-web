"use client";

import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div>
      <motion.button
        className="rounded-full p-3 flex items-center justify-center transition-colors duration-500 bg-linear-to-tr from-yellow-400 via-orange-300 to-yellow-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        whileTap={{ scale: 0.8 }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.div
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -100, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 100, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <FaMoon className="text-4xl text-yellow-100 drop-shadow-[0_0_15px_rgba(254,243,199,0.8)]" />
          ) : (
            <FaSun className="text-4xl text-orange-600 drop-shadow-[0_0_30px_rgba(251,146,60,1)] filter brightness-125" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}
