"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    image: "/assets/pic1.webp",
    title: "Organic Comfort, Planet-First",
    subtitle:
      "Made with organic cotton and plant-based dyes — gentle on your skin and the planet.",
  },
  {
    image: "/assets/pic2.webp",
    title: "Breathable. Sustainable. Timeless.",
    subtitle:
      "Crafted from natural fibers for all-day comfort and conscious living.",
  },
];

export default function ImageScroller() {
  return (
    <Swiper
      loop={true}
      autoplay={{ delay: 8000, disableOnInteraction: false }}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      speed={1200}
      modules={[Autoplay, Pagination, EffectFade]}
      pagination={{ clickable: true, dynamicBullets: true }}
      className="h-screen w-full"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={slide.image}
              alt={slide.title}
              sizes="100vw"
              fill
              priority={index === 0}
              className="object-cover brightness-90 scale-105 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="max-w-5xl space-y-6 flex flex-col items-center justify-center"
              >
                <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white drop-shadow-2xl">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-2xl text-white/90 font-light max-w-3xl leading-relaxed drop-shadow-lg">
                  {slide.subtitle}
                </p>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-12 group relative overflow-hidden rounded-full bg-white px-10 py-5 text-lg font-semibold text-black shadow-2xl transition-all duration-300 hover:shadow-white/30"
                >
                  <span className="relative z-10">Shop the Collection</span>
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-rose-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  />
                  <span className="relative z-10 ml-3 group-hover:translate-x-2 transition-transform duration-300">
                    →
                  </span>
                </motion.button>
              </motion.div>
            </div>
            <style jsx global>{`
              .swiper-pagination-bullet {
                background: rgba(255, 255, 255, 0.4);
                opacity: 1;
                width: 12px;
                height: 12px;
                transition: all 0.4s ease;
              }
              .swiper-pagination-bullet-active {
                background: white;
                transform: scale(1.4);
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
              }
            `}</style>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
