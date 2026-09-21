"use client";

import React, { useMemo, useId, useState } from "react";
import { motion, type Transition } from "motion/react";
import ExpandableCard, {
    type ExpandableCardItem,
    type ExpandableCardConfig,
    type ExpandableBoxResponsiveConfig,
    SMOOTH_EXPAND_TRANSITION,
    getSharedLayoutId,
    getCardIdentifier,
} from "@/components/ui/expandable-card";
import {
    PosterProject,
    PosterAspectRatio,
    PosterSubCategory,
    POSTER_PROJECTS,
    POSTER_SUBCATEGORIES,
    detectImageAspectRatio,
    ImageFitBehavior,
} from "@/data/PosterProjectData";
import "./PosterProjectList.css";

/* ============================================================
   CANONICAL DISPLAY SEQUENCE
   Sequence:
   1. Creative Posters ("poster-edits")
   2. Standee Designs  ("standee-works")
   3. Billboard & Banners ("billboard-canvas")
   ============================================================ */

export const POSTER_SUBCATEGORY_ORDER: readonly PosterSubCategory[] = [
    "poster-edits",
    "standee-works",
    "billboard-canvas",
] as const;

/* ============================================================
   ASPECT RATIO RESOLVER WITH DYNAMIC DETECTION
   Supports:
   - Presets: 1:1, 4:3, 16:9, 3:2, 2:3, 9:16, 1:2, 1:2.4, 3:1, 4:1
   - Dynamic automatic image detection ("auto" or unassigned)
   - Fallback mechanisms for non-standard ratios and missing metadata
   - Orientation conflict resolution with fit mode (contain vs cover)
   ============================================================ */

export function resolvePosterAspectRatio(
    project: PosterProject,
    runtimeDimensions?: { width: number; height: number } | null
): {
    cssRatio: string;
    aspectClass: string;
    objectFit: ImageFitBehavior;
    hasOrientationConflict: boolean;
} {
    const specified = project.aspectRatio;

    // 1. If a fixed non-auto aspect ratio is explicitly specified:
    if (specified && specified !== "auto") {
        let aspectClass = "poster-aspect-standard";
        let cssRatio = "2 / 3";

        switch (specified) {
            case "1:1":
                aspectClass = "poster-aspect-1-1";
                cssRatio = "1 / 1";
                break;
            case "4:3":
                aspectClass = "poster-aspect-4-3";
                cssRatio = "4 / 3";
                break;
            case "16:9":
                aspectClass = "poster-aspect-16-9";
                cssRatio = "16 / 9";
                break;
            case "3:2":
                aspectClass = "poster-aspect-3-2";
                cssRatio = "3 / 2";
                break;
            case "2:3":
                aspectClass = "poster-aspect-2-3";
                cssRatio = "2 / 3";
                break;
            case "9:16":
                aspectClass = "poster-aspect-9-16";
                cssRatio = "9 / 16";
                break;
            case "1:2":
                aspectClass = "poster-aspect-standee-1-2";
                cssRatio = "1 / 2";
                break;
            case "1:2.4":
                aspectClass = "poster-aspect-standee-1-2-4";
                cssRatio = "1 / 2.4";
                break;
            case "3:1":
                aspectClass = "poster-aspect-billboard-3-1";
                cssRatio = "3 / 1";
                break;
            case "4:1":
                aspectClass = "poster-aspect-billboard-4-1";
                cssRatio = "4 / 1";
                break;
            default:
                aspectClass = "poster-aspect-dynamic";
                cssRatio = specified.includes(":")
                    ? specified.replace(":", " / ")
                    : specified;
                break;
        }

        const objectFit = project.fit || "cover";
        return {
            cssRatio,
            aspectClass,
            objectFit,
            hasOrientationConflict: false,
        };
    }

    // 2. Automatic Aspect Ratio Detection:
    // First, evaluate statically bundled image metadata, or runtime-measured dimensions
    const sourceImage = runtimeDimensions || project.coverImage;
    const detected = detectImageAspectRatio(sourceImage, project.subCategory);

    let aspectClass = "poster-aspect-dynamic";
    if (detected.matchedPreset) {
        switch (detected.matchedPreset) {
            case "1:1":
                aspectClass = "poster-aspect-1-1";
                break;
            case "4:3":
                aspectClass = "poster-aspect-4-3";
                break;
            case "16:9":
                aspectClass = "poster-aspect-16-9";
                break;
            case "3:2":
                aspectClass = "poster-aspect-3-2";
                break;
            case "2:3":
                aspectClass = "poster-aspect-2-3";
                break;
            case "9:16":
                aspectClass = "poster-aspect-9-16";
                break;
            case "1:2":
                aspectClass = "poster-aspect-standee-1-2";
                break;
            case "1:2.4":
                aspectClass = "poster-aspect-standee-1-2-4";
                break;
            case "3:1":
                aspectClass = "poster-aspect-billboard-3-1";
                break;
            case "4:1":
                aspectClass = "poster-aspect-billboard-4-1";
                break;
            default:
                aspectClass = "poster-aspect-dynamic";
                break;
        }
    }

    // Fit behavior:
    // If explicitly specified by author, honor it; otherwise use recommended fit from detector
    const objectFit = project.fit || detected.recommendedFit;

    return {
        cssRatio: detected.cssRatio,
        aspectClass,
        objectFit,
        hasOrientationConflict: detected.hasOrientationConflict,
    };
}

