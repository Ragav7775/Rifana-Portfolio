import { StaticImageData } from "next/image";

// ── Asset Imports for Nest Nook ────────────────────────────
import NestNookMainImg from "@/assets/Projects/Branding/NestAndNooks/main-image.jpeg";
import NestNookImg1 from "@/assets/Projects/Branding/NestAndNooks/img1.jpeg";
import NestNookImg2 from "@/assets/Projects/Branding/NestAndNooks/img2.jpeg";
import NestNookImg3 from "@/assets/Projects/Branding/NestAndNooks/img3.jpeg";
import NestNookImg4 from "@/assets/Projects/Branding/NestAndNooks/img4.jpeg";


/* ============================================================
   TYPES
   ============================================================ */

export interface BrandingProject {
    id: string;
    slug: string;
    title: string;
    industryLabel?: string;
    industry: string;
    industryLine1?: string;
    industryLine2?: string;
    description: string;
    keyFeatures: string[];
    coverImage: StaticImageData;
    brandBoardImage?: StaticImageData;
    logoDiagramImage?: StaticImageData;
    fullBrandingImage?: StaticImageData;
    images: StaticImageData[];
    category?: string;
    accentColor?: string;
}

/* ============================================================
   BRANDING PROJECTS DATA
   ============================================================ */

export const BRANDING_PROJECTS: BrandingProject[] = [
    {
        id: "nest-nook",
        slug: "nest-nook",
        title: "Nest & Nook",
        industryLabel: "Industry :",
        industry: "Home Décor & Lifestyle",
        industryLine1: "Home Décor",
        industryLine2: "& Lifestyle",
        description:
            "Nest & Nook is a home décor and lifestyle brand centered around creating warm, comfortable, and thoughtfully curated spaces. The identity combines a refined monogram with a candle-inspired element and flowing nest-like forms, reflecting the brand’s focus on comfort, warmth, craftsmanship, and the feeling of home.",
        keyFeatures: [
            "Target Audience: Homeowners, Décor Enthusiasts, Lifestyle Shoppers & Interior Lovers",
            "Logo Type: Combination Mark / Monogram Symbol",
            "Home Décor",
            "Lifestyle Products",
            "Cozy Living Spaces",
            "Curated Interiors",
            "Warmth & Comfort",
            "Handcrafted Aesthetic",
        ],
        coverImage: NestNookMainImg,
        images: [NestNookImg1, NestNookImg2, NestNookImg3, NestNookImg4],
        category: "branding",
        accentColor: "#07553d",
    },
];

/* ============================================================
   HELPER QUERIES
   ============================================================ */

export function getBrandingProjectBySlug(slug: string): BrandingProject | undefined {
    return BRANDING_PROJECTS.find((proj) => proj.slug === slug);
}
