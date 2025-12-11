"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  Loader2,
  AlertCircle,
  LogIn,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import ToasterProvider from "@/components/ToasterProvider";
import { useVerifyEmail } from "@/hooks/useLogin";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { data, isLoading, isError, error } = useVerifyEmail(token);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-cyan-900 to-purple-900 p-4 overflow-hidden">
        <ToasterProvider />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -150, 0], y: [0, 100, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white z-10"
        >
          <Loader2 className="w-16 h-16 mx-auto animate-spin text-cyan-400 mb-6" />
          <h2 className="text-3xl font-bold">Verifying your email...</h2>
          <p className="text-white/70 mt-4">Please wait a moment</p>
        </motion.div>
      </div>
    );
  }
  if (isError || !token) {
    const message = error?.message || "Invalid or expired verification link";
    toast.error(message);
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-pink-900">
        <ToasterProvider />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -150, 0], y: [0, 100, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white max-w-md p-8 z-10"
        >
          <AlertCircle className="w-24 h-24 mx-auto text-red-400 mb-6" />
          <h1 className="text-5xl font-bold mb-4">Invalid Link</h1>
          <p className="text-xl text-white/70 mb-8">{message}</p>
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            className="inline-block px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white font-medium hover:bg-white/20 transition-all"
          >
            Go back to home
          </motion.a>
        </motion.div>
      </div>
    );
  }
  const isAlreadyVerified = data?.message?.includes("already verified");
  const email = searchParams.get("email") || "your email"; // fallback if backend doesn't return it
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-cyan-900 to-purple-900 p-4 overflow-hidden">
      <ToasterProvider />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -150, 0], y: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <CheckCircle className="w-24 h-24 mx-auto text-cyan-400" />
          </motion.div>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-white mb-4"
          >
            {isAlreadyVerified ? "Already Verified!" : "Email Verified!"}
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 text-lg mb-8"
          >
            {isAlreadyVerified ? (
              "Your email is already verified. You're all set!"
            ) : (
              <>
                Thank you! Your email{" "}
                <span className="text-cyan-300 font-medium">{email}</span> has
                been successfully verified.
              </>
            )}
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/login">
              <button className="inline-flex items-center gap-3 px-10 py-5 bg-linear-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-xl transition-all duration-300 group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-3">
                  <LogIn className="w-6 h-6" />
                  Go to Login
                  <ArrowRight className="w-6 h-6" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-white/60 text-sm"
          >
            Need help?{" "}
            <a href="/support" className="text-cyan-300 hover:underline">
              Contact support
            </a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