// Backward-compatible helper aliases
export function getPosterAspectRatioClass(
    ratio?: PosterAspectRatio,
    subCategory?: string
): string {
    const dummyProject = {
        id: "",
        slug: "",
        title: "",
        metaLabel: "",
        metaValue: "",
        description: "",
        coverImage: "",
        category: "poster",
        subCategory: (subCategory as PosterSubCategory) || "poster-edits",
        aspectRatio: ratio,
    };
    return resolvePosterAspectRatio(dummyProject).aspectClass;
}

export function getPosterAspectRatioValue(
    ratio?: PosterAspectRatio,
    subCategory?: string
): string {
    const dummyProject = {
        id: "",
        slug: "",
        title: "",
        metaLabel: "",
        metaValue: "",
        description: "",
        coverImage: "",
        category: "poster",
        subCategory: (subCategory as PosterSubCategory) || "poster-edits",
        aspectRatio: ratio,
    };
    return resolvePosterAspectRatio(dummyProject).cssRatio;
}

/* ============================================================
   EXPANDABLE BOX CONFIGURATIONS PER SUB-CATEGORY
   ============================================================ */

export const POSTER_EDITS_EXPANDABLE_BOX_CONFIG: ExpandableBoxResponsiveConfig = {
    desktop: {
        width: 680,
        height: 480,
        maxWidth: "92vw",
        maxHeight: "88vh",
        top: "50%",
        left: "50%",
        borderRadius: "20px",
        duration: 0.44,
        easing: [0.4, 0, 0.2, 1],
        scale: 1,
    },
    tablet: {
        width: 640,
        height: 480,
        maxWidth: "94vw",
        maxHeight: "88vh",
        top: "50%",
        left: "50%",
        borderRadius: "18px",
        duration: 0.44,
        easing: [0.4, 0, 0.2, 1],
        scale: 1,
    },
    mobile: {
        width: 300,
        height: 650,
        imageWidth: "80%",
        maxWidth: "420px",
        maxHeight: "88vh",
        top: "10%",
        left: "50%",
        borderRadius: "16px",
        duration: 0.44,
        easing: [0.4, 0, 0.2, 1],
        scale: 1,
    },
};

