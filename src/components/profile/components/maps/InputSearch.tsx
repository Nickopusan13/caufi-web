"use client";

import { FaSearch } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Loader2 } from "lucide-react";
import { usePlaceDetails, usePlaceAutocomplete } from "@/hooks/useLogin";
import type { AutocompleteResult } from "@/api/user";

export default function InputSearch({
  address: initialAddress,
  onSelect,
  onClose,
  onSelectLocation,
}: {
  address: string;
  onSelect: (lat: number, lng: number) => void;
  onClose: () => void;
  onSelectLocation: (address: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const { data: autocompleteData, isLoading: isAutocompleteLoading } =
    usePlaceAutocomplete(debouncedQuery);
  const results: AutocompleteResult[] = autocompleteData?.predictions || [];
  const { data: placeDetails, isFetching: isFetchingDetails } = usePlaceDetails(
    selectedPlaceId || ""
  );
  const handleSelect = (place: AutocompleteResult) => {
    setSelectedPlaceId(place.placeid);
    setQuery(place.structuredFormatting.mainText);
  };
  if (placeDetails) {
    onSelect(placeDetails.lat, placeDetails.lng);
  }
  const displayAddress = placeDetails?.formattedAddress || initialAddress;
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-t-2xl md:rounded-l-2xl h-full flex flex-col px-6 py-5 gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-extrabold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Search Location
        </h1>
        <button
          onClick={onClose}
          className="text-3xl text-zinc-500 hover:text-zinc-700 transition"
        >
          <IoCloseSharp />
        </button>
      </div>
      <div className="relative">
        <input
          className="w-full px-12 py-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl outline-none text-lg font-medium placeholder:text-zinc-500"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city, street, landmark..."
          autoFocus
        />
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-zinc-500" />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setSelectedPlaceId(null);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-zinc-500 hover:text-zinc-700"
          >
            <IoCloseSharp />
          </button>
        )}
        {(isAutocompleteLoading || isFetchingDetails) && (
          <div className="absolute inset-x-0 top-16 bg-white dark:bg-zinc-800 rounded-b-2xl shadow-lg p-4 text-center z-10">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-600" />
          </div>
        )}
        {results.length > 0 && !isAutocompleteLoading && !isFetchingDetails && (
          <ul className="absolute inset-x-0 top-16 bg-white dark:bg-zinc-800 rounded-b-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 max-h-80 overflow-y-auto z-50">
            {results.map((place) => (
              <li
                key={place.placeid}
                onClick={() => handleSelect(place)}
                className="px-5 py-4 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer border-b border-zinc-100 dark:border-zinc-700 last:border-0 transition-colors"
              >
                <p className="font-semibold text-base">
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
      <div className="flex-1">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
          Detected address:
        </p>
        <p className="text-base font-medium text-zinc-800 dark:text-zinc-200 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl wrap-break-words">
          {displayAddress || "Search or move the pin to set address"}
        </p>
      </div>
      <button
        onClick={() => {
          if (displayAddress) onSelectLocation(displayAddress);
          onClose();
        }}
        disabled={!displayAddress}
        className="w-full h-14 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-zinc-400 disabled:to-zinc-500 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
      >
        Confirm This Location
      </button>
    </div>
  );
}
