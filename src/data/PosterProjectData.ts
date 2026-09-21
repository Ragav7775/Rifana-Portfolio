
import { StaticImageData } from "next/image";

// Asset Imports for Poster Designs
import LumoraImg from "@/assets/Projects/Poster/Lumora-Poster-Design.jpeg";
import sam1 from "@/assets/Projects/Poster/sam1.jpeg";
import sam2 from "@/assets/Projects/Poster/sam2.jpeg";



/* ============================================================
   TYPES & PRESETS
   ============================================================ */

export const POSTER_SUBCATEGORIES = [
    "poster-edits",
    "standee-works",
    "billboard-canvas",
] as const;

export type PosterSubCategory = (typeof POSTER_SUBCATEGORIES)[number];

export type CommonAspectRatioPreset =
    | "auto"
    | "1:1"
    | "4:3"
    | "16:9"
    | "3:2"
    | "2:3"
    | "9:16"
    | "1:2"
    | "1:2.4"
    | "3:1"
    | "4:1";

export type PosterAspectRatio = CommonAspectRatioPreset | string;

export type ImageFitBehavior = "cover" | "contain";

export interface AspectRatioDetectionResult {
    /** CSS-valid aspect ratio expression, e.g. "16 / 9" or "1 / 2" */
    cssRatio: string;
    /** Canonical ratio label if matched, or custom expression */
    ratioLabel: string;
    /** Numerical width-to-height ratio */
    numericRatio: number;
    /** Matched preset if within tolerance */
    matchedPreset?: CommonAspectRatioPreset;
    /** Recommended object-fit behavior ("cover" or "contain") */
    recommendedFit: ImageFitBehavior;
    /** Whether this was derived from fallback defaults */
    isFallback: boolean;
    /** Indicates if detected ratio conflicts with sub-category design expectation */
    hasOrientationConflict: boolean;
}

export const COMMON_ASPECT_RATIO_PRESETS: Array<{
    preset: CommonAspectRatioPreset;
    numeric: number;
    css: string;
}> = [
        { preset: "1:2.4", numeric: 1 / 2.4, css: "1 / 2.4" },
        { preset: "1:2", numeric: 1 / 2, css: "1 / 2" },
        { preset: "9:16", numeric: 9 / 16, css: "9 / 16" },
        { preset: "2:3", numeric: 2 / 3, css: "2 / 3" },
        { preset: "1:1", numeric: 1, css: "1 / 1" },
        { preset: "4:3", numeric: 4 / 3, css: "4 / 3" },
        { preset: "3:2", numeric: 3 / 2, css: "3 / 2" },
        { preset: "16:9", numeric: 16 / 9, css: "16 / 9" },
        { preset: "3:1", numeric: 3, css: "3 / 1" },
        { preset: "4:1", numeric: 4, css: "4 / 1" },
    ];

/**
 * Analyzes image dimensions (width & height) to detect aspect ratio, match common presets,
 * detect orientation conflicts, and suggest appropriate fit behavior.
 */
export function detectImageAspectRatio(
    image: StaticImageData | string | { width?: number; height?: number } | null | undefined,
    subCategory?: PosterSubCategory
): AspectRatioDetectionResult {
    let width: number | undefined;
    let height: number | undefined;

    if (image && typeof image === "object") {
        if ("width" in image && typeof image.width === "number") {
            width = image.width;
        }
        if ("height" in image && typeof image.height === "number") {
            height = image.height;
        }
    }

    // Fallback when metadata is unavailable or non-positive
    if (!width || !height || width <= 0 || height <= 0) {
        let fallbackCss = "2 / 3";
        let fallbackLabel: CommonAspectRatioPreset = "2:3";
        let fallbackNumeric = 2 / 3;

        if (subCategory === "standee-works") {
            fallbackCss = "1 / 2";
            fallbackLabel = "1:2";
            fallbackNumeric = 1 / 2;
        } else if (subCategory === "billboard-canvas") {
            fallbackCss = "3 / 1";
            fallbackLabel = "3:1";
            fallbackNumeric = 3 / 1;
        }

        return {
            cssRatio: fallbackCss,
            ratioLabel: fallbackLabel,
            numericRatio: fallbackNumeric,
            matchedPreset: fallbackLabel,
            recommendedFit: "cover",
            isFallback: true,
            hasOrientationConflict: false,
        };
    }

    const numericRatio = width / height;

    // Search for closest matching common preset within tolerance (epsilon = 0.045)
    let matchedPreset: CommonAspectRatioPreset | undefined;
    let cssRatio = `${width} / ${height}`;
    let ratioLabel = `${width}:${height}`;

    for (const item of COMMON_ASPECT_RATIO_PRESETS) {
        if (Math.abs(numericRatio - item.numeric) <= 0.045) {
            matchedPreset = item.preset;
            cssRatio = item.css;
            ratioLabel = item.preset;
            break;
        }
    }

    // Check for orientation conflicts with sub-category expectations
    let hasOrientationConflict = false;
    if (subCategory === "standee-works" && numericRatio > 1.1) {
        // Standee expects tall portrait, but image is landscape
        hasOrientationConflict = true;
    } else if (subCategory === "billboard-canvas" && numericRatio < 0.9) {
        // Billboard expects wide landscape, but image is portrait
        hasOrientationConflict = true;
    }

    // Recommended fitting behavior:
    // Never "stretch" (avoids distortion).
    // If there is an orientation conflict and the container doesn't adopt the ratio,
    // "contain" preserves the full artwork without harsh cropping.
    // In standard cases, "cover" delivers borderless full-frame presentation.
    const recommendedFit: ImageFitBehavior = hasOrientationConflict ? "contain" : "cover";

    return {
        cssRatio,
        ratioLabel,
        numericRatio,
        matchedPreset,
        recommendedFit,
        isFallback: false,
        hasOrientationConflict,
    };
}

export interface PosterProject {
    id: string;
    slug: string;
    title: string;
    metaLabel: string;
    metaValue: string;
    description: string;
    coverImage: StaticImageData | string;
    category: "poster" | string;
    subCategory: PosterSubCategory;
    aspectRatio?: PosterAspectRatio;
    fit?: ImageFitBehavior;
    tags?: string[];
    year?: string;
}



export const POSTER_PROJECTS: PosterProject[] = [
    {
        id: "lumora-night-of-lights-poster",
        slug: "lumora-night-of-lights-poster",
        title: "LUMORA - Night of Lights",
        metaLabel: "Client :",
        metaValue: "LUMORA",
        description:
            "A vibrant cultural event poster designed to capture the atmosphere of LUMORA — Night of Lights, blending immersive illumination, music, and creative expression into a striking visual composition. The design uses glowing light elements, atmospheric depth, and bold typography to communicate the energy and wonder of a night dedicated to art, sound, and interactive experiences.",
        coverImage: LumoraImg,
        category: "poster",
        subCategory: "poster-edits",
        aspectRatio: "2:3",
        tags: ["Creative Events", "Poster Design", "Light Art", "Event Branding"],
        year: "2024",
    },
];

export function getPosterProjectBySlug(slug: string): PosterProject | undefined {
    return POSTER_PROJECTS.find(
        (proj) => proj.slug === slug || proj.id === slug
    );
}
