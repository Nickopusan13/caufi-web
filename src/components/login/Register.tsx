"use client";

import { FormSocial, FormInput } from "./FormInput";
import { MdMail, MdPerson, MdLock } from "react-icons/md";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRegister } from "@/hooks/useLogin";
import toast from "react-hot-toast";
import ToasterProvider from "../ToasterProvider";

export default function Register({ onToggle }: { onToggle: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const mutation = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    mutation.mutate({
      name,
      email: email.toLowerCase().trim(),
      password,
    });
  };
  const isLoading = mutation.isPending;
  return (
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
              {`LET'S GET STARTED`}
            </h1>
            <h2 className="text-4xl font-bold text-white mt-2">
              Create Account
            </h2>
            <p className="text-white/60 mt-2 text-sm">
              Join us today and unlock amazing features
            </p>
          </motion.div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FormInput
                labels="Full Name"
                id="full-name"
                type="text"
                icon={<MdPerson className="text-cyan-300" />}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
                className="bg-white/10 border-white/20 text-white placeholder-cyan-200/50 focus:border-cyan-400"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
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
              <FormInput
                labels="Confirm Password"
                id="confirm-password"
                type="password"
                icon={<MdLock className="text-cyan-300" />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
                className="bg-white/10 border-white/20 text-white placeholder-cyan-200/50 focus:border-cyan-400"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
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
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="pt-6"
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.05 } : {}}
                whileTap={!isLoading ? { scale: 0.95 } : {}}
                className="w-full bg-linear-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-70 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isLoading ? "CREATING ACCOUNT..." : "GET STARTED"}
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
              transition={{ delay: 0.8 }}
              className="flex justify-center"
            >
              <FormSocial />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center text-white/70 text-sm mt-8"
            >
              Already have an account?{" "}
              <button
                type="button"
                onClick={onToggle}
                className="font-bold text-cyan-300 hover:text-cyan-100 underline underline-offset-4 transition"
              >
                Login here
              </button>
            </motion.p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
