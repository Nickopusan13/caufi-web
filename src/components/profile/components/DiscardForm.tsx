"use client";

import { AnimatePresence } from "framer-motion";
import AppDialog from "@/components/AppDialog";
import { DialogTitle } from "@headlessui/react";

export default function Discard({
  onClose,
  onDiscard,
  open,
}: {
  onClose: () => void;
  onDiscard: () => void;
  open: boolean;
}) {
  return (
    <AnimatePresence>
      <AppDialog onClose={onClose} open={open}>
        <div className="flex flex-col text-center gap-4">
          <DialogTitle className="text-xl font-semibold text-black dark:text-white border-b border-gray-200 pb-2">
            Unsaved Changes
          </DialogTitle>
          <p className="text-sm text-gray-900 dark:text-gray-200">
            If you leave this page, any changes you have will be lost. Discard
            changes?
          </p>
          <div className="flex justify-between gap-3 mt-2">
            <button
              className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              onClick={() => {
                onDiscard();
                onClose();
              }}
            >
              Discard
            </button>
          </div>
        </div>
      </AppDialog>
    </AnimatePresence>
  );
}
