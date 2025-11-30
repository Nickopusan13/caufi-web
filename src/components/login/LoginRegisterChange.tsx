"use client";

import { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import { AnimatePresence, motion } from "framer-motion";

export default function LoginRegisterChange() {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin((prev) => !prev);
  return (
    <div className="relative w-full max-w-2xl mx-auto flex items-center justify-center">
      <AnimatePresence mode="wait" initial={false}>
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ x: 50, opacity: 0, scale: 0.98 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -50, opacity: 0, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
              duration: 0.3,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Login onToggle={toggleForm} />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ x: 50, opacity: 0, scale: 0.98 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -50, opacity: 0, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
              duration: 0.3,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Register onToggle={toggleForm} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
