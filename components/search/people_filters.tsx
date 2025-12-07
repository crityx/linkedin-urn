"use client";

import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useState } from "react";
import type { PeopleSearchParams } from "@/types/search_types";
import { PROFILE_LANGUAGES } from "@/types/search_types";
import { GeoLookup } from "./geo_lookup";

interface PeopleFiltersProps {
  filters: PeopleSearchParams;
  onChange: (filters: PeopleSearchParams) => void;
}

export function PeopleFilters({ filters, onChange }: PeopleFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof PeopleSearchParams, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value && key !== "keyword" && key !== "start"
  ).length;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" />
          <span className="font-medium text-zinc-700 dark:text-zinc-200">
            Filtres avances
          </span>
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-zinc-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Prenom */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Prenom
              </label>
              <input
                type="text"
                value={filters.firstName || ""}
                onChange={(e) => updateFilter("firstName", e.target.value)}
                placeholder="Ex: Jean"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Nom */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Nom
              </label>
              <input
                type="text"
                value={filters.lastName || ""}
                onChange={(e) => updateFilter("lastName", e.target.value)}
                placeholder="Ex: Dupont"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Titre */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Titre / Poste
              </label>
              <input
                type="text"
                value={filters.title || ""}
                onChange={(e) => updateFilter("title", e.target.value)}
                placeholder="Ex: CEO, Developer, Manager"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Entreprise actuelle */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Entreprise actuelle (ID)
              </label>
              <input
                type="text"
                value={filters.currentCompany || ""}
                onChange={(e) => updateFilter("currentCompany", e.target.value)}
                placeholder="Ex: 1337,1441"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Ancienne entreprise */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Ancienne entreprise (ID)
              </label>
              <input
                type="text"
                value={filters.pastCompany || ""}
                onChange={(e) => updateFilter("pastCompany", e.target.value)}
                placeholder="Ex: 1035,1441"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Ecole */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Ecole (ID)
              </label>
              <input
                type="text"
                value={filters.school || ""}
                onChange={(e) => updateFilter("school", e.target.value)}
                placeholder="Ex: 1792,739903"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Localisation */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Localisation
              </label>
              <GeoLookup
                value={filters.geoUrn || ""}
                onChange={(value) => updateFilter("geoUrn", value)}
                placeholder="Rechercher une ville (ex: Lyon, Paris...)"
              />
            </div>

            {/* Industrie */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Industrie (ID)
              </label>
              <input
                type="text"
                value={filters.industry || ""}
                onChange={(e) => updateFilter("industry", e.target.value)}
                placeholder="Ex: 4,7"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Langue du profil */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Langue du profil
              </label>
              <select
                value={filters.profileLanguage || ""}
                onChange={(e) => updateFilter("profileLanguage", e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              >
                {PROFILE_LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Service */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Service propose (ID)
              </label>
              <input
                type="text"
                value={filters.serviceCategory || ""}
                onChange={(e) => updateFilter("serviceCategory", e.target.value)}
                placeholder="Ex: 123"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
