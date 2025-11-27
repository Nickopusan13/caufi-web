"use client";

import { FaArrowRight, FaFire } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProduct";
import ProductItem from "../ProductItem";

export default function MenSection() {
  const { data: cloths = [], isLoading } = useProducts({
    category: "Men",
    onlyActive: true,
    limit: 10,
  });

  return (
    <section className="mt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
            {`Men's Collection`}
          </h2>
          <motion.a
            href="/men"
            className="hidden sm:flex items-center gap-2 text-sm font-medium hover:gap-4 transition-all duration-300"
            whileHover={{ x: 4 }}
          >
            View All <FaArrowRight className="text-sm" />
          </motion.a>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-track-transparent scroll-smooth snap-x snap-mandatory pb-6 -mx-4 px-4">
          {/* Special Cards */}
          <div className="flex gap-6 flex-none">
            {/* Show All Card */}
            <motion.div
              className="group relative w-72 lg:w-80 h-96 bg-linear-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-950 rounded-3xl overflow-hidden shadow-xl border border-zinc-300 dark:border-zinc-800 backdrop-blur-xl"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full flex flex-col justify-end p-8 text-center">
                <h3 className="text-2xl font-bold mb-3 tracking-wide">
                  {`All Men's Wear`}
                </h3>
                <motion.button
                  className="mx-auto flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider shadow-lg"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shop Now <FaArrowRight />
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              className="group relative w-72 lg:w-80 h-96 bg-linear-to-br from-red-600 via-red-500 to-rose-600 rounded-3xl overflow-hidden shadow-2xl border border-red-400/20"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute top-6 left-6 flex items-center gap-2 text-white/90">
                <FaFire className="text-2xl animate-pulse" />
                <span className="text-sm font-bold tracking-wider">HOT</span>
              </div>
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative h-full flex flex-col justify-end p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">New Arrivals</h3>
                <p className="text-sm opacity-90 mb-6">
                  Fresh drops. Limited stock. Move fast.
                </p>
                <motion.button
                  className="mx-auto flex items-center gap-3 bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider border border-white/30 shadow-xl"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shop New <FaArrowRight />
                </motion.button>
              </div>
            </motion.div>
          </div>
          <div className="flex gap-6">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-64 lg:w-72 h-96 bg-gray-200 dark:bg-zinc-800 rounded-3xl animate-pulse snap-center flex-none"
                />
              ))
            ) : (
              <ProductItem cloths={cloths} />
            )}
          </div>
        </div>
        <div className="sm:hidden mt-6 text-center">
          <motion.a
            href="/men"
            className="inline-flex items-center gap-3 text-sm font-medium"
            whileHover={{ gap: 5 }}
          >
            See all products <FaArrowRight />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
