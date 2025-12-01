"use client";

import { Linkedin } from "lucide-react";
import { getAuthorizationUrl } from "@/lib/linkedin_config";

export function LinkedInLoginButton() {
  const handleLogin = () => {
    // Génère un state aléatoire pour la sécurité CSRF
    const state = Math.random().toString(36).substring(2, 15);

    // Stocke dans localStorage ET sessionStorage pour plus de robustesse
    localStorage.setItem("linkedin_oauth_state", state);
    sessionStorage.setItem("linkedin_oauth_state", state);

    // Redirige vers LinkedIn OAuth
    const authUrl = getAuthorizationUrl(state);
    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-3 rounded-lg bg-[#0A66C2] px-6 py-3 text-white font-medium transition-all hover:bg-[#004182] hover:scale-105 hover:shadow-lg"
    >
      <Linkedin className="h-5 w-5" />
      Se connecter à LinkedIn
    </button>
  );
}
