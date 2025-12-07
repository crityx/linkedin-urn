"use client";

import {
  ExternalLink,
  Heart,
  MessageCircle,
  Repeat2,
  Play,
  Image as ImageIcon,
  FileText,
  Link2,
  FileIcon,
} from "lucide-react";
import type { PostResult } from "@/types/search_types";

interface PostsResultsProps {
  results: PostResult[];
  isLoading: boolean;
  total: number;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function PostsResults({
  results,
  isLoading,
  total,
  hasMore,
  onLoadMore,
}: PostsResultsProps) {
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
        <FileText className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
        <p className="mt-4 text-zinc-500 dark:text-zinc-400">
          Aucun post trouve
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
        {total.toLocaleString()} posts trouves
      </p>

      <div className="space-y-4">
        {results.map((post) => (
          <PostCard key={post.urn} post={post} />
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
            "Charger plus de posts"
          )}
        </button>
      )}
    </div>
  );
}

function PostCard({ post }: { post: PostResult }) {
  const getMediaIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "article":
        return <Link2 className="h-4 w-4" />;
      case "document":
        return <FileIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800">
      {/* Author header */}
      <a
        href={post.author.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-3"
      >
        {post.author.profilePictureURL ? (
          <img
            src={post.author.profilePictureURL}
            alt={post.author.name}
            className="h-10 w-10 flex-shrink-0 rounded-full object-cover ring-2 ring-zinc-100 transition-all group-hover:ring-blue-200 dark:ring-zinc-700 dark:group-hover:ring-blue-800"
          />
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
            {post.author.name?.[0]}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {post.author.name}
          </p>
          <p className="line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
            {post.author.headline}
          </p>
          <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
            {post.postedAt.relativeDay}
          </p>
        </div>
      </a>

      {/* Post content */}
      <div className="mt-3">
        <p className="line-clamp-4 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
          {post.text}
        </p>
      </div>

      {/* Media indicators */}
      {post.mediaContent && post.mediaContent.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.mediaContent.map((media, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
            >
              {getMediaIcon(media.type)}
              {media.type === "video" && "Video"}
              {media.type === "image" && "Image"}
              {media.type === "article" && "Article"}
              {media.type === "document" && "Document"}
            </span>
          ))}
        </div>
      )}

      {/* Engagement stats */}
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-700">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            <Heart className="h-4 w-4 text-red-500" />
            {post.engagements.totalReactions.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            <MessageCircle className="h-4 w-4 text-blue-500" />
            {post.engagements.commentsCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            <Repeat2 className="h-4 w-4 text-green-500" />
            {post.engagements.repostsCount.toLocaleString()}
          </span>
        </div>

        <a
          href={post.postURL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          Voir sur LinkedIn
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
