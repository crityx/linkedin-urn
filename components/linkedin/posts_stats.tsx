"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Heart,
  MessageCircle,
  Repeat2,
  TrendingUp,
  Loader2,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Sparkles,
  Lightbulb,
  HandHeart,
  PartyPopper,
  Laugh,
} from "lucide-react";

interface PostEngagement {
  reactions: number;
  comments: number;
  reposts: number;
  total: number;
}

interface ReactionDetail {
  type: string;
  count: number;
}

interface Post {
  id: string;
  text: string;
  fullText: string;
  url: string;
  postedAt: string | null;
  relativeTime: string | null;
  isRepost: boolean;
  edited: boolean;
  engagement: PostEngagement;
  reactionDetails: ReactionDetail[];
  hasMedia: boolean;
  mediaType: string | null;
}

interface PostsData {
  posts: Post[];
  totalPosts: number;
  totalReactions: number;
  totalComments: number;
  totalReposts: number;
  averageEngagement: number;
  topPost: {
    text: string;
    url: string;
    engagement: PostEngagement;
  } | null;
}

interface PostsStatsProps {
  profileUrn: string;
}

const reactionIcons: Record<string, React.ReactNode> = {
  like: <ThumbsUp className="h-3 w-3" />,
  praise: <Sparkles className="h-3 w-3" />,
  interest: <Lightbulb className="h-3 w-3" />,
  empathy: <HandHeart className="h-3 w-3" />,
  appreciation: <PartyPopper className="h-3 w-3" />,
  entertainment: <Laugh className="h-3 w-3" />,
};

export function PostsStats({ profileUrn }: PostsStatsProps) {
  const [data, setData] = useState<PostsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPosts, setShowPosts] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/linkedin/posts?urn=${encodeURIComponent(profileUrn)}`
      );
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Erreur lors de la récupération des posts");
        return;
      }

      setData(result.data);
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileUrn) {
      fetchPosts();
    }
  }, [profileUrn]);

  if (loading) {
    return (
      <div className="w-full rounded-xl bg-zinc-100 p-6 dark:bg-zinc-800">
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="h-6 w-6 animate-spin text-[#0A66C2]" />
          <span className="text-zinc-600 dark:text-zinc-400">
            Chargement des posts...
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
            onClick={fetchPosts}
            className="flex items-center gap-2 rounded-lg bg-[#0A66C2] px-4 py-2 text-sm text-white transition-colors hover:bg-[#004182]"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.totalPosts === 0) {
    return (
      <div className="w-full rounded-xl bg-zinc-100 p-6 dark:bg-zinc-800">
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <FileText className="h-8 w-8 text-zinc-400" />
          <p className="text-zinc-500 dark:text-zinc-400">
            Aucun post public trouvé
          </p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            L'utilisateur n'a peut-être pas de posts publics
          </p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toLocaleString("fr-FR");
  };

  return (
    <div className="w-full space-y-4">
      {/* Stats globales des posts */}
      <div className="rounded-xl bg-zinc-100 p-6 dark:bg-zinc-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900 dark:text-white">
            Statistiques des Posts
          </h3>
          <button
            onClick={fetchPosts}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
            title="Actualiser"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Stats en grille */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Total Posts */}
          <div className="rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 p-4 text-white">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-white/70" />
              <span className="text-xs text-white/70">Posts</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{data.totalPosts}</p>
          </div>

          {/* Total Reactions */}
          <div className="rounded-xl bg-gradient-to-br from-red-500 to-red-700 p-4 text-white">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-white/70" />
              <span className="text-xs text-white/70">Réactions</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {formatNumber(data.totalReactions)}
            </p>
          </div>

          {/* Total Comments */}
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 p-4 text-white">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-white/70" />
              <span className="text-xs text-white/70">Commentaires</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {formatNumber(data.totalComments)}
            </p>
          </div>

          {/* Average Engagement */}
          <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-700 p-4 text-white">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-white/70" />
              <span className="text-xs text-white/70">Moy. Engage.</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{data.averageEngagement}</p>
          </div>
        </div>

        {/* Reposts */}
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/50 p-3 dark:bg-white/5">
          <Repeat2 className="h-4 w-4 text-zinc-500" />
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {formatNumber(data.totalReposts)} reposts au total
          </span>
        </div>

        {/* Top Post */}
        {data.topPost && (
          <div className="mt-4 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 p-4 dark:from-amber-900/20 dark:to-yellow-900/20">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
              <TrendingUp className="h-4 w-4" />
              Post le plus performant
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              {data.topPost.text}
            </p>
            <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {data.topPost.engagement.reactions}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {data.topPost.engagement.comments}
              </span>
              <span className="flex items-center gap-1">
                <Repeat2 className="h-3 w-3" />
                {data.topPost.engagement.reposts}
              </span>
            </div>
            <a
              href={data.topPost.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-[#0A66C2] hover:underline"
            >
              Voir sur LinkedIn
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      {/* Liste des posts (collapsible) */}
      {data.posts.length > 0 && (
        <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <button
            onClick={() => setShowPosts(!showPosts)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-600" />
              <span className="font-medium text-zinc-900 dark:text-white">
                Derniers posts ({data.posts.length})
              </span>
            </div>
            {showPosts ? (
              <ChevronUp className="h-5 w-5 text-zinc-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-zinc-500" />
            )}
          </button>
          {showPosts && (
            <div className="space-y-3 border-t border-zinc-200 p-4 dark:border-zinc-700">
              {data.posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg bg-white p-4 dark:bg-zinc-900"
                >
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {post.text}
                  </p>

                  {/* Réactions détaillées */}
                  {post.reactionDetails.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {post.reactionDetails.map((reaction) => (
                        <span
                          key={reaction.type}
                          className="flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                          {reactionIcons[reaction.type] || (
                            <Heart className="h-3 w-3" />
                          )}
                          {reaction.count}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {post.engagement.reactions}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.engagement.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Repeat2 className="h-3 w-3" />
                        {post.engagement.reposts}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.relativeTime && (
                        <span className="text-xs text-zinc-400">
                          {post.relativeTime}
                        </span>
                      )}
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0A66C2] hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
