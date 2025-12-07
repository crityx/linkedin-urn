import { NextRequest, NextResponse } from "next/server";
import { LINKDAPI_CONFIG, getLinkdApiHeaders } from "@/lib/linkdapi_config";
import type { PostsSearchParams, PostsSearchResponse } from "@/types/search_types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params: PostsSearchParams = {
      keyword: searchParams.get("keyword") || undefined,
      start: searchParams.get("start") ? parseInt(searchParams.get("start")!) : 0,
      authorCompany: searchParams.get("authorCompany") || undefined,
      authorIndustry: searchParams.get("authorIndustry") || undefined,
      authorJobTitle: searchParams.get("authorJobTitle") || undefined,
      contentType: (searchParams.get("contentType") as PostsSearchParams["contentType"]) || undefined,
      datePosted: (searchParams.get("datePosted") as PostsSearchParams["datePosted"]) || undefined,
      fromMember: searchParams.get("fromMember") || undefined,
      fromOrganization: searchParams.get("fromOrganization") || undefined,
      mentionsMember: searchParams.get("mentionsMember") || undefined,
      mentionsOrganization: searchParams.get("mentionsOrganization") || undefined,
      sortBy: (searchParams.get("sortBy") as PostsSearchParams["sortBy"]) || "relevance",
    };

    // Build query string
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const url = `${LINKDAPI_CONFIG.baseUrl}/search/posts?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getLinkdApiHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "LinkdAPI request failed", details: errorText },
        { status: response.status }
      );
    }

    const data: PostsSearchResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Posts search error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
