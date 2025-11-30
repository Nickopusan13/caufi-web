"use client";

import { MotionConfig, motion } from "framer-motion";
import Image from "next/image";
import LoginRegisterChange from "./LoginRegisterChange";

export default function LoginSection() {
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
            <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/60 to-black/80" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 flex-1 flex items-center justify-center px-8 py-16 lg:py-0"
          >
            <div className="max-w-lg text-center lg:text-left">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-amiko text-8xl lg:text-9xl xl:text-[140px] font-bold tracking-tighter text-amber-50 drop-shadow-2xl"
              >
                CAUFI.
              </motion.h1>
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 space-y-4"
              >
                <h2 className="text-3xl lg:text-5xl font-light tracking-wide text-amber-100">
                  Timeless Style
                </h2>
                <h2 className="text-3xl lg:text-5xl font-light tracking-wide text-amber-100">
                  Modern Comfort
                </h2>
                <p className="mt-8 text-lg lg:text-xl text-amber-200/80 font-light leading-relaxed">
                  Discover meticulously crafted pieces that transcend trends.
                  <br />
                  <span className="text-amber-100">
                    {`This is more than fashion — it's a statement.`}
                  </span>
                </p>
              </motion.div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 1 }}
                className="mt-12 h-px bg-linear-to-r from-transparent via-amber-600 to-transparent w-32 mx-auto lg:mx-0"
              />
            </div>
          </motion.div>
          <LoginRegisterChange />
        </main>
      </MotionConfig>
    </>
  );
}
