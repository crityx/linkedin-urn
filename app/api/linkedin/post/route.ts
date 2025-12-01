import { NextRequest, NextResponse } from "next/server";
import { LINKEDIN_CONFIG } from "@/lib/linkedin_config";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token d'accès manquant" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace("Bearer ", "");
    const { text, authorUrn } = await request.json();

    if (!text || !authorUrn) {
      return NextResponse.json(
        { error: "Texte et URN de l'auteur requis" },
        { status: 400 }
      );
    }

    // Formate l'URN correctement
    // Si authorUrn contient déjà "urn:li:person:", on l'utilise tel quel
    // Sinon on le préfixe
    const formattedAuthor = authorUrn.startsWith("urn:li:person:")
      ? authorUrn
      : `urn:li:person:${authorUrn}`;

    console.log("Author URN formaté:", formattedAuthor);

    // Création du post avec la nouvelle API /rest/posts
    const postBody = {
      author: formattedAuthor,
      commentary: text,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    };

    const postResponse = await fetch(LINKEDIN_CONFIG.postUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": LINKEDIN_CONFIG.apiVersion,
      },
      body: JSON.stringify(postBody),
    });

    // LinkedIn retourne 201 Created en cas de succès
    if (postResponse.status === 201) {
      const postId = postResponse.headers.get("x-restli-id");
      return NextResponse.json({
        success: true,
        message: "Post publié avec succès",
        postId: postId,
      });
    }

    const errorData = await postResponse.json();
    console.error("Erreur post LinkedIn:", errorData);

    return NextResponse.json(
      {
        error: errorData.message || "Erreur lors de la publication",
        details: errorData
      },
      { status: postResponse.status }
    );
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
