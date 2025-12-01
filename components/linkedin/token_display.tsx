"use client";

import { Key, User, RefreshCw, Clock } from "lucide-react";

interface TokenDisplayProps {
  userUrn: string;
  userName: string;
  accessToken: string;
  refreshToken: string | null;
  expiresIn: string;
}

export function TokenDisplay({
  userUrn,
  userName,
  accessToken,
  refreshToken,
  expiresIn,
}: TokenDisplayProps) {
  const truncateToken = (token: string) => {
    if (token.length > 50) {
      return `${token.substring(0, 25)}...${token.substring(token.length - 25)}`;
    }
    return token;
  };

  return (
    <div className="w-full space-y-4 rounded-xl bg-zinc-100 p-6 dark:bg-zinc-800">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Informations de connexion
      </h2>

      <div className="space-y-3">
        {/* Nom utilisateur */}
        <div className="flex items-start gap-3 rounded-lg bg-white p-4 dark:bg-zinc-900">
          <User className="mt-0.5 h-5 w-5 text-blue-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Utilisateur
            </p>
            <p className="text-zinc-900 dark:text-white font-medium">
              {userName}
            </p>
          </div>
        </div>

        {/* URN */}
        <div className="flex items-start gap-3 rounded-lg bg-white p-4 dark:bg-zinc-900">
          <Key className="mt-0.5 h-5 w-5 text-purple-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              URN (User ID)
            </p>
            <p className="text-zinc-900 dark:text-white font-mono text-sm break-all">
              {userUrn}
            </p>
          </div>
        </div>

        {/* Access Token */}
        <div className="flex items-start gap-3 rounded-lg bg-white p-4 dark:bg-zinc-900">
          <Key className="mt-0.5 h-5 w-5 text-green-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Access Token
            </p>
            <p className="text-zinc-900 dark:text-white font-mono text-sm break-all">
              {truncateToken(accessToken)}
            </p>
          </div>
        </div>

        {/* Expiration */}
        <div className="flex items-start gap-3 rounded-lg bg-white p-4 dark:bg-zinc-900">
          <Clock className="mt-0.5 h-5 w-5 text-orange-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Expire dans
            </p>
            <p className="text-zinc-900 dark:text-white">
              {Math.floor(parseInt(expiresIn) / 86400)} jours
            </p>
          </div>
        </div>

        {/* Refresh Token */}
        <div className="flex items-start gap-3 rounded-lg bg-white p-4 dark:bg-zinc-900">
          <RefreshCw className="mt-0.5 h-5 w-5 text-cyan-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Refresh Token
            </p>
            <p className="text-zinc-900 dark:text-white font-mono text-sm break-all">
              {refreshToken ? truncateToken(refreshToken) : "Non disponible"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
