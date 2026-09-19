"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import DragAnimatedSVG, {
    type DragAnimatedSVGConfigBreakpoints,
} from "@/components/ui/drag-animated-svg";
import {
    PROJECT_CATEGORIES,
    PROJECT_GRID_DECORATIONS,
    ProjectCategory,
    CategorySlug,
} from "@/data/ProjectData";
import RifanaCheckingImg from "@/assets/Avatars/Projects-Checking-Rifana-image.png";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import "./ProjectSection.css";

export interface ProjectSectionProps {
    className?: string;
}


/**
 * Manually defined explicit properties for the DragAnimatedSVG 
 * at each responsive breakpoint.
 */
export const PROJECT_SECTION_CONFIG: DragAnimatedSVGConfigBreakpoints = {
    desktop: {
        width: 1120,
        height: 580,
        duration: 3,
        dashCount: 132,
        strokeWidth: 3,
        boxSize: 12,
        dashSpeed: 3,
        delay: 0.05,
        viewportPercentage: 45,
        cursorSize: 1,
        cursorPosition: { x: -15, y: 5 }
    },
    tablet: {
        width: 940,
        height: 940,
        duration: 4,
        dashCount: 82,
        strokeWidth: 5,
        boxSize: 15,
        dashSpeed: 3,
        delay: 0.05,
        viewportPercentage: 40,
        cursorSize: 1.5,
        cursorPosition: { x: -12, y: 92 }
    },
    mobile: {
        width: 1120,
        height: 3260,
        duration: 5,
        dashCount: 112,
        strokeWidth: 8,
        boxSize: 30,
        dashSpeed: 3,
        delay: 0.05,
        viewportPercentage: 40,
        cursorSize: 2.5,
        cursorPosition: { x: -15, y: 275 }
    },
};

/**
 * Predefined responsive script position configuration per category,
 * exactly matching the structure used in GenericCategoryPage.
 */
export interface CategoryScriptPositionConfig {
    desktop: {
        scriptposition: React.CSSProperties;
    };
    tablet: {
        scriptposition: React.CSSProperties;
    };
    mobile: {
        scriptposition: React.CSSProperties;
    };
}

export const PROJECT_CATEGORY_SCRIPT_CONFIG: Record<CategorySlug, CategoryScriptPositionConfig> = {
    "uiux": {
        desktop: {
            scriptposition: { position: "absolute", top: "70%", right: "14%" },
        },
        tablet: {
            scriptposition: { position: "absolute", top: "72%", right: "25%" },
        },
        mobile: {
            scriptposition: { position: "absolute", top: "75%", right: "30%" },
        },
    },
    "book-covers": {
        desktop: {
            scriptposition: { position: "absolute", top: "70%", right: "5%" },
        },
        tablet: {
            scriptposition: { position: "absolute", top: "72%", right: "5%" },
        },
        mobile: {
            scriptposition: { position: "absolute", top: "75%", right: "8%" },
        },
    },
    "little-logos": {
        desktop: {
            scriptposition: { position: "absolute", top: "70%", right: "22%" },
        },
        tablet: {
            scriptposition: { position: "absolute", top: "72%", right: "32%" },
        },
        mobile: {
            scriptposition: { position: "absolute", top: "75%", right: "37%" },
        },
    },
    "branding": {
        desktop: {
            scriptposition: { position: "absolute", top: "70%", right: "20%" },
        },
        tablet: {
            scriptposition: { position: "absolute", top: "72%", right: "30%" },
        },
        mobile: {
            scriptposition: { position: "absolute", top: "75%", right: "35%" },
        },
    },
    "poster": {
        desktop: {
            scriptposition: { position: "absolute", top: "70%", right: "15%" },
        },
        tablet: {
            scriptposition: { position: "absolute", top: "72%", right: "25%" },
        },
        mobile: {
            scriptposition: { position: "absolute", top: "75%", right: "30%" },
        },
    },
    "social-media": {
        desktop: {
            scriptposition: { position: "absolute", top: "70%", right: "5%" },
        },
        tablet: {
            scriptposition: { position: "absolute", top: "72%", right: "5%" },
        },
        mobile: {
            scriptposition: { position: "absolute", top: "75%", right: "8%" },
        },
    },
};

/**
 * Reusable helper component to render the golden divider dot.
 */
