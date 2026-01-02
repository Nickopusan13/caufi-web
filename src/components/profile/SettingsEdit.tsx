"use client";

import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { IconType } from "react-icons/lib";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Globe, AlertCircle } from "lucide-react";

interface OpenSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  type?: "confirmation" | "language";
  onConfirm?: () => void;
}

export const OpenSettings = ({
  open,
  onOpenChange,
  title,
  type = "confirmation",
  onConfirm,
}: OpenSettingsProps) => {
  const isLanguage = type === "language";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 rounded-3xl shadow-2xl">
        <DialogHeader className="px-7 pt-7 pb-5 text-center relative">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center mb-4 shadow-lg">
            {isLanguage ? (
              <Globe className="w-8 h-8 text-white" />
            ) : (
              <AlertCircle className="w-8 h-8 text-white" />
            )}
          </div>
          <DialogTitle className="text-2xl font-bold text-center bg-linear-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="px-7 pb-8">
          {isLanguage ? (
            <RadioGroup defaultValue="English" className="grid gap-3">
              {[
                { value: "English", label: "English" },
                { value: "Indonesia", label: "Bahasa Indonesia" },
              ].map((lang) => (
                <motion.label
                  key={lang.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-2xl cursor-pointer",
                    "bg-white dark:bg-zinc-800/70 border border-zinc-200/70 dark:border-zinc-700/70",
                    "hover:border-blue-400 dark:hover:border-blue-600",
                    "transition-all duration-300 hover:shadow-md"
                  )}
                >
                  <RadioGroupItem
                    value={lang.value}
                    id={lang.value}
                    className="scale-110"
                  />
                  <span className="font-medium text-foreground select-none">
                    {lang.label}
                  </span>
                </motion.label>
              ))}
            </RadioGroup>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button
                variant="destructive"
                size="lg"
                className="h-12 text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl"
                onClick={() => {
                  onConfirm?.();
                  onOpenChange(false);
                }}
              >
                Yes, Confirm
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-12 text-base font-semibold rounded-2xl border-2"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface SettingsItemProps {
  icon: IconType;
  title?: string;
  description: string;
  onClick?: () => void;
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export const SettingsItem = ({
  icon: Icon,
  title,
  description,
  onClick,
  iconColor = "text-blue-600 dark:text-blue-400",
  iconBg = "bg-blue-100 dark:bg-blue-950/40",
  className,
}: SettingsItemProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group flex w-full items-center justify-between gap-4 rounded-xl",
        "bg-white dark:bg-zinc-900 p-4",
        "border border-zinc-200/70 dark:border-zinc-800/70",
        "shadow-sm hover:shadow-lg dark:shadow-zinc-900/50",
        "backdrop-blur-sm",
        "transition-all duration-300",
        "hover:border-blue-300 dark:hover:border-blue-700",
        className
      )}
    >
      <div className="flex items-center gap-4">
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

        <div className="flex-1 text-left min-w-0">
          {title && (
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {title}
            </p>
          )}
          <p className="text-sm sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {description}
          </p>
        </div>
      </div>
      <ChevronRight className="h-6 w-6 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-all duration-300 group-hover:translate-x-1" />
    </motion.button>
  );
};
