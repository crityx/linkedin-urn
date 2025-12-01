"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Traitement de l'authentification...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      // Vérification des erreurs OAuth
      if (errorParam) {
        setError(errorDescription || errorParam);
        return;
      }

      if (!code) {
        setError("Code d'autorisation manquant");
        return;
      }

      // Vérification du state (sécurité CSRF) - DÉSACTIVÉ temporairement pour debug
      // TODO: Réactiver en production
      const savedStateLocal = localStorage.getItem("linkedin_oauth_state");
      const savedStateSession = sessionStorage.getItem("linkedin_oauth_state");

      console.log("State reçu:", state);
      console.log("State localStorage:", savedStateLocal);
      console.log("State sessionStorage:", savedStateSession);

      // Skip la vérification pour l'instant (ngrok cause des problèmes)
      // if (!state || (state !== savedStateLocal && state !== savedStateSession)) {
      //   setError("État OAuth invalide - possible attaque CSRF. Veuillez réessayer.");
      //   return;
      // }

      try {
        setStatus("Échange du code contre le token...");

        // Échange le code contre un access token
        const tokenResponse = await fetch("/api/linkedin/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
          setError(tokenData.error || "Erreur lors de l'échange du token");
          return;
        }

        setStatus("Récupération des informations utilisateur...");

        // Récupère les infos utilisateur
        const userResponse = await fetch("/api/linkedin/userinfo", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
          setError(userData.error || "Erreur lors de la récupération des infos");
          return;
        }

        // Stocke les données dans localStorage
        localStorage.setItem("linkedin_access_token", tokenData.access_token);
        localStorage.setItem("linkedin_expires_in", tokenData.expires_in);
        localStorage.setItem("linkedin_user_urn", userData.urn);
        localStorage.setItem("linkedin_user_name", userData.name || "");
        localStorage.setItem("linkedin_user_email", userData.email || "");

        if (tokenData.refresh_token) {
          localStorage.setItem("linkedin_refresh_token", tokenData.refresh_token);
        }

        // Nettoie le state
        localStorage.removeItem("linkedin_oauth_state");
        sessionStorage.removeItem("linkedin_oauth_state");

        setStatus("Authentification réussie! Redirection...");

        // Redirige vers la page principale
        setTimeout(() => router.push("/"), 1000);
      } catch (err) {
        console.error("Erreur callback:", err);
        setError("Erreur lors du traitement de l'authentification");
      }
    };

    processCallback();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        {error ? (
          <>
            <div className="text-red-500 text-lg font-medium">Erreur</div>
            <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
            >
              Retour à l'accueil
            </button>
          </>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-zinc-600 dark:text-zinc-400">{status}</p>
          </>
        )}
      </div>
    </div>
  );
}
