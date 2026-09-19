"use client";

import React, { ReactNode, useMemo, useCallback } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { useReducedMotion } from "motion/react";
import DragAnimatedSVG, {
    type DragAnimatedSVGConfigBreakpoints,
} from "@/components/ui/drag-animated-svg";
import { ProjectCategory, PROJECT_HEADER_ASSET, CategorySlug } from "@/data/ProjectData";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useNavigate } from "@/hooks/useNavigateHook";
import "./GenericCategoryPage.css";
import PageCornerFrameSVG from "../PageCornerFrameSVG";

export interface GenericCategoryPageProps {
    category: ProjectCategory;
    children?: ReactNode;
    className?: string;
}

/**
 * Predefined custom position and asset mapping for each category header image
 * (All categories except UI/UX, which uses its own dedicated inline title layout).
 */
export interface CategoryHeaderAssetConfig {
    image: StaticImageData;
    alt: string;

    desktop: {
        width: number;
        height: number;
        Imgposition: React.CSSProperties;
        scriptposition: React.CSSProperties;
    };

    tablet: {
        width: number;
        height: number;
        Imgposition: React.CSSProperties;
        scriptposition: React.CSSProperties;
    };

    mobile: {
        width: number;
        height: number;
        Imgposition: React.CSSProperties;
        scriptposition: React.CSSProperties;
    };

    className?: string;
}


export const CATEGORY_HEADER_CONFIG: Record<CategorySlug, CategoryHeaderAssetConfig> = {
    "uiux": {
        image: PROJECT_HEADER_ASSET.UIUXImg,
        alt: "UIUX illustration",

        desktop: {
            width: 80,
            height: 125,
            Imgposition: { position: "relative", top: "0px", left: "0px" },
            scriptposition: { position: "relative", top: "0px", left: "20%" }
        },

        tablet: {
            width: 42,
            height: 65,
            Imgposition: { position: "relative", top: "0px", left: "0px" },
            scriptposition: { position: "relative", top: "0px", left: "25%" }
        },

        mobile: {
            width: 38,
            height: 60,
            Imgposition: { position: "relative", top: "0px", left: "0px" },
            scriptposition: { position: "relative", top: "0px", left: "40%" }
        },

        className: "generic-category-icon-frame--uiux",
    },

    "book-covers": {
        image: PROJECT_HEADER_ASSET.booksAndCoversImg,
        alt: "Books & Covers illustration",

        desktop: {
            width: 117,
            height: 125,
            Imgposition: { position: "absolute", top: "-50px", left: "60%" },
            scriptposition: { position: "relative", top: "0px", left: "85%" }
        },

        tablet: {
            width: 94,
            height: 100,
            Imgposition: { position: "absolute", top: "-50px", left: "65%" },
            scriptposition: { position: "relative", top: "0px", left: "85%" }
        },

        mobile: {
            width: 89,
            height: 95,
            Imgposition: { position: "absolute", top: "0px", left: "60%" },
            scriptposition: { position: "relative", top: "0px", left: "30%" }
        },

        className: "generic-category-icon-frame--book-covers",
    },

    "little-logos": {
        image: PROJECT_HEADER_ASSET.littleLogosImg,
        alt: "Little Logos illustration",

        desktop: {
            width: 135,
            height: 95,
            Imgposition: { position: "absolute", top: "0px", left: "20%" },
            scriptposition: { position: "relative", top: "0px", left: "70%" }
        },

        tablet: {
            width: 130,
            height: 91,
            Imgposition: { position: "absolute", top: "-40%", left: "25%" },
            scriptposition: { position: "relative", top: "0px", left: "75%" }
        },

        mobile: {
            width: 120,
            height: 84,
            Imgposition: { position: "absolute", top: "-35%", left: "45%" },
            scriptposition: { position: "relative", top: "0px", left: "70%" }
        },

        className: "generic-category-icon-frame--little-logos",
    },

    "branding": {
        image: PROJECT_HEADER_ASSET.brandFolioImg,
        alt: "Brand Folio illustration",

        desktop: {
            width: 175,
            height: 138,
            Imgposition: { position: "absolute", top: "-20%", left: "28%" },
            scriptposition: { position: "relative", top: "0px", left: "75%" }
        },

        tablet: {
            width: 135,
            height: 106,
            Imgposition: { position: "absolute", top: "-45%", left: "28%" },
            scriptposition: { position: "relative", top: "0px", left: "70%" }
        },

        mobile: {
            width: 125,
            height: 98,
            Imgposition: { position: "absolute", top: "-30%", left: "58%" },
            scriptposition: { position: "relative", top: "0px", left: "70%" }
        },

        className: "generic-category-icon-frame--branding",
    },

    "poster": {
        image: PROJECT_HEADER_ASSET.posterPalettesImg,
        alt: "Poster Palettes illustration",

        desktop: {
            width: 100,
            height: 130,
            Imgposition: { position: "absolute", top: "-10px", left: "-10px" },
            scriptposition: { position: "relative", top: "10px", left: "70%" }
        },

        tablet: {
            width: 69,
            height: 90,
            Imgposition: { position: "absolute", top: "-10px", left: "-10px" },
            scriptposition: { position: "relative", top: "10px", left: "70%" }
        },

        mobile: {
            width: 69,
            height: 90,
            Imgposition: { position: "absolute", top: "-10px", left: "-10px" },
            scriptposition: { position: "relative", top: "10px", left: "60%" }
        },

        className: "generic-category-icon-frame--poster",
    },

    "social-media": {
        image: PROJECT_HEADER_ASSET.socialMediaChroniclesImg,
        alt: "Social Media Chronicles illustration",

        desktop: {
            width: 130,
            height: 129,
            Imgposition: { position: "absolute", top: "-30%", left: "45%" },
            scriptposition: { position: "relative", top: "0px", left: "85%" }
        },

        tablet: {
            width: 110,
            height: 109,
            Imgposition: { position: "absolute", top: "-65%", left: "45%" },
            scriptposition: { position: "relative", top: "0px", left: "85%" }
        },

        mobile: {
            width: 90,
            height: 89,
            Imgposition: { position: "absolute", top: "-90%", left: "72%" },
            scriptposition: { position: "relative", top: "0px", left: "60%" }
        },

        className: "generic-category-icon-frame--social-media",
    },
};

