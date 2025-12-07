// Types pour la recherche LinkedIn via LinkdAPI

// ========== People Search Types ==========

export interface PeopleSearchParams {
  keyword?: string;
  start?: number;
  currentCompany?: string;
  firstName?: string;
  geoUrn?: string;
  industry?: string;
  lastName?: string;
  profileLanguage?: string;
  pastCompany?: string;
  school?: string;
  serviceCategory?: string;
  title?: string;
}

export interface PersonResult {
  urn: string;
  profileID: string;
  url: string;
  firstName: string;
  lastName: string;
  fullName: string;
  headline: string;
  location: string;
  profilePictureURL: string;
  premium: boolean;
}

export interface PeopleSearchResponse {
  success: boolean;
  statusCode: number;
  message: string;
  errors: string | null;
  data: {
    people: PersonResult[];
    total: number;
    start: number;
    count: number;
    hasMore: boolean;
  };
}

// ========== Posts Search Types ==========

export interface PostsSearchParams {
  keyword?: string;
  start?: number;
  authorCompany?: string;
  authorIndustry?: string;
  authorJobTitle?: string;
  contentType?: "videos" | "photos" | "jobs" | "liveVideos" | "documents" | "collaborativeArticles" | "";
  datePosted?: "past-24h" | "past-week" | "past-month" | "past-year" | "";
  fromMember?: string;
  fromOrganization?: string;
  mentionsMember?: string;
  mentionsOrganization?: string;
  sortBy?: "relevance" | "date_posted";
}

export interface PostAuthor {
  name: string;
  headline: string;
  urn: string;
  id: string;
  url: string;
  profilePictureURL: string;
}

export interface PostEngagements {
  totalReactions: number;
  commentsCount: number;
  repostsCount: number;
}

export interface PostReaction {
  reactionType: string;
  reactionCount: number;
}

export interface PostMediaContent {
  type: "video" | "image" | "article" | "document";
  url: string;
}

export interface PostResult {
  urn: string;
  postID: string;
  postURL: string;
  text: string;
  author: PostAuthor;
  postedAt: {
    timestamp: number;
    fullDate: string;
    relativeDay: string;
  };
  engagements: PostEngagements;
  reactions: PostReaction[] | null;
  mediaContent: PostMediaContent[];
}

export interface PostsSearchResponse {
  success: boolean;
  statusCode: number;
  message: string;
  errors: string | null;
  data: {
    posts: PostResult[];
    total: number;
    start: number;
    count: number;
    hasMore: boolean;
  };
}

// ========== Filter Options Types ==========

export interface FilterOption {
  value: string;
  label: string;
}

export const CONTENT_TYPES: FilterOption[] = [
  { value: "", label: "Tous les types" },
  { value: "videos", label: "Videos" },
  { value: "photos", label: "Photos" },
  { value: "documents", label: "Documents" },
  { value: "jobs", label: "Offres d'emploi" },
  { value: "liveVideos", label: "Lives" },
  { value: "collaborativeArticles", label: "Articles collaboratifs" },
];

export const DATE_POSTED: FilterOption[] = [
  { value: "", label: "Toutes les dates" },
  { value: "past-24h", label: "Dernières 24h" },
  { value: "past-week", label: "Cette semaine" },
  { value: "past-month", label: "Ce mois" },
  { value: "past-year", label: "Cette année" },
];

export const SORT_OPTIONS: FilterOption[] = [
  { value: "relevance", label: "Pertinence" },
  { value: "date_posted", label: "Date de publication" },
];

export const PROFILE_LANGUAGES: FilterOption[] = [
  { value: "", label: "Toutes les langues" },
  { value: "fr", label: "Francais" },
  { value: "en", label: "English" },
  { value: "es", label: "Espanol" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
  { value: "pt", label: "Portugues" },
  { value: "nl", label: "Nederlands" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ar", label: "Arabic" },
];
