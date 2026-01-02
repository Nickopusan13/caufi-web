"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const MotionImage = motion.create(Image);
const MotionLink = motion.create(Link);

export default function Quotes() {
  return (
    <section className="py-20 lg:py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        <MotionLink
          href="#"
          initial={{ opacity: 0, x: -60, rotate: -10 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
          className="group"
        >
          <motion.div
            className="relative w-64 h-96 sm:w-80 sm:h-[480px] lg:w-96 lg:h-[580px] rounded-2xl overflow-hidden shadow-2xl"
            whileHover={{
              scale: 1.03,
              rotate: -3,
              transition: { duration: 0.5 },
            }}
          >
            <MotionImage
              src="/assets/model.webp"
              alt="Model"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 639px) 256px, (max-width: 1023px) 320px, 384px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10" />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-black px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider"
            >
              SS25 • LOOK 03
            </motion.div>
          </motion.div>
        </MotionLink>
        <motion.div
          className="max-w-2xl text-center lg:text-left"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.12, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="block text-9xl lg:text-[180px] font-serif leading-none select-none"
          >
            “
          </motion.span>
          <h1 className="relative mt-[-60px] lg:mt-[-100px] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="block"
            >
              {`Fashion isn't what you wear—`}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="block font-medium bg-linear-to-r from-black via-zinc-700 to-black dark:from-white dark:via-zinc-300 dark:to-white bg-clip-text text-transparent"
            >
              {`it's the confidence`}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="block mt-2"
            >
              you bring to life,
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="block font-light text-zinc-600 dark:text-zinc-400 italic"
            >
              the energy that makes heads turn.
            </motion.span>
          </h1>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="lg:mt-16 mt-8 flex flex-col sm:flex-row items-center lg:items-start md:gap-8 gap-4 text-sm font-medium tracking-widest"
          >
            <div>CAUFI.</div>
            <div className="hidden sm:block w-full h-px bg-zinc-400 dark:bg-zinc-600" />
            <div className="text-zinc-500 dark:text-zinc-400">DEVELOPER</div>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.6 }}
            className="mt-8 h-px bg-linear-to-r from-transparent via-zinc-400 to-transparent origin-left"
          />
        </motion.div>
      </div>
    </section>
  );
}
