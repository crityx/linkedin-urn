import { NextRequest, NextResponse } from "next/server";
import { LINKDAPI_CONFIG, getLinkdApiHeaders } from "@/lib/linkdapi_config";

interface Reaction {
  reactionType: string;
  reactionCount: number;
}

interface PostEngagement {
  totalReactions: number;
  commentsCount: number;
  repostsCount: number;
  reactions: Reaction[] | null;
}

interface RawPost {
  text: string;
  url: string;
  urn: string;
  postedAt: {
    timestamp: number;
    fullDate: string;
    relativeDay: string;
  };
  edited: boolean;
  engagements: PostEngagement;
  mediaContent: Array<{ type: string; url: string }> | null;
  header?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const urn = searchParams.get("urn");

    if (!urn) {
      return NextResponse.json(
        { error: "Paramètre 'urn' requis" },
        { status: 400 }
      );
    }

    if (!LINKDAPI_CONFIG.apiKey) {
      return NextResponse.json(
        { error: "Clé API LinkdAPI non configurée" },
        { status: 500 }
      );
    }

    // Récupérer les posts de l'utilisateur
    const postsUrl = `${LINKDAPI_CONFIG.baseUrl}/posts/all?urn=${urn}&cursor=&start=0`;

    const postsResponse = await fetch(postsUrl, {
      method: "GET",
      headers: getLinkdApiHeaders(),
    });

    const postsData = await postsResponse.json();

    if (!postsData.success) {
      return NextResponse.json({
        success: true,
        data: {
          posts: [],
          totalPosts: 0,
          totalReactions: 0,
          totalComments: 0,
          totalReposts: 0,
          averageEngagement: 0,
        },
      });
    }

    const rawPosts: RawPost[] = postsData.data?.posts || [];

    // Calculer les statistiques globales
    let totalReactions = 0;
    let totalComments = 0;
    let totalReposts = 0;

    const formattedPosts = rawPosts
      .filter((post) => post.text && post.text.length > 0) // Filtrer les posts vides
      .map((post) => {
        const engagement = post.engagements || {
          totalReactions: 0,
          commentsCount: 0,
          repostsCount: 0,
          reactions: null,
        };

        totalReactions += engagement.totalReactions || 0;
        totalComments += engagement.commentsCount || 0;
        totalReposts += engagement.repostsCount || 0;

        return {
          id: post.urn,
          text: post.text.slice(0, 200) + (post.text.length > 200 ? "..." : ""),
          fullText: post.text,
          url: post.url,
          postedAt: post.postedAt?.fullDate || null,
          relativeTime: post.postedAt?.relativeDay || null,
          isRepost: post.header?.includes("reposted") || false,
          edited: post.edited,
          engagement: {
            reactions: engagement.totalReactions || 0,
            comments: engagement.commentsCount || 0,
            reposts: engagement.repostsCount || 0,
            total:
              (engagement.totalReactions || 0) +
              (engagement.commentsCount || 0) +
              (engagement.repostsCount || 0),
          },
          reactionDetails: engagement.reactions?.map((r) => ({
            type: r.reactionType.toLowerCase(),
            count: r.reactionCount,
          })) || [],
          hasMedia: post.mediaContent && post.mediaContent.length > 0,
          mediaType: post.mediaContent?.[0]?.type || null,
        };
      });

    const totalPosts = formattedPosts.length;
    const averageEngagement =
      totalPosts > 0
        ? Math.round((totalReactions + totalComments + totalReposts) / totalPosts)
        : 0;

    // Trouver le post le plus performant
    const topPost = formattedPosts.reduce(
      (best, post) => {
        return post.engagement.total > best.engagement.total ? post : best;
      },
      formattedPosts[0] || null
    );

    return NextResponse.json({
      success: true,
      data: {
        posts: formattedPosts.slice(0, 10), // Limiter à 10 posts
        totalPosts,
        totalReactions,
        totalComments,
        totalReposts,
        averageEngagement,
        topPost: topPost
          ? {
              text: topPost.text,
              url: topPost.url,
              engagement: topPost.engagement,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Erreur LinkdAPI posts:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des posts" },
      { status: 500 }
    );
  }
}
