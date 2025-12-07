"use client";

import { Check, X, Send, User, Lock, ExternalLink } from "lucide-react";

export function AvailableFeatures() {
  const features = [
    {
      name: "Voir votre profil",
      description: "Nom, email, photo de profil",
      available: true,
      scope: "profile, email",
    },
    {
      name: "Publier des posts",
      description: "Créer des publications texte sur LinkedIn",
      available: true,
      scope: "w_member_social",
    },
    {
      name: "Authentification OpenID",
      description: "Connexion sécurisée via LinkedIn",
      available: true,
      scope: "openid",
    },
  ];

  const unavailableFeatures = [
    {
      name: "Statistiques de posts",
      description: "Likes, commentaires, partages",
      reason: "Nécessite r_member_social (fermé)",
    },
    {
      name: "Liste de vos posts",
      description: "Récupérer vos publications",
      reason: "Nécessite r_member_social (fermé)",
    },
    {
      name: "Nombre de followers",
      description: "Votre nombre d'abonnés",
      reason: "Nécessite r_member_social (fermé)",
    },
    {
      name: "Stats d'organisation",
      description: "Statistiques de page entreprise",
      reason: "Nécessite Community Management API",
    },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Fonctionnalités disponibles */}
      <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
          <Check className="h-5 w-5" />
          Disponible avec vos scopes
        </h3>
        <div className="space-y-2">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="flex items-center justify-between rounded-lg bg-white/60 px-4 py-3 dark:bg-white/5"
            >
              <div className="flex items-center gap-3">
                {feature.name.includes("profil") && (
                  <User className="h-4 w-4 text-emerald-600" />
                )}
                {feature.name.includes("post") && (
                  <Send className="h-4 w-4 text-emerald-600" />
                )}
                {feature.name.includes("OpenID") && (
                  <Lock className="h-4 w-4 text-emerald-600" />
                )}
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    {feature.name}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                {feature.scope}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fonctionnalités non disponibles */}
      <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800/50">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-zinc-600 dark:text-zinc-400">
          <X className="h-5 w-5" />
          Non disponible
        </h3>
        <div className="space-y-2">
          {unavailableFeatures.map((feature) => (
            <div
              key={feature.name}
              className="flex items-center justify-between rounded-lg bg-white/60 px-4 py-3 dark:bg-white/5"
            >
              <div>
                <p className="font-medium text-zinc-500 dark:text-zinc-400">
                  {feature.name}
                </p>
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  {feature.description}
                </p>
              </div>
              <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                {feature.reason}
              </span>
            </div>
          ))}
        </div>

        {/* Lien vers LinkedIn Developer */}
        <a
          href="https://www.linkedin.com/developers/apps"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-200 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-700"
        >
          <ExternalLink className="h-4 w-4" />
          Demander plus de permissions sur LinkedIn Developer
        </a>
      </div>
    </div>
  );
}
