"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingPage() {
  const progress = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const animation = animate(progress, 100, {
      duration: 5,
      ease: "linear",
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => animation.stop();
  }, [progress]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-900">
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl font-bold text-blue-500"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {displayValue}%
        </motion.h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      </motion.div>
    </div>
  );
}
