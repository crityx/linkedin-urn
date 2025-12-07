"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Link2,
  Briefcase,
  MapPin,
  Loader2,
  RefreshCw,
  GraduationCap,
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Languages,
  BadgeCheck,
  Building2,
} from "lucide-react";
import { PostsStats } from "./posts_stats";

interface Experience {
  title: string;
  company: string;
  companyLogo: string | null;
  companyUrl: string | null;
  industry: string | null;
  location: string | null;
  description: string | null;
  employmentType: string | null;
  startDate: string | null;
  endDate: string;
  isCurrent: boolean;
}

interface Education {
  school: string;
  schoolUrl: string | null;
  degree: string;
  duration: string;
}

interface Skill {
  name: string;
  isAssessed: boolean;
}

interface Language {
  name: string;
  level: string | null;
}

interface Certification {
  name: string;
  authority: string | null;
  url: string | null;
}

interface LinkedInStats {
  urn: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  headline: string;
  summary: string | null;
  followerCount: number;
  connectionsCount: number;
  profilePictureURL: string | null;
  backgroundImageURL: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
  countryCode: string | null;
  currentCompany: string | null;
  currentPosition: string | null;
  companyLogoURL: string | null;
  isPremium: boolean;
  isCreator: boolean;
  isInfluencer: boolean;
  isTopVoice: boolean;
  experiences: Experience[];
  experienceCount: number;
  education: Education[];
  educationCount: number;
  skills: Skill[];
  skillsCount: number;
  languages: Language[];
  languagesCount: number;
  certifications: Certification[];
  certificationsCount: number;
  hasProjects: boolean;
  hasPublications: boolean;
  hasVolunteering: boolean;
  hasCourses: boolean;
}

interface StatsCardProps {
  userName: string;
}

