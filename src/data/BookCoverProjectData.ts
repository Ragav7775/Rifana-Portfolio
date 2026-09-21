import { StaticImageData } from "next/image";

// Asset Imports for Book Cover Designs
import AwakeInTheWorldImg from "@/assets/Projects/Book/Awake-in-the-world-book-cover-page-image.jpeg";
import TheCompleteBookOfSpaceTravelImg from "@/assets/Projects/Book/Complete-book-of-space-travel-book-cover-page-image.jpeg";


export interface BookCoverProject {
    id: string;
    slug: string;
    title: string;
    metaLabel: string;
    metaValue: string;
    description: string;
    coverImage: StaticImageData;
    category?: string;
    tags?: string[];
    year?: string;
}

export const BOOK_COVER_PROJECTS: BookCoverProject[] = [
    {
        id: "awake-in-the-world",
        slug: "awake-in-the-world",
        title: "Awake in the World",
        metaLabel: "Author :",
        metaValue: "Jason Gurley",
        description:
            "A cinematic dystopian book cover exploring a mysterious world through a silhouetted human profile, an industrial offshore structure and a distant futuristic cityscape. Crafted with atmospheric textures, dramatic contrast and restrained typography to evoke mystery, isolation and a world on the edge of transformation.",
        coverImage: AwakeInTheWorldImg,
        category: "book-covers",
        tags: ["Dystopian Fiction", "Book Cover Design", "Editorial Typography", "Atmospheric Illustration"],
        year: "2024",
    },
    {
        id: "the-complete-book-of-space-travel",
        slug: "the-complete-book-of-space-travel",
        title: "The Complete Book of Space Travel",
        metaLabel: "Author :",
        metaValue: "Albro Gaul",
        description:
            "A retro-inspired space travel book cover featuring a soaring rocket, celestial bodies and layered atmospheric clouds against a textured cosmic backdrop. Crafted with a vintage editorial aesthetic, warm contrasting tones and bold typography to capture the wonder and adventure of exploring beyond Earth.",
        coverImage: TheCompleteBookOfSpaceTravelImg,
        category: "book-covers",
        tags: ["Space Travel", "Editorial Design", "Retro Illustration", "Typography"],
        year: "2024",
    },
];

export function getBookCoverProjectBySlug(slug: string): BookCoverProject | undefined {
    return BOOK_COVER_PROJECTS.find((proj) => proj.slug === slug);
}