export const STANDEE_EXPANDABLE_BOX_CONFIG: ExpandableBoxResponsiveConfig = {
    desktop: {
        width: 540,
        height: 720,
        maxWidth: "92vw",
        maxHeight: "90vh",
        top: "50%",
        left: "50%",
        borderRadius: "20px",
        duration: 0.44,
        easing: [0.4, 0, 0.2, 1],
        scale: 1,
    },
    tablet: {
        width: 480,
        height: 680,
        maxWidth: "94vw",
        maxHeight: "90vh",
        top: "50%",
        left: "50%",
        borderRadius: "18px",
        duration: 0.44,
        easing: [0.4, 0, 0.2, 1],
        scale: 1,
    },
    mobile: {
        width: 310,
        height: 650,
        imageWidth: "85%",
        maxWidth: "420px",
        maxHeight: "90vh",
        top: "10%",
        left: "50%",
        borderRadius: "16px",
        duration: 0.44,
        easing: [0.4, 0, 0.2, 1],
        scale: 1,
    },
};

export const BILLBOARD_EXPANDABLE_BOX_CONFIG: ExpandableBoxResponsiveConfig = {
    desktop: {
        width: 820,
        height: 520,
        maxWidth: "94vw",
        maxHeight: "88vh",
        top: "50%",
        left: "50%",
        borderRadius: "20px",
        duration: 0.44,
        easing: [0.4, 0, 0.2, 1],
        scale: 1,
    },
    tablet: {
        width: 680,
        height: 460,
        maxWidth: "94vw",
        maxHeight: "88vh",
        top: "50%",
        left: "50%",
        borderRadius: "18px",
        duration: 0.44,
        easing: [0.4, 0, 0.2, 1],
        scale: 1,
    },
    mobile: {
        width: 320,
        height: 540,
        imageWidth: "92%",
        maxWidth: "420px",
        maxHeight: "88vh",
        top: "10%",
        left: "50%",
        borderRadius: "16px",
        duration: 0.44,
        easing: [0.4, 0, 0.2, 1],
        scale: 1,
    },
};

/* ============================================================
   INDIVIDUAL POSTER CARD ITEM WITH DYNAMIC DETECTION
   ============================================================ */

interface PosterCardItemProps {
    card: ExpandableCardItem;
    project: PosterProject;
    trackIndex: number;
    scopeId: string;
    layoutId?: string;
    effectiveTransition: Transition;
    openCard: (card: ExpandableCardItem, trackIndex: number) => void;
    getLayoutId?: (prefix: string, card: ExpandableCardItem, trackIndex: number) => string;
    modifierClass?: string;
}

function PosterCardItem({
    card,
    project,
    trackIndex,
    scopeId,
    layoutId,
    effectiveTransition,
    openCard,
    getLayoutId,
    modifierClass = "",
}: PosterCardItemProps) {
    const [runtimeDimensions, setRuntimeDimensions] = useState<{
        width: number;
        height: number;
    } | null>(null);

    const titleLayoutId = getLayoutId
        ? getLayoutId("title", card, trackIndex)
        : getSharedLayoutId("title", card, trackIndex, scopeId);

    const { cssRatio, aspectClass, objectFit } = resolvePosterAspectRatio(
        project,
        runtimeDimensions
    );

    const imageSrc =
        typeof project.coverImage === "string"
            ? project.coverImage
            : project.coverImage.src;

    return (
        <motion.article
            key={`poster-card-${getCardIdentifier(card)}-${trackIndex}-${scopeId}`}
            layout
            layoutId={layoutId}
            transition={{
                layout: effectiveTransition,
                ...effectiveTransition,
            }}
            className={`poster-card ${modifierClass}`}
            onClick={() => openCard(card, trackIndex)}
            tabIndex={0}
            role="button"
            aria-label={`Open details for ${project.title}`}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openCard(card, trackIndex);
                }
            }}
        >
            {/* Artwork Frame with Dynamic Aspect Ratio & Fit Detection */}
            <div
                className={`poster-card-media ${aspectClass}`}
                style={{ aspectRatio: cssRatio }}
            >
                <img
                    src={imageSrc}
                    alt={`${project.title} artwork`}
                    className={`poster-card-img poster-card-img--${objectFit}`}
                    style={{ objectFit }}
                    onLoad={(e) => {
                        const img = e.currentTarget;
                        if (!runtimeDimensions && project.aspectRatio === "auto") {
                            const isStaticWithDims =
                                typeof project.coverImage === "object" &&
                                project.coverImage !== null &&
                                "width" in project.coverImage &&
                                typeof project.coverImage.width === "number" &&
                                project.coverImage.width > 0;

                            if (!isStaticWithDims && img.naturalWidth > 0 && img.naturalHeight > 0) {
                                setRuntimeDimensions({
                                    width: img.naturalWidth,
                                    height: img.naturalHeight,
                                });
                            }
                        }
                    }}
                />
            </div>

            {/* Project Info Block */}
            <div className="poster-card-body">
                <motion.h3
                    layoutId={titleLayoutId}
                    transition={{
                        layout: effectiveTransition,
                        ...effectiveTransition,
                    }}
                    className="poster-card-title"
                >
                    <span className="poster-card-title-btn">{project.title}</span>
                </motion.h3>

                <div className="poster-card-meta">
                    <span className="poster-meta-label">
                        {project.metaLabel || "Client :"}
                    </span>{" "}
                    <span className="poster-meta-value">{project.metaValue}</span>
                </div>
            </div>
        </motion.article>
    );
}

