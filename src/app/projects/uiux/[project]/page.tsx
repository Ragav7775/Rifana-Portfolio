import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUIUXProjectBySlug, UIUX_PROJECTS } from "@/data/UIUXProjectData";
import UIUXProjectDetail from "@/components/ProjectSection/UIUX/UIUXProjectDetail";

interface ProjectDetailPageProps {
    params: Promise<{
        project: string;
    }>;
}

export async function generateStaticParams() {
    return UIUX_PROJECTS.map((proj) => ({
        project: proj.slug,
    }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
    const { project: projectSlug } = await params;
    const project = getUIUXProjectBySlug(projectSlug);

    if (!project) {
        return {
            title: "Project Not Found — Rifana Portfolio",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title = `${project.name} — UI/UX Case Study | Rifana`;
    const description = project.summary;
    const path = `/projects/uiux/${projectSlug}`;

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

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { project: projectSlug } = await params;
    const project = getUIUXProjectBySlug(projectSlug);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-(--color-bg,#fff6d3)">
            <UIUXProjectDetail project={project} />
        </main>
    );
}
