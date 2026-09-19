import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
    GenericCategoryPage,
    UIUXProjectList,
    BrandingLogoList,
    EditorialProjectList,
    SocialMediaList,
    WorkingOnIt,
} from "@/components/ProjectSection";
import {
    getCategoryBySlug,
    CATEGORY_SLUGS,
} from "@/data/ProjectData";
import { UIUX_PROJECTS } from "@/data/UIUXProjectData";
import { LOGO_PROJECTS } from "@/data/LogoProjectData";
import { BOOK_COVER_PROJECTS } from "@/data/BookCoverProjectData";
import { BRANDING_PROJECTS } from "@/data/BrandingProjectData";
import { SOCIAL_MEDIA_PROJECTS } from "@/data/SocialMediaProjectData";

interface CategoryPageProps {
    params: Promise<{
        category: string;
    }>;
}

export async function generateStaticParams() {
    return CATEGORY_SLUGS.map((slug) => ({
        category: slug,
    }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { category: categorySlug } = await params;
    const category = getCategoryBySlug(categorySlug);

    if (!category) {
        return {
            title: "Category Not Found — Rifana Portfolio",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    return {
        title: `${category.title} Projects — Rifana Portfolio`,
        description: category.slogan,
        alternates: {
            canonical: `/projects/${category.slug}`,
        },
        openGraph: {
            title: `${category.title} Projects — Rifana Portfolio`,
            description: category.slogan,
            url: `/projects/${category.slug}`,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${category.title} Projects — Rifana Portfolio`,
            description: category.slogan,
        },
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category: categorySlug } = await params;
    const category = getCategoryBySlug(categorySlug);

    if (!category) {
        notFound();
    }

    return (
        <main style={{ minHeight: "100vh", background: "var(--color-bg, #fff6d3)" }}>
            <GenericCategoryPage category={category}>
                {/* 1. UI/UX: Custom 3D interactive list with dedicated detail routes */}
                {category.slug === "uiux" && (
                    <UIUXProjectList projects={UIUX_PROJECTS} />
                )}

                {/* 2. Book Covers: Editorial cover designs exploring typography, composition, and visual storytelling */}
                {category.slug === "book-covers" && (
                    <EditorialProjectList
                        projects={BOOK_COVER_PROJECTS}
                        sectionAriaLabel="Book Cover Projects"
                    />
                )}

                {/* 3. Little Logos: Minimal logo marks focused on simplicity, symbolism, and strong visual identity */}
                {category.slug === "little-logos" && (
                    <BrandingLogoList
                        projects={LOGO_PROJECTS}
                        interaction="expand"
                    />
                )}

                {/* 4. Branding: Complete brand identity systems combining logos, color palettes, typography, and visual elements */}
                {category.slug === "branding" && (
                    <BrandingLogoList
                        projects={BRANDING_PROJECTS}
                        interaction="navigate"
                    />
                )}

                {/* 5. Poster: Creative poster designs balancing bold typography, imagery, composition, and visual impact */}
                {category.slug === "poster" && (
                    <WorkingOnIt
                        categoryTitle={category.title}
                        categorySlug={category.slug}
                        description={category.slogan}
                    />
                )}

                {/* 6. Social Media: Engaging social media designs created for promotional content, campaigns, and visual storytelling */}
                {category.slug === "social-media" && (
                    <SocialMediaList
                        projects={SOCIAL_MEDIA_PROJECTS}
                    />
                )}
            </GenericCategoryPage>
        </main>
    );
}
