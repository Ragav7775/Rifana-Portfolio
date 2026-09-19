"use client";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { BrandingProject, BRANDING_PROJECTS } from "@/data/BrandingProjectData";
import "./BrandingProjectDetail.css";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export interface BrandingProjectDetailProps {
    project: BrandingProject;
    className?: string;
}

export function BrandingProjectDetail({
    project,
    className = "",
}: BrandingProjectDetailProps) {

    // Responsive device media queries matching project breakpoints
    const { isMobile, isTablet } = useMediaQuery();

    // Find adjacent projects for seamless bottom navigation
    const currentIndex = BRANDING_PROJECTS.findIndex((p) => p.slug === project.slug);
    const prevProject =
        currentIndex > 0 ? BRANDING_PROJECTS[currentIndex - 1] : null;
    const nextProject =
        currentIndex >= 0 && currentIndex < BRANDING_PROJECTS.length - 1
            ? BRANDING_PROJECTS[currentIndex + 1]
            : null;

    const accentColor = project.accentColor || "#0071BD";

    // Resolve all additional branding images dynamically
    const additionalImages: StaticImageData[] =
        project.images && project.images.length > 0
            ? project.images
            : ([
                  project.brandBoardImage,
                  project.logoDiagramImage,
                  project.fullBrandingImage,
              ].filter(Boolean) as StaticImageData[]);

    // Image 0 serves as the primary Brand Board visual in the Hero section
    const heroBoardImage = additionalImages[0] || project.coverImage;
    // Remaining images (index 1 to N) are rendered dynamically as full-width showcase sections
    const showcaseImages = additionalImages.slice(1);

    return (
        <article className={`branding-detail-page ${className}`}>
            <div className="branding-detail-inner">
                {/* =====================================================
                    TOP NAVIGATION / BACK LINK
                    ====================================================== */}
                <nav className="branding-detail-back-nav" aria-label="Breadcrumb">
                    <Link href="/projects/branding" className="branding-detail-back-link">
                        <span className="branding-back-arrow" aria-hidden="true">←</span>
                        <span>Back to Branding Projects</span>
                    </Link>
                </nav>

                {/* =====================================================
                    SECTION 1: BRAND HEADER & OVERVIEW (LEFT) + BRAND BOARD (RIGHT)
                    ====================================================== */}
                <section
                    className="branding-detail-section branding-hero-section"
                    aria-label="Brand Overview and Guidelines Board"
                >
                    <div className="branding-hero-grid">
                        {/* Left Column: Brand Name, Industry, Story & Key Features */}
                        <div className="branding-info-column">
                            <div className="branding-title-block">
                                <h1 className="branding-main-heading">
                                    <span className="branding-heading-label">Brand Name :</span>{" "}
                                    <span className="branding-heading-name">{project.title}</span>
                                </h1>

                                <div className="branding-industry-block">
                                    <span className="branding-industry-meta-label">Industry :</span>{" "}
                                    <span className="branding-industry-meta-value">
                                        {project.industryLine1 || project.industry}
                                        {project.industryLine2 && (
                                            <span className="branding-industry-meta-line2">
                                                {project.industryLine2}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Narrative Paragraph */}
                            <div className="branding-description-block">
                                <p className="branding-description-text">{project.description}</p>
                            </div>

                            {/* Key Features Bullet List */}
                            {project.keyFeatures && project.keyFeatures.length > 0 && (
                                <div className="branding-features-block">
                                    <h2 className="branding-features-heading">Key Features</h2>
                                    <ul className="branding-features-list">
                                        {project.keyFeatures.map((feature, idx) => (
                                            <li key={idx} className="branding-feature-item">
                                                <span className="branding-feature-bullet" aria-hidden="true">
                                                    •
                                                </span>
                                                <span className="branding-feature-text">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Brand Board / Guidelines Visual */}
                        <div className="branding-board-column">
                            <div className="branding-board-card">
                                <Image
                                    src={heroBoardImage}
                                    alt={`${project.title} Brand Identity and Guidelines Board`}
                                    width={1200}
                                    height={900}
                                    priority
                                    className="branding-board-img"
                                    sizes="(max-width: 1024px) 100vw, 55vw"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    SECTION 2: BRANDING SHOWCASE GALLERY (FLEX & WRAP)
                    Renders all remaining branding images in a responsive flex-wrap layout
                    ====================================================== */}
                {showcaseImages.length > 0 && (
                    <section
                        className="branding-detail-section branding-gallery-section"
                        aria-label="Branding Showcase Gallery"
                    >
                        <div className="branding-gallery-flex">
                            {showcaseImages.map((img, idx) => (
                                <div
                                    key={`branding-gallery-${idx}`}
                                    className={`branding-gallery-card ${
                                        idx === 0 ? "branding-gallery-card--featured" : ""
                                    }`}
                                    style={idx === 0 ? { borderColor: accentColor } : undefined}
                                >
                                    <div className="branding-gallery-img-wrap">
                                        <Image
                                            src={img}
                                            alt={`${project.title} Brand Presentation ${idx + 2}`}
                                            width={1600}
                                            height={1000}
                                            loading="lazy"
                                            className="branding-gallery-img"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* =====================================================
                    BOTTOM NAVIGATION / PREV & NEXT PROJECTS
                    ====================================================== */}
                <footer className="branding-detail-footer-nav" aria-label="Project Navigation">
                    <div className="branding-nav-links-row">
                        {prevProject ? (
                            <Link
                                href={`/projects/branding/${prevProject.slug}`}
                                className="branding-nav-btn branding-nav-prev"
                                aria-label={`Previous project: ${prevProject.title}`}
                            >
                                {isMobile || isTablet ? (
                                    <>
                                        <span className="branding-nav-sub">← Prev</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="branding-nav-sub">← Previous Project</span>
                                        <span className="branding-nav-title">{prevProject.title}</span>
                                    </>
                                )}
                            </Link>
                        ) : (
                            <div className="branding-nav-placeholder" aria-hidden="true" />
                        )}

                        <Link href="/projects/branding" className="branding-nav-all-btn">
                            {isMobile ? "View All" : "View All Projects"}
                        </Link>

                        {nextProject ? (
                            <Link
                                href={`/projects/branding/${nextProject.slug}`}
                                className="branding-nav-btn branding-nav-next"
                                aria-label={`Next project: ${nextProject.title}`}
                            >
                                {isMobile || isTablet ? (
                                    <>
                                        <span className="branding-nav-sub">Next →</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="branding-nav-sub">Next Project →</span>
                                        <span className="branding-nav-title">{nextProject.title}</span>
                                    </>
                                )}
                            </Link>
                        ) : (
                            <div className="branding-nav-placeholder" aria-hidden="true" />
                        )}
                    </div>
                </footer>
            </div>
        </article>
    );
}

export default BrandingProjectDetail;
