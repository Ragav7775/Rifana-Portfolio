"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UIUXProject } from "@/data/UIUXProjectData";
import { MacbookPro } from "@/components/ui/macbook-pro";
import { Iphone17Pro } from "@/components/ui/iphone-17-pro";
import { Safari } from "@/components/ui/safari-browser";
import { ImagesBadge } from "@/components/ui/images-badge";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DraggableCardContainer,
    DraggableCardBody,
} from "@/components/ui/draggable-card";
import "./UIUXProjectDetail.css";
import PageCornerFrameSVG from "../PageCornerFrameSVG";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/* ============================================================
   MANUAL SIZING DEFINITIONS FOR DRAGGABLE BOX & CARDS
   (Controlled manually in TSX for Desktop, Tablet, Mobile)
   ============================================================ */
export const DRAGGABLE_BOX_SIZES = {
    desktop: { width: 1080, height: 680 },
    tablet: { width: 720, height: 600 },
    mobile: { width: 360, height: 560 },
};

export const SAFARI_CARD_SIZES = {
    desktop: { width: 520, height: 326 },
    tablet: { width: 420, height: 263 },
    mobile: { width: 270, height: 169 },
};

export const IPHONE_CARD_SIZES = {
    desktop: { width: 210, height: 420 },
    tablet: { width: 180, height: 360 },
    mobile: { width: 140, height: 280 },
};

export const SAFARI_CARD_STACK_DISTANCE = {
    desktop: { x: 32, y: 24 },
    tablet: { x: 32, y: 24 },
    mobile: { x: 14, y: 28 },
};

export const IPHONE_CARD_STACK_DISTANCE = {
    desktop: { x: 42, y: 14 },
    tablet: { x: 32, y: 24 },
    mobile: { x: 32, y: 24 },
};

export interface UIUXProjectDetailProps {
    project: UIUXProject;
    className?: string;
}

