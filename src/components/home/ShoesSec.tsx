"use client";

import { FaArrowRight, FaFire } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProduct";
import ProductItem from "../ProductItem";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function ShoesSection() {
  const { data: cloths = [], isLoading } = useProducts({
    category: "Men",
    onlyActive: true,
    limit: 5,
  });
  const allMensProducts = cloths.slice(0, 6);
  const newArrivalsProducts =
    cloths.filter((p) => p.name).slice(0, 6) || cloths.slice(2, 8);
  return (
    <section className="mt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
            {`Shoes's Collection`}
          </h2>
          <motion.a
            href="/men"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-pink-600 hover:gap-4 transition-all duration-300"
            whileHover={{ x: 4 }}
          >
            View All <FaArrowRight className="text-sm" />
          </motion.a>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-track-transparent scroll-smooth snap-x snap-mandatory pb-6 -mx-4 px-4 pt-3">
          <div className="flex gap-6 flex-none">
            <div className="flex-none w-72 lg:w-80">
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                className="h-96 rounded-3xl overflow-hidden shadow-xl"
              >
                {allMensProducts.map((product, idx) => (
                  <SwiperSlide key={idx}>
                    <Link href={`/product/${product.slug}`}>
                      <div className="relative h-full group cursor-pointer">
                        <Image
                          src={product.images[0]?.imageUrl}
                          alt={product.name}
                          sizes="(max-width: 1023px) 288px, 320px"
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-8 left-0 right-0 text-center text-white px-4">
                          <h3 className="text-2xl font-bold mb-3">
                            {`All Shoes's Wear`}
                          </h3>
                          <motion.button
                            className="mx-auto flex items-center gap-3 bg-black/80 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider shadow-lg"
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Shop Now <FaArrowRight />
                          </motion.button>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="flex-none w-72 lg:w-80">
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3200, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                className="h-96 rounded-3xl overflow-hidden shadow-2xl"
              >
                {newArrivalsProducts.map((product, idx) => (
                  <SwiperSlide key={idx}>
                    <Link href={`/product/${product.slug}`}>
                      <div className="relative h-full group cursor-pointer">
                        <Image
                          src={product.images[0]?.imageUrl}
                          alt={product.name}
                          sizes="(max-width: 1023px) 288px, 320px"
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-yellow-700/80 via-yellow-700/40 to-transparent" />
                        <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                          <FaFire className="text-2xl text-orange-400 animate-pulse" />
                          <span className="text-sm font-bold text-red-600 tracking-wider">
                            HOT
                          </span>
                        </div>
                        <div className="absolute bottom-8 left-0 right-0 text-center text-white px-4">
                          <h3 className="text-3xl font-bold mb-2">
                            New Arrivals
                          </h3>
                          <p className="text-sm opacity-90 mb-6">
                            Fresh drops. Limited stock.
                          </p>
                          <motion.button
                            className="mx-auto flex items-center gap-3 bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider border border-white/30 shadow-xl"
                            whileHover={{
                              backgroundColor: "rgba(255,255,255,0.3)",
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Shop New <FaArrowRight />
                          </motion.button>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
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
