// Configuration LinkedIn OAuth 2.0
// Les secrets sont dans .env.local (non commité sur GitHub)

// Config serveur (pour les routes API)
export const LINKEDIN_CONFIG = {
  clientId: process.env.LINKEDIN_CLIENT_ID || "",
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
  redirectUri: process.env.LINKEDIN_REDIRECT_URI || "",
  scopes: ["openid", "profile", "email", "w_member_social"],
  authorizationUrl: "https://www.linkedin.com/oauth/v2/authorization",
  tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
  userInfoUrl: "https://api.linkedin.com/v2/userinfo",
  postUrl: "https://api.linkedin.com/rest/posts",
  apiVersion: "202411", // Version API LinkedIn (YYYYMM format)
};

// Config client (pour le bouton login côté navigateur)
export const LINKEDIN_CLIENT_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "",
  redirectUri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI || "",
  scopes: ["openid", "profile", "email", "w_member_social"],
  authorizationUrl: "https://www.linkedin.com/oauth/v2/authorization",
};

// Génère l'URL d'autorisation OAuth (utilisé côté client)
export function getAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: LINKEDIN_CLIENT_CONFIG.clientId,
    redirect_uri: LINKEDIN_CLIENT_CONFIG.redirectUri,
    state: state,
    scope: LINKEDIN_CLIENT_CONFIG.scopes.join(" "),
  });

  return `${LINKEDIN_CLIENT_CONFIG.authorizationUrl}?${params.toString()}`;
}
