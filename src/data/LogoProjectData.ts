import { StaticImageData } from "next/image";

// Asset Imports for Logo Designs
import RisingXILogoDesignImg from "@/assets/Projects/Logo/Rising-XI-Jersey Logo-Design.jpeg";
import SRFLogoDesignImg from "@/assets/Projects/Logo/SRF-Logo-Design.jpeg";
import NestNookMainImg from "@/assets/Projects/Logo/Nest-And-Nooks-Logo-Design.png";



export interface LogoProject {
    id: string;
    slug: string;
    title: string;
    industryLabel?: string;
    industry: string;
    industryLine1?: string;
    industryLine2?: string;
    description: string;
    coverImage: StaticImageData;
    category?: string;
    keyFeatures?: string[];
}

export const LOGO_PROJECTS: LogoProject[] = [
    {
        id: "nest-nook",
        slug: "nest-nook",
        title: "Nest & Nook",
        industryLabel: "Industry :",
        industry: "Lifestyle & Home Décor",
        industryLine1: "Lifestyle",
        industryLine2: "& Home Décor",
        description:
            "A refined lifestyle and décor brandmark designed to evoke the warmth, comfort, and character of a thoughtfully curated home. The emblem combines an elegant N/N monogram, candle-inspired form, and flowing nest-like lines, symbolizing warmth, craftsmanship, creativity, and spaces that feel personal and inviting.",
        keyFeatures: [
            "Elegant monogram-based identity",
            "Candle and nest-inspired symbolism",
            "Warm, refined earthy color palette",
            "Combination of typography and symbolic mark",
            "Versatile logo and icon system",
            "Strong visual association with comfort and home",
        ],
        coverImage: NestNookMainImg,
        category: "little-logos",
    },
    {
        id: "rising-xi",
        slug: "rising-xi",
        title: "Rising XI",
        industryLabel: "Industry :",
        industry: "Cricket & Sports",
        industryLine1: "Cricket",
        industryLine2: "& Sports",
        description:
            "A bold emblem-style cricket team logo built around a stylized golden dragon, expansive wings, and a shield-inspired crest. The design combines strength, movement, and competitive spirit with metallic gold detailing and dramatic typography, creating a distinctive identity suited for a cricket team jersey.",
        coverImage: RisingXILogoDesignImg,
        category: "little-logos",
        keyFeatures: [
            "Dragon-inspired team emblem",
            "Shield-based crest structure",
            "Bold gothic-style lettering",
            "Metallic gold visual treatment",
            "Strong silhouette for jersey application",
            "High-impact sports identity",
        ],
    },
    {
        id: "srf",
        slug: "srf",
        title: "SRF",
        industryLabel: "Industry :",
        industry: "Steel Furniture",
        industryLine1: "Steel",
        industryLine2: "Furniture",
        description:
            "A bold industrial logo designed for a steel furniture brand, combining a streamlined monogram with a dynamic metallic-inspired form. The elliptical frame and contrasting gradient treatment create a strong, contemporary identity, while the integrated circular motif adds a sense of structure, durability, and precision.",
        coverImage: SRFLogoDesignImg,
        category: "little-logos",
        keyFeatures: [
            "Custom SRF monogram",
            "Strong geometric structure",
            "Industrial-inspired visual language",
            "Bold cyan and purple contrast",
            "Scalable emblem-based composition",
            "Clear brand-name hierarchy",
        ],
    },

];

export function getLogoProjectBySlug(slug: string): LogoProject | undefined {
    return LOGO_PROJECTS.find((proj) => proj.slug === slug);
}
