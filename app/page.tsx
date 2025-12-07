"use client";

import { useEffect, useState } from "react";
import { Linkedin, LogOut } from "lucide-react";
import { LinkedInLoginButton } from "@/components/linkedin/login_button";
import { ProfileCard } from "@/components/linkedin/profile_card";
import { StatsCard } from "@/components/linkedin/stats_card";
import { PostForm } from "@/components/linkedin/post_form";
import { SearchContainer } from "@/components/search/search_container";

interface LinkedInData {
  accessToken: string;
  refreshToken: string | null;
  userUrn: string;
  userName: string;
  userEmail: string | null;
  userPicture: string | null;
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
    const userEmail = localStorage.getItem("linkedin_user_email");
    const userPicture = localStorage.getItem("linkedin_user_picture");
    const expiresIn = localStorage.getItem("linkedin_expires_in");

    if (accessToken && userUrn) {
      setLinkedInData({
        accessToken,
        refreshToken,
        userUrn,
        userName: userName || "Utilisateur LinkedIn",
        userEmail: userEmail || null,
        userPicture: userPicture || null,
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
    localStorage.removeItem("linkedin_user_picture");
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
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A66C2]">
              <Linkedin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                LinkedIn Publisher
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Publiez et recherchez sur LinkedIn
              </p>
            </div>
          </div>

          {linkedInData && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <LogOut className="h-4 w-4" />
              Deconnexion
            </button>
          )}
        </header>

        {/* Contenu principal */}
        {!linkedInData ? (
          // Etat non connecte
          <main className="flex flex-col items-center justify-center py-20">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900">
              <div className="flex flex-col items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#004182]">
                  <Linkedin className="h-10 w-10 text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    Bienvenue
                  </h2>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    Connectez-vous avec votre compte LinkedIn pour publier des
                    posts et effectuer des recherches.
                  </p>
                </div>
                <LinkedInLoginButton />
              </div>
            </div>
          </main>
        ) : (
          // Etat connecte - Layout deux colonnes
          <main className="grid gap-6 lg:grid-cols-2">
            {/* Colonne gauche - Profil et publication */}
            <div className="space-y-6">
              {/* Carte profil utilisateur */}
              <ProfileCard
                userUrn={linkedInData.userUrn}
                userName={linkedInData.userName}
                userEmail={linkedInData.userEmail}
                userPicture={linkedInData.userPicture}
                expiresIn={linkedInData.expiresIn}
              />

              {/* Statistiques LinkedIn */}
              <StatsCard userName={linkedInData.userName} />

              {/* Formulaire de post */}
              <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
                <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                  Creer une publication
                </h2>
                <PostForm
                  accessToken={linkedInData.accessToken}
                  userUrn={linkedInData.userUrn}
                />
              </div>
            </div>

            {/* Colonne droite - Recherche */}
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                Recherche LinkedIn
              </h2>
              <SearchContainer />
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
