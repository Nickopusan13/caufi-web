"use client";

import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React, { useCallback, useState } from "react";
import { BiMapPin } from "react-icons/bi";
import { OpenMap } from "./components/maps/OpenMap";
import {
  useUpdateUserAddress,
  useGetCurrentUser,
  useCreateAddress,
} from "@/hooks/useLogin";
import { UserAddressUpdate } from "@/api/user";
import toast from "react-hot-toast";
import ToasterProvider from "../ToasterProvider";

interface MapLocationData {
  fullAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
}

export default function EditAddress({ onClose }: { onClose: () => void }) {
  const { data: user, isPending: loadingUser } = useGetCurrentUser();
  const mutationUpdate = useUpdateUserAddress();
  const mutationCreate = useCreateAddress();
  const firstAddress = user?.addresses?.[0];
  const [addressLabel, setAddressLabel] = useState(
    () => firstAddress?.addressLabel ?? ""
  );
  const [recipientName, setRecipientName] = useState(
    () => firstAddress?.recipientName ?? ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    () => firstAddress?.phoneNumber ?? ""
  );
  const [notesCourier, setNotesCourier] = useState(
    () => firstAddress?.notesCourier ?? ""
  );
  const [fullAddress, setFullAddress] = useState(
    () => firstAddress?.fullAddress ?? ""
  );
  const [city, setCity] = useState(() => firstAddress?.city ?? "Hello");
  const [openMap, setOpenMap] = useState<boolean>(false);

  // Handle map selection
  const handleMapSelect = useCallback((location: MapLocationData) => {
    setFullAddress(location.fullAddress);
    setCity(location.city);
    setOpenMap(false);
    toast.success("Location pinned successfully!");
  }, []);

  const isDirty =
    !firstAddress ||
    addressLabel !== (firstAddress.addressLabel ?? "") ||
    recipientName !== (firstAddress.recipientName ?? "") ||
    phoneNumber !== (firstAddress.phoneNumber ?? "") ||
    notesCourier !== (firstAddress.notesCourier ?? "") ||
    fullAddress !== (firstAddress.fullAddress ?? "") ||
    city !== (firstAddress.city ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutationCreate.mutate({
      addressLabel,
      city,
      fullAddress,
      isSelected: true,
      notesCourier,
      phoneNumber,
      recipientName,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstAddress) {
      toast.error("No address found to update.");
      return;
    }
    if (!recipientName || !phoneNumber || !fullAddress || !city) {
      toast.error("Please fill in all required fields and pin your location.");
      return;
    }

    const data: UserAddressUpdate = {
      addressLabel,
      recipientName,
      phoneNumber,
      notesCourier: notesCourier || undefined,
      fullAddress,
      city,
    };

    mutationUpdate.mutate(
      { addressId: firstAddress.id, data },
      {
        onSuccess: () => {
          toast.success("Address updated successfully!");
          onClose();
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to update address");
        },
      }
    );
  };

  const handleClose = () => {
    if (isDirty) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToasterProvider />
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
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <DialogTitle className="text-4xl font-bold bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                  Add Address
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
                className="space-y-1.5"
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
                className="space-y-1.5"
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
                className="space-y-1.5"
              >
                <Label className="text-sm font-semibold">
                  Notes (Optional)
                </Label>
                <Input
                  value={notesCourier}
                  onChange={(e) => setNotesCourier(e.target.value)}
                  placeholder="Gate code: 1234, near mosque, etc."
                  className="h-12 text-base rounded-2xl"
                />
              </motion.div>

              {/* Map Pin Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="md:col-span-2"
              >
                <div className="bg-linear-to-r from-blue-50/80 to-purple-50/80 dark:from-zinc-800/60 dark:to-purple-900/30 border border-dashed border-purple-400/40 dark:border-purple-600/40 rounded-2xl p-3.5 flex items-center justify-between gap-3">
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
                    {fullAddress ? "Change Pin" : "Pin Now"}
                  </button>
                </div>
              </motion.div>

              {/* Province, City (Readonly) */}
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
                  value={city}
                  placeholder="Detected automatically after pinning"
                  className="h-12 text-base rounded-2xl bg-zinc-50 dark:bg-zinc-900/50"
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
                  placeholder="Street name, building, apartment, floor, etc."
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  className="min-h-24 max-h-32 text-base rounded-2xl resize-none"
                  rows={3}
                  required
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
                disabled={mutationCreate.isPending || !isDirty}
                className="flex-1 h-14 text-lg font-bold rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-60"
              >
                {mutationCreate.isPending ? "Saving..." : "Save Changes"}
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
                setFullAddress(addr);
              }}
              // initialLocation={
              //   firstAddress
              //     ? {
              //         fullAddress: firstAddress.fullAddress || "",
              //         city: firstAddress.city || "",
              //       }
              //     : undefined
              // }
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
