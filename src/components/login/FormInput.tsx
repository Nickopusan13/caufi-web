// components/FormInput.tsx
"use client";

import { useState, type ReactNode, InputHTMLAttributes } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import { motion } from "framer-motion";
import clsx from "clsx";
import { userGoogleLogin } from "@/api/user";

type FormInputProps = {
  labels: string;
  icon: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export const FormInput = ({
  labels,
  icon,
  type = "text",
  value = "",
  onChange,
  disabled = false,
  required = false,
  id,
  name,
  className,
  ...rest
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const hasValue = !!value;
  return (
    <div className="relative group">
      <motion.label
        htmlFor={id}
        initial={false}
        animate={{
          top: hasValue ? "0" : "50%",
          y: hasValue ? "-120%" : "-50%",
          x: hasValue ? "-30%" : "-0%",
          fontSize: hasValue ? "12px" : "14px",
          color: hasValue ? "#67e8f9" : "#94a3b8",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={clsx(
          "absolute left-10 pointer-events-none font-medium tracking-wide",
          "text-cyan-300/80 group-focus-within:text-cyan-300"
        )}
      >
        {labels}
      </motion.label>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300/70 z-10 transition-colors group-focus-within:text-cyan-300">
        {icon}
      </div>
      <input
        id={id}
        name={name || id}
        type={isPassword && showPassword ? "text" : type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        autoComplete={isPassword ? "new-password" : "off"}
        className={clsx(
          "w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl",
          "px-10 py-4 text-white placeholder-cyan-200/40",
          "focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20",
          "transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...rest}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-300/70 hover:text-cyan-300 transition"
          tabIndex={-1}
        >
          {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
        </button>
      )}
    </div>
  );
};

export const FormSocial = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md">
      <motion.button
        type="button"
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={userGoogleLogin}
        className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex py-3 items-center justify-center gap-3 transition-all duration-300 hover:bg-white/20 hover:border-cyan-400/50"
      >
        <FcGoogle size={26} />
        <span className="text-white/90 text-sm font-medium">Google</span>
        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>
      <motion.button
        type="button"
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 py-3 flex items-center justify-center gap-3 transition-all duration-300 hover:bg-blue-500/10 hover:border-blue-400/50"
      >
        <FaFacebook size={26} color="#1877F2" />
        <span className="text-white/90 text-sm font-medium">Facebook</span>
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>
      <motion.button
        type="button"
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 py-3 flex items-center justify-center gap-3 transition-all duration-300 hover:bg-black/30 hover:border-white/40"
      >
        <FaApple size={28} className="text-white" />
        <span className="text-white/90 text-sm font-medium">Apple</span>
        <div className="absolute inset-0 bg-linear-to-r from-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>
    </div>
  );
};
