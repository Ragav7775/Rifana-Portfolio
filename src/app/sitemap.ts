import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
import { UIUX_PROJECTS } from "@/data/UIUXProjectData";
import { BRANDING_PROJECTS } from "@/data/BrandingProjectData";

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = getSiteUrl();
    const currentDate = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 1.0,
        },
        {
            url: `${siteUrl}/projects/uiux`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.85,
        },
        {
            url: `${siteUrl}/projects/branding`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.85,
        },
        {
            url: `${siteUrl}/projects/little-logos`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${siteUrl}/projects/book-covers`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${siteUrl}/projects/poster`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${siteUrl}/projects/social-media`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];

    const uiuxRoutes: MetadataRoute.Sitemap = UIUX_PROJECTS.map((project) => ({
        url: `${siteUrl}/projects/uiux/${project.slug}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    const brandingRoutes: MetadataRoute.Sitemap = BRANDING_PROJECTS.map((project) => ({
        url: `${siteUrl}/projects/branding/${project.slug}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    return [...staticRoutes, ...uiuxRoutes, ...brandingRoutes];
}
