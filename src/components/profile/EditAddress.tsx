"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React, { useCallback, useEffect, useState } from "react";
import { BiMapPin } from "react-icons/bi";
import { useUpdateUserAddress, useCreateAddress } from "@/hooks/useLogin";
import { UserAddressOut } from "@/api/user";
import toast from "react-hot-toast";
const OpenMap = dynamic(() => import("./components/maps/OpenMap"), {
  ssr: false,
});
interface EditAddressProps {
  addressToEdit?: UserAddressOut | null;
  onClose: () => void;
}

export default function EditAddress({
  addressToEdit,
  onClose,
}: EditAddressProps) {
  const isEditMode = !!addressToEdit;
  const [addressLabel, setAddressLabel] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notesCourier, setNotesCourier] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const mutationUpdate = useUpdateUserAddress();
  const mutationCreate = useCreateAddress();
  useEffect(() => {
    if (addressToEdit) {
      setAddressLabel(addressToEdit.addressLabel || "");
      setRecipientName(addressToEdit.recipientName || "");
      setPhoneNumber(addressToEdit.phoneNumber || "");
      setNotesCourier(addressToEdit.notesCourier || "");
      setFullAddress(addressToEdit.fullAddress || "");
      setIsSelected(addressToEdit.isSelected || false);
    } else {
      setAddressLabel("");
      setRecipientName("");
      setPhoneNumber("");
      setNotesCourier("");
      setFullAddress("");
      setIsSelected(false);
    }
  }, [addressToEdit]);
  const handleMapSelect = useCallback((addr: string) => {
    setFullAddress(addr);
    setOpenMap(false);
    toast.success("Location pinned successfully!");
  }, []);
  const isDirty = isEditMode
    ? addressLabel !== (addressToEdit?.addressLabel || "") ||
      recipientName !== (addressToEdit?.recipientName || "") ||
      phoneNumber !== (addressToEdit?.phoneNumber || "") ||
      notesCourier !== (addressToEdit?.notesCourier || "") ||
      fullAddress !== (addressToEdit?.fullAddress || "") ||
      isSelected !== (addressToEdit.isSelected || false)
    : !!addressLabel ||
      !!recipientName ||
      !!phoneNumber ||
      !!fullAddress ||
      !!isSelected;

  const handleClose = () => {
    if (isDirty && !confirm("You have unsaved changes. Leave anyway?")) return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName || !phoneNumber || !fullAddress) {
      toast.error("Please fill all required fields and set your location.");
      return;
    }

    if (isEditMode && addressToEdit) {
      mutationUpdate.mutate(
        {
          addressId: addressToEdit.id,
          data: {
            addressLabel: addressLabel || undefined,
            recipientName,
            phoneNumber,
            notesCourier: notesCourier || undefined,
            fullAddress,
            isSelected,
          },
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      mutationCreate.mutate(
        {
          addressLabel: addressLabel || "Home",
          recipientName,
          phoneNumber,
          notesCourier: notesCourier || undefined,
          fullAddress,
          isSelected: false,
        },
        {
          onSuccess: () => {
            toast.success("Address added successfully!");
            onClose();
          },
        }
      );
    }
  };

  return (
    <>
      <Dialog open onOpenChange={handleClose}>
        <DialogContent
          className="sm:max-w-2xl p-0 overflow-hidden rounded-3xl border-0 shadow-2xl bg-white dark:bg-zinc-950"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <form onSubmit={handleSubmit} className="py-10 px-6 sm:px-10">
            <DialogHeader className="text-center mb-10">
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <DialogTitle className="text-4xl font-bold bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                  {isEditMode ? "Edit Address" : "Add New Address"}
                </DialogTitle>
                <p className="text-muted-foreground mt-3 text-base">
                  {isEditMode
                    ? "Update your delivery details"
                    : "Add your delivery details with care"}
                </p>
              </motion.div>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Label className="text-sm font-semibold">Address Label *</Label>
                <Input
                  placeholder="Home, Office..."
                  value={addressLabel}
                  onChange={(e) => setAddressLabel(e.target.value)}
                  className="h-12 text-base rounded-2xl"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
              >
                <Label className="text-sm font-semibold">
                  Recipient Name *
                </Label>
                <Input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="John Doe"
                  className="h-12 text-base rounded-2xl"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.21 }}
              >
                <Label className="text-sm font-semibold">Phone Number *</Label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+62 812 3456 7890"
                  className="h-12 text-base rounded-2xl"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
              >
                <Label className="text-sm font-semibold">
                  Notes (Optional)
                </Label>
                <Input
                  value={notesCourier}
                  onChange={(e) => setNotesCourier(e.target.value)}
                  placeholder="Gate code: 1234..."
                  className="h-12 text-base rounded-2xl"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="md:col-span-2"
              >
                <div className="bg-linear-to-r from-blue-50/80 to-purple-50/80 dark:from-zinc-800/60 dark:to-purple-900/30 border border-dashed border-purple-400/40 dark:border-purple-600/40 rounded-2xl p-3.5 flex items-center justify-between">
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
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition"
                  >
                    {fullAddress ? "Change Pin" : "Pin Now"}
                  </button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36 }}
                className="md:col-span-2 space-y-1.5"
              >
                <Label className="text-sm font-semibold">Full Address *</Label>
                <Textarea
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="Street, building, floor..."
                  className="min-h-24 text-base rounded-2xl resize-none"
                  rows={3}
                  required
                />
              </motion.div>
            </div>
            {isEditMode && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="md:col-span-2 flex items-center justify-center gap-2 mt-5"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => setIsSelected(e.target.checked)}
                  id="isSelected"
                  className="w-4 h-4 accent-purple-600"
                />
                <label htmlFor="isSelected" className="text-sm font-medium">
                  Set as default address
                </label>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 mt-10 max-w-2xl mx-auto"
            >
              <Button
                type="submit"
                disabled={
                  mutationCreate.isPending ||
                  mutationUpdate.isPending ||
                  !isDirty
                }
                className="flex-1 h-14 text-lg font-bold rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-60"
              >
                {mutationCreate.isPending || mutationUpdate.isPending
                  ? "Saving..."
                  : isEditMode
                  ? "Save Changes"
                  : "Add Address"}
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
              onSelectLocation={handleMapSelect}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
