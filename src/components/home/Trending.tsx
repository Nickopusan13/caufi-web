"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const trendingImages = [
  "/assets/pic1.webp",
  "/assets/pic2.webp",
  "/assets/pic3.webp",
  "/assets/pic1.webp",
  "/assets/pic2.webp",
  "/assets/pic3.webp",
  "/assets/pic1.webp",
  "/assets/pic2.webp",
  "/assets/pic3.webp",
  "/assets/pic1.webp",
];

export default function Trending() {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <section className="w-full py-16 px-4 overflow-hidden bg-transparent">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-4xl md:text-5xl font-black tracking-tighter mb-12
                   bg-linear-to-r from-black via-purple-700 to-black dark:from-white dark:via-purple-400 dark:to-white
                   bg-clip-text text-transparent"
      >
        TRENDING NOW
      </motion.h2>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide select-none"
        style={{ scrollbarWidth: "none" }}
      >
        {trendingImages.map((src, i) => (
          <motion.div
            key={i}
            className="relative flex-none w-80 md:w-96 h-96 md:h-[520px] rounded-3xl overflow-hidden
                       shadow-2xl border border-white/20 backdrop-blur-sm
                       group cursor-grab active:cursor-grabbing snap-center"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ willChange: "transform" }}
          >
            <Image
              src={src}
              alt="Trending look"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 85vw, 400px"
              priority={i < 3}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-purple-500/40 transition-all duration-500" />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="absolute top-6 left-6 bg-white/10 backdrop-blur-xl border border-white/30
                         text-white font-bold text-2xl px-5 py-2 rounded-full shadow-2xl"
            >
              #{i + 1}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 
                         bg-white/20 backdrop-blur-xl border border-white/40
                         text-white font-medium px-6 py-3 rounded-full text-sm tracking-wider"
            >
              SHOP THIS LOOK
            </motion.div>
          </motion.div>
        ))}
      </div>
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-hide::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        .dark .scrollbar-hide::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
}
