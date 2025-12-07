"use client";

import { User, Mail, Fingerprint, Shield, Calendar } from "lucide-react";

interface ProfileCardProps {
  userUrn: string;
  userName: string;
  userEmail: string | null;
  userPicture: string | null;
  expiresIn: string;
}

export function ProfileCard({
  userUrn,
  userName,
  userEmail,
  userPicture,
  expiresIn,
}: ProfileCardProps) {
  const expirationDays = Math.floor(parseInt(expiresIn) / 86400);
  const expirationDate = new Date(Date.now() + parseInt(expiresIn) * 1000);

  return (
    <div className="w-full rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#004182] p-6 text-white">
      {/* Header avec photo */}
      <div className="flex items-center gap-4">
        {userPicture ? (
          <img
            src={userPicture}
            alt={userName}
            className="h-16 w-16 rounded-full border-2 border-white/30 object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <User className="h-8 w-8" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold">{userName}</h2>
          <p className="text-sm text-white/70">Compte LinkedIn connecté</p>
        </div>
      </div>

      {/* Informations */}
      <div className="mt-6 space-y-3">
        {/* Email */}
        {userEmail && (
          <div className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3">
            <Mail className="h-5 w-5 text-white/70" />
            <div>
              <p className="text-xs text-white/60">Email</p>
              <p className="font-medium">{userEmail}</p>
            </div>
          </div>
        )}

        {/* ID Utilisateur */}
        <div className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3">
          <Fingerprint className="h-5 w-5 text-white/70" />
          <div>
            <p className="text-xs text-white/60">ID LinkedIn</p>
            <p className="font-mono text-sm">{userUrn}</p>
          </div>
        </div>

        {/* Session */}
        <div className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3">
          <Calendar className="h-5 w-5 text-white/70" />
          <div>
            <p className="text-xs text-white/60">Session valide</p>
            <p className="font-medium">
              {expirationDays} jours restants
              <span className="ml-2 text-xs text-white/60">
                (jusqu'au {expirationDate.toLocaleDateString("fr-FR")})
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Scopes actifs */}
      <div className="mt-6">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Shield className="h-4 w-4" />
          <span>Permissions actives</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {["openid", "profile", "email", "w_member_social"].map((scope) => (
            <span
              key={scope}
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium"
            >
              {scope}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
