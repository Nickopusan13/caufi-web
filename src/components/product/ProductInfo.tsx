"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";

import {
  ProductSize,
  ColorDropDown,
  LikeButton,
  StarRating,
} from "./ProductComponent";
import { ProductInfoImages } from "./Item";

const MotionImage = motion(Image);

const paymentMethods = [
  { name: "BRI", src: "/icon/BRI.webp" },
  { name: "BCA", src: "/icon/BCA.webp" },
  { name: "DANA", src: "/icon/DANA.webp" },
  { name: "OVO", src: "/icon/OVO.webp" },
  { name: "ShopeePay", src: "/icon/SHOPEEPAY.webp" },
  { name: "Mandiri", src: "/icon/MANDIRI.webp" },
];

export default function ProductInfo() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const images = ProductInfoImages.images;
  console.log(ProductInfoImages);

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index
                    ? "border-purple-600 ring-4 ring-purple-600/20"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-purple-400"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${ProductInfoImages.title} - view ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative aspect-square lg:aspect-auto lg:h-[600px] w-full rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900">
            <MotionImage
              key={selectedImageIndex}
              src={images[selectedImageIndex]}
              alt={ProductInfoImages.title}
              fill
              className="object-cover"
              priority={selectedImageIndex === 0}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            <div className="absolute top-4 right-4 z-10">
              <LikeButton size={36} />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white">
              {ProductInfoImages.title}
            </h1>
            <div className="mt-3">
              <StarRating
                rating={ProductInfoImages.review.rating}
                reviewCount={ProductInfoImages.review.count}
                size={22}
                maxStars={2}
              />
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl lg:text-4xl font-bold text-purple-600">
              Rp {ProductInfoImages.price.toLocaleString("id-ID")}
            </span>
            {ProductInfoImages.discount > ProductInfoImages.price && (
              <span className="text-xl lg:text-2xl text-zinc-400 line-through">
                Rp {ProductInfoImages.discount.toLocaleString("id-ID")}
              </span>
            )}
          </div>

          {/* Variants */}
          <div className="space-y-6">
            <ColorDropDown color={ProductInfoImages.color} />
            <ProductSize size={ProductInfoImages.size} />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-14 bg-black text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
            >
              <ShoppingCart size={22} />
              Buy Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-14 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
            >
              <ShoppingCart size={22} />
              Add to Cart
            </motion.button>
          </div>

          {/* Free Shipping Banner */}
          <div className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
            <p className="text-center text-sm lg:text-base text-zinc-700 dark:text-zinc-300">
              Enjoy{" "}
              <a
                href="#"
                className="font-bold underline underline-offset-4 hover:text-purple-600"
              >
                FREE express shipping
              </a>{" "}
              &{" "}
              <a
                href="#"
                className="font-bold underline underline-offset-4 hover:text-purple-600"
              >
                FREE returns
              </a>{" "}
              on orders over <strong>Rp900.000</strong>
            </p>
          </div>

          {/* Payment Methods */}
          <div className="mt-10">
            <h3 className="text-center lg:text-left text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">
              Secure Payment Methods
            </h3>
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.name}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-md"
                >
                  <Image
                    src={method.src}
                    alt={method.name}
                    width={80}
                    height={50}
                    className="object-contain h-10"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
