/**
 * Technical SEO and Structured Data Utilities
 * Portfolio of Rifana — Graphic & UI/UX Designer
 */

export function getSiteUrl(): string {
    const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rifana.designer.vercel.app";
    return rawUrl.replace(/\/+$/, "");
}

export function getCanonicalUrl(path = "/"): string {
    const baseUrl = getSiteUrl();
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath === "/" ? "" : cleanPath}`;
}

export const SITE_METADATA = {
    title: "Rifana — Graphic & UI/UX Designer Portfolio",
    titleTemplate: "%s | Rifana",
    description:
        "Portfolio of Rifana, a Graphic & UI/UX Designer based in Chennai, India. Specializing in intuitive user experiences, brand identity design, editorial book covers, and visual storytelling.",
    authorName: "Rifana",
    jobTitle: "Graphic & UI/UX Designer",
    location: {
        city: "Chennai",
        region: "Tamil Nadu",
        country: "India",
    },
    email: "rifana0112@gmail.com",
    socialLinks: [
        "https://www.linkedin.com/in/rifana-a-uiux",
        "https://www.figma.com/@rifana",
        "https://github.com/Rifana7jasmine",
        "https://www.instagram.com/she_ui_ux",
    ],
    keywords: [
        "Rifana",
        "UI/UX Designer",
        "Graphic Designer",
        "Product Designer",
        "Branding",
        "Logo Design",
        "Book Cover Design",
        "Design Portfolio Chennai",
        "Figma Designer",
        "Web Design",
    ],
};

export function generatePersonJsonLd() {
    const siteUrl = getSiteUrl();

    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: SITE_METADATA.authorName,
        jobTitle: SITE_METADATA.jobTitle,
        description: SITE_METADATA.description,
        url: siteUrl,
        email: `mailto:${SITE_METADATA.email}`,
        address: {
            "@type": "PostalAddress",
            addressLocality: SITE_METADATA.location.city,
            addressRegion: SITE_METADATA.location.region,
            addressCountry: SITE_METADATA.location.country,
        },
        sameAs: SITE_METADATA.socialLinks,
        knowsAbout: [
            "User Interface Design",
            "User Experience Design (UX)",
            "Brand Identity Design",
            "Logo Design",
            "Book Cover Design",
            "Poster Design",
            "Social Media Design",
            "Visual Communication",
        ],
    };
}

export function generateWebsiteJsonLd() {
    const siteUrl = getSiteUrl();

    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: SITE_METADATA.title,
        url: siteUrl,
        description: SITE_METADATA.description,
        inLanguage: "en",
        publisher: {
            "@id": `${siteUrl}/#person`,
        },
    };
}