/**
 * Manually defined explicit properties for the DragAnimatedSVG 
 * at each responsive breakpoint (matching ProjectSection architectural pattern).
 */
export const GENERIC_CATEGORY_SLOGAN_CONFIG: DragAnimatedSVGConfigBreakpoints = {
    desktop: {
        width: 1280,
        height: 150,
        duration: 4,
        dashCount: 120,
        strokeWidth: 4,
        boxSize: 16,
        dashSpeed: 2,
        delay: 0.05,
        viewportPercentage: 30,
        cursorSize: 1,
        cursorPosition: { x: 10, y: 6 },
    },
    tablet: {
        width: 1360,
        height: 180,
        duration: 4,
        dashCount: 62,
        strokeWidth: 6,
        boxSize: 20,
        dashSpeed: 2,
        delay: 0.05,
        viewportPercentage: 30,
        cursorSize: 1.5,
        cursorPosition: { x: 500, y: 100 },
    },
    mobile: {
        width: 950,
        height: 650,
        duration: 3,
        dashCount: 62,
        strokeWidth: 7,
        boxSize: 24,
        dashSpeed: 2,
        delay: 0.05,
        viewportPercentage: 30,
        cursorSize: 2,
        cursorPosition: { x: 990, y: 190 },
    },
};

/**
 * Backward-compatible dimension mapping
 */
