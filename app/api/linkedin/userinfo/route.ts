import { NextRequest, NextResponse } from "next/server";
import { LINKEDIN_CONFIG } from "@/lib/linkedin_config";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token d'accès manquant" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace("Bearer ", "");

    // Récupère les informations utilisateur via OpenID Connect
    const userInfoResponse = await fetch(LINKEDIN_CONFIG.userInfoUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      console.error("Erreur userinfo LinkedIn:", userInfo);
      return NextResponse.json(
        { error: userInfo.message || "Erreur lors de la récupération des infos utilisateur" },
        { status: userInfoResponse.status }
      );
    }

    // L'URN est dans le champ "sub" pour OpenID Connect
    return NextResponse.json({
      urn: userInfo.sub, // Format: person URN
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
    });
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