export function UIUXProjectDetail({
    project,
    className = "",
}: UIUXProjectDetailProps) {
    const isMobileproject = project.platform === "mobile";
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "mobile">("desktop");

    const { isMobile, isTablet } = useMediaQuery();

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            if (w < 768) {
                setDeviceType("mobile");
            } else if (w < 1024) {
                setDeviceType("tablet");
            } else {
                setDeviceType("desktop");
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const currentBoxSize = DRAGGABLE_BOX_SIZES[deviceType];
    const currentSafariSize = SAFARI_CARD_SIZES[deviceType];
    const currentIphoneSize = IPHONE_CARD_SIZES[deviceType];

    const currentCardStackDistance = isMobileproject
        ? IPHONE_CARD_STACK_DISTANCE[deviceType]
        : SAFARI_CARD_STACK_DISTANCE[deviceType];

    const mainPages = project.mainPages || [];

    // Collect array of preview image URLs for ImagesBadge
    const badgeImages = mainPages
        .map((p) => (typeof p.image === "string" ? p.image : p.image.src))
        .slice(0, 3);

    const heroImageSrc = isMobileproject
        ? typeof project.thumbnailImage === "string"
            ? project.thumbnailImage
            : project.thumbnailImage.src
        : typeof project.macbookScreenImage === "string"
            ? project.macbookScreenImage
            : project.macbookScreenImage.src;

    return (
        <article className={`uiux-page ${className}`}>
            <PageCornerFrameSVG
                side="left"
                width={isMobile ? 350 : isTablet ? 650 : 950}
                height={isMobile ? 650 : isTablet ? 600 : 800}
                thickness={isMobile ? 48 : isTablet ? 48 : 48}
                color="#B08E2F"
            />
            <div className="uiux-inner">
                {/* =====================================================
            BACK LINK
            ====================================================== */}
                <div className="uiux-back-nav">
                    <Link href="/projects/uiux" className="uiux-back-link">
                        ← Back to UI/UX Projects
                    </Link>
                </div>

                {/* =====================================================
            HERO SECTION: Title + Intro (Left) & Device Mockup (Right)
            ====================================================== */}
                <div className="uiux-hero-grid">
                    {/* Left: Title, Subtitle & Summary */}
                    <div className="uiux-intro">
                        <div className="uiux-title-group">
                            <h1 className="uiux-main-title">
                                {project.lable1}
                                {project.name.split(" ").length > 1 && (
                                    <span className="uiux-script-title">
                                        {project.lable2}
                                    </span>
                                )}
                            </h1>
                            <p className="uiux-subtitle">{project.subtitle}</p>
                        </div>

                        <div className="uiux-summary-block">
                            <p className="uiux-summary-text">
                                <strong className="uiux-highlight">{project.name}</strong>{" "}
                                {project.summary.replace(
                                    new RegExp(`^${project.name}\\s*`, "i"),
                                    ""
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Right: Conditional Mockup (MacBook for Web / iPhone 17 Pro for Mobile) */}
                    <div
                        className={`uiux-device-wrap ${isMobileproject
                            ? "uiux-device-wrap--mobile"
                            : "uiux-device-wrap--web"
                            }`}
                    >
                        {isMobileproject ? (
                            <div className="uiux-iphone-frame">
                                <Iphone17Pro
                                    src={heroImageSrc}
                                    width={230}
                                    height={460}
                                    className="uiux-iphone-svg"
                                />
                            </div>
                        ) : (
                            <div className="uiux-macbook-frame">
                                <MacbookPro
                                    src={heroImageSrc}
                                    width={650}
                                    height={400}
                                    className="uiux-macbook-svg"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* =====================================================
            KEY FEATURES SECTION + ACTIONS ROW (LIVE LINK + IMAGE BADGE)
            ====================================================== */}
                <section
                    className="uiux-features-section"
                    aria-label="Key Features"
                >
                    <h2 className="uiux-features-heading">Key Features :</h2>

                    <ul className="uiux-features-list">
                        {project.keyFeatures.map((feature, idx) => (
                            <li key={idx} className="uiux-feature-item">
                                <span className="uiux-feature-bullet">•</span>
                                <span className="uiux-feature-text">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Actions Row: Live Project Link + Image-Badge Trigger placed side by side */}
                    <div className="uiux-actions-row">
                        {project.liveLink && (
                            <div className="uiux-live-link-wrap">
                                <a
                                    href={project.liveLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="uiux-live-link-btn"
                                >
                                    View Live Project ↗
                                </a>
                            </div>
                        )}

                        {/* Image-Badge Alone as Dialog Trigger (No Headers, No Card Outline) */}
                        {mainPages.length > 0 && (
                            <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        className="uiux-badge-alone-trigger"
                                        aria-label="Open Interactive Mockup Gallery"
                                    >
                                        <ImagesBadge
                                            text="View Gallery"
                                            textClassName="uiux-badge-alone-trigger-text"
                                            images={badgeImages}
                                            folderSize={{ width: 44, height: 32 }}
                                            // teaserImageSize={{ width: 28, height: 20 }}
                                            // hoverImageSize={{ width: 64, height: 44 }}
                                            // hoverSpread={26}
                                            // hoverTranslateY={-42}
                                            teaserImageSize={{ width: 40, height: 28 }}
                                            hoverImageSize={{ width: 140, height: 108 }}
                                            hoverTranslateY={-110}
                                            hoverSpread={50}
                                        />
                                        {/* <span className="uiux-badge-alone-trigger-text">Image Gallery</span> */}
                                    </button>
                                </DialogTrigger>

                                {/* Draggable Gallery Dialog with Manually Controlled Width & Height */}
                                <DialogContent
                                    showCloseButton
                                    className="uiux-dialog-content"
                                    style={{
                                        width: `min(${currentBoxSize.width}px, 94vw)`,
                                        height: `min(${currentBoxSize.height}px, 88vh)`,
                                    }}
                                >
                                    <DialogTitle className="sr-only">
                                        Draggable Mockup Gallery
                                    </DialogTitle>
                                    <DialogDescription className="sr-only">
                                        Interactive gallery of draggable project mockups
                                    </DialogDescription>

                                    {/* Draggable Mockups Canvas */}
                                    <div className="uiux-canvas-wrap">
                                        <DraggableCardContainer className="uiux-draggable-container">
                                            {mainPages.map((page, idx) => {
                                                const imgSrc =
                                                    typeof page.image === "string"
                                                        ? page.image
                                                        : page.image.src;

                                                return (
                                                    <DraggableCardBody
                                                        key={page.id || idx}
                                                        index={idx}
                                                        id={page.id || `card-${idx}`}
                                                        totalCards={mainPages.length}
                                                        className="uiux-draggable-body"
                                                        initial_distance={currentCardStackDistance}
                                                    >
                                                        {isMobileproject ? (
                                                            /* Mobile Mockup with Manual Dimension Control */
                                                            <div className="uiux-iphone-card">
                                                                <Iphone17Pro
                                                                    src={imgSrc}
                                                                    width={currentIphoneSize.width}
                                                                    height={currentIphoneSize.height}
                                                                    className="uiux-iphone-svg"
                                                                />
                                                            </div>
                                                        ) : (
                                                            /* Web Mockup with Manual Dimension Control */
                                                            <div className="uiux-safari-card">
                                                                <Safari
                                                                    src={imgSrc}
                                                                    url={project.liveLink}
                                                                    width={currentSafariSize.width}
                                                                    height={currentSafariSize.height}
                                                                    className="uiux-safari-svg"
                                                                />
                                                            </div>
                                                        )}
                                                    </DraggableCardBody>
                                                );
                                            })}
                                        </DraggableCardContainer>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </section>
            </div>
        </article>
    );
}

export default UIUXProjectDetail;
