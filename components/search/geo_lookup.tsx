"use client";

import { useState, useCallback } from "react";
import { MapPin, Search, X, Check, Loader2 } from "lucide-react";

interface GeoResult {
  id: string;
  type: string;
  displayName: string;
}

interface GeoLookupProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function GeoLookup({ value, onChange, placeholder }: GeoLookupProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGeos, setSelectedGeos] = useState<GeoResult[]>([]);

  const searchGeo = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/linkedin/lookup/geo?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data.success && data.data?.geoIds) {
        setResults(data.data.geoIds);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Geo lookup error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    searchGeo(newQuery);
  };

  const handleSelect = (geo: GeoResult) => {
    const isAlreadySelected = selectedGeos.some((g) => g.id === geo.id);

    let newSelectedGeos: GeoResult[];
    if (isAlreadySelected) {
      newSelectedGeos = selectedGeos.filter((g) => g.id !== geo.id);
    } else {
      newSelectedGeos = [...selectedGeos, geo];
    }

    setSelectedGeos(newSelectedGeos);
    onChange(newSelectedGeos.map((g) => g.id).join(","));
  };

  const removeGeo = (geoId: string) => {
    const newSelectedGeos = selectedGeos.filter((g) => g.id !== geoId);
    setSelectedGeos(newSelectedGeos);
    onChange(newSelectedGeos.map((g) => g.id).join(","));
  };

  const clearAll = () => {
    setSelectedGeos([]);
    onChange("");
    setQuery("");
    setResults([]);
  };

  return (
    <div className="space-y-2">
      {/* Selected geos */}
      {selectedGeos.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedGeos.map((geo) => (
            <span
              key={geo.id}
              className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
            >
              <MapPin className="h-3 w-3" />
              <span className="max-w-[150px] truncate">{geo.displayName}</span>
              <button
                onClick={() => removeGeo(geo.id)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Tout effacer
          </button>
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder || "Rechercher une ville..."}
            className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-8 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-400" />
          )}
        </div>

        {/* Dropdown results */}
        {isOpen && results.length > 0 && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            {results.map((geo) => {
              const isSelected = selectedGeos.some((g) => g.id === geo.id);
              return (
                <button
                  key={geo.id}
                  onClick={() => handleSelect(geo)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
                    isSelected
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-zinc-700 dark:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                    <span className="truncate">{geo.displayName}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Click outside to close */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Helper text */}
      {value && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          IDs selectionnes: {value}
        </p>
      )}
    </div>
  );
}
