"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function AppDialog({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Dialog
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      open={open}
      onClose={onClose}
    >
      <motion.div
        initial={{ backgroundColor: "rgba(0,0,0,0)", opacity: 0 }}
        animate={{ backgroundColor: "rgba(0,0,0,0.5)", opacity: 1 }}
        exit={{ backgroundColor: "rgba(0,0,0,0)", opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="rounded-2xl w-[90%] max-w-2xl"
      >
        <div className="bg-white dark:bg-zinc-900 py-3 px-6 rounded-lg shadow-lg">
          <DialogPanel>{children}</DialogPanel>
        </div>
      </motion.div>
    </Dialog>
  );
}
