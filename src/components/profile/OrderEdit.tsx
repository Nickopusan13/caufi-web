"use client";

import { motion } from "framer-motion";
import { ORDER_FILTERS, type OrderFilterValue } from "@/lib/orderStatus";

interface FilterButtonProps {
  selectedFilter: OrderFilterValue;
  setSelectedFilter: (filter: OrderFilterValue) => void;
}

export const FilterButton = ({
  selectedFilter,
  setSelectedFilter,
}: FilterButtonProps) => {
  return (
    <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
      {ORDER_FILTERS.map(({ label, value }) => {
        const isActive = selectedFilter === value;
        return (
          <motion.button
            key={value}
            layout
            onClick={() => setSelectedFilter(value)}
            className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
              ${
                isActive
                  ? "text-white"
                  : "text-zinc-600 dark:text-zinc-400 bg-transparent"
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilterPill"
                className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-full -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {label}
          </motion.button>
        );
      })}
    </div>
  );
};
