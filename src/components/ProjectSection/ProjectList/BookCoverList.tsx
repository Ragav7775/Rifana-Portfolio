"use client";

import React, { useMemo, useId } from "react";
import { motion, type Transition } from "motion/react";
import ExpandableCard, {
    type ExpandableCardItem,
    type ExpandableCardConfig,
    type ExpandableBoxConfig,
    type ExpandableBoxResponsiveConfig,
    type PositionOffsets,
    SMOOTH_EXPAND_TRANSITION,
    getSharedLayoutId,
    getCardIdentifier,
} from "@/components/ui/expandable-card";
import { BookCoverProject } from "@/data/BookCoverProjectData";
import "./BookCoverList.css";

/**
 * Configurable box parameters for Book Cover expandable cards.
 * Features smooth non-bouncy cubic-bezier easing, responsive sizing,
 * and exact return-to-grid repositioning.
 */
export const BOOK_COVER_EXPANDABLE_BOX_CONFIG: ExpandableBoxResponsiveConfig = {
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

export interface BookCoverListProps {
    projects: BookCoverProject[];
    config?: ExpandableCardConfig;

    /** Configurable expandable box sizing, coordinates, and offsets */
    expandable_box_config?: ExpandableBoxConfig;
    expandableBoxConfig?: ExpandableBoxConfig;
    expandedBoxConfig?: ExpandableBoxConfig;

    /** Custom duration in seconds (e.g. 0.44) */
    duration?: number;
    /** Custom easing curve (e.g. [0.4, 0, 0.2, 1] or 'easeInOut') */
    easing?: string | [number, number, number, number];
    /** Custom scale factor */
    scaleFactor?: number;
    /** Position offsets */
    positionOffsets?: PositionOffsets;
    /** Custom transition override */
    transition?: Transition;

    className?: string;
    sectionAriaLabel?: string;
}

export function BookCoverList({
    projects,
    config,
    expandable_box_config,
    expandableBoxConfig,
    expandedBoxConfig,
    duration,
    easing,
    scaleFactor,
    positionOffsets,
    transition,
    className = "",
    sectionAriaLabel = "Book Cover Projects",
}: BookCoverListProps) {
    const scopeId = useId();

    // Resolve effective transition: smooth cubic-bezier by default, eliminating high-spring jitter
    const effectiveTransition =
        transition ||
        config?.transition ||
        (duration !== undefined || easing !== undefined
            ? {
                type: "tween",
                duration: duration ?? 0.44,
                ease: (easing as Transition["ease"]) ?? [0.4, 0, 0.2, 1],
            }
            : SMOOTH_EXPAND_TRANSITION);

    // Resolve box configuration
    const effectiveBoxConfig =
        expandable_box_config ||
        expandableBoxConfig ||
        expandedBoxConfig ||
        config?.expandable_box_config ||
        config?.expandableBoxConfig ||
        config?.expandedBoxConfig ||
        BOOK_COVER_EXPANDABLE_BOX_CONFIG;

    // Map book cover projects into standard ExpandableCardItem objects (unconditionally declared)
    const expandableCards: ExpandableCardItem[] = useMemo(() => {
        return (projects || []).map((p) => ({
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
    }, [projects]);

    // Fast lookup map from card id to original book cover project
    const bookCoverMap = useMemo(() => {
        const map = new Map<string, BookCoverProject>();
        (projects || []).forEach((p) => map.set(p.id, p));
        return map;
    }, [projects]);

    if (!projects || projects.length === 0) {
        return null;
    }

    return (
        <section
            className={`book-cover-list-section ${className}`}
            aria-label={sectionAriaLabel}
        >
            <ExpandableCard
                cards={expandableCards}
                scopeId={scopeId}
                config={config}
                expandable_box_config={effectiveBoxConfig}
                transition={effectiveTransition}
                duration={duration}
                easing={easing}
                scaleFactor={scaleFactor}
                positionOffsets={positionOffsets}
                onActiveChange={config?.onActiveChange}
                renderContainer={(renderTrackCards) => (
                    <div className="book-cover-grid">
                        {renderTrackCards(0)}
                    </div>
                )}
                renderCard={(card, openCard, layoutId, trackIndex, getLayoutId) => {
                    const originalProject = bookCoverMap.get(card.id || "") || projects[0];
                    const titleLayoutId = getLayoutId
                        ? getLayoutId("title", card, trackIndex)
                        : getSharedLayoutId("title", card, trackIndex, scopeId);

                    return (
                        <motion.article
                            key={`book-cover-card-${getCardIdentifier(card)}-${trackIndex}-${scopeId}`}
                            layout
                            layoutId={layoutId}
                            transition={{
                                layout: effectiveTransition,
                                ...effectiveTransition,
                            }}
                            className="book-cover-card"
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
                            <div className="book-cover-card-media">
                                <img
                                    src={typeof originalProject.coverImage === "string" ? originalProject.coverImage : originalProject.coverImage.src}
                                    alt={`${originalProject.title} artwork`}
                                    className="book-cover-card-img"
                                />
                            </div>

                            {/* Project Info Block */}
                            <div className="book-cover-card-body">
                                <motion.h3
                                    layoutId={titleLayoutId}
                                    transition={{
                                        layout: effectiveTransition,
                                        ...effectiveTransition,
                                    }}
                                    className="book-cover-card-title"
                                >
                                    <span className="book-cover-card-title-btn">
                                        {originalProject.title}
                                    </span>
                                </motion.h3>

                                <div className="book-cover-card-meta">
                                    <span className="book-cover-meta-label">
                                        {originalProject.metaLabel || "Author :"}
                                    </span>{" "}
                                    <span className="book-cover-meta-value">
                                        {originalProject.metaValue}
                                    </span>
                                </div>
                            </div>
                        </motion.article>
                    );
                }}
            />
        </section>
    );
}

export default BookCoverList;
