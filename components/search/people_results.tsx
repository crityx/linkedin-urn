"use client";

import { ExternalLink, MapPin, Crown, User } from "lucide-react";
import type { PersonResult } from "@/types/search_types";

interface PeopleResultsProps {
  results: PersonResult[];
  isLoading: boolean;
  total: number;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function PeopleResults({
  results,
  isLoading,
  total,
  hasMore,
  onLoadMore,
}: PeopleResultsProps) {
  if (isLoading && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Recherche en cours...
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <User className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
        <p className="mt-4 text-zinc-500 dark:text-zinc-400">
          Aucun resultat trouve
        </p>
        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
          Essayez avec d'autres mots-cles ou filtres
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {total.toLocaleString()} resultats trouves
      </p>

      <div className="space-y-3">
        {results.map((person) => (
          <PersonCard key={person.urn} person={person} />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="w-full rounded-lg border border-zinc-200 bg-white py-3 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
              Chargement...
            </span>
          ) : (
            "Charger plus de resultats"
          )}
        </button>
      )}
    </div>
  );
}

function PersonCard({ person }: { person: PersonResult }) {
  return (
    <a
      href={person.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-blue-600"
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {person.profilePictureURL ? (
            <img
              src={person.profilePictureURL}
              alt={person.fullName}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-700"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-semibold text-white">
              {person.firstName?.[0]}
              {person.lastName?.[0]}
            </div>
          )}
          {person.premium && (
            <div className="absolute -bottom-1 -right-1 rounded-full bg-amber-400 p-1">
              <Crown className="h-3 w-3 text-amber-900" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {person.fullName}
            </h3>
            <ExternalLink className="h-4 w-4 flex-shrink-0 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          {person.headline && (
            <p className="mt-0.5 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {person.headline}
            </p>
          )}

          {person.location && (
            <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-500">
              <MapPin className="h-3 w-3" />
              <span>{person.location}</span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
