"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { RiMapPin2Fill } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import {
  ForceMapResize,
  CurrentLocationButton,
  LocationWatcher,
  RecenterMap,
} from "./MapComponents";
import InputSearch from "./InputSearch";

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
  const [fromSearch, setFromSearch] = useState(false);
  const [address, setAddress] = useState("");
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="p-0 overflow-hidden rounded-3xl border-0 shadow-2xl max-w-4xl w-full h-[90vh] max-h-screen bg-white dark:bg-zinc-950"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="top-0 left-0 right-0 z-10 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-ml-2 text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Set Location on Map
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <IoIosCloseCircle className="w-7 h-7 text-zinc-600 dark:text-zinc-400" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Move the map or tap to pinpoint your exact address
          </p>
        </DialogHeader>
        <div className="flex w-full h-full">
          <div className="w-1/3 border-r border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto">
            <InputSearch
              address={address}
              onClose={onClose}
              onSelect={(lat: number, lon: number) => {
                setFromSearch(true);
                setPosition([lat, lon]);
              }}
              onSelectLocation={(addr: string) => {
                setAddress(addr);
                onSelectLocation(addr);
              }}
            />
          </div>
          <div className="relative w-2/3 py-25">
            <MapContainer
              center={position}
              zoom={17}
              scrollWheelZoom={true}
              className="h-full w-full rounded-b-3xl"
              style={{ borderRadius: "0 0 24px 24px" }}
            >
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
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-5xl text-red-600 drop-shadow-2xl"
              >
                <RiMapPin2Fill />
              </motion.div>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md">
              <button className="w-full h-14 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:scale-105 transition-all">
                Confirm This Location
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
