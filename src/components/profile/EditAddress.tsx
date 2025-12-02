"use client";

import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { BiMapPin } from "react-icons/bi";
import { OpenMap } from "./components/maps/OpenMap";

export default function EditAddress({ onClose }: { onClose: () => void }) {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [openMap, setOpenMap] = useState<boolean>(false);
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);
  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-2xl p-0 overflow-hidden rounded-3xl border-0 shadow-2xl bg-white dark:bg-zinc-950"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <form className="py-10 px-6 sm:px-10">
          <DialogHeader className="text-center mb-10">
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <DialogTitle className="text-4xl font-bold bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                Edit Address
              </DialogTitle>
              <p className="text-muted-foreground mt-3 text-base">
                Update your delivery details with care
              </p>
            </motion.div>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-1.5"
            >
              <Label className="text-sm font-semibold">Address Label *</Label>
              <Input
                placeholder="Home, Office..."
                className="h-12 text-base rounded-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="space-y-1.5"
            >
              <Label className="text-sm font-semibold">Recipient Name *</Label>
              <Input
                placeholder="John Doe"
                className="h-12 text-base rounded-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.21 }}
              className="space-y-1.5"
            >
              <Label className="text-sm font-semibold">Phone Number *</Label>
              <Input
                type="tel"
                placeholder="+62 812 3456 7890"
                className="h-12 text-base rounded-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="space-y-1.5"
            >
              <Label className="text-sm font-semibold">Notes (Optional)</Label>
              <Input
                placeholder="Gate code: 1234"
                className="h-12 text-base rounded-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="md:col-span-2"
            >
              <div
                className="bg-linear-to-r from-blue-50/80 to-purple-50/80 dark:from-zinc-800/60 dark:to-purple-900/30 
                    border border-dashed border-purple-400/40 dark:border-purple-600/40
                    rounded-2xl p-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl">
                    <BiMapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Set location on map</p>
                    <p className="text-xs text-muted-foreground">
                      More accurate delivery
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenMap(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl active:scale-95 transition"
                >
                  Pin Now
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="md:col-span-2 space-y-1.5"
            >
              <Label className="text-sm font-semibold">
                Province, City, District *
              </Label>
              <Input
                readOnly
                placeholder="Detected automatically after pinning"
                className="h-mt-1 h-12 text-base rounded-2xl bg-zinc-50 dark:bg-zinc-900/50"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
              className="md:col-span-2 space-y-1.5"
            >
              <Label className="text-sm font-semibold">Full Address *</Label>
              <Textarea
                placeholder="Street, apartment, floor, etc."
                className="min-h-24 max-h-32 text-base rounded-2xl resize-none"
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                rows={3}
              />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 mt-10 max-w-2xl mx-auto"
          >
            <Button
              type="submit"
              className="flex-1 h-14 text-lg font-bold rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-14 text-lg font-medium rounded-2xl border-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
            >
              Cancel
            </Button>
          </motion.div>
        </form>
        {openMap && (
          <OpenMap
            open={openMap}
            onClose={() => setOpenMap(false)}
            onSelectLocation={(addr: string) => {
              setSelectedAddress(addr);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
