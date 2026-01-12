"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingPage() {
  const progress = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const animation = animate(progress, 100, {
      duration: 5,
      ease: "easeInOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => animation.stop();
  }, [progress]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-linear-to-tr from-blue-500 via-purple-500 to-pink-500 blur-sm"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
          <div className="absolute inset-1 rounded-full bg-white dark:bg-black" />
          <motion.span
            key={displayValue}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 text-3xl font-bold text-gray-900 dark:text-white"
          >
            {displayValue}%
          </motion.span>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm tracking-wide text-gray-500 dark:text-gray-400"
        >
          Please wait while we prepare everything
          <LoadingDots />
        </motion.p>
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="inline-flex ml-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="mx-px"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: [0, -3, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}
