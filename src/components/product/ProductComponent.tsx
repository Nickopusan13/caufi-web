"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaChevronDown,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { Star } from "lucide-react";

interface LikeButtonProps {
  size?: number;
}

export const LikeButton = ({ size = 28 }: LikeButtonProps) => {
  const [liked, setLiked] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setLiked(!liked)}
      className="p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
      aria-label={liked ? "Unlike" : "Like"}
    >
      {liked ? (
        <FaHeart size={size} className="text-red-500 drop-shadow-sm" />
      ) : (
        <FaRegHeart size={size} className="text-gray-600 dark:text-gray-400" />
      )}
    </motion.button>
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
  const safeRating = Math.max(0, Math.min(Number(rating) || 0, maxStars));
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {/* Full Stars */}
        {Array.from({ length: fullStars }, (_, i) => (
          <Star
            key={i}
            size={size}
            className="fill-yellow-400 text-yellow-400 drop-shadow-sm"
          />
        ))}

        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative">
            <FaRegStar
              size={size}
              className="text-gray-300 dark:text-gray-600"
            />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <FaStar size={size} className="fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}

        {/* Empty Stars */}
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
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
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

interface ColorDropDownProps {
  color: string[];
}

export const ColorDropDown = ({ color }: ColorDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(color[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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

  const formatColor = (c: string) => c.charAt(0).toUpperCase() + c.slice(1);

  return (
    <div className="space-y-2">
      <p className="text-sm opacity-70">Color</p>
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-5 py-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
        >
          <span className="font-medium">{formatColor(selectedColor)}</span>
          <FaChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 w-full mt-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
          >
            {color.map((c) => (
              <li
                key={c}
                onClick={() => {
                  setSelectedColor(c);
                  setIsOpen(false);
                }}
                className={`px-5 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer transition-all ${
                  selectedColor === c
                    ? "bg-purple-100 dark:bg-purple-900/50 font-bold"
                    : ""
                }`}
              >
                {formatColor(c)}
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
};

interface ProductSizeProps {
  size: string[];
}

export const ProductSize = ({ size }: ProductSizeProps) => {
  const [selectedSize, setSelectedSize] = useState(size[0]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm opacity-70">Size</p>
        <a
          href="#"
          className="text-xs underline underline-offset-2 hover:opacity-100 opacity-70 transition"
        >
          Size Guide
        </a>
      </div>
      <div className="flex flex-wrap gap-3">
        {size.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedSize(s)}
            className={`w-14 h-14 rounded-2xl font-medium transition-all ${
              selectedSize === s
                ? "bg-black text-white shadow-lg scale-105"
                : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="h-px bg-zinc-300 dark:bg-zinc-700" />
    </div>
  );
};
