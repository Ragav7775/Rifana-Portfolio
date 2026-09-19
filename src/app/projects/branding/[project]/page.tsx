import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrandingProjectBySlug, BRANDING_PROJECTS } from "@/data/BrandingProjectData";
import { BrandingProjectDetail } from "@/components/ProjectSection";

interface BrandingDetailPageProps {
    params: Promise<{
        project: string;
    }>;
}

export async function generateStaticParams() {
    return BRANDING_PROJECTS.map((proj) => ({
        project: proj.slug,
    }));
}

export async function generateMetadata({ params }: BrandingDetailPageProps): Promise<Metadata> {
    const { project: projectSlug } = await params;
    const project = getBrandingProjectBySlug(projectSlug);

    if (!project) {
        return {
            title: "Project Not Found — Rifana Portfolio",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title = `${project.title} — Branding Case Study | Rifana`;
    const description = project.description;
    const path = `/projects/branding/${projectSlug}`;

    return {
        title,
        description,
        alternates: {
            canonical: path,
        },
        openGraph: {
            title,
            description,
            url: path,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function BrandingDetailPage({ params }: BrandingDetailPageProps) {
    const { project: projectSlug } = await params;
    const project = getBrandingProjectBySlug(projectSlug);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-(--color-bg,#fff6d3)">
            <BrandingProjectDetail project={project} />
        </main>
    );
}