export const CATEGORY_SLOGAN_SVG_DIMENSIONS = {
    desktop: { width: GENERIC_CATEGORY_SLOGAN_CONFIG.desktop.width, height: GENERIC_CATEGORY_SLOGAN_CONFIG.desktop.height },
    tablet: { width: GENERIC_CATEGORY_SLOGAN_CONFIG.tablet.width, height: GENERIC_CATEGORY_SLOGAN_CONFIG.tablet.height },
    mobile: { width: GENERIC_CATEGORY_SLOGAN_CONFIG.mobile.width, height: GENERIC_CATEGORY_SLOGAN_CONFIG.mobile.height },
};

export function GenericCategoryPage({
    category,
    children,
    className = "",
}: GenericCategoryPageProps) {
    const shouldReduceMotion = useReducedMotion();
    const { isMobile, isTablet } = useMediaQuery();

    const svgConfig = isMobile
        ? GENERIC_CATEGORY_SLOGAN_CONFIG.mobile
        : isTablet
            ? GENERIC_CATEGORY_SLOGAN_CONFIG.tablet
            : GENERIC_CATEGORY_SLOGAN_CONFIG.desktop;

    /**
     * Compute pixel-perfect coordinates mapping the children slogan
     * to the internal selection rectangle geometry of DragAnimatedSVG
     * (BOX_X = 3.5, BOX_Y = 5.5 for cursor="right")
     */
    const frameStyle = useMemo<React.CSSProperties>(() => {
        const BOX_X = 3.5;
        const BOX_Y = 5.5;
        const right = BOX_X + svgConfig.width;
        const bottom = BOX_Y + svgConfig.height;
        const svgWidth = Math.max(1015, right + 70);
        const svgHeight = Math.max(223, bottom + 70);
        const viewBoxX = -10;
        const viewBoxWidth = svgWidth + 10;

        return {
            position: "absolute",
            left: `${((BOX_X - viewBoxX) / viewBoxWidth) * 100}%`,
            top: `${(BOX_Y / svgHeight) * 100}%`,
            width: `${(svgConfig.width / viewBoxWidth) * 100}%`,
            height: `${(svgConfig.height / svgHeight) * 100}%`,
        };
    }, [svgConfig.width, svgConfig.height]);

    const isUIUX = category.slug === "uiux";
    const isposter = category.slug === "poster";

    // Dynamic header asset and predefined custom position for the category (except UI/UX)
    const headerAsset = CATEGORY_HEADER_CONFIG[category.slug];

    // const currentImagePosition = isMobile
    //     ? headerAsset.position.mobile || headerAsset.position.desktop
    //     : isTablet
    //         ? headerAsset.position.tablet || headerAsset.position.desktop
    //         : headerAsset.position.desktop;
    const CategoryHeaderConfig = isMobile
        ? headerAsset.mobile
        : isTablet
            ? headerAsset.tablet
            : headerAsset.desktop;

    const { navigateTo } = useNavigate();

    const handleBackToProjects = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
                return;
            }
            e.preventDefault();
            navigateTo("projects");
        },
        [navigateTo]
    );

    return (
        <div className={`generic-category-page ${className}`}>
            <PageCornerFrameSVG
                side="right"
                width={isMobile ? 350 : isTablet ? 650 : 950}
                height={isMobile ? 650 : isTablet ? 600 : 800}
                thickness={isMobile ? 48 : isTablet ? 52 : 58}
                color="#B08E2F"
            />
            <div className="generic-category-inner">
                {/* =====================================================
            BACK TO PROJECTS NAVIGATION
            ====================================================== */}
                <nav className="generic-category-nav" aria-label="Projects Navigation">
                    <Link
                        href="/"
                        className="generic-category-back-btn"
                        onClick={handleBackToProjects}
                    >
                        <span className="generic-category-back-arrow">←</span>
                        <span>Back to Projects</span>
                    </Link>
                </nav>

                {/* =====================================================
            CATEGORY HEADER
            ====================================================== */}
                <header className="generic-category-header">
                    {isUIUX ? (
                        <>
                            {/* UI/UX Specific Header Composition */}
                            <div className="generic-category-title-wrap uiux-header-layout">
                                <span className="generic-category-title-main">{category.titlelable1}</span>
                                <div
                                    className="generic-category-header-avatar"
                                    style={CategoryHeaderConfig.Imgposition}
                                >
                                    <Image
                                        src={headerAsset.image}
                                        alt={headerAsset.alt}
                                        width={headerAsset.image.width}
                                        height={headerAsset.image.height}
                                        style={{
                                            width: `${CategoryHeaderConfig.width}px`,
                                            height: `${CategoryHeaderConfig.height}px`,
                                        }}
                                        priority
                                        className="generic-category-avatar-img"
                                    />
                                </div>
                                <span className="generic-category-title-main">{category.titlelable2}</span>
                            </div>
                            <div
                                className="generic-category-header-script"
                                style={CategoryHeaderConfig.scriptposition}
                            >
                                {category.scriptLabel && (
                                    <span className="generic-category-script">{category.scriptLabel}</span>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Standard Editorial Category Header with Dynamic Respective Image and Custom Positioning */
                        <div className="generic-category-title-wrap standard-header-layout">
                            <div
                                className={`generic-category-header-main-row
                                ${isposter && "relative left-16 sm:left-16 lg:left-24"}`}
                            >
                                <h1 className="generic-category-title-main">{category.title}</h1>
                                <div
                                    className="generic-category-standard-header-script"
                                    style={CategoryHeaderConfig.scriptposition}
                                >
                                    {category.scriptLabel && (
                                        <span className="generic-category-script">{category.scriptLabel}</span>
                                    )}
                                </div>
                            </div>

                            <div
                                className={`generic-category-icon-frame ${headerAsset.className || ""}`}
                                style={CategoryHeaderConfig.Imgposition}
                            >
                                <Image
                                    src={headerAsset.image}
                                    alt={headerAsset.alt}
                                    width={headerAsset.image.width}
                                    height={headerAsset.image.height}
                                    style={{
                                        width: `${CategoryHeaderConfig.width}px`,
                                        height: `${CategoryHeaderConfig.height}px`,
                                    }}
                                    priority
                                    className="generic-category-icon-img"
                                />
                            </div>
                        </div>
                    )}
                </header>

                {/* =====================================================
            SLOGAN WITH DRAG ANIMATED SVG DASHED BOX
            (Encapsulated following ProjectSection architectural pattern)
            ====================================================== */}
                <div className="generic-category-slogan-section">
                    <div className="generic-category-slogan-dashed-frame">
                        <DragAnimatedSVG
                            width={svgConfig.width}
                            height={svgConfig.height}
                            duration={shouldReduceMotion ? 0.01 : svgConfig.duration}
                            sides="all"
                            cursor="right"
                            dashCount={svgConfig.dashCount}
                            strokeWidth={svgConfig.strokeWidth}
                            boxSize={svgConfig.boxSize}
                            cursorSize={svgConfig.cursorSize}
                            cursorPosition={svgConfig.cursorPosition}
                            dashSpeed={shouldReduceMotion ? 0 : svgConfig.dashSpeed}
                            dashDirection="reverse"
                            className="generic-category-slogan-drag-svg"
                        >
                            {/* Encapsulated Slogan Content Frame - Positioned inside Selection Box */}
                            <div className="generic-category-slogan-frame" style={frameStyle}>
                                <div className="generic-category-slogan-content">
                                    <p className="generic-category-slogan-text">{category.slogan}</p>
                                </div>
                            </div>
                        </DragAnimatedSVG>
                    </div>
                </div>

                {/* =====================================================
            CATEGORY-SPECIFIC CONTENT SLOT
            (UIUXProjectList for UI/UX, empty for other categories)
            ====================================================== */}
                {children && <div className="generic-category-content-slot">{children}</div>}
            </div>
        </div>
    );
}

export default GenericCategoryPage;
