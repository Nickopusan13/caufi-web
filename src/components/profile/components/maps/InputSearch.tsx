"use client";

import { FaSearch } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Loader2 } from "lucide-react";
import { usePlaceDetails, usePlaceAutocomplete } from "@/hooks/useLogin";
import type { AutocompleteResult } from "@/api/user";
import { motion } from "framer-motion";

export default function InputSearch({
  address: initialAddress = "",
  onSelect,
  onSelectLocation,
  onClose,
}: {
  address?: string;
  onSelect: (lat: number, lng: number) => void;
  onSelectLocation: (address: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 400);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: autocompleteData, isLoading: isAutocompleteLoading } =
    usePlaceAutocomplete(debouncedQuery);

  const { data: placeDetails, isFetching: isFetchingDetails } = usePlaceDetails(
    selectedPlaceId || ""
  );

  const results: AutocompleteResult[] = autocompleteData?.predictions || [];
  useEffect(() => {
    if (placeDetails) {
      onSelect(placeDetails.lat, placeDetails.lng);
    }
  }, [placeDetails, onSelect]);

  const handleSelect = (place: AutocompleteResult) => {
    setSelectedPlaceId(place.placeId);
    setQuery(place.structuredFormatting.mainText);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setQuery("");
    setSelectedPlaceId(null);
  };

  const handleConfirm = () => {
    if (initialAddress) {
      onSelectLocation(initialAddress);
      onClose();
    }
  };
  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 lg:mb-4">
        <h1 className="text-lg lg:text-2xl font-extrabold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Search Location
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Type an address or move the pin on the map
        </p>
      </div>
      <div className="relative">
        <input
          className="w-full px-12 py-2.5 lg:py-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl outline-none text-sm lg:text-lg font-medium placeholder:text-zinc-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          placeholder="Search city, street, landmark..."
          autoFocus
        />
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-zinc-500" />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-zinc-500 hover:text-zinc-700 transition"
          >
            <IoCloseSharp />
          </button>
        )}
        {showDropdown && (isAutocompleteLoading || isFetchingDetails) && (
          <div className="absolute inset-x-0 top-full mt-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-zinc-200 dark:border-zinc-700 z-10">
            <Loader2 className="w-7 h-7 animate-spin mx-auto text-purple-600" />
          </div>
        )}

        {showDropdown &&
          results.length > 0 &&
          !isAutocompleteLoading &&
          !isFetchingDetails && (
            <ul
              data-lenis-prevent
              className="absolute inset-x-0 top-full mt-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 lg:max-h-96 max-h-50 overflow-y-auto z-50 divide-y divide-zinc-200 dark:divide-zinc-700 scrollbar-none"
            >
              {results.map((place) => (
                <li
                  key={place.placeId}
                  onClick={() => handleSelect(place)}
                  className="px-3 py-2 lg:px-5 lg:py-4 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <p className="font-semibold text-sm lg:text-base text-zinc-900 dark:text-zinc-100">
                    {place.structuredFormatting.mainText}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {place.structuredFormatting.secondaryText}
                  </p>
                </li>
              ))}
            </ul>
          )}
      </div>
      <div className="flex-1 mt-6">
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-3">
          Current address:
        </p>
        <div className="p-3 lg:p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700 min-h-24">
          <p className="text-sm lg:text-base font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed wrap-break-words">
            {initialAddress || (
              <span className="text-zinc-500 italic">
                Search an address or drag the pin to select a location
              </span>
            )}
          </p>
        </div>
      </div>
      <motion.button
        onClick={handleConfirm}
        disabled={!initialAddress}
        whileHover={!initialAddress ? {} : { scale: 1.05 }}
        whileTap={!initialAddress ? {} : { scale: 0.95 }}
        transition={{
          ease: "easeIn",
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        className="mt-3 lg:mt-6 w-full h-10 lg:h-14 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-zinc-400 disabled:to-zinc-500 disabled:cursor-not-allowed text-white font-bold text-base lg:text-lg rounded-2xl shadow-2xl flex items-center justify-center gap-3"
      >
        Confirm This Location
      </motion.button>
    </div>
  );
}
