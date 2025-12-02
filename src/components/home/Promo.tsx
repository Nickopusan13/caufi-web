"use client";

import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Image from "next/image";
import { promoSlides } from "./Item";

export default function Promo() {
  return (
    <section className="relative w-full py-10 px-4 overflow-hidden font-love">
      <div className="w-full">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-white/60 dark:bg-[#294031]/70 border border-white/30 shadow-2xl"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, -3, 0], y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-6 right-6 z-50"
          >
            <div className="relative">
              <div className="relative bg-linear-to-br from-[#4A2774] to-purple-800 text-white font-black text-4xl px-12 py-8 rounded-full shadow-2xl border-4 border-white/40">
                -20%
              </div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 text-5xl"
              >
                ✨
              </motion.div>
            </div>
          </motion.div>
          <div className="grid lg:grid-cols-2 items-center gap-10 p-8 lg:p-12">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
              className="text-center lg:text-left space-y-6"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight ">
                MATCH <br />
                <span className="font-irish-grover text-transparent bg-clip-text bg-linear-to-r from-purple-700 via-pink-600 to-purple-800 underline decoration-wavy decoration-4 decoration-pink-500/70">
                  INDIE
                </span>{" "}
                AESTHETICS
              </h1>
              <p className="text-lg md:text-xl text-gray-800 dark:text-gray-100 font-medium max-w-lg mx-auto lg:mx-0">
                Curated chaos. Limited drops. Zero rules.
                <br />
                <span className="text-purple-600 dark:text-purple-400 font-bold text-2xl">
                  20% OFF — this week only
                </span>
              </p>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center gap-4 bg-linear-to-r from-[#4A2774] to-purple-700 text-white font-bold text-lg px-12 py-6 rounded-full shadow-2xl overflow-hidden"
              >
                <span className="relative z-10">Shop Now</span>
                <FaArrowRight className="relative z-10 group-hover:translate-x-3 transition-transform duration-300" />
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.button>
            </motion.div>
            <motion.div className="relative h-[420px] lg:h-[580px] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              <Swiper
                loop={true}
                effect="fade"
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                className="h-full w-full"
              >
                {promoSlides.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative h-full w-full group">
                      <Image
                        src={slide.image}
                        alt="Indie drop"
                        fill
                        className="object-cover transition-all duration-1000 group-hover:scale-110"
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-8 left-8 text-white">
                        <p className="text-lg font-light tracking-wider">
                          DROP {index + 1} • LIMITED
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
