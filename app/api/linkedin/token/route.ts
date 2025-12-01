import { NextRequest, NextResponse } from "next/server";
import { LINKEDIN_CONFIG } from "@/lib/linkedin_config";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Code d'autorisation manquant" },
        { status: 400 }
      );
    }

    // Échange le code contre un access token
    const tokenResponse = await fetch(LINKEDIN_CONFIG.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        client_id: LINKEDIN_CONFIG.clientId,
        client_secret: LINKEDIN_CONFIG.clientSecret,
        redirect_uri: LINKEDIN_CONFIG.redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Erreur token LinkedIn:", tokenData);
      return NextResponse.json(
        { error: tokenData.error_description || "Erreur lors de l'échange du token" },
        { status: tokenResponse.status }
      );
    }

    return NextResponse.json({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token || null,
      refresh_token_expires_in: tokenData.refresh_token_expires_in || null,
      scope: tokenData.scope,
    });
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