function GoldenDot() {
    return (
        <Image
            src={PROJECT_GRID_DECORATIONS.goldenDot}
            alt="Divider dot"
            width={10}
            height={10}
            className="divider-dot-img"
        />
    );
}

/**
 * Props for individual category card
 */
interface CategoryCardProps {
    category: ProjectCategory;
    index: number;
    isMobile?: boolean;
    isTablet?: boolean;
}

/**
 * Clean, accessible, typed category card component
 */
function CategoryCard({ category, index, isMobile, isTablet }: CategoryCardProps) {
    const fallbackMediaQuery = useMediaQuery();
    const activeIsMobile = typeof isMobile === "boolean" ? isMobile : fallbackMediaQuery.isMobile;
    const activeIsTablet = typeof isTablet === "boolean" ? isTablet : fallbackMediaQuery.isTablet;

    const categoryScriptConfig = PROJECT_CATEGORY_SCRIPT_CONFIG[category.slug];
    const scriptPosition = activeIsMobile
        ? categoryScriptConfig?.mobile?.scriptposition
        : activeIsTablet
            ? categoryScriptConfig?.tablet?.scriptposition
            : categoryScriptConfig?.desktop?.scriptposition;

    return (
        <Link
            href={category.route}
            className={`project-cat-card project-cat-${category.slug} cell-idx-${index}`}
            aria-label={`${category.number} ${category.title} ${category.scriptLabel || ""}`}
        >
            <div className="project-cat-leaf-group">
                {category.leafImage && (
                    <div className="project-cat-leaf-frame" aria-hidden="true">
                        <Image
                            src={category.leafImage}
                            alt="Botanical leaf line art"
                            width={50}
                            height={80}
                            className="project-cat-leaf-img"
                        />
                    </div>
                )}
            </div>
            <div className="project-cat-top-bottom-row">
                {/* Top Row: Leaf + Number + Category Icon */}
                <div className="project-cat-top-row">
                    <span className="project-cat-number">{category.number}</span>

                    {/* Floating Category Illustration (Grayscale default -> Color on hover) */}
                    <div className={`project-cat-icon-frame icon-${category.slug}`}>
                        <Image
                            src={category.iconImage}
                            alt={`${category.title} icon illustration`}
                            width={75}
                            height={75}
                            className="project-cat-icon-img"
                        />
                    </div>
                </div>

                {/* Bottom Row: Category Title + Script Label + Forward Arrow */}
                <div className="project-cat-bottom-row">
                    <h3 className="project-cat-title">{category.title}</h3>

                    {category.scriptLabel && (
                        <div
                            className="project-cat-script-wrap"
                            style={scriptPosition}
                        >
                            <span className={`project-cat-script script-${category.slug}`}>
                                {category.scriptLabel}
                            </span>

                            <span className="project-cat-arrow" aria-hidden="true">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="project-cat-arrow-svg"
                                >
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

export function ProjectSection({ className = "" }: ProjectSectionProps) {
    const shouldReduceMotion = useReducedMotion();
    const { isMobile, isTablet } = useMediaQuery();

    const svgConfig = isMobile
        ? PROJECT_SECTION_CONFIG.mobile
        : isTablet
            ? PROJECT_SECTION_CONFIG.tablet
            : PROJECT_SECTION_CONFIG.desktop;

    /**
     * Compute pixel-perfect coordinates mapping the children grid
     * to the internal selection rectangle geometry of DragAnimatedSVG
     * (BOX_X = 47.5005, BOX_Y = 5.5 for cursor="left")
     */
    const frameStyle = useMemo<React.CSSProperties>(() => {
        const BOX_X = 47.5005;
        const BOX_Y = 5.5;
        const right = BOX_X + svgConfig.width;
        const bottom = BOX_Y + svgConfig.height;
        const svgWidth = Math.max(1007, right + 4);
        const svgHeight = Math.max(220, bottom + 48);

        return {
            position: "absolute",
            left: `${(BOX_X / svgWidth) * 100}%`,
            top: `${(BOX_Y / svgHeight) * 100}%`,
            width: `${(svgConfig.width / svgWidth) * 100}%`,
            height: `${(svgConfig.height / svgHeight) * 100}%`,
        };
    }, [svgConfig.width, svgConfig.height]);

    return (
        <section
            id="projects"
            className={`projects-section ${className}`}
            aria-label="Projects and Works"
        >
            <div className="projects-inner">
                {/* =====================================================
                    HEADER COMPOSITION: PROJECTS + Things That [Rifana] 've Made...
                    ====================================================== */}
                <header className="projects-header">
                    <h2 className="projects-title-main">PROJECTS</h2>

                    <div className="projects-title-sub-wrap">
                        <span className="projects-title-script">Things That</span>
                        <div className="projects-header-character">
                            <Image
                                src={RifanaCheckingImg}
                                alt="Rifana checking project records on tablet"
                                width={60}
                                height={80}
                                priority
                                className="projects-header-char-img"
                            />
                            <span className="projects-title-script">&apos;ve</span>
                        </div>
                        <span className="projects-title-script">Made...</span>
                    </div>
                </header>

                {/* =====================================================
                    MAIN CATEGORIES CONTAINER: ENCAPSULATED IN DRAG ANIMATED SVG
                    The entire grid layout is passed as children to DragAnimatedSVG.
                    The SVG luminance mask unmasks the grid content in real time
                    as the selection frame expands!
                    ====================================================== */}
                <div className="projects-dashed-container">
                    <DragAnimatedSVG
                        width={svgConfig.width}
                        height={svgConfig.height}
                        duration={shouldReduceMotion ? 0.01 : svgConfig.duration}
                        sides="all"
                        cursor="left"
                        dashCount={svgConfig.dashCount}
                        strokeWidth={svgConfig.strokeWidth}
                        boxSize={svgConfig.boxSize}
                        cursorSize={svgConfig.cursorSize}
                        cursorPosition={svgConfig.cursorPosition}
                        dashSpeed={shouldReduceMotion ? 0 : svgConfig.dashSpeed}
                        dashDirection="reverse"
                        delay={svgConfig.delay}
                        viewportPercentage={svgConfig.viewportPercentage}
                        className="projects-drag-svg"
                    >
                        {/* Encapsulated Grid Content Frame - Positioned inside Selection Box */}
                        <div className="projects-grid-frame" style={frameStyle}>
                            <div className="projects-categories-grid">
                                {PROJECT_CATEGORIES.map((cat: ProjectCategory, index: number) => (
                                    <React.Fragment key={cat.slug}>
                                        <CategoryCard
                                            category={cat}
                                            index={index}
                                            isMobile={isMobile}
                                            isTablet={isTablet}
                                        />

                                        {/* Desktop Horizontal Golden Divider between Row 1 and Row 2 */}
                                        {index === 2 && (
                                            <div className="project-grid-row-divider desktop-only" aria-hidden="true">
                                                <div className="divider-col-segment">
                                                    <div className="divider-line" />
                                                    {Array.from({ length: 3 }, (_, i) => <GoldenDot key={i} />)}
                                                    <div className="divider-line" />
                                                </div>
                                                <div className="divider-intersection-dot">
                                                    {Array.from({ length: 2 }, (_, i) => <GoldenDot key={i} />)}
                                                </div>
                                                <div className="divider-col-segment">
                                                    <div className="divider-line" />
                                                    {Array.from({ length: 3 }, (_, i) => <GoldenDot key={i} />)}
                                                    <div className="divider-line" />
                                                </div>
                                                <div className="divider-intersection-dot">
                                                    {Array.from({ length: 2 }, (_, i) => <GoldenDot key={i} />)}
                                                </div>
                                                <div className="divider-col-segment">
                                                    <div className="divider-line" />
                                                    {Array.from({ length: 3 }, (_, i) => <GoldenDot key={i} />)}
                                                    <div className="divider-line" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Tablet: divider after 02 and 04 */}
                                        {(index === 1 || index === 3) && (
                                            <div
                                                className="project-grid-row-divider project-grid-divider-tablet"
                                                aria-hidden="true"
                                            >
                                                <div className="divider-col-segment">
                                                    <div className="divider-line" />
                                                    {Array.from({ length: 3 }, (_, i) => <GoldenDot key={i} />)}
                                                    <div className="divider-line" />
                                                </div>

                                                <div className="divider-intersection-dot">
                                                    {Array.from({ length: 2 }, (_, i) => <GoldenDot key={i} />)}
                                                </div>

                                                <div className="divider-col-segment">
                                                    <div className="divider-line" />
                                                    {Array.from({ length: 3 }, (_, i) => <GoldenDot key={i} />)}
                                                    <div className="divider-line" />
                                                </div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </DragAnimatedSVG>
                </div>
            </div>
        </section>
    );
}

export default ProjectSection;
