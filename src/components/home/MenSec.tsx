"use client";

import { FaArrowRight, FaFire } from "react-icons/fa";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProduct";
import ProductItem from "../ProductItem";

export default function MenSection() {
  const { data: cloths = [], isLoading } = useProducts({
    category: "Men",
    onlyActive: true,
    limit: 10,
  });
  return (
    <div className="text-black flex mt-10 overflow-x-auto scrollbar-8 scrollbar scrollbar-thumb-red-500 scrollbar-track-gray-700">
      <div className="flex w-min mx-auto gap-3 lg:gap-4 px-2 lg:px-4">
        <div>
          <div className="border-2 border-[#ABABAB] w-[140px] h-40 lg:w-[170px] lg:h-[180px] flex flex-col text-center items-center mb-1 p-1 lg:p-2 rounded-2xl justify-center dark:bg-[#1D1C1C]">
            <h1 className="font-bold mb-2 lg:mb-3 dark:text-white transition-colors duration-300 text-[13px] lg:text-base">
              SHOW ALL MAN CLOTHES
            </h1>
            <motion.button
              className="flex items-center justify-center bg-[#D9D9D9] lg:w-[105px] lg:h-[50px] lg:text-[12px] text-[10px] rounded-2xl p-2 font-bold"
              whileHover={{ scale: 1.5, backgroundColor: "#E5E7EB" }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Now
              <FaArrowRight className="ml-1" />
            </motion.button>
          </div>
          <div className="border-2 w-[140px] h-40 lg:w-[170px] lg:h-[180px] flex flex-col text-center items-center p-2 rounded-2xl justify-center bg-[#C34D4D] border-[#ABABAB] dark:bg-[#541313] dark:text-white transition-colors duration-300">
            <div className="flex mb-1 lg:mb-2 text-center">
              <FaFire className="mr-1" />
              <h1 className="font-bold text-[13px] lg:text-base">
                {`NEW ARRIVALS`}
              </h1>
            </div>
            <p className="lg:text-[12px] text-[10px] mb-3">
              {`Check out the latest men's Collections!`}
            </p>
            <motion.button
              className="flex items-center justify-center bg-[#A52F2F] lg:w-[105px] lg:h-[50px] lg:text-[12px] text-[10px] rounded-2xl p-2 text-white font-bold"
              whileHover={{ scale: 1.5, backgroundColor: "#DC2626" }}
              whileTap={{ scale: 0.95 }}
              style={{ backgroundColor: "#A52F2F" }}
            >
              View New Arrivals <FaArrowRight className="ml-1" />
            </motion.button>
          </div>
        </div>
        <ProductItem cloths={cloths} />
      </div>
    </div>
  );
}
