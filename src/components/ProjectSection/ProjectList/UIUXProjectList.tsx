"use client";

import Link from "next/link";
import Image from "next/image";
import { UIUXProject } from "@/data/UIUXProjectData";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import "./UIUXProjectList.css";

export interface UIUXProjectListProps {
    projects: UIUXProject[];
    className?: string;
}

export function UIUXProjectList({ projects, className = "" }: UIUXProjectListProps) {
    if (!projects || projects.length === 0) {
        return null;
    }

    // Filter projects into Web Applications and Mobile Applications
    const webProjects = projects.filter((p) => p.platform !== "mobile");
    const mobileProjects = projects.filter((p) => p.platform === "mobile");

    const renderProjectCard = (project: UIUXProject) => {
        const isMobile = project.platform === "mobile";

        return (
            <article
                key={project.id}
                className={`uiux-project-card ${isMobile ? "uiux-project-card--mobile" : "uiux-project-card--web"}`}
            >
                {/* Left: 3D Card Interactive Preview Wrap */}
                <div className="uiux-project-preview-wrap">
                    <CardContainer
                        containerClassName="w-full py-0 block"
                        className="w-full h-auto"
                    >
                        <CardBody className="uiux-3d-card-body relative w-full h-auto transform-3d">
                            {/* Layer 1: SVG Linear-Gradient Backdrop Shape (Permanently Layered Behind with lower translateZ & z-index: 1) */}
                            <CardItem
                                translateZ={15}
                                className="uiux-project-backdrop-shape"
                                aria-hidden="true"
                            >
                                {isMobile ? (
                                    <svg
                                        viewBox="0 0 320 644"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="uiux-project-backdrop-svg uiux-project-backdrop-svg--mobile"
                                        preserveAspectRatio="none"
                                    >
                                        <path
                                            d="M319.238 633.833C319.238 639.355 314.761 643.833 309.238 643.833H10.0121C2.678 643.833 -2.16109 636.199 0.967876 629.566L162.884 286.316L300.256 5.61897C304.915 -3.90063 319.238 -0.583713 319.238 10.0148V633.833Z"
                                            fill={`url(#paint0_linear_mobile_${project.id})`}
                                        />
                                        <defs>
                                            <linearGradient
                                                id={`paint0_linear_mobile_${project.id}`}
                                                x1="127.422"
                                                y1="21.6754"
                                                x2="-321.428"
                                                y2="-150.443"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop stopColor="#07553D" />
                                                <stop offset="0.2501" stopColor="#037552" />
                                                <stop offset="0.5" stopColor="#02B37C" />
                                                <stop offset="0.750385" stopColor="#00DD61" stopOpacity="0.81" />
                                                <stop offset="1" stopColor="#00DD61" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                ) : (
                                    <svg
                                        viewBox="0 0 750 467"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="uiux-project-backdrop-svg uiux-project-backdrop-svg--desktop"
                                        preserveAspectRatio="none"
                                    >
                                        <path
                                            d="M749.066 456.343C749.066 461.866 744.589 466.343 739.066 466.343H10.0177C-0.0358276 466.343 -3.80365 453.174 4.72845 447.856L376.702 216.028L733.917 1.44333C740.582 -2.56055 749.066 2.24023 749.066 10.0155V456.343Z"
                                            fill={`url(#paint0_linear_desktop_${project.id})`}
                                        />
                                        <defs>
                                            <linearGradient
                                                id={`paint0_linear_desktop_${project.id}`}
                                                x1="292.248"
                                                y1="30.7409"
                                                x2="-161.654"
                                                y2="-561.306"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop stopColor="#07553D" />
                                                <stop offset="0.2501" stopColor="#037552" />
                                                <stop offset="0.5" stopColor="#02B37C" />
                                                <stop offset="0.750385" stopColor="#00DD61" stopOpacity="0.81" />
                                                <stop offset="1" stopColor="#00DD61" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                )}
                            </CardItem>

                            {/* Layer 2: Main Thumbnail Preview Frame with higher 3D Depth Elevation (translateZ: 50 & z-index: 10) */}
                            <CardItem
                                translateZ={50}
                                className="uiux-project-preview-frame"
                                as={Link}
                                href={`/projects/uiux/${project.slug}`}
                                aria-label={`View ${project.name} project details`}
                            >
                                <Image
                                    src={project.thumbnailImage}
                                    alt={`${project.name} UI preview`}
                                    width={isMobile ? 260 : 460}
                                    height={isMobile ? 540 : 260}
                                    loading="lazy"
                                    className="uiux-project-preview-img"
                                />
                            </CardItem>
                        </CardBody>
                    </CardContainer>
                </div>

                {/* Right: Project Title, Description & Action Link */}
                <div className="uiux-project-info">
                    <h3 className="uiux-project-title">
                        <Link href={`/projects/uiux/${project.slug}`}>
                            {project.name.toUpperCase()}
                        </Link>
                    </h3>

                    <div className="uiux-project-desc-group">
                        <h4 className="uiux-project-desc-heading">Description:</h4>
                        <p className="uiux-project-desc-text">
                            {project.description}
                        </p>
                    </div>

                    <div className="uiux-project-action">
                        <Link
                            href={`/projects/uiux/${project.slug}`}
                            className="uiux-view-details-link"
                        >
                            → View Details
                        </Link>
                    </div>
                </div>
            </article>
        );
    };

    return (
        <div className={`uiux-project-list ${className}`}>
            {/* =====================================================
          SECTION 1: WEB APPLICATIONS
          ====================================================== */}
            {webProjects.length > 0 && (
                <section
                    className="uiux-app-section uiux-web-section"
                    aria-labelledby="heading-web-applications"
                >
                    <header className="uiux-section-header">
                        <div className="uiux-section-title-row">
                            <h2 id="heading-web-applications" className="uiux-section-title">
                                Web <span className="uiux-section-script">Applications</span>
                            </h2>
                        </div>
                        <p className="uiux-section-subtitle">
                            Responsive web platforms, interactive streaming layouts, and SaaS experiences.
                        </p>
                    </header>

                    <div className="uiux-section-cards-grid">
                        {webProjects.map(renderProjectCard)}
                    </div>
                </section>
            )}

            {/* Visual Section Divider */}
            {webProjects.length > 0 && mobileProjects.length > 0 && (
                <div className="uiux-sections-divider" aria-hidden="true">
                    <div className="uiux-divider-line" />
                    <div className="uiux-divider-accent-dots">
                        <span className="uiux-divider-dot" />
                        <span className="uiux-divider-dot" />
                        <span className="uiux-divider-dot" />
                    </div>
                    <div className="uiux-divider-line" />
                </div>
            )}

            {/* =====================================================
          SECTION 2: MOBILE APPLICATIONS
          ====================================================== */}
            {mobileProjects.length > 0 && (
                <section
                    className="uiux-app-section uiux-mobile-section"
                    aria-labelledby="heading-mobile-applications"
                >
                    <header className="uiux-section-header">
                        <div className="uiux-section-title-row">
                            <h2 id="heading-mobile-applications" className="uiux-section-title">
                                Mobile <span className="uiux-section-script">Applications</span>
                            </h2>
                        </div>
                        <p className="uiux-section-subtitle">
                            Touch-optimized iOS & Android app designs, gesture workflows, and mobile design systems.
                        </p>
                    </header>

                    <div className="uiux-section-cards-grid">
                        {mobileProjects.map(renderProjectCard)}
                    </div>
                </section>
            )}
        </div>
    );
}

export default UIUXProjectList;
