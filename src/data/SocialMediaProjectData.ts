
import { StaticImageData } from "next/image";

// Asset Imports for Social Media Designs
import BloomBrewCafeImg from "@/assets/Projects/SocialMedia/Bloom-Brew-Cafe-Design.jpeg";


/* ============================================================
   TYPES
   ============================================================ */

export type SocialMediaSubCategory =
    | "instagram-post"
    | "youtube-video-thumbnail";

export interface SocialMediaProject {
    id: string;
    slug: string;
    title: string;
    metaLabel: string;
    metaValue: string;
    description: string;
    coverImage: StaticImageData;
    category: "social-media" | string;
    subCategory: SocialMediaSubCategory;
    tags?: string[];
    year?: string;
}

/* ============================================================
   SOCIAL MEDIA PROJECTS DATA
   ============================================================ */

export const SOCIAL_MEDIA_PROJECTS: SocialMediaProject[] = [
    {
        id: "bloom-brew-cafe",
        slug: "bloom-brew-cafe",
        title: "New combo offer post",
        metaLabel: "Client :",
        metaValue: "Bloom & Brew Café",
        description:
            "A warm and inviting Instagram promotional post designed to capture the cozy café atmosphere while highlighting a weekend breakfast combo. The composition combines rich café imagery, handcrafted chalkboard-style typography, warm earthy tones, and appetizing food photography to create an engaging social media visual that communicates the offer clearly.",
        coverImage: BloomBrewCafeImg,
        category: "social-media",
        subCategory: "instagram-post",
        tags: [
            "Social Media Design",
            "Food & Beverage",
            "Promotional Design",
            "Visual Storytelling",
        ],
        year: "2025",
    },
];

/* ============================================================
   HELPER QUERIES
   ============================================================ */

export function getSocialMediaProjectBySlug(slug: string): SocialMediaProject | undefined {
    return SOCIAL_MEDIA_PROJECTS.find((proj) => proj.slug === slug);
}

