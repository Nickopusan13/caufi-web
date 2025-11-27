"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ShoppingBag, Zap } from "lucide-react";
import type { ProductData } from "@/api/product";

interface ProductItemProps {
  cloths: ProductData[];
}

const MotionLink = motion.create(Link);

export default function ProductItem({ cloths }: ProductItemProps) {
  return (
    <>
      {cloths.map((product, idx) => {
        const hasDiscount = product.discountPrice < product.regularPrice;
        const discountPercent = hasDiscount
          ? Math.round(
              ((product.regularPrice - product.discountPrice) /
                product.regularPrice) *
                100
            )
          : 0;

        const primaryImage = product.images[0]?.imageUrl;
        const hoverImage = product.images[1]?.imageUrl || primaryImage;

        return (
          <MotionLink
            href={`/product/${product.slug}`}
            key={product.sku || idx}
            className="group relative flex-none w-64 lg:w-72 snap-center"
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Product Card */}
            <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 group-hover:shadow-2xl group-hover:ring-black/10">
              {/* Sale Badge */}
              {hasDiscount && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-red-500 text-white font-bold px-3 py-1 rounded-full shadow-lg">
                    -{discountPercent}%
                  </Badge>
                </div>
              )}

              {/* Quick Add Button (appears on hover) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
              >
                <Button
                  size="lg"
                  className="rounded-full shadow-2xl font-semibold bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black"
                  onClick={(e) => {
                    e.preventDefault();
                    // Add to cart logic
                    console.log("Added to cart:", product.name);
                  }}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Quick Add
                </Button>
              </motion.div>

              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <AnimatePresence mode="wait">
                  {primaryImage ? (
                    <>
                      {/* Main Image */}
                      <motion.div
                        key="main"
                        initial={{ opacity: 1 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={primaryImage}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 280px, 320px"
                        />
                      </motion.div>

                      {/* Hover Image */}
                      {hoverImage && hoverImage !== primaryImage && (
                        <motion.div
                          key="hover"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={hoverImage}
                            alt={`${product.name} - hover`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 280px, 320px"
                          />
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-zinc-400">
                      No Image
                    </div>
                  )}
                </AnimatePresence>

                {/* New / Hot Badge */}
                {idx < 3 && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs font-bold">New</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-3">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2">
                  {hasDiscount ? (
                    <>
                      <span className="text-2xl font-bold text-black dark:text-white">
                        ${product.discountPrice}
                      </span>
                      <span className="text-lg text-zinc-400 line-through">
                        ${product.regularPrice}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold">
                      ${product.regularPrice}
                    </span>
                  )}
                </div>

                {/* Colors */}
                {product.colors.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-zinc-500">Colors:</span>
                    <div className="flex gap-1.5">
                      {product.colors.slice(0, 4).map((color, i) => (
                        <HoverCard key={i}>
                          <HoverCardTrigger asChild>
                            <button
                              className="relative w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-md ring-2 ring-transparent hover:ring-zinc-400 transition-all"
                              style={{ backgroundColor: color.hex }}
                            />
                          </HoverCardTrigger>
                          <HoverCardContent className="text-xs font-medium">
                            {color.name || color.hex}
                          </HoverCardContent>
                        </HoverCard>
                      ))}
                      {product.colors.length > 4 && (
                        <span className="text-xs text-zinc-500 ml-1">
                          +{product.colors.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-xs text-zinc-500">Sizes:</span>
                    {product.sizes.slice(0, 5).map((size) => (
                      <Badge
                        key={size.size}
                        variant="secondary"
                        className="text-xs py-0.5 px-2"
                      >
                        {size.size}
                      </Badge>
                    ))}
                    {product.sizes.length > 5 && (
                      <span className="text-xs text-zinc-500">
                        +{product.sizes.length - 5}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </MotionLink>
        );
      })}
    </>
  );
}
