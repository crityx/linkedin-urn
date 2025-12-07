// Configuration LinkdAPI (API non officielle LinkedIn)
// Documentation: https://linkdapi.com/docs

export const LINKDAPI_CONFIG = {
  apiKey: process.env.LINKDAPI_API_KEY || "",
  baseUrl: "https://linkdapi.com/api/v1",
  endpoints: {
    profileOverview: "/profile/overview",
    searchPeople: "/search/people",
  },
};

// Headers pour les requêtes LinkdAPI
export function getLinkdApiHeaders(): HeadersInit {
  return {
    "X-linkdapi-apikey": LINKDAPI_CONFIG.apiKey,
    "Content-Type": "application/json",
  };
}
