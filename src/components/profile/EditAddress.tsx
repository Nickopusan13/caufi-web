"use client";

import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export default function EditAddress({ onClose }: { onClose: () => void }) {
  return (
    <Dialog open>
      <DialogContent
        className="sm:max-w-2xl p-0 overflow-hidden rounded-3xl border-0 shadow-2xl py-10"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <form action="">
          <DialogHeader className="px-5 text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <DialogTitle className="text-3xl font-bold bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                Edit Profile
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Update your personal information
              </p>
            </motion.div>
          </DialogHeader>
        </form>
      </DialogContent>
    </Dialog>
  );
}
