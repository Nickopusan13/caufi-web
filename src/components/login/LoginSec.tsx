"use client";

import { MotionConfig, motion } from "framer-motion";
import Image from "next/image";
import LoginRegisterChange from "./LoginRegisterChange";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function LoginSection() {
  const isLg = useMediaQuery("(min-width: 1024px)");
  return (
    <>
      <MotionConfig transition={{ duration: 0.8, ease: "easeOut" }}>
        <main className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/assets/login-bg.webp"
              alt="CAUFI Collection"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-br from-black/90 via-black/70 to-black/90" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative hidden z-10 flex-1 lg:flex items-center justify-center px-6 py-12 sm:py-16 lg:py-0 lg:px-12"
          >
            <div className="max-w-2xl lg:max-w-lg text-center lg:text-left">
              <motion.h1
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-amiko text-7xl sm:text-8xl lg:text-9xl xl:text-[140px] font-bold tracking-tighter text-amber-50 drop-shadow-2xl leading-none"
              >
                CAUFI.
              </motion.h1>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 sm:mt-8 space-y-3 sm:space-y-4"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light tracking-wide text-amber-100">
                  Timeless Style
                </h2>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light tracking-wide text-amber-100">
                  Modern Comfort
                </h2>
                <p className="mt-8 text-base sm:text-lg lg:text-xl text-amber-200/90 font-light leading-relaxed max-w-md mx-auto lg:mx-0">
                  Discover meticulously crafted pieces that transcend trends.
                  <br className="hidden sm:block" />
                  <span className="text-amber-100 font-medium">
                    {`This is more than fashion — it's a statement.`}
                  </span>
                </p>
              </motion.div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 1.2 }}
                className="mt-10 sm:mt-12 h-px bg-linear-to-r from-transparent via-amber-600 to-transparent w-32 mx-auto lg:mx-0 origin-left"
              />
            </div>
          </motion.div>
          {isLg ? (
            <LoginRegisterChange />
          ) : (
            <div className="relative z-20 w-full px-6 pb-10 lg:px-12 lg:pb-0 lg:w-auto">
              <div className="max-w-md mx-auto lg:max-w-none">
                <LoginRegisterChange />
              </div>
            </div>
          )}
        </main>
      </MotionConfig>
    </>
  );
}
