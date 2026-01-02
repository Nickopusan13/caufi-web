"use client";

import { motion } from "framer-motion";
import { IconType } from "react-icons/lib";
import { cn } from "@/lib/utils";

interface InformationItemProps {
  icon: IconType;
  title?: string;
  description?: string | number | null;
  username?: string | null;
  href?: string;
  iconColor?: string;
  iconBg?: string;
}

export const InformationItem = ({
  icon: Icon,
  title,
  description,
  username,
  href,
  iconColor = "text-blue-600 dark:text-blue-400",
  iconBg = "bg-blue-100 dark:bg-blue-950/40",
}: InformationItemProps) => {
  const displayText = description ?? (username ? `@${username}` : "—");
  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group flex items-center gap-4 rounded-xl bg-white dark:bg-zinc-900",
        "p-4 transition-all duration-300",
        "border border-zinc-200/70 dark:border-zinc-800/70",
        "shadow-sm hover:shadow-lg dark:shadow-zinc-900/50",
        "backdrop-blur-sm",
        href &&
          "cursor-pointer hover:border-blue-300 dark:hover:border-blue-700"
      )}
      onClick={() => href && window.open(href, "_blank")}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          "shadow-inner shadow-black/5",
          iconBg,
          "transition-all duration-300 group-hover:scale-110"
        )}
      >
        <Icon className={cn("text-2xl", iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
        )}
        <p
          className={cn(
            "text-sm sm:text-lg font-semibold truncate",
            displayText === "—"
              ? "text-zinc-400 dark:text-zinc-600"
              : "text-zinc-900 dark:text-zinc-100"
          )}
        >
          {displayText}
        </p>
      </div>
    </motion.div>
  );
};
