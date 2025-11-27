"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SignRegBtn() {
  return (
    <div className="flex items-center gap-3">
      <Link href="/login">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="relative overflow-hidden border border-white/20 bg-white/10 backdrop-blur-md text-black dark:text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 shadow-lg"
          >
            <span className="relative z-10">Sign In</span>
          </Button>
        </motion.div>
      </Link>
      <Link href="/register">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="relative group bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium shadow-xl hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-300 border border-red-500/30 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Register
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
          </Button>
        </motion.div>
      </Link>
    </div>
  );
}
