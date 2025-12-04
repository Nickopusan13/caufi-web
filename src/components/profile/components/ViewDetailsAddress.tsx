// components/ViewDetailsAddress.tsx
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  User,
  Home,
  CheckCircle2,
  StickyNote,
  Edit3,
} from "lucide-react";
import { motion } from "framer-motion";
import { UserAddressOut } from "@/api/user";
import { useState } from "react";
import EditAddress from "../EditAddress";

type ViewDetailsAddressProps = {
  address: UserAddressOut | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ViewDetailsAddress({
  address,
  open,
  onOpenChange,
}: ViewDetailsAddressProps) {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  if (!address) return null;
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg w-[95vw] rounded-3xl p-0 overflow-hidden border-0 shadow-2xl bg-white dark:bg-zinc-950">
          <div className="relative bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/25 backdrop-blur-md rounded-2xl">
                    <MapPin className="w-9 h-9" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Address Details</h2>
                    <p className="text-white/90 text-base mt-1 font-medium">
                      {address.addressLabel || "Home"}
                    </p>
                  </div>
                </div>

                {address.isSelected && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full 
                  bg-emerald-100 dark:bg-emerald-900/40 
                  text-emerald-800 dark:text-emerald-300 
                  font-semibold text-sm 
                  border border-emerald-300 dark:border-emerald-700
                  shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Default
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-7 space-y-6">
            <InfoRow
              icon={<User />}
              label="Recipient Name"
              value={address.recipientName}
              delay={0.1}
            />
            <InfoRow
              icon={<Phone />}
              label="Phone Number"
              value={address.phoneNumber}
              delay={0.2}
            />
            <InfoRow
              icon={<Home />}
              label="Complete Address"
              value={address.fullAddress}
              delay={0.3}
              multiline
            />
            {address.notesCourier && address.notesCourier.trim() && (
              <InfoRow
                icon={
                  <StickyNote className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                }
                label="Notes for Courier"
                value={address.notesCourier}
                delay={0.4}
                multiline
                className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4"
              />
            )}
          </div>
          <div className="px-7 pb-8 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setOpenEdit(true)}
                className="h-14 text-lg font-semibold rounded-2xl
                 bg-linear-to-r from-blue-600 to-purple-600
                 hover:from-blue-700 hover:to-purple-700
                 shadow-xl hover:shadow-2xl
                 active:scale-95 transition-all duration-300
                 flex items-center justify-center gap-2.5"
              >
                <Edit3 className="w-5 h-5" />
                Edit Address
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="h-14 text-lg font-semibold rounded-2xl
                 border-2 border-zinc-300 dark:border-zinc-700
                 hover:bg-zinc-100 dark:hover:bg-zinc-800
                 active:scale-95 transition-all duration-300
                 text-zinc-800 dark:text-zinc-200"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {openEdit && (
        <EditAddress
          onClose={() => setOpenEdit(false)}
          addressToEdit={address}
        />
      )}
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
  delay = 0,
  multiline = false,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay?: number;
  multiline?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      className={`flex gap-5 ${className}`}
    >
      <div
        className={`
        p-3.5 rounded-2xl shrink-0
        ${multiline ? "self-start mt-1" : "self-center"}
        ${label.includes("Recipient") ? "bg-blue-100 dark:bg-blue-900/40" : ""}
        ${label.includes("Phone") ? "bg-green-100 dark:bg-green-900/40" : ""}
        ${
          label.includes("Address") ? "bg-purple-100 dark:bg-purple-900/40" : ""
        }
        ${
          label.includes("Notes")
            ? "bg-amber-100 dark:bg-amber-900/40"
            : "bg-zinc-100 dark:bg-zinc-800"
        }
      `}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
        <p
          className={`mt-1.5 text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed ${
            multiline ? "whitespace-pre-line" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}
