"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingCart,
  Package,
  Truck,
  Shield,
  Plus,
  Minus,
} from "lucide-react";
import { useAddOrder } from "@/hooks/userOrder";
import { ProductData } from "@/api/product";
import {
  ProductSize,
  ColorDropDown,
  LikeButton,
  StarRating,
} from "./ProductComponent";
import ProductDescription from "./Description";

const MotionImage = motion(Image);

const paymentMethods = [
  { name: "BRI", src: "/icon/BRI.webp" },
  { name: "BCA", src: "/icon/BCA.webp" },
  { name: "DANA", src: "/icon/DANA.webp" },
  { name: "OVO", src: "/icon/OVO.webp" },
  { name: "ShopeePay", src: "/icon/SHOPEEPAY.webp" },
  { name: "Mandiri", src: "/icon/MANDIRI.webp" },
];

export default function ProductInfo({ product }: { product: ProductData }) {
  const orderMutation = useAddOrder();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const images = product.images.map((img) => img.imageUrl);
  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    const normalizedColor = selectedColor.trim().toLowerCase();
    const normalizedSize = selectedSize.trim().toLowerCase();
    return (
      product.variants.find((v) => {
        const variantColor = v.color?.trim().toLowerCase();
        const variantSize = v.size?.trim().toLowerCase();

        return (
          variantColor === normalizedColor && variantSize === normalizedSize
        );
      }) || null
    );
  }, [product.variants, selectedColor, selectedSize]);

  const fallbackVariant = useMemo(() => {
    if (!selectedColor) return null;
    return product.variants.find(
      (v) => v.color?.toLowerCase() === selectedColor.toLowerCase()
    );
  }, [product.variants, selectedColor]);
  const activeVariant =
    selectedVariant || fallbackVariant || product.variants[0];
  const variantId = activeVariant?.id;
  const stock = activeVariant?.stock || 0;
  const isOutOfStock = stock <= 0;

  const regularPrice = activeVariant
    ? parseFloat(activeVariant.regularPrice)
    : 0;
  const discountPrice = activeVariant?.discountPrice
    ? parseFloat(activeVariant.discountPrice)
    : null;
  const displayPrice =
    discountPrice && discountPrice < regularPrice
      ? discountPrice
      : regularPrice;
  const hasDiscount = !!discountPrice && discountPrice < regularPrice;
  const savedAmount = hasDiscount ? regularPrice - discountPrice : 0;

  const availableColors = useMemo(() => {
    return Array.from(
      new Map(
        product.variants
          .filter((v) => v.color && v.stock && v.stock > 0)
          .map((v) => [v.color!.toLowerCase(), { name: v.color!, hex: v.hex }])
      ).values()
    );
  }, [product.variants]);

  const availableSizes = useMemo(() => {
    return Array.from(
      new Set(
        product.variants
          .filter((v) => v.stock && v.stock > 0)
          .map((v) => v.size)
          .filter((size): size is string => !!size && size.trim() !== "")
      )
    ).sort();
  }, [product.variants]);

  const disabledSizes = useMemo(() => {
    if (!selectedColor) return [];
    const sizesInStock = product.variants
      .filter(
        (v) =>
          v.color?.toLowerCase() === selectedColor.toLowerCase() &&
          v.stock &&
          v.stock > 0
      )
      .map((v) => v.size)
      .filter((size): size is string => !!size);

    return availableSizes.filter((size) => !sizesInStock.includes(size));
  }, [selectedColor, product.variants, availableSizes]);
  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0].name);
    }
  }, [availableColors, selectedSize, selectedColor]);
  useEffect(() => {
    if (!selectedColor) {
      setSelectedSize(null);
      return;
    }

    const validSizes = product.variants
      .filter(
        (v) =>
          v.color?.toLowerCase() === selectedColor.toLowerCase() &&
          v.size &&
          v.stock &&
          v.stock > 0
      )
      .map((v) => v.size!)
      .filter(Boolean);

    const uniqueSizes = Array.from(new Set(validSizes)).sort();
    if (
      uniqueSizes.length > 0 &&
      (!selectedSize || !uniqueSizes.includes(selectedSize))
    ) {
      setSelectedSize(uniqueSizes[0]);
    }
  }, [selectedColor, product.variants, selectedSize]);

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    if (newQty > stock) {
      alert(`Only ${stock} item${stock > 1 ? "s" : ""} left in stock!`);
      setQuantity(stock);
    } else {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (!variantId || isOutOfStock || !selectedVariant) {
      alert("Please select a valid color and size.");
      return;
    }
    orderMutation.mutate({ variantId, quantity });
  };
  const canAddToCart = !!variantId && !!selectedVariant && !isOutOfStock;
  return (
    <section className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Image Gallery */}
          <div className="order-2 lg:order-1">
            <div className="flex flex-col-reverse lg:flex-row gap-6">
              <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible scrollbar-hide">
                {images.map((image, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all duration-300 ${
                      selectedImageIndex === i
                        ? "border-black dark:border-white shadow-2xl"
                        : "border-transparent hover:border-gray-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <Image src={image} alt="" fill className="object-cover" />
                  </motion.button>
                ))}
              </div>
              <motion.div
                layout
                className="relative aspect-square lg:aspect-auto lg:h-[680px] w-full rounded-3xl overflow-hidden shadow-2xl"
              >
                <AnimatePresence mode="wait">
                  <MotionImage
                    key={selectedImageIndex}
                    src={images[selectedImageIndex]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-6 right-6 z-10"
                >
                  <LikeButton size={40} />
                </motion.div>
              </motion.div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 space-y-8"
          >
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                {product.name}
              </h1>
              <div className="mt-4">
                <StarRating
                  rating={4.8}
                  reviewCount={127}
                  size={28}
                  maxStars={5}
                />
              </div>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg text-sm font-mono">
              <p>
                Selected Color: <strong>{selectedColor}</strong>
              </p>
              <p>
                Selected Size: <strong>{selectedSize}</strong>
              </p>
              <p>
                Found Variant ID:{" "}
                <strong>{selectedVariant?.id || "NOT FOUND"}</strong>
              </p>
              <p>
                Stock: {stock} | Out of stock: {isOutOfStock ? "YES" : "NO"}
              </p>
              <p>Can add: {canAddToCart ? "YES" : "NO"}</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <span className="text-4xl font-bold text-black dark:text-white">
                  ${displayPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-3xl text-gray-400 line-through">
                      ${regularPrice.toFixed(2)}
                    </span>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-4 py-2 bg-red-500 text-white font-bold rounded-full text-sm"
                    >
                      SAVE ${savedAmount.toFixed(2)}
                    </motion.span>
                  </>
                )}
              </div>
              {isOutOfStock ? (
                <p className="text-red-600 font-bold text-xl">Out of Stock</p>
              ) : stock <= 5 ? (
                <p className="text-orange-600 font-medium">
                  Only {stock} left — Order soon!
                </p>
              ) : null}
            </div>
            <div className="space-y-8 pt-6">
              <ColorDropDown
                colors={availableColors}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />
              <ProductSize
                sizes={availableSizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                disabledSizes={disabledSizes}
              />
              <div className="flex items-center gap-6">
                <span className="text-lg font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 dark:border-zinc-700 rounded-xl">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-4 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-50"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-16 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= stock}
                    className="p-4 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-8">
              <motion.button
                whileHover={{ scale: canAddToCart ? 1.02 : 1 }}
                whileTap={{ scale: canAddToCart ? 0.98 : 1 }}
                onClick={handleAddToCart}
                disabled={!canAddToCart || orderMutation.isPending}
                className="h-16 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={26} />
                {orderMutation.isPending ? "Adding..." : "Add to Cart"}
              </motion.button>
              <motion.button
                whileHover={{ scale: canAddToCart ? 1.02 : 1 }}
                whileTap={{ scale: canAddToCart ? 0.98 : 1 }}
                disabled={!canAddToCart || orderMutation.isPending}
                className="h-16 bg-linear-to-r from-red-600 to-pink-600 text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={26} />
                Buy Now
              </motion.button>
            </div>
            <div className="grid grid-cols-3 gap-6 py-10 border-t border-gray-200 dark:border-zinc-800">
              {[
                { icon: Truck, text: "Free Shipping" },
                { icon: Package, text: "Easy Returns" },
                { icon: Shield, text: "2-Year Warranty" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <item.icon className="w-10 h-10 mb-2 text-purple-600" />
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
            <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold mb-6 text-center">
                Secure Payment
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.name}
                    whileHover={{ y: -6, scale: 1.1 }}
                    className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-lg"
                  >
                    <Image
                      src={method.src}
                      alt={method.name}
                      width={100}
                      height={60}
                      className="object-contain w-full h-auto"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        <div className="mt-20 lg:mt-32 px-4">
          <ProductDescription
            product={product}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
          />
        </div>
      </div>
    </section>
  );
}
