import { NextRequest, NextResponse } from "next/server";
import { LINKDAPI_CONFIG, getLinkdApiHeaders } from "@/lib/linkdapi_config";

interface SearchResult {
  urn: string;
  url: string;
  fullName: string;
}

interface Position {
  companyId: number;
  companyName: string;
  companyUsername: string;
  companyURL: string;
  companyLogo: string;
  companyIndustry: string;
  title: string;
  location: string;
  description: string;
  employmentType: string;
  start: { year: number; month: number; day: number };
  end: { year: number; month: number; day: number };
}

interface Education {
  university: string;
  universityLink: string;
  degree: string;
  duration: string;
}

interface Skill {
  name: string;
  passedSkillAssessment: boolean;
}

interface Language {
  name: string;
  proficiency: string;
}

interface Certification {
  name: string;
  authority: string;
  url: string;
}

interface Geo {
  country: string;
  city: string;
  full: string;
  countryCode: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userName = searchParams.get("name");

    if (!userName) {
      return NextResponse.json(
        { error: "Paramètre 'name' requis" },
        { status: 400 }
      );
    }

    if (!LINKDAPI_CONFIG.apiKey) {
      return NextResponse.json(
        { error: "Clé API LinkdAPI non configurée" },
        { status: 500 }
      );
    }

    // Étape 1: Rechercher l'utilisateur par nom
    const searchUrl = `${LINKDAPI_CONFIG.baseUrl}/search/people?keyword=${encodeURIComponent(userName)}`;
    const searchResponse = await fetch(searchUrl, {
      method: "GET",
      headers: getLinkdApiHeaders(),
    });
    const searchData = await searchResponse.json();

    if (!searchData.success || !searchData.data?.people?.length) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé sur LinkedIn" },
        { status: 404 }
      );
    }

    const firstResult: SearchResult = searchData.data.people[0];
    const username = firstResult.url.split("/in/")[1]?.replace("/", "");
    const urn = firstResult.urn;

    if (!username) {
      return NextResponse.json(
        { error: "Impossible d'extraire le username LinkedIn" },
        { status: 500 }
      );
    }

    // Étape 2: Récupérer le profil complet ET l'overview (pour followers)
    const [fullProfileRes, overviewRes] = await Promise.all([
      fetch(
        `${LINKDAPI_CONFIG.baseUrl}/profile/full?username=${username}&urn=${urn}`,
        { headers: getLinkdApiHeaders() }
      ),
      fetch(
        `${LINKDAPI_CONFIG.baseUrl}/profile/overview?username=${username}`,
        { headers: getLinkdApiHeaders() }
      ),
    ]);

    const [fullProfileData, overviewData] = await Promise.all([
      fullProfileRes.json(),
      overviewRes.json(),
    ]);

    if (!fullProfileData.success || !fullProfileData.data) {
      return NextResponse.json(
        { error: "Impossible de récupérer le profil complet" },
        { status: 500 }
      );
    }

    const profile = fullProfileData.data;
    const overview = overviewData.success ? overviewData.data : null;

    // Formatter les expériences
    const experiences = (profile.fullPositions || profile.position || []).map(
      (pos: Position) => ({
        title: pos.title,
        company: pos.companyName,
        companyLogo: pos.companyLogo || null,
        companyUrl: pos.companyURL || null,
        industry: pos.companyIndustry || null,
        location: pos.location || null,
        description: pos.description || null,
        employmentType: pos.employmentType || null,
        startDate: pos.start
          ? `${pos.start.month}/${pos.start.year}`
          : null,
        endDate:
          pos.end && pos.end.year > 0
            ? `${pos.end.month}/${pos.end.year}`
            : "Présent",
        isCurrent: !pos.end || pos.end.year === 0,
      })
    );

    // Formatter l'éducation
    const education = (profile.educations || []).map((edu: Education) => ({
      school: edu.university,
      schoolUrl: edu.universityLink || null,
      degree: edu.degree,
      duration: edu.duration,
    }));

    // Formatter les compétences
    const skills = (profile.skills || []).map((skill: Skill) => ({
      name: skill.name,
      isAssessed: skill.passedSkillAssessment || false,
    }));

    // Formatter les langues
    const languages = (profile.languages || []).map((lang: Language) => ({
      name: lang.name,
      level: lang.proficiency?.replace(/_/g, " ").toLowerCase() || null,
    }));

    // Formatter les certifications
    const certifications = (profile.certifications || []).map(
      (cert: Certification) => ({
        name: cert.name,
        authority: cert.authority || null,
        url: cert.url || null,
      })
    );

    // Géolocalisation
    const geo: Geo | null = profile.geo || null;

    // Retourner les données formatées
    return NextResponse.json({
      success: true,
      data: {
        // Infos de base
        urn: profile.urn || urn,
        username: profile.username || username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        fullName: `${profile.firstName} ${profile.lastName}`,
        headline: profile.headline,
        summary: profile.summary || null,

        // Stats (depuis overview car plus précis)
        followerCount: overview?.followerCount || 0,
        connectionsCount: overview?.connectionsCount || 0,

        // Images
        profilePictureURL: profile.profilePicture || null,
        profilePictures: profile.profilePictures || [],
        backgroundImageURL: profile.backgroundImage?.[0]?.url || null,

        // Localisation
        location: geo?.full || null,
        city: geo?.city || null,
        country: geo?.country || null,
        countryCode: geo?.countryCode || null,

        // Entreprise actuelle
        currentCompany: experiences.find((e: { isCurrent: boolean }) => e.isCurrent)?.company || null,
        currentPosition: experiences.find((e: { isCurrent: boolean }) => e.isCurrent)?.title || null,
        companyLogoURL: experiences.find((e: { isCurrent: boolean }) => e.isCurrent)?.companyLogo || null,

        // Badges
        isPremium: profile.isPremium || false,
        isCreator: profile.isCreator || false,
        isInfluencer: profile.isInfluencer || false,
        isTopVoice: profile.isTopVoice || false,

        // Expériences
        experiences,
        experienceCount: experiences.length,

        // Éducation
        education,
        educationCount: education.length,

        // Compétences
        skills,
        skillsCount: skills.length,

        // Langues
        languages,
        languagesCount: languages.length,

        // Certifications
        certifications,
        certificationsCount: certifications.length,

        // Projets, Publications, Bénévolat (si disponibles)
        hasProjects:
          profile.projects && Object.keys(profile.projects).length > 0,
        hasPublications:
          profile.publications && profile.publications.length > 0,
        hasVolunteering:
          profile.volunteering && profile.volunteering.length > 0,
        hasCourses: profile.courses && profile.courses.length > 0,
      },
    });
  } catch (error) {
    console.error("Erreur LinkdAPI:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
