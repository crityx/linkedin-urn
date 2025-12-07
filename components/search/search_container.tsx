"use client";

import { useState, useCallback } from "react";
import { Search, Users, FileText, X } from "lucide-react";
import { PeopleFilters } from "./people_filters";
import { PostsFilters } from "./posts_filters";
import { PeopleResults } from "./people_results";
import { PostsResults } from "./posts_results";
import type {
  PeopleSearchParams,
  PostsSearchParams,
  PersonResult,
  PostResult,
  PeopleSearchResponse,
  PostsSearchResponse,
} from "@/types/search_types";

type SearchTab = "people" | "posts";

export function SearchContainer() {
  const [activeTab, setActiveTab] = useState<SearchTab>("people");

  // People search state
  const [peopleKeyword, setPeopleKeyword] = useState("");
  const [peopleFilters, setPeopleFilters] = useState<PeopleSearchParams>({});
  const [peopleResults, setPeopleResults] = useState<PersonResult[]>([]);
  const [peoplePagination, setPeoplePagination] = useState({
    total: 0,
    start: 0,
    hasMore: false,
  });
  const [isPeopleLoading, setIsPeopleLoading] = useState(false);

  // Posts search state
  const [postsKeyword, setPostsKeyword] = useState("");
  const [postsFilters, setPostsFilters] = useState<PostsSearchParams>({
    sortBy: "relevance",
  });
  const [postsResults, setPostsResults] = useState<PostResult[]>([]);
  const [postsPagination, setPostsPagination] = useState({
    total: 0,
    start: 0,
    hasMore: false,
  });
  const [isPostsLoading, setIsPostsLoading] = useState(false);

  // People search
  const searchPeople = useCallback(
    async (loadMore = false) => {
      if (!peopleKeyword.trim() && !Object.values(peopleFilters).some(Boolean)) {
        return;
      }

      setIsPeopleLoading(true);
      const start = loadMore ? peoplePagination.start + 10 : 0;

      try {
        const params = new URLSearchParams({
          keyword: peopleKeyword,
          start: String(start),
          ...Object.fromEntries(
            Object.entries(peopleFilters).filter(([, v]) => v)
          ),
        });

        const response = await fetch(`/api/linkedin/search/people?${params}`);
        const data: PeopleSearchResponse = await response.json();

        if (data.success && data.data) {
          setPeopleResults((prev) =>
            loadMore ? [...prev, ...data.data.people] : data.data.people
          );
          setPeoplePagination({
            total: data.data.total,
            start: data.data.start,
            hasMore: data.data.hasMore,
          });
        }
      } catch (error) {
        console.error("People search error:", error);
      } finally {
        setIsPeopleLoading(false);
      }
    },
    [peopleKeyword, peopleFilters, peoplePagination.start]
  );

  // Posts search
  const searchPosts = useCallback(
    async (loadMore = false) => {
      if (!postsKeyword.trim() && !Object.values(postsFilters).some(Boolean)) {
        return;
      }

      setIsPostsLoading(true);
      const start = loadMore ? postsPagination.start + 10 : 0;

      try {
        const params = new URLSearchParams({
          keyword: postsKeyword,
          start: String(start),
          ...Object.fromEntries(
            Object.entries(postsFilters).filter(([, v]) => v)
          ),
        });

        const response = await fetch(`/api/linkedin/search/posts?${params}`);
        const data: PostsSearchResponse = await response.json();

        if (data.success && data.data) {
          setPostsResults((prev) =>
            loadMore ? [...prev, ...data.data.posts] : data.data.posts
          );
          setPostsPagination({
            total: data.data.total,
            start: data.data.start,
            hasMore: data.data.hasMore,
          });
        }
      } catch (error) {
        console.error("Posts search error:", error);
      } finally {
        setIsPostsLoading(false);
      }
    },
    [postsKeyword, postsFilters, postsPagination.start]
  );

  const handlePeopleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchPeople(false);
    }
  };

  const handlePostsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchPosts(false);
    }
  };

  const clearPeopleSearch = () => {
    setPeopleKeyword("");
    setPeopleFilters({});
    setPeopleResults([]);
    setPeoplePagination({ total: 0, start: 0, hasMore: false });
  };

  const clearPostsSearch = () => {
    setPostsKeyword("");
    setPostsFilters({ sortBy: "relevance" });
    setPostsResults([]);
    setPostsPagination({ total: 0, start: 0, hasMore: false });
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
        <button
          onClick={() => setActiveTab("people")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === "people"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          }`}
        >
          <Users className="h-4 w-4" />
          Personnes
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === "posts"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          }`}
        >
          <FileText className="h-4 w-4" />
          Posts
        </button>
      </div>

      {/* People Search */}
      {activeTab === "people" && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={peopleKeyword}
              onChange={(e) => setPeopleKeyword(e.target.value)}
              onKeyDown={handlePeopleKeyDown}
              placeholder="Rechercher des personnes sur LinkedIn..."
              className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-20 text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {peopleKeyword && (
                <button
                  onClick={clearPeopleSearch}
                  className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => searchPeople(false)}
                disabled={isPeopleLoading}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50"
              >
                {isPeopleLoading ? "..." : "Rechercher"}
              </button>
            </div>
          </div>

          {/* Filters */}
          <PeopleFilters filters={peopleFilters} onChange={setPeopleFilters} />

          {/* Results */}
          <PeopleResults
            results={peopleResults}
            isLoading={isPeopleLoading}
            total={peoplePagination.total}
            hasMore={peoplePagination.hasMore}
            onLoadMore={() => searchPeople(true)}
          />
        </div>
      )}

      {/* Posts Search */}
      {activeTab === "posts" && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={postsKeyword}
              onChange={(e) => setPostsKeyword(e.target.value)}
              onKeyDown={handlePostsKeyDown}
              placeholder="Rechercher des posts sur LinkedIn..."
              className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-20 text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {postsKeyword && (
                <button
                  onClick={clearPostsSearch}
                  className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => searchPosts(false)}
                disabled={isPostsLoading}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50"
              >
                {isPostsLoading ? "..." : "Rechercher"}
              </button>
            </div>
          </div>

          {/* Filters */}
          <PostsFilters filters={postsFilters} onChange={setPostsFilters} />

          {/* Results */}
          <PostsResults
            results={postsResults}
            isLoading={isPostsLoading}
            total={postsPagination.total}
            hasMore={postsPagination.hasMore}
            onLoadMore={() => searchPosts(true)}
          />
        </div>
      )}
    </div>
  );
}
