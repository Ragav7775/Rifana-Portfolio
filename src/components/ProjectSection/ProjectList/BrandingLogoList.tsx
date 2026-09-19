"use client";

import React, { useMemo, useId } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { BrandingProject, BRANDING_PROJECTS } from "@/data/BrandingProjectData";
import { LogoProject } from "@/data/LogoProjectData";
import "./BrandingLogoList.css";

export type CommonBrandingLogoItem = BrandingProject | LogoProject;

/**
 * Configurable box parameters for Branding / Logo expandable cards.
 * Features smooth non-bouncy cubic-bezier easing, responsive sizing,
 * and exact return-to-grid repositioning.
 */
export const BRANDING_EXPANDABLE_BOX_CONFIG: ExpandableBoxResponsiveConfig = {
    desktop: {
        width: 860,
        height: "auto",
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
        height: "auto",
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
        // width: "calc(100vw - 5.5rem)",
        width: 320,
        height: "auto",
        maxWidth: "360px",
        maxHeight: "88vh",
        top: "50%",
        left: "50%",
        borderRadius: "16px",
        duration: 0.44,
        easing: [0.4, 0, 0.2, 1],
        scale: 1,
    },
};

export interface BrandingLogoListProps {
    projects?: CommonBrandingLogoItem[];
    interaction?: "navigate" | "expand";
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
}

export function BrandingLogoList({
    projects = BRANDING_PROJECTS,
    interaction = "navigate",
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
}: BrandingLogoListProps) {
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
        BRANDING_EXPANDABLE_BOX_CONFIG;

    /* ──────────────────────────────────────────────────────────
       HOOKS: Declared unconditionally before any early returns
       ────────────────────────────────────────────────────────── */
    const expandableCards: ExpandableCardItem[] = useMemo(() => {
        return (projects || []).map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            image: typeof p.coverImage === "string" ? p.coverImage : p.coverImage.src,
            content: (
                <div className="flex flex-col gap-2 pt-1">
                    <div className="text-sm font-serif">
                        <span className="font-bold text-neutral-900">{p.industryLabel || "Industry :"} </span>
                        <span className="font-bold text-[#987400]">{p.industry}</span>
                    </div>
                    {p.keyFeatures && p.keyFeatures.length > 0 && (
                        <div className="mt-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                Key Highlights:
                            </span>
                            <ul className="mt-1.5 space-y-1 text-xs text-neutral-600">
                                {p.keyFeatures.map((kf, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                        <span className="text-[#987400]">•</span>
                                        <span>{kf}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ),
        }));
    }, [projects]);

    const projectMap = useMemo(() => {
        const map = new Map<string, CommonBrandingLogoItem>();
        (projects || []).forEach((p) => map.set(p.id, p));
        return map;
    }, [projects]);

    if (!projects || projects.length === 0) {
        return null;
    }

    /* ──────────────────────────────────────────────────────────
       MODE 1: INTERACTION = "NAVIGATE" (Branding Detail Page)
       Preserves existing dedicated Branding detail-page navigation.
       ────────────────────────────────────────────────────────── */
    if (interaction === "navigate") {
        return (
            <section
                className={`branding-list-section ${className}`}
                aria-label="Branding Projects"
            >
                <div className="branding-grid">
                    {projects.map((project, index) => {
                        const targetUrl = `/projects/branding/${project.slug}`;

                        return (
                            <article key={project.id} className="branding-card">
                                {/* Project Cover / Logo Media Box (1:1 Square) */}
                                <Link
                                    href={targetUrl}
                                    className="branding-card-media-link"
                                    aria-label={`View ${project.title} branding details`}
                                >
                                    <div className="branding-card-media">
                                        <Image
                                            src={project.coverImage}
                                            alt={`${project.title} logo preview`}
                                            priority={index < 4}
                                            className="branding-card-img"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                    </div>
                                </Link>

                                {/* Project Info Block */}
                                <div className="branding-card-body">
                                    <h3 className="branding-card-title">
                                        <Link
                                            href={targetUrl}
                                            className="branding-card-title-link"
                                        >
                                            {project.title}
                                        </Link>
                                    </h3>

                                    <div className="branding-card-industry">
                                        <span className="branding-industry-label">
                                            {project.industryLabel || "Industry :"}
                                        </span>{" "}
                                        <span className="branding-industry-value">
                                            {project.industry}
                                        </span>
                                    </div>

                                    <Link
                                        href={targetUrl}
                                        className="branding-view-details-link"
                                        aria-label={`View details for ${project.title}`}
                                    >
                                        <span className="branding-view-details-arrow">→</span>
                                        <span>View Details</span>
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>
        );
    }

    /* ──────────────────────────────────────────────────────────
       MODE 2: INTERACTION = "EXPAND" (Logo with ExpandableCard)
       Uses polished smooth cubic-bezier scale expansion and shrink.
       ────────────────────────────────────────────────────────── */

    return (
        <section
            className={`branding-list-section ${className}`}
            aria-label="Logo Projects"
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
                    <div className="branding-grid">
                        {renderTrackCards(0)}
                    </div>
                )}
                renderCard={(card, openCard, layoutId, trackIndex, getLayoutId) => {
                    const originalProject = projectMap.get(card.id || "") || projects[0];
                    const imageLayoutId = getLayoutId
                        ? getLayoutId("image", card, trackIndex)
                        : getSharedLayoutId("image", card, trackIndex, scopeId);
                    const titleLayoutId = getLayoutId
                        ? getLayoutId("title", card, trackIndex)
                        : getSharedLayoutId("title", card, trackIndex, scopeId);

                    return (
                        <motion.article
                            key={`logo-card-${getCardIdentifier(card)}-${trackIndex}-${scopeId}`}
                            layout
                            layoutId={layoutId}
                            transition={{
                                layout: effectiveTransition,
                                ...effectiveTransition,
                            }}
                            className="branding-card"
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
                            {/* Project Cover / Logo Media Box (1:1 Square) */}
                            <div className="branding-card-media">
                                <img
                                    src={typeof originalProject.coverImage === "string" ? originalProject.coverImage : originalProject.coverImage.src}
                                    alt={`${originalProject.title} logo preview`}
                                    className="branding-card-img"
                                />
                            </div>

                            {/* Project Info Block */}
                            <div className="branding-card-body">
                                <motion.h3
                                    layoutId={titleLayoutId}
                                    transition={{
                                        layout: effectiveTransition,
                                        ...effectiveTransition,
                                    }}
                                    className="branding-card-title"
                                >
                                    <span className="branding-card-title-btn">
                                        {originalProject.title}
                                    </span>
                                </motion.h3>

                                <div className="branding-card-industry">
                                    <span className="branding-industry-label">
                                        {originalProject.industryLabel || "Industry :"}
                                    </span>{" "}
                                    <span className="branding-industry-value">
                                        {originalProject.industry}
                                    </span>
                                </div>

                                <div className="branding-view-details-btn">
                                    <span className="branding-view-details-arrow">→</span>
                                    <span>View Details</span>
                                </div>
                            </div>
                        </motion.article>
                    );
                }}
            />
        </section>
    );
}

// Backward compatibility alias export
export const BrandingList = BrandingLogoList;
export type BrandingListProps = BrandingLogoListProps;

export default BrandingLogoList;
