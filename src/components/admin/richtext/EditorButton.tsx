"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditorButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  desc: string;
  isActive?: boolean;
  disabled?: boolean;
}

export const EditorButton = ({
  icon,
  onClick,
  desc,
  isActive = false,
  disabled = false,
}: EditorButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            type="button"
            onClick={onClick}
            disabled={disabled}
            whileTap={{ scale: disabled ? 1 : 0.92 }}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`
              relative flex items-center justify-center
              p-2.5 rounded-lg
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }
              dark:bg-transparent
              dark:text-muted-foreground
              dark:hover:bg-accent/80
              dark:hover:text-accent-foreground
              ${
                isActive
                  ? "dark:bg-primary/90 dark:text-primary-foreground dark:shadow-md"
                  : ""
              }
            `}
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-lg bg-primary/10 dark:bg-primary/20"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
            <div className="relative z-10">{icon}</div>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p>{desc}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
