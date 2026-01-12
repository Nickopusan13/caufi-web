"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { useState, useEffect } from "react";
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

function ImageScroller() {
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
                <h1 className="text-3xl lg:text-6xl font-bold tracking-tighter text-white drop-shadow-2xl">
                  {slide.title}
                </h1>
                <p className="text-lg lg:text-2xl text-white/90 font-light max-w-3xl leading-relaxed drop-shadow-lg">
                  {slide.subtitle}
                </p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    ease: "easeIn",
                    stiffness: 300,
                    type: "spring",
                  }}
                  className="mt-12 group relative overflow-hidden rounded-full bg-white py-3 px-7 lg:px-10 lg:py-5 text-lg font-semibold text-black shadow-2xl"
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
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default function ImageScrollerWrapper() {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-screen w-full bg-black" />;

  return <ImageScroller />;
}
