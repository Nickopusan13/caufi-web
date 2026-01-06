"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { RiMapPin2Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import {
  ForceMapResize,
  CurrentLocationButton,
  LocationWatcher,
  RecenterMap,
} from "./MapComponents";
import InputSearch from "./InputSearch";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useReverseGeocoding } from "@/hooks/useLogin";
import { useEffect } from "react";

export const OpenMap = ({
  open,
  onClose,
  onSelectLocation,
}: {
  open: boolean;
  onClose: () => void;
  onSelectLocation: (addr: string) => void;
}) => {
  const [position, setPosition] = useState<[number, number]>([
    -6.2088, 106.8456,
  ]);
  const [lat, lng] = position;
  const [fromSearch, setFromSearch] = useState(false);
  const [address, setAddress] = useState("");
  const { data, isLoading } = useReverseGeocoding(lat, lng);
  useEffect(() => {
    if (!data || data.status !== "OK" || data.results.length === 0) {
      if (address !== "") {
        setAddress("");
      }
      return;
    }
    const bestResult = data.results[0];
    const newAddr = bestResult.formattedAddress;
    if (newAddr !== address) {
      setAddress(newAddr);
    }
  }, [data, address]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="p-0 overflow-hidden rounded-3xl border-0 shadow-2xl max-w-none w-[95vw] h-[90vh] max-h-screen bg-white dark:bg-zinc-950 outline-none"
        style={{ maxWidth: "1400px" }}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="absolute top-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between px-3 lg:px-5 py-2 lg:py-4">
            <div>
              <DialogTitle className="text-lg lg:text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Set Delivery Location
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Search or drag the pin to your exact address
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95"
            >
              <IoClose className="w-5 h-5 lg:w-7 lg:h-7" />
            </button>
          </div>
          <div className="hidden lg:block px-3 lg:px-5 pb-2 lg:pb-4">
            <p className="text-sm lg:text-base font-medium text-zinc-800 dark:text-zinc-200 line-clamp-2">
              {isLoading
                ? "Fetching address..."
                : address || "Move the pin to see address"}
            </p>
          </div>
        </div>
        <div className="flex flex-col h-full pt-22 lg:pt-36 lg:flex-row">
          <div className="w-full lg:w-96 lg:max-w-md bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 lg:h-full overflow-y-auto">
            <div className="pt-0 pb-3 px-3 lg:py-6 lg:px-6 space-y-4">
              <InputSearch
                onClose={onClose}
                address={address}
                onSelect={(lat, lng) => {
                  setFromSearch(true);
                  setPosition([lat, lng]);
                }}
                onSelectLocation={(addr) => {
                  setAddress(addr);
                  onSelectLocation(addr);
                  onClose();
                }}
              />
            </div>
          </div>
          <div className="relative flex-1">
            <MapContainer center={position} zoom={17} className="h-full w-full">
              <ForceMapResize />
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap
                position={position}
                fromSearch={fromSearch}
                setFromSearch={setFromSearch}
              />
              <CurrentLocationButton />
              <LocationWatcher onChange={setPosition} />
            </MapContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-1000">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl text-red-600 drop-shadow-2xl"
              >
                <RiMapPin2Fill />
              </motion.div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpenMap;