export function StatsCard({ userName }: StatsCardProps) {
  const [stats, setStats] = useState<LinkedInStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showExperiences, setShowExperiences] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showCertifications, setShowCertifications] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/linkedin/stats?name=${encodeURIComponent(userName)}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erreur lors de la récupération des stats");
        return;
      }

      setStats(data.data);
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userName) {
      fetchStats();
    }
  }, [userName]);

  if (loading) {
    return (
      <div className="w-full rounded-xl bg-zinc-100 p-6 dark:bg-zinc-800">
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="h-6 w-6 animate-spin text-[#0A66C2]" />
          <span className="text-zinc-600 dark:text-zinc-400">
            Chargement des statistiques...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-xl bg-zinc-100 p-6 dark:bg-zinc-800">
        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-center text-zinc-500 dark:text-zinc-400">{error}</p>
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 rounded-lg bg-[#0A66C2] px-4 py-2 text-sm text-white transition-colors hover:bg-[#004182]"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toLocaleString("fr-FR");
  };

  return (
    <div className="w-full space-y-4">
      {/* Header avec stats principales */}
      <div className="rounded-xl bg-zinc-100 p-6 dark:bg-zinc-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900 dark:text-white">
            Statistiques LinkedIn
          </h3>
          <button
            onClick={fetchStats}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
            title="Actualiser"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Stats principales en grille */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Followers */}
          <div className="rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#004182] p-4 text-white">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-white/70" />
              <span className="text-xs text-white/70">Followers</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {formatNumber(stats.followerCount)}
            </p>
          </div>

          {/* Connexions */}
          <div className="rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 p-4 text-white">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-white/70" />
              <span className="text-xs text-white/70">Connexions</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {formatNumber(stats.connectionsCount)}
            </p>
          </div>

          {/* Expériences */}
          <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-4 text-white">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-white/70" />
              <span className="text-xs text-white/70">Expériences</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stats.experienceCount}</p>
          </div>

          {/* Compétences */}
          <div className="rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 p-4 text-white">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-white/70" />
              <span className="text-xs text-white/70">Compétences</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stats.skillsCount}</p>
          </div>
        </div>

        {/* Stats secondaires */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {stats.languagesCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-white/50 p-2 dark:bg-white/5">
              <Languages className="h-4 w-4 text-zinc-500" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {stats.languagesCount} langue{stats.languagesCount > 1 ? "s" : ""}
              </span>
            </div>
          )}
          {stats.certificationsCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-white/50 p-2 dark:bg-white/5">
              <BadgeCheck className="h-4 w-4 text-zinc-500" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {stats.certificationsCount} certif.
              </span>
            </div>
          )}
          {stats.educationCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-white/50 p-2 dark:bg-white/5">
              <GraduationCap className="h-4 w-4 text-zinc-500" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {stats.educationCount} formation{stats.educationCount > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Badges */}
        {(stats.isPremium || stats.isInfluencer || stats.isTopVoice || stats.isCreator) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {stats.isPremium && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Premium
              </span>
            )}
            {stats.isCreator && (
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                Creator
              </span>
            )}
            {stats.isInfluencer && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Influencer
              </span>
            )}
            {stats.isTopVoice && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Top Voice
              </span>
            )}
          </div>
        )}

        {/* Infos rapides */}
        <div className="mt-4 space-y-2">
          {stats.currentPosition && stats.currentCompany && (
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Building2 className="h-4 w-4" />
              <span>
                {stats.currentPosition} chez {stats.currentCompany}
              </span>
            </div>
          )}
          {stats.location && (
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <MapPin className="h-4 w-4" />
              <span>{stats.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary / À propos (collapsible) */}
      {stats.summary && (
        <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <span className="font-medium text-zinc-900 dark:text-white">
              À propos
            </span>
            {showSummary ? (
              <ChevronUp className="h-5 w-5 text-zinc-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-zinc-500" />
            )}
          </button>
          {showSummary && (
            <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
              <p className="whitespace-pre-line text-sm text-zinc-600 dark:text-zinc-400">
                {stats.summary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Expériences (collapsible) */}
      {stats.experiences.length > 0 && (
        <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <button
            onClick={() => setShowExperiences(!showExperiences)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-600" />
              <span className="font-medium text-zinc-900 dark:text-white">
                Expériences ({stats.experienceCount})
              </span>
            </div>
            {showExperiences ? (
              <ChevronUp className="h-5 w-5 text-zinc-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-zinc-500" />
            )}
          </button>
          {showExperiences && (
            <div className="space-y-4 border-t border-zinc-200 p-4 dark:border-zinc-700">
              {stats.experiences.map((exp, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white p-4 dark:bg-zinc-900"
                >
                  <div className="flex items-start gap-3">
                    {exp.companyLogo && (
                      <img
                        src={exp.companyLogo}
                        alt={exp.company}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-zinc-900 dark:text-white">
                        {exp.title}
                      </h4>
                      <p className="text-sm text-[#0A66C2]">{exp.company}</p>
                      <p className="text-xs text-zinc-500">
                        {exp.startDate} - {exp.endDate}
                        {exp.employmentType && ` · ${exp.employmentType}`}
                      </p>
                      {exp.location && (
                        <p className="text-xs text-zinc-500">{exp.location}</p>
                      )}
                      {exp.description && (
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Éducation (collapsible) */}
      {stats.education.length > 0 && (
        <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <button
            onClick={() => setShowEducation(!showEducation)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-zinc-900 dark:text-white">
                Formation ({stats.educationCount})
              </span>
            </div>
            {showEducation ? (
              <ChevronUp className="h-5 w-5 text-zinc-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-zinc-500" />
            )}
          </button>
          {showEducation && (
            <div className="space-y-3 border-t border-zinc-200 p-4 dark:border-zinc-700">
              {stats.education.map((edu, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white p-4 dark:bg-zinc-900"
                >
                  <h4 className="font-medium text-zinc-900 dark:text-white">
                    {edu.school}
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {edu.degree}
                  </p>
                  {edu.duration && (
                    <p className="text-xs text-zinc-500">{edu.duration}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Langues (collapsible) */}
      {stats.languages.length > 0 && (
        <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <button
            onClick={() => setShowLanguages(!showLanguages)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-indigo-600" />
              <span className="font-medium text-zinc-900 dark:text-white">
                Langues ({stats.languagesCount})
              </span>
            </div>
            {showLanguages ? (
              <ChevronUp className="h-5 w-5 text-zinc-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-zinc-500" />
            )}
          </button>
          {showLanguages && (
            <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
              <div className="space-y-2">
                {stats.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-white px-4 py-3 dark:bg-zinc-900"
                  >
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {lang.name}
                    </span>
                    {lang.level && (
                      <span className="text-sm text-zinc-500">{lang.level}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Certifications (collapsible) */}
      {stats.certifications.length > 0 && (
        <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <button
            onClick={() => setShowCertifications(!showCertifications)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-teal-600" />
              <span className="font-medium text-zinc-900 dark:text-white">
                Certifications ({stats.certificationsCount})
              </span>
            </div>
            {showCertifications ? (
              <ChevronUp className="h-5 w-5 text-zinc-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-zinc-500" />
            )}
          </button>
          {showCertifications && (
            <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
              <div className="space-y-2">
                {stats.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-white px-4 py-3 dark:bg-zinc-900"
                  >
                    <h4 className="font-medium text-zinc-900 dark:text-white">
                      {cert.name}
                    </h4>
                    {cert.authority && (
                      <p className="text-sm text-zinc-500">{cert.authority}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Compétences (collapsible) */}
      {stats.skills.length > 0 && (
        <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <button
            onClick={() => setShowSkills(!showSkills)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600" />
              <span className="font-medium text-zinc-900 dark:text-white">
                Compétences ({stats.skillsCount})
              </span>
            </div>
            {showSkills ? (
              <ChevronUp className="h-5 w-5 text-zinc-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-zinc-500" />
            )}
          </button>
          {showSkills && (
            <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
              <div className="flex flex-wrap gap-2">
                {stats.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`rounded-full px-3 py-1 text-sm ${
                      skill.isAssessed
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-white text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                    }`}
                  >
                    {skill.name}
                    {skill.isAssessed && " ✓"}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Statistiques des Posts */}
      {stats.urn && <PostsStats profileUrn={stats.urn} />}

      {/* Lien profil */}
      <a
        href={`https://www.linkedin.com/in/${stats.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#004182]"
      >
        <ExternalLink className="h-4 w-4" />
        Voir le profil complet sur LinkedIn
      </a>
    </div>
  );
}
