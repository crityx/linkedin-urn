import { NextRequest, NextResponse } from "next/server";
import { LINKDAPI_CONFIG, getLinkdApiHeaders } from "@/lib/linkdapi_config";

export interface GeoResult {
  id: string;
  type: string;
  displayName: string;
}

export interface GeoLookupResponse {
  success: boolean;
  statusCode: number;
  message: string;
  errors: string | null;
  data: {
    geoIds: GeoResult[];
    query: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const url = `${LINKDAPI_CONFIG.baseUrl}/geos/name-lookup?query=${encodeURIComponent(query)}`;

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

    const data: GeoLookupResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Geo lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
