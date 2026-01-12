"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaRegStar, FaStar } from "react-icons/fa";
import { Star as LucideStar } from "lucide-react";
import { useAddToWishlist, useRemoveFromwishlist } from "@/hooks/useWishlist";

interface LikeButtonProps {
  productId: number;
  size?: number;
  initialLiked?: boolean;
}

export const LikeButton = ({
  productId,
  size = 28,
  initialLiked = false,
}: LikeButtonProps) => {
  const addMutation = useAddToWishlist();
  const deleteMutation = useRemoveFromwishlist();
  const [liked, setLiked] = useState(initialLiked);
  const handleClick = () => {
    setLiked(!liked);
    if (!liked) {
      addMutation.mutate({ productId });
    } else {
      deleteMutation.mutate(productId);
    }
  };
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        aria-label={liked ? "Unlike" : "Like"}
      >
        <motion.div
          initial={false}
          animate={{ scale: liked ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          {liked ? (
            <FaHeart size={size} className="text-red-500 drop-shadow-md" />
          ) : (
            <FaRegHeart
              size={size}
              className="text-gray-600 dark:text-gray-400"
            />
          )}
        </motion.div>
      </motion.button>
    </>
  );
};

interface StarRatingProps {
  rating?: number;
  reviewCount?: number;
  size?: number;
  maxStars?: number;
}

export const StarRating = ({
  rating = 0,
  reviewCount,
  size = 18,
  maxStars = 5,
}: StarRatingProps) => {
  const safeRating = Math.max(0, Math.min(rating || 0, maxStars));
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }, (_, i) => (
          <LucideStar
            key={`full-${i}`}
            size={size}
            className="fill-yellow-400 text-yellow-400 drop-shadow-sm"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <FaRegStar
              size={size}
              className="text-gray-300 dark:text-gray-600"
            />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <FaStar size={size} className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        )}
        {Array.from(
          { length: maxStars - fullStars - (hasHalfStar ? 1 : 0) },
          (_, i) => (
            <FaRegStar
              key={`empty-${i}`}
              size={size}
              className="text-gray-300 dark:text-gray-600"
            />
          )
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="font-bold text-zinc-800 dark:text-zinc-200">
          {safeRating.toFixed(1)}
        </span>
        {reviewCount !== undefined && (
          <span className="text-zinc-500">
            ({reviewCount.toLocaleString("id-ID")})
          </span>
        )}
      </div>
    </div>
  );
};

// Updated Color Interface
interface ColorOption {
  name: string;
  hex?: string;
}

interface ColorDropDownProps {
  colors: ColorOption[];
  selectedColor: string | null;
  onSelectColor: (color: string) => void;
}

export const ColorDropDown = ({
  colors,
  selectedColor,
  onSelectColor,
}: ColorDropDownProps) => {
  const [, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayColor = selectedColor
    ? colors.find((c) => c.name.toLowerCase() === selectedColor.toLowerCase())
    : colors[0];

  const formatColor = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        Color:{" "}
        <span className="font-bold text-zinc-900 dark:text-white">
          {formatColor(displayColor?.name || "Select")}
        </span>
      </p>

      <div className="flex flex-wrap gap-4">
        {colors.map((color) => {
          const isSelected =
            selectedColor?.toLowerCase() === color.name.toLowerCase();
          return (
            <motion.button
              key={color.name}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectColor(color.name)}
              className={`
                relative w-14 h-14 rounded-2xl border-4 shadow-lg transition-all
                ${
                  isSelected
                    ? "dark:border-white scale-110 ring-4 ring-purple-400/30"
                    : "dark:border-zinc-600 hover:border-gray-400"
                }
              `}
              style={{ backgroundColor: color.hex || "#e5e7eb" }}
              aria-label={`Select ${color.name}`}
            />
          );
        })}
      </div>
    </div>
  );
};

interface ProductSizeProps {
  sizes: string[];
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
  disabledSizes?: string[];
}

export const ProductSize = ({
  sizes,
  selectedSize,
  onSelectSize,
  disabledSizes = [],
}: ProductSizeProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Size:{" "}
          <span className="font-bold text-zinc-900 dark:text-white">
            {selectedSize || "Select"}
          </span>
        </p>
        <a
          href="#size-guide"
          className="text-xs underline underline-offset-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition"
        >
          Size Guide
        </a>
      </div>

      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          const isDisabled = disabledSizes.includes(size);

          return (
            <motion.button
              key={size}
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              onClick={() => !isDisabled && onSelectSize(size)}
              disabled={isDisabled}
              className={`
                w-16 h-16 rounded-2xl font-bold text-lg transition-all shadow-md
                ${
                  isSelected
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-2xl scale-105"
                    : isDisabled
                    ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 line-through cursor-not-allowed opacity-60"
                    : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                }
              `}
            >
              {size}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
