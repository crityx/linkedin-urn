"use client";

import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useState } from "react";
import type { PostsSearchParams } from "@/types/search_types";
import { CONTENT_TYPES, DATE_POSTED, SORT_OPTIONS } from "@/types/search_types";

interface PostsFiltersProps {
  filters: PostsSearchParams;
  onChange: (filters: PostsSearchParams) => void;
}

export function PostsFilters({ filters, onChange }: PostsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof PostsSearchParams, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value && key !== "keyword" && key !== "start" && key !== "sortBy"
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
            {/* Type de contenu */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Type de contenu
              </label>
              <select
                value={filters.contentType || ""}
                onChange={(e) => updateFilter("contentType", e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              >
                {CONTENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date de publication */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Date de publication
              </label>
              <select
                value={filters.datePosted || ""}
                onChange={(e) => updateFilter("datePosted", e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              >
                {DATE_POSTED.map((date) => (
                  <option key={date.value} value={date.value}>
                    {date.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tri */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Trier par
              </label>
              <select
                value={filters.sortBy || "relevance"}
                onChange={(e) => updateFilter("sortBy", e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Titre de l'auteur */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Titre/Poste de l'auteur
              </label>
              <input
                type="text"
                value={filters.authorJobTitle || ""}
                onChange={(e) => updateFilter("authorJobTitle", e.target.value)}
                placeholder="Ex: CEO, Founder, Manager"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Entreprise de l'auteur */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Entreprise de l'auteur (ID)
              </label>
              <input
                type="text"
                value={filters.authorCompany || ""}
                onChange={(e) => updateFilter("authorCompany", e.target.value)}
                placeholder="Ex: 1337"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Industrie de l'auteur */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Industrie de l'auteur (ID)
              </label>
              <input
                type="text"
                value={filters.authorIndustry || ""}
                onChange={(e) => updateFilter("authorIndustry", e.target.value)}
                placeholder="Ex: 4,7"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Profil membre */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                De ce membre (URN)
              </label>
              <input
                type="text"
                value={filters.fromMember || ""}
                onChange={(e) => updateFilter("fromMember", e.target.value)}
                placeholder="Ex: ACoAAAAKXBwB..."
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Organisation */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                De cette organisation (ID)
              </label>
              <input
                type="text"
                value={filters.fromOrganization || ""}
                onChange={(e) => updateFilter("fromOrganization", e.target.value)}
                placeholder="Ex: 1337,1441"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Mentionne membre */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Mentionne ce membre (URN)
              </label>
              <input
                type="text"
                value={filters.mentionsMember || ""}
                onChange={(e) => updateFilter("mentionsMember", e.target.value)}
                placeholder="Ex: ACoAAAAKXBwB..."
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Mentionne organisation */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Mentionne cette organisation (ID)
              </label>
              <input
                type="text"
                value={filters.mentionsOrganization || ""}
                onChange={(e) => updateFilter("mentionsOrganization", e.target.value)}
                placeholder="Ex: 1337,1441"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
