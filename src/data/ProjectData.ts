import { StaticImageData } from "next/image";

// Category Illustrations & Decorative Assets
import UIUXSeatingRifanaImg from "@/assets/Avatars/UIUX-Seating-Rifana-image.png";
import LittleLogoRifanaImg from "@/assets/Avatars/Logo-Painting-Rifana-image.png";
import BooksAndCoversRifanaImg from "@/assets/Avatars/Book-Reading-Rifana-image.png";
import SocialMediaRifanaImg from "@/assets/Avatars/Socialmedia-photographing-Rifana-image.png";
import PosterPalettesRifanaImg from "@/assets/Avatars/Poster-peeking-Rifana-image.png";
import BrandFolioRifanaImg from "@/assets/Avatars/Braning-Creative-Rifana-image.png";

import UiUxIconImg from "@/assets/Projects/Others/uiux-icon.png";
import BookIconImg from "@/assets/Projects/Others/book-icon.png";
import LogoIconImg from "@/assets/Projects/Others/logo-icon.png";
import BrandingIconImg from "@/assets/Projects/Others/branding-icon.png";
import PosterIconImg from "@/assets/Projects/Others/poster-icon.png";
import SocialMediaIconImg from "@/assets/Projects/Others/socialmedia-icon.png";
import LeafImage1 from "@/assets/Projects/Others/leaf-image-1.png";
import LeafImage2 from "@/assets/Projects/Others/leaf-image-2.png";
import GoldenDotImage from "@/assets/Projects/Others/golden-dot-image.png";


/* ============================================================
   TYPES
   ============================================================ */

export const CATEGORY_SLUGS = [
    "uiux",
    "book-covers",
    "little-logos",
    "branding",
    "poster",
    "social-media",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export interface ProjectCategory {
    number: string;
    slug: CategorySlug;
    title: string;
    titlelable1?: string;
    titlelable2?: string;
    titlelable3?: string;
    scriptLabel?: string;
    slogan: string;
    route: string;
    iconImage: StaticImageData;
    leafImage?: StaticImageData;
}


/* ============================================================
   PROJECT ASSETS & DECORATIONS
   ============================================================ */

export const PROJECT_HEADER_ASSET = {
    UIUXImg: UIUXSeatingRifanaImg,
    booksAndCoversImg: BooksAndCoversRifanaImg,
    littleLogosImg: LittleLogoRifanaImg,
    brandFolioImg: BrandFolioRifanaImg,
    posterPalettesImg: PosterPalettesRifanaImg,
    socialMediaChroniclesImg: SocialMediaRifanaImg,
};

export const PROJECT_GRID_DECORATIONS = {
    leaf1: LeafImage1,
    leaf2: LeafImage2,
    goldenDot: GoldenDotImage,
};

export const PROJECT_CATEGORIES: ProjectCategory[] = [
    {
        number: "01",
        slug: "uiux",
        title: "UI/UX",
        titlelable1: "UI",
        titlelable2: "UX",
        scriptLabel: "Designs",
        slogan: "I design purposeful interfaces for apps and websites, combining user-centered thinking with clean, engaging visual experiences.",
        route: "/projects/uiux",
        iconImage: UiUxIconImg,
        leafImage: LeafImage1,
    },
    {
        number: "02",
        slug: "book-covers",
        title: "Books & Covers",
        titlelable1: "Books",
        titlelable2: "&",
        titlelable3: "Covers",
        scriptLabel: "Works",
        slogan: "From pages to visuals, shaping stories into memorable covers that invite readers to look closer.",
        route: "/projects/book-covers",
        iconImage: BookIconImg,
        leafImage: LeafImage2,
    },
    {
        number: "03",
        slug: "little-logos",
        title: "Little",
        scriptLabel: "Logos",
        slogan: "In little logos, I turn simple ideas into memorable marks that give every brand its own visual voice.",
        route: "/projects/little-logos",
        iconImage: LogoIconImg,
        leafImage: LeafImage1,
    },
    {
        number: "04",
        slug: "branding",
        title: "Brand",
        scriptLabel: "Folio",
        slogan: "Giving brands a visual voice by translating their mission, values, and vision into cohesive and memorable identities.",
        route: "/projects/branding",
        iconImage: BrandingIconImg,
        leafImage: LeafImage2,
    },
    {
        number: "05",
        slug: "poster",
        title: "Poster",
        scriptLabel: "Palettes",
        slogan: "Where creativity takes shape through bold visuals, dynamic compositions, and visual storytelling.",
        route: "/projects/poster",
        iconImage: PosterIconImg,
        leafImage: LeafImage1,
    },
    {
        number: "06",
        slug: "social-media",
        title: "Social Media",
        scriptLabel: "Chronicles",
        slogan: "Scroll-stopping visuals crafted to spark attention, tell stories, and connect with audiences across social platforms.",
        route: "/projects/social-media",
        iconImage: SocialMediaIconImg,
        leafImage: LeafImage2,
    },
];



/* Helper queries */
export function getCategoryBySlug(slug: string): ProjectCategory | undefined {
    return PROJECT_CATEGORIES.find((cat) => cat.slug === slug);
}



