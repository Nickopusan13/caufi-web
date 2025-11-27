"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ProductData } from "@/api/product";
import Image from "next/image";
import Link from "next/link";

interface ProductSellProps {
  cloths: ProductData[];
}

const MotionImage = motion.create(Image);

export default function ProductItem({ cloths }: ProductSellProps) {
  return (
    <>
      {cloths.map((cloth, idx) => {
        return (
          <Link href="/" key={idx}>
            <div className="w-full">
              <AnimatePresence mode="wait">
                <div className="relative w-40 h-40">
                  {cloth.images && cloth.images.length > 0 ? (
                    <MotionImage
                      src={cloth.images[0].imageUrl}
                      alt={cloth.name}
                      fill
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                      No Image
                    </div>
                  )}
                </div>
              </AnimatePresence>
            </div>
          </Link>
        );
      })}
    </>
  );
}