/* ============================================================
   TYPES
   ============================================================ */

export interface PosterProjectListProps {
    projects?: PosterProject[];
    config?: ExpandableCardConfig;
    className?: string;
}

/* ============================================================
   MAIN COMPONENT
   Strict Sequence:
   1. Creative Posters ("poster-edits")
   2. Standee Designs  ("standee-works")
   3. Billboard & Banners ("billboard-canvas")
   ============================================================ */

export function PosterProjectList({
    projects = POSTER_PROJECTS,
    config,
    className = "",
}: PosterProjectListProps) {
    const posterEditsScopeId = useId();
    const standeeScopeId = useId();
    const billboardScopeId = useId();

    const effectiveTransition = config?.transition || SMOOTH_EXPAND_TRANSITION;

    // 1. Creative Posters ("poster-edits")
    const posterEditsProjects = useMemo(
        () =>
            (projects || []).filter(
                (p) =>
                    p.subCategory === "poster-edits" ||
                    (!POSTER_SUBCATEGORIES.includes(p.subCategory) &&
                        p.subCategory !== "standee-works" &&
                        p.subCategory !== "billboard-canvas")
            ),
        [projects]
    );

    // 2. Standee Designs ("standee-works")
    const standeeProjects = useMemo(
        () =>
            (projects || []).filter(
                (p) => p.subCategory === "standee-works"
            ),
        [projects]
    );

    // 3. Billboard & Banners ("billboard-canvas")
    const billboardProjects = useMemo(
        () =>
            (projects || []).filter(
                (p) => p.subCategory === "billboard-canvas"
            ),
        [projects]
    );

    // Card items for ExpandableCard
    const buildCardItems = (items: PosterProject[]): ExpandableCardItem[] => {
        return items.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            image: typeof p.coverImage === "string" ? p.coverImage : p.coverImage.src,
            content: (
                <div className="flex flex-col gap-2.5 pt-1">
                    <div className="text-sm font-serif">
                        <span className="font-bold text-[#987400]">{p.metaLabel} </span>
                        <span className="font-bold text-neutral-900">{p.metaValue}</span>
                    </div>

                    {p.year && (
                        <div className="text-xs text-neutral-500">
                            <span className="font-semibold">Year: </span>
                            <span>{p.year}</span>
                        </div>
                    )}

                    {p.tags && p.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {p.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-[#987400]/10 text-[#987400] border border-[#987400]/20"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ),
        }));
    };

    const posterEditsCards = useMemo(
        () => buildCardItems(posterEditsProjects),
        [posterEditsProjects]
    );

    const standeeCards = useMemo(
        () => buildCardItems(standeeProjects),
        [standeeProjects]
    );

    const billboardCards = useMemo(
        () => buildCardItems(billboardProjects),
        [billboardProjects]
    );

    // Lookup maps
    const posterEditsMap = useMemo(() => {
        const map = new Map<string, PosterProject>();
        posterEditsProjects.forEach((p) => map.set(p.id, p));
        return map;
    }, [posterEditsProjects]);

    const standeeMap = useMemo(() => {
        const map = new Map<string, PosterProject>();
        standeeProjects.forEach((p) => map.set(p.id, p));
        return map;
    }, [standeeProjects]);

    const billboardMap = useMemo(() => {
        const map = new Map<string, PosterProject>();
        billboardProjects.forEach((p) => map.set(p.id, p));
        return map;
    }, [billboardProjects]);

    const hasPosterEdits = posterEditsProjects.length > 0;
    const hasStandee = standeeProjects.length > 0;
    const hasBillboard = billboardProjects.length > 0;

    // If no projects exist across all categories, render null
    if (!hasPosterEdits && !hasStandee && !hasBillboard) {
        return null;
    }

    return (
        <div className={`poster-project-list ${className}`}>
            {/* =====================================================
                SECTION 1: CREATIVE POSTER EDITS (APPEARS FIRST)
                ====================================================== */}
            {hasPosterEdits && (
                <section
                    className="poster-section poster-edits-section"
                    aria-labelledby="heading-poster-edits"
                >
                    <header className="poster-section-header">
                        <div className="poster-section-title-row">
                            <h2 id="heading-poster-edits" className="poster-section-title">
                                Creative <span className="poster-section-script">Posters</span>
                            </h2>
                        </div>
                        <p className="poster-section-subtitle">
                            Concept art, promotional event posters, typography prints, and cultural editions.
                        </p>
                    </header>

                    <ExpandableCard
                        cards={posterEditsCards}
                        scopeId={posterEditsScopeId}
                        config={config}
                        expandable_box_config={POSTER_EDITS_EXPANDABLE_BOX_CONFIG}
                        transition={effectiveTransition}
                        onActiveChange={config?.onActiveChange}
                        renderContainer={(renderTrackCards) => (
                            <div className="poster-edits-grid">
                                {renderTrackCards(0)}
                            </div>
                        )}
                        renderCard={(card, openCard, layoutId, trackIndex, getLayoutId) => {
                            const originalProject =
                                posterEditsMap.get(card.id || "") || posterEditsProjects[0];

                            return (
                                <PosterCardItem
                                    key={`poster-edit-card-${getCardIdentifier(card)}-${trackIndex}-${posterEditsScopeId}`}
                                    card={card}
                                    project={originalProject}
                                    trackIndex={trackIndex}
                                    scopeId={posterEditsScopeId}
                                    layoutId={layoutId}
                                    effectiveTransition={effectiveTransition}
                                    openCard={openCard}
                                    getLayoutId={getLayoutId}
                                    modifierClass="poster-card--portrait"
                                />
                            );
                        }}
                    />
                </section>
            )}

            {/* Visual Divider: Between Creative Posters and (Standee or Billboard) */}
            {hasPosterEdits && (hasStandee || hasBillboard) && (
                <div className="poster-sections-divider" aria-hidden="true">
                    <div className="poster-divider-line" />
                    <div className="poster-divider-accent-dots">
                        <span className="poster-divider-dot" />
                        <span className="poster-divider-dot" />
                        <span className="poster-divider-dot" />
                    </div>
                    <div className="poster-divider-line" />
                </div>
            )}

            {/* =====================================================
                SECTION 2: STANDEE DESIGNS (APPEARS SECOND)
                ====================================================== */}
            {hasStandee && (
                <section
                    className="poster-section poster-standee-section"
                    aria-labelledby="heading-standee-works"
                >
                    <header className="poster-section-header">
                        <div className="poster-section-title-row">
                            <h2 id="heading-standee-works" className="poster-section-title">
                                Standee <span className="poster-section-script">Designs</span>
                            </h2>
                        </div>
                        <p className="poster-section-subtitle">
                            Vertical roll-up banners, event entrance displays, and exhibition stands.
                        </p>
                    </header>

                    <ExpandableCard
                        cards={standeeCards}
                        scopeId={standeeScopeId}
                        config={config}
                        expandable_box_config={STANDEE_EXPANDABLE_BOX_CONFIG}
                        transition={effectiveTransition}
                        onActiveChange={config?.onActiveChange}
                        renderContainer={(renderTrackCards) => (
                            <div className="poster-standee-grid">
                                {renderTrackCards(0)}
                            </div>
                        )}
                        renderCard={(card, openCard, layoutId, trackIndex, getLayoutId) => {
                            const originalProject =
                                standeeMap.get(card.id || "") || standeeProjects[0];

                            return (
                                <PosterCardItem
                                    key={`standee-card-${getCardIdentifier(card)}-${trackIndex}-${standeeScopeId}`}
                                    card={card}
                                    project={originalProject}
                                    trackIndex={trackIndex}
                                    scopeId={standeeScopeId}
                                    layoutId={layoutId}
                                    effectiveTransition={effectiveTransition}
                                    openCard={openCard}
                                    getLayoutId={getLayoutId}
                                    modifierClass="poster-card--standee"
                                />
                            );
                        }}
                    />
                </section>
            )}

            {/* Visual Divider: Between Standee and Billboard */}
            {hasStandee && hasBillboard && (
                <div className="poster-sections-divider" aria-hidden="true">
                    <div className="poster-divider-line" />
                    <div className="poster-divider-accent-dots">
                        <span className="poster-divider-dot" />
                        <span className="poster-divider-dot" />
                        <span className="poster-divider-dot" />
                    </div>
                    <div className="poster-divider-line" />
                </div>
            )}

            {/* =====================================================
                SECTION 3: BILLBOARD & BANNERS (APPEARS THIRD)
                ====================================================== */}
            {hasBillboard && (
                <section
                    className="poster-section poster-billboard-section"
                    aria-labelledby="heading-billboard-canvas"
                >
                    <header className="poster-section-header">
                        <div className="poster-section-title-row">
                            <h2 id="heading-billboard-canvas" className="poster-section-title">
                                Billboard & <span className="poster-section-script">Banners</span>
                            </h2>
                        </div>
                        <p className="poster-section-subtitle">
                            Large format outdoor displays, digital signage, and highway billboard canvases.
                        </p>
                    </header>

                    <ExpandableCard
                        cards={billboardCards}
                        scopeId={billboardScopeId}
                        config={config}
                        expandable_box_config={BILLBOARD_EXPANDABLE_BOX_CONFIG}
                        transition={effectiveTransition}
                        onActiveChange={config?.onActiveChange}
                        renderContainer={(renderTrackCards) => (
                            <div className="poster-billboard-grid">
                                {renderTrackCards(0)}
                            </div>
                        )}
                        renderCard={(card, openCard, layoutId, trackIndex, getLayoutId) => {
                            const originalProject =
                                billboardMap.get(card.id || "") || billboardProjects[0];

                            return (
                                <PosterCardItem
                                    key={`billboard-card-${getCardIdentifier(card)}-${trackIndex}-${billboardScopeId}`}
                                    card={card}
                                    project={originalProject}
                                    trackIndex={trackIndex}
                                    scopeId={billboardScopeId}
                                    layoutId={layoutId}
                                    effectiveTransition={effectiveTransition}
                                    openCard={openCard}
                                    getLayoutId={getLayoutId}
                                    modifierClass="poster-card--billboard"
                                />
                            );
                        }}
                    />
                </section>
            )}
        </div>
    );
}

export default PosterProjectList;
