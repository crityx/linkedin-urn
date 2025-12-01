"use client";

import { useEffect, useState } from "react";
import { Linkedin, LogOut } from "lucide-react";
import { LinkedInLoginButton } from "@/components/linkedin/login_button";
import { TokenDisplay } from "@/components/linkedin/token_display";
import { PostForm } from "@/components/linkedin/post_form";

interface LinkedInData {
  accessToken: string;
  refreshToken: string | null;
  userUrn: string;
  userName: string;
  expiresIn: string;
}

export default function Home() {
  const [linkedInData, setLinkedInData] = useState<LinkedInData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charge les données depuis localStorage
    const accessToken = localStorage.getItem("linkedin_access_token");
    const refreshToken = localStorage.getItem("linkedin_refresh_token");
    const userUrn = localStorage.getItem("linkedin_user_urn");
    const userName = localStorage.getItem("linkedin_user_name");
    const expiresIn = localStorage.getItem("linkedin_expires_in");

    if (accessToken && userUrn) {
      setLinkedInData({
        accessToken,
        refreshToken,
        userUrn,
        userName: userName || "Utilisateur LinkedIn",
        expiresIn: expiresIn || "0",
      });
    }

    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("linkedin_access_token");
    localStorage.removeItem("linkedin_refresh_token");
    localStorage.removeItem("linkedin_user_urn");
    localStorage.removeItem("linkedin_user_name");
    localStorage.removeItem("linkedin_user_email");
    localStorage.removeItem("linkedin_expires_in");
    setLinkedInData(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-black">
      <main className="w-full max-w-xl space-y-6 rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A66C2]">
              <Linkedin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                LinkedIn Publisher
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Publiez sur LinkedIn facilement
              </p>
            </div>
          </div>

          {linkedInData && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          )}
        </div>

        {/* Contenu principal */}
        {!linkedInData ? (
          // État non connecté
          <div className="flex flex-col items-center gap-6 py-8">
            <p className="text-center text-zinc-600 dark:text-zinc-400">
              Connectez-vous avec votre compte LinkedIn pour publier des posts.
            </p>
            <LinkedInLoginButton />
          </div>
        ) : (
          // État connecté
          <div className="space-y-6">
            {/* Affichage des tokens */}
            <TokenDisplay
              userUrn={linkedInData.userUrn}
              userName={linkedInData.userName}
              accessToken={linkedInData.accessToken}
              refreshToken={linkedInData.refreshToken}
              expiresIn={linkedInData.expiresIn}
            />

            {/* Séparateur */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                  Créer une publication
                </span>
              </div>
            </div>

            {/* Formulaire de post */}
            <PostForm
              accessToken={linkedInData.accessToken}
              userUrn={linkedInData.userUrn}
            />
          </div>
        )}
      </main>
    </div>
  );
}
