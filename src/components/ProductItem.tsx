"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Add this for redirection
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Heart, Zap } from "lucide-react";
import type { ProductOut } from "@/api/product";
import {
  useGetWishlist,
  useAddToWishlist,
  useRemoveFromwishlist,
} from "@/hooks/useWishlist";
import type { WishlistOut } from "@/api/wishlist";
import { useAuth } from "@/lib/useAuth";

interface ProductItemProps {
  cloths: ProductOut[];
}

const MotionLink = motion.create(Link);

export default function ProductItem({ cloths }: ProductItemProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: wishlist = [], isLoading: isWishlistLoading } = useGetWishlist(
    { limit: 100, page: 1 },
    { queryKey: ["userWishlist", 1, 100], enabled: isAuthenticated }
  );

  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromwishlist();
  const wishlistIds = isAuthenticated
    ? new Set(wishlist.map((item: WishlistOut) => item.product.id))
    : new Set();

  const handleToggleWishlist = (productId: number, isWishlisted: boolean) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isWishlisted) {
      removeMutation.mutate(productId);
    } else {
      addMutation.mutate({ productId });
    }
  };

  return (
    <>
      {cloths.map((product, idx) => {
        const variants = product.variants || [];
        const validVariants = variants.filter(
          (v) => parseFloat(v.regularPrice) > 0
        );
        const regularPrices = validVariants.map((v) =>
          parseFloat(v.regularPrice)
        );
        const discountPrices = validVariants
          .map((v) => (v.discountPrice ? parseFloat(v.discountPrice) : null))
          .filter((p) => p !== null && p > 0) as number[];
        const minRegular = Math.min(...regularPrices);
        const minDiscount =
          discountPrices.length > 0 ? Math.min(...discountPrices) : null;
        const regularPrice = minRegular;
        const discountPrice = minDiscount;
        const hasDiscount =
          discountPrice !== null && discountPrice < regularPrice;
        const discountPercent = hasDiscount
          ? Math.round(((regularPrice - discountPrice!) / regularPrice) * 100)
          : 0;
        const colors = Array.from(
          new Map(
            variants
              .filter((v) => v.color && v.hex)
              .map((v) => [
                v.color!.toLowerCase(),
                { color: v.color!, hex: v.hex! },
              ])
          ).values()
        );
        const sizes = Array.from(
          new Set(variants.map((v) => v.size).filter(Boolean))
        );
        const primaryImage = product.images[0]?.imageUrl;
        const isWishlisted = wishlistIds.has(product.id);
        return (
          <MotionLink
            href={`/product/${product.slug}`}
            key={idx}
            className="group relative flex-none w-64 lg:w-72"
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 group-hover:shadow-2xl group-hover:ring-black/10 max-h-96">
              {hasDiscount && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-red-500 text-white font-bold px-3 py-1 rounded-full shadow-lg">
                    -{discountPercent}%
                  </Badge>
                </div>
              )}
              <div className="relative aspect-3/4 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <AnimatePresence mode="wait">
                  {primaryImage ? (
                    <motion.div key="main" className="absolute inset-0">
                      <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 280px, 320px"
                      />
                    </motion.div>
                  ) : (
                    <div className="flex h-full items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-zinc-400">
                      No Image
                    </div>
                  )}
                </AnimatePresence>
                <div className="absolute top-4 right-2 z-10 flex flex-col gap-2 items-center">
                  {idx < 3 && (
                    <div className="flex items-center gap-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs font-bold">New</span>
                    </div>
                  )}
                  {!isWishlistLoading && (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleToggleWishlist(product.id, isWishlisted);
                          }}
                          className={`p-2.5 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full shadow-lg transition-colors flex items-center justify-center ${
                            !isAuthenticated
                              ? "cursor-not-allowed opacity-50"
                              : "hover:bg-red-100 dark:hover:bg-red-900/50"
                          }`}
                          aria-label={
                            isWishlisted
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          disabled={
                            !isAuthenticated ||
                            addMutation.isPending ||
                            removeMutation.isPending
                          }
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              isWishlisted
                                ? "text-red-500 fill-red-500"
                                : "text-red-500"
                            }`}
                          />
                        </motion.button>
                      </HoverCardTrigger>
                      {!isAuthenticated && (
                        <HoverCardContent className="text-xs font-medium">
                          Log in to add to wishlist
                        </HoverCardContent>
                      )}
                    </HoverCard>
                  )}
                </div>
              </div>
              <div className="flex flex-col flex-1 p-3 space-y-1">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-sm font-medium leading-tight line-clamp-1 text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {product.name}
                  </h3>
                  {product.productSummary && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {product.productSummary}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {hasDiscount ? (
                      <>
                        <span className="text-xl font-bold text-black dark:text-white">
                          ${discountPrice!.toFixed(2)}
                        </span>
                        <span className="text-sm text-zinc-400 line-through">
                          ${regularPrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold">
                        ${regularPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                {colors.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-zinc-500">Colors:</span>
                    <div className="flex gap-1.5">
                      {colors.slice(0, 4).map((color, i) => (
                        <HoverCard key={i}>
                          <HoverCardTrigger asChild>
                            <button
                              className="relative w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-md ring-2 ring-transparent hover:ring-zinc-400 transition-all"
                              style={{ backgroundColor: color.hex }}
                            />
                          </HoverCardTrigger>
                          <HoverCardContent className="text-xs font-medium max-w-20 text-center">
                            {color.color}
                          </HoverCardContent>
                        </HoverCard>
                      ))}
                      {colors.length > 4 && (
                        <span className="text-xs text-zinc-500 ml-1">
                          +{colors.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {sizes.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-xs text-zinc-500">Sizes:</span>
                    {sizes.slice(0, 5).map((size) => (
                      <Badge
                        key={size}
                        variant="secondary"
                        className="text-xs py-0.5 px-2"
                      >
                        {size}
                      </Badge>
                    ))}
                    {sizes.length > 5 && (
                      <span className="text-xs text-zinc-500">
                        +{sizes.length - 5}
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
