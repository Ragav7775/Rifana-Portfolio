"use client";

import React, { useMemo, useId } from "react";
import { motion } from "motion/react";
import ExpandableCard, {
    type ExpandableCardItem,
    type ExpandableCardConfig,
    type ExpandableBoxResponsiveConfig,
    SMOOTH_EXPAND_TRANSITION,
    getSharedLayoutId,
    getCardIdentifier,
} from "@/components/ui/expandable-card";
import {
    SocialMediaProject,
    SOCIAL_MEDIA_PROJECTS,
} from "@/data/SocialMediaProjectData";
import "./SocialMediaList.css";

/* ============================================================
   EXPANDABLE BOX CONFIGURATIONS
   ============================================================ */

export const INSTAGRAM_EXPANDABLE_BOX_CONFIG: ExpandableBoxResponsiveConfig = {
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

export const YOUTUBE_EXPANDABLE_BOX_CONFIG: ExpandableBoxResponsiveConfig = {
    desktop: {
        width: 760,
        height: 520,
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
        width: 320,
        height: 560,
        imageWidth: "90%",
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
   TYPES
   ============================================================ */

export interface SocialMediaListProps {
    projects?: SocialMediaProject[];
    config?: ExpandableCardConfig;
    className?: string;
}

/* ============================================================
   COMPONENT
   ============================================================ */

export function SocialMediaList({
    projects = SOCIAL_MEDIA_PROJECTS,
    config,
    className = "",
}: SocialMediaListProps) {
    const instagramScopeId = useId();
    const youtubeScopeId = useId();

    const effectiveTransition = config?.transition || SMOOTH_EXPAND_TRANSITION;

    // Filter projects into sub-categories
    const instagramProjects = useMemo(
        () => (projects || []).filter((p) => p.subCategory === "instagram-post"),
        [projects]
    );

    const youtubeProjects = useMemo(
        () =>
            (projects || []).filter(
                (p) => p.subCategory === "youtube-video-thumbnail"
            ),
        [projects]
    );

    // Map Instagram projects into ExpandableCardItem format
    const instagramCards: ExpandableCardItem[] = useMemo(() => {
        return instagramProjects.map((p) => ({
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
    }, [instagramProjects]);

    // Map YouTube projects into ExpandableCardItem format
    const youtubeCards: ExpandableCardItem[] = useMemo(() => {
        return youtubeProjects.map((p) => ({
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
    }, [youtubeProjects]);

    // Fast lookup maps
    const instagramMap = useMemo(() => {
        const map = new Map<string, SocialMediaProject>();
        instagramProjects.forEach((p) => map.set(p.id, p));
        return map;
    }, [instagramProjects]);

    const youtubeMap = useMemo(() => {
        const map = new Map<string, SocialMediaProject>();
        youtubeProjects.forEach((p) => map.set(p.id, p));
        return map;
    }, [youtubeProjects]);

    // Conditional rendering: If neither sub-category has projects, render nothing
    if (instagramProjects.length === 0 && youtubeProjects.length === 0) {
        return null;
    }

    return (
        <div className={`social-media-list ${className}`}>
            {/* =====================================================
                SECTION 1: INSTAGRAM POSTS (PORTRAIT CARDS)
                Only renders when at least one project exists
                ====================================================== */}
            {instagramProjects.length > 0 && (
                <section
                    className="social-media-section social-instagram-section"
                    aria-labelledby="heading-instagram-posts"
                >
                    <header className="social-media-section-header">
                        <div className="social-media-section-title-row">
                            <h2 id="heading-instagram-posts" className="social-media-section-title">
                                Instagram <span className="social-media-section-script">Posts</span>
                            </h2>
                        </div>
                        <p className="social-media-section-subtitle">
                            Visual storytelling, brand campaigns, and promotional feed designs.
                        </p>
                    </header>

                    <ExpandableCard
                        cards={instagramCards}
                        scopeId={instagramScopeId}
                        config={config}
                        expandable_box_config={INSTAGRAM_EXPANDABLE_BOX_CONFIG}
                        transition={effectiveTransition}
                        onActiveChange={config?.onActiveChange}
                        renderContainer={(renderTrackCards) => (
                            <div className="social-instagram-grid">
                                {renderTrackCards(0)}
                            </div>
                        )}
                        renderCard={(card, openCard, layoutId, trackIndex, getLayoutId) => {
                            const originalProject =
                                instagramMap.get(card.id || "") || instagramProjects[0];
                            const titleLayoutId = getLayoutId
                                ? getLayoutId("title", card, trackIndex)
                                : getSharedLayoutId("title", card, trackIndex, instagramScopeId);

                            return (
                                <motion.article
                                    key={`insta-card-${getCardIdentifier(card)}-${trackIndex}-${instagramScopeId}`}
                                    layout
                                    layoutId={layoutId}
                                    transition={{
                                        layout: effectiveTransition,
                                        ...effectiveTransition,
                                    }}
                                    className="social-media-card social-media-card--portrait"
                                    onClick={() => openCard(card, trackIndex)}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`Open details for ${originalProject.title}`}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            openCard(card, trackIndex);
                                        }
                                    }}
                                >
                                    {/* Portrait Artwork Frame (2:3 Aspect Ratio) */}
                                    <div className="social-card-media social-card-media--portrait">
                                        <img
                                            src={
                                                typeof originalProject.coverImage === "string"
                                                    ? originalProject.coverImage
                                                    : originalProject.coverImage.src
                                            }
                                            alt={`${originalProject.title} artwork`}
                                            className="social-card-img"
                                        />
                                    </div>

                                    {/* Project Info Block */}
                                    <div className="social-card-body">
                                        <motion.h3
                                            layoutId={titleLayoutId}
                                            transition={{
                                                layout: effectiveTransition,
                                                ...effectiveTransition,
                                            }}
                                            className="social-card-title"
                                        >
                                            <span className="social-card-title-btn">
                                                {originalProject.title}
                                            </span>
                                        </motion.h3>

                                        <div className="social-card-meta">
                                            <span className="social-meta-label">
                                                {originalProject.metaLabel || "Client :"}
                                            </span>{" "}
                                            <span className="social-meta-value">
                                                {originalProject.metaValue}
                                            </span>
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        }}
                    />
                </section>
            )}

            {/* Visual Section Divider: Renders only when BOTH sub-categories exist */}
            {instagramProjects.length > 0 && youtubeProjects.length > 0 && (
                <div className="social-sections-divider" aria-hidden="true">
                    <div className="social-divider-line" />
                    <div className="social-divider-accent-dots">
                        <span className="social-divider-dot" />
                        <span className="social-divider-dot" />
                        <span className="social-divider-dot" />
                    </div>
                    <div className="social-divider-line" />
                </div>
            )}

            {/* =====================================================
                SECTION 2: YOUTUBE VIDEO THUMBNAILS (LANDSCAPE CARDS)
                Only renders when at least one project exists
                ====================================================== */}
            {youtubeProjects.length > 0 && (
                <section
                    className="social-media-section social-youtube-section"
                    aria-labelledby="heading-youtube-thumbnails"
                >
                    <header className="social-media-section-header">
                        <div className="social-media-section-title-row">
                            <h2 id="heading-youtube-thumbnails" className="social-media-section-title">
                                YouTube <span className="social-media-section-script">Video Thumbnails</span>
                            </h2>
                        </div>
                        <p className="social-media-section-subtitle">
                            High-impact video thumbnails, editorial title cards, and content packaging.
                        </p>
                    </header>

                    <ExpandableCard
                        cards={youtubeCards}
                        scopeId={youtubeScopeId}
                        config={config}
                        expandable_box_config={YOUTUBE_EXPANDABLE_BOX_CONFIG}
                        transition={effectiveTransition}
                        onActiveChange={config?.onActiveChange}
                        renderContainer={(renderTrackCards) => (
                            <div className="social-youtube-grid">
                                {renderTrackCards(0)}
                            </div>
                        )}
                        renderCard={(card, openCard, layoutId, trackIndex, getLayoutId) => {
                            const originalProject =
                                youtubeMap.get(card.id || "") || youtubeProjects[0];
                            const titleLayoutId = getLayoutId
                                ? getLayoutId("title", card, trackIndex)
                                : getSharedLayoutId("title", card, trackIndex, youtubeScopeId);

                            return (
                                <motion.article
                                    key={`yt-card-${getCardIdentifier(card)}-${trackIndex}-${youtubeScopeId}`}
                                    layout
                                    layoutId={layoutId}
                                    transition={{
                                        layout: effectiveTransition,
                                        ...effectiveTransition,
                                    }}
                                    className="social-media-card social-media-card--landscape"
                                    onClick={() => openCard(card, trackIndex)}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`Open details for ${originalProject.title}`}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            openCard(card, trackIndex);
                                        }
                                    }}
                                >
                                    {/* Landscape Artwork Frame (16:9 Aspect Ratio) */}
                                    <div className="social-card-media social-card-media--landscape">
                                        <img
                                            src={
                                                typeof originalProject.coverImage === "string"
                                                    ? originalProject.coverImage
                                                    : originalProject.coverImage.src
                                            }
                                            alt={`${originalProject.title} thumbnail`}
                                            className="social-card-img"
                                        />
                                    </div>

                                    {/* Project Info Block */}
                                    <div className="social-card-body">
                                        <motion.h3
                                            layoutId={titleLayoutId}
                                            transition={{
                                                layout: effectiveTransition,
                                                ...effectiveTransition,
                                            }}
                                            className="social-card-title"
                                        >
                                            <span className="social-card-title-btn">
                                                {originalProject.title}
                                            </span>
                                        </motion.h3>

                                        <div className="social-card-meta">
                                            <span className="social-meta-label">
                                                {originalProject.metaLabel || "Client :"}
                                            </span>{" "}
                                            <span className="social-meta-value">
                                                {originalProject.metaValue}
                                            </span>
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        }}
                    />
                </section>
            )}
        </div>
    );
}

export default SocialMediaList;
