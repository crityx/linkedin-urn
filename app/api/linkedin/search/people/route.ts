import { NextRequest, NextResponse } from "next/server";
import { LINKDAPI_CONFIG, getLinkdApiHeaders } from "@/lib/linkdapi_config";
import type { PeopleSearchParams, PeopleSearchResponse } from "@/types/search_types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params: PeopleSearchParams = {
      keyword: searchParams.get("keyword") || undefined,
      start: searchParams.get("start") ? parseInt(searchParams.get("start")!) : 0,
      currentCompany: searchParams.get("currentCompany") || undefined,
      firstName: searchParams.get("firstName") || undefined,
      geoUrn: searchParams.get("geoUrn") || undefined,
      industry: searchParams.get("industry") || undefined,
      lastName: searchParams.get("lastName") || undefined,
      profileLanguage: searchParams.get("profileLanguage") || undefined,
      pastCompany: searchParams.get("pastCompany") || undefined,
      school: searchParams.get("school") || undefined,
      serviceCategory: searchParams.get("serviceCategory") || undefined,
      title: searchParams.get("title") || undefined,
    };

    // Build query string
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const url = `${LINKDAPI_CONFIG.baseUrl}/search/people?${queryParams.toString()}`;

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

    const data: PeopleSearchResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("People search error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
