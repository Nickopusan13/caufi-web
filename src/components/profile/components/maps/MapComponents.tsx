// mapcomponents/MapComponent.tsx
"use client";

import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { FaMapLocationDot } from "react-icons/fa6";

export function ForceMapResize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 150);
  }, [map]);
  return null;
}

export function LocationWatcher({
  onChange,
}: {
  onChange: (pos: [number, number]) => void;
}) {
  const map = useMap();
  useMapEvents({
    moveend: () => {
      const c = map.getCenter();
      onChange([c.lat, c.lng]);
    },
  });
  return null;
}

export function RecenterMap({
  position,
  fromSearch,
  setFromSearch,
}: {
  position: [number, number];
  fromSearch: boolean;
  setFromSearch: (v: boolean) => void;
}) {
  const map = useMap();
  useEffect(() => {
    if (fromSearch) {
      map.flyTo(position, 18, { duration: 1 });
      setFromSearch(false);
    }
  }, [position, fromSearch, map, setFromSearch]);
  return null;
}

export function CurrentLocationButton() {
  const map = useMap();
  const goToCurrentLocation = () => {
    map.locate();
    map.once("locationfound", (e) => {
      map.flyTo(e.latlng, map.getZoom());
    });
  };
  return (
    <button
      onClick={goToCurrentLocation}
      className="absolute z-1000 bottom-20 right-4 
                 bg-white dark:bg-zinc-800 p-3 rounded-full 
                 shadow-2xl border border-zinc-300 dark:border-zinc-600
                 hover:scale-110 active:scale-95 transition-all"
      aria-label="My location"
    >
      <FaMapLocationDot className="w-6 h-6 text-blue-600" />
    </button>
  );
}
