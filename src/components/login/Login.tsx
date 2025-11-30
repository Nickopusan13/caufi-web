"use client";

import { FormSocial, FormInput } from "./FormInput";
import { MdMail, MdLock } from "react-icons/md";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useLogin, useForgotPasswordRequest } from "@/hooks/useLogin";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ToasterProvider from "../ToasterProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import clsx from "clsx";

export default function Login({ onToggle }: { onToggle: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [emailForgot, setEmailForgot] = useState("");
  const [password, setPassword] = useState<string>("");
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const mutationLogin = useLogin();
  const mutationForgotRequest = useForgotPasswordRequest();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    mutationLogin.mutate(
      {
        email: email.toLowerCase().trim(),
        password,
      },
      {
        onSuccess: (user) => {
          toast.success(`Welcome back, ${user.user.name.split(" ")[0]}!`);
          router.push("/dashboard");
        },
        onError: () => {
          toast.error("Invalid email or password");
        },
      }
    );
  };
  const handleForgotPasswordRequest = (e: React.FormEvent) => {
    e.preventDefault();
    mutationForgotRequest.mutate(
      { email: emailForgot.toLowerCase().trim() },
      {
        onSuccess: () => {
          setIsForgotPassword(false);
          setEmailForgot("");
        },
      }
    );
  };
  const isLoading = mutationLogin.isPending;
  return (
    <>
      <div className="flex rounded-3xl bg-linear-to-br from-slate-900 via-cyan-900 to-teal-900 relative overflow-hidden">
        <ToasterProvider />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-10"
            >
              <h1 className="text-white/80 text-sm tracking-widest font-light">
                WELCOME BACK
              </h1>
              <h2 className="text-4xl font-bold text-white mt-2">
                Login to Account
              </h2>
              <p className="text-white/60 mt-2 text-sm">
                Access your dashboard and continue where you left off
              </p>
            </motion.div>
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                <FormInput
                  labels="Email Address"
                  id="email"
                  type="email"
                  icon={<MdMail className="text-cyan-300" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-cyan-200/50 focus:border-cyan-400"
                />
                <FormInput
                  labels="Password"
                  id="password"
                  type="password"
                  icon={<MdLock className="text-cyan-300" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-cyan-200/50 focus:border-cyan-400"
                />
              </motion.div>
              <div className="text-right -mt-4">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-cyan-300 text-sm hover:text-cyan-100 underline underline-offset-4 transition"
                >
                  Forgot Password?
                </button>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-3"
              >
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.05 } : {}}
                  whileTap={!isLoading ? { scale: 0.95 } : {}}
                  className="w-full bg-linear-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-70 relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {isLoading ? "LOGGING IN..." : "LOGIN NOW"}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </motion.button>
              </motion.div>
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-white/50 text-sm">or continue with</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex justify-center"
              >
                <FormSocial />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-white/70 text-sm mt-8"
              >
                {`Don't have an account?`}{" "}
                <button
                  type="button"
                  onClick={onToggle}
                  className="font-bold text-cyan-300 hover:text-cyan-100 underline underline-offset-4 transition"
                >
                  Register here
                </button>
              </motion.p>
            </form>
          </div>
        </motion.div>
      </div>
      <Dialog open={isForgotPassword} onOpenChange={setIsForgotPassword}>
        <DialogContent className="bg-linear-to-br from-slate-900 via-cyan-900/90 to-teal-900/90 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white text-center mb-4">
              Reset Password
            </DialogTitle>
            <p className="text-white/70 text-center text-sm mb-8">
              Enter your email and we&apos;ll send you a link to reset your
              password
            </p>
          </DialogHeader>
          <form onSubmit={handleForgotPasswordRequest} className="space-y-6">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300 z-10">
                <MdMail size={22} />
              </div>
              <input
                type="email"
                value={emailForgot}
                onChange={(e) => setEmailForgot(e.target.value)}
                required
                disabled={mutationForgotRequest.isPending}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-cyan-200/50
                     focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20
                     transition-all duration-300 disabled:opacity-60"
              />
              <label
                className={clsx(
                  "absolute left-12 top-1/2 -translate-y-1/2 origin-left transition-all duration-300 pointer-events-none font-medium",
                  emailForgot || document.activeElement?.tagName === "INPUT"
                    ? "top-2 text-xs text-cyan-300 scale-90"
                    : "text-cyan-300/70"
                )}
              >
                Email Address
              </label>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                disabled={mutationForgotRequest.isPending}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutationForgotRequest.isPending}
                className="flex-1 bg-linear-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold py-3 rounded-xl shadow-lg transition disabled:opacity-60"
              >
                {mutationForgotRequest.isPending
                  ? "Sending..."
                  : "Send Reset Link"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
