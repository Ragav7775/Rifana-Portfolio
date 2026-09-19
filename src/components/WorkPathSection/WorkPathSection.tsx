"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import WorkingRifanaImg from "@/assets/Avatars/Working-Rifana.png";
import "./WorkPathSection.css";

/* ============================================================
   CANONICAL PHASE DATA DEFINITIONS (Desktop & Shared Content)
   ============================================================ */

export interface PhaseData {
    id: number;
    phaseNumber: string;
    title: string;
    items: string[];
    description: string;
}

export const PHASES: PhaseData[] = [
    {
        id: 1,
        phaseNumber: "Phase 01",
        title: "Discover & Understand",
        items: [
            "User Research",
            "Problem Definition",
            "Competitor Research",
        ],
        description:
            "Understanding The People, Context, And Problem Before Jumping Into Solutions.",
    },
    {
        id: 2,
        phaseNumber: "Phase 02",
        title: "Structure & Explore",
        items: [
            "User Flows",
            "Information Architecture",
            "Wireframing",
            "Ideation",
        ],
        description:
            "Turning Insights Into A Clear Structure And Exploring Different Ways To Solve The Problem.",
    },
    {
        id: 3,
        phaseNumber: "Phase 03",
        title: "Design & Create",
        items: [
            "UI Design",
            "Visual Design",
            "Prototyping",
            "Interaction Design",
        ],
        description:
            "Bringing The Solution To Life Through Purposeful Visuals, Interactions, And Experiences.",
    },
    {
        id: 4,
        phaseNumber: "Phase 04",
        title: "Test & Refine",
        items: [
            "Usability Testing",
            "Feedback & Iteration",
            "Design System",
            "Final Refinement",
        ],
        description:
            "Validating The Experience, Learning From Feedback, And Refining The Design Until It Feels Right.",
    },
];

/* ============================================================
   MOBILE-ONLY PHASE POSITIONING & ANIMATION TYPES
   Applied strictly to mobile viewport (< 768px)
   ============================================================ */

export interface MobilePhaseAnimationConfig {
    entranceOffset?: number; // Horizontal translation distance (px)
    duration?: number; // Animation duration in seconds
    delay?: number; // Stagger delay in seconds
    ease?: string; // Easing function
    scrollTriggerStart?: string; // Viewport trigger threshold e.g. "top 72%"
}

export interface MobilePhasePositionConfig {
    markerOffset?: { x?: number; y?: number }; // Offset for mobile milestone dot
    upperContentOffset?: { x?: number; y?: number }; // Offset for upper content panel
    lowerContentOffset?: { x?: number; y?: number }; // Offset for lower content panel
    spacing?: number; // Row gap / spacing for mobile phase
    transformOrigin?: string;
}

export interface MobilePhaseConfig {
    id: number;
    position?: MobilePhasePositionConfig;
    animation?: MobilePhaseAnimationConfig;
}

export const DEFAULT_MOBILE_PHASE_CONFIGS: Record<number, MobilePhaseConfig> = {
    1: {
        id: 1,
        position: {
            markerOffset: { x: 0, y: 0 },
            upperContentOffset: { x: 20, y: 10 },
            lowerContentOffset: { x: -10, y: -40 },
            spacing: 0,
            transformOrigin: "center left",
        },
        animation: {
            entranceOffset: 35,
            duration: 0.55,
            delay: 0.05,
            ease: "cubic-bezier(0.25, 1, 0.5, 1)",
            scrollTriggerStart: "top 72%",
        },
    },
    2: {
        id: 2,
        position: {
            markerOffset: { x: 0, y: 0 },
            upperContentOffset: { x: 10, y: -20 },
            lowerContentOffset: { x: 30, y: -80 },
            spacing: 10,
            transformOrigin: "center right",
        },
        animation: {
            entranceOffset: 35,
            duration: 0.55,
            delay: 0.05,
            ease: "cubic-bezier(0.25, 1, 0.5, 1)",
            scrollTriggerStart: "top 70%",
        },
    },
    3: {
        id: 3,
        position: {
            markerOffset: { x: 0, y: 0 },
            upperContentOffset: { x: 10, y: -20 },
            lowerContentOffset: { x: 0, y: -80 },
            spacing: 10,
            transformOrigin: "center left",
        },
        animation: {
            entranceOffset: 35,
            duration: 0.55,
            delay: 0.05,
            ease: "cubic-bezier(0.25, 1, 0.5, 1)",
            scrollTriggerStart: "top 65%",
        },
    },
    4: {
        id: 4,
        position: {
            markerOffset: { x: 0, y: 0 },
            upperContentOffset: { x: 10, y: -20 },
            lowerContentOffset: { x: 20, y: 0 },
            spacing: 10,
            transformOrigin: "center right",
        },
        animation: {
            entranceOffset: 35,
            duration: 0.55,
            delay: 0.05,
            ease: "cubic-bezier(0.25, 1, 0.5, 1)",
            scrollTriggerStart: "top 55%",
        },
    },
};

/* ============================================================
   EXACT CANONICAL DESKTOP GEOMETRY (Polygon 3 — 1326 × 472)
   Untouched and fully functional
   ============================================================ */

const DESKTOP_SEGMENTS = [
    {
        id: 1,
        d: "M 3 201.161 C 3 213.736, 333.87 191.393, 333.87 191.393",
        dotX: 333.87,
        dotY: 191.393,
    },
    {
        id: 2,
        d: "M 333.87 191.393 C 540.702 172.781, 667.015 157.188, 667.015 157.188",
        dotX: 667.015,
        dotY: 157.188,
    },
    {
        id: 3,
        d: "M 667.015 157.188 C 793.329 141.595, 874.985 130.193, 994.757 99.0064",
        dotX: 994.757,
        dotY: 99.0064,
    },
    {
        id: 4,
        d: "M 994.757 99.0064 C 1114.53 67.8199, 1195.18 48.7496, 1323 7",
        dotX: 1323,
        dotY: 7,
    },
];

const DESKTOP_START_DOT = { x: 3, y: 201.161 };

const LOWER_BACKGROUND_POLYGON_D =
    "M 3 201.161 C 3 213.736, 333.87 191.393, 333.87 191.393 C 540.702 172.781, 667.015 157.188, 667.015 157.188 C 793.329 141.595, 874.985 130.193, 994.757 99.0064 C 1114.53 67.8199, 1195.18 48.7496, 1323 7 L 1326 472 L 0 472 Z";

/* ============================================================
   CANONICAL MOBILE WIDE S-CURVE PATHWAY (< 768px)
   Terminating precisely at the final Phase 04 checkpoint (290, 1260)
   Design space: 380 x 1340
   ============================================================ */

const MOBILE_PATH_D =
    // "M 240 0 C 260 50, 100 130, 90 240 C 80 350, 300 470, 290 580 C 280 690, 100 810, 90 920 C 80 1030, 300 1150, 290 1260";
    // "M 240 0 C 260 50 100 130 90 240 C 80 350 300 470 290 580 C 280 690 100 810 90 920 C 80 1030 192 1029 202 1098"
    "M 240 0 C 260 50 100 130 90 240 C 80 350 300 470 290 580 C 280 690 100 810 90 920 C 80 1030 198 1035 198 1194"
const MOBILE_DOTS = [
    { id: 1, x: 180, y: 90 },
    { id: 2, x: 200, y: 420 },
    { id: 3, x: 170, y: 770 },
    { id: 4, x: 198, y: 1190 },
];

/* ============================================================
   WORK PATHWAY SECTION COMPONENT
   ============================================================ */

export interface WorkPathSectionProps {
    className?: string;
    phases?: PhaseData[];
    mobilePhaseOverrides?: Record<
        number,
        { position?: MobilePhasePositionConfig; animation?: MobilePhaseAnimationConfig }
    >;
}

export function WorkPathSection({
    className = "",
    phases = PHASES,
    mobilePhaseOverrides,
}: WorkPathSectionProps) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const desktopContainerRef = useRef<HTMLDivElement | null>(null);
    const mobileTimelineRef = useRef<HTMLDivElement | null>(null);
    const mobilePathRef = useRef<SVGPathElement | null>(null);

    // Reduced motion preference
    const prefersReducedMotion = usePrefersReducedMotion();

    // Desktop active reveal phase (0 to 4)
    const [activeDesktopPhase, setActiveDesktopPhase] = useState<number>(0);
    const [desktopInView, setDesktopInView] = useState<boolean>(false);

    // Mobile active reveal phases with support for bidirectional scroll
    const [mobileRevealed, setMobileRevealed] = useState<{ [key: number]: boolean }>({
        1: false,
        2: false,
        3: false,
        4: false,
    });

    // Mobile-only phase configurations derived from defaults and optional overrides
    const mobilePhases = phases.map((phase) => {
        const defaultConfig = DEFAULT_MOBILE_PHASE_CONFIGS[phase.id];
        const override = mobilePhaseOverrides?.[phase.id];

        return {
            ...phase,
            mobilePosition: {
                ...defaultConfig?.position,
                ...override?.position,
                markerOffset: {
                    ...defaultConfig?.position?.markerOffset,
                    ...override?.position?.markerOffset,
                },
                upperContentOffset: {
                    ...defaultConfig?.position?.upperContentOffset,
                    ...override?.position?.upperContentOffset,
                },
                lowerContentOffset: {
                    ...defaultConfig?.position?.lowerContentOffset,
                    ...override?.position?.lowerContentOffset,
                },
            },
            mobileAnimation: {
                ...defaultConfig?.animation,
                ...override?.animation,
            },
        };
    });

    // Desktop IntersectionObserver & Sequential Animation
    useEffect(() => {
        if (prefersReducedMotion) return;

        const container = desktopContainerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setDesktopInView(true);
                } else {
                    setDesktopInView(false);
                    setActiveDesktopPhase(0);
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, [prefersReducedMotion]);

    // Sequential Desktop Phase Step Machine
    useEffect(() => {
        if (prefersReducedMotion) return;

        if (!desktopInView) return;

        // Step 1: Draw segment 1 -> Reveal Phase 1
        const t1 = setTimeout(() => setActiveDesktopPhase(1), 300);
        // Step 2: Draw segment 2 -> Reveal Phase 2
        const t2 = setTimeout(() => setActiveDesktopPhase(2), 1000);
        // Step 3: Draw segment 3 -> Reveal Phase 3
        const t3 = setTimeout(() => setActiveDesktopPhase(3), 1700);
        // Step 4: Draw segment 4 -> Reveal Phase 4
        const t4 = setTimeout(() => setActiveDesktopPhase(4), 2400);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, [desktopInView, prefersReducedMotion]);

    // Mobile-Only GSAP + ScrollTrigger Animation Scoped via matchMedia("(max-width: 767px)")
    useEffect(() => {
        if (typeof window === "undefined") return;

        if (prefersReducedMotion) return;

        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();

        mm.add("(max-width: 767px)", () => {
            const path = mobilePathRef.current;
            const timeline = mobileTimelineRef.current;
            if (!path || !timeline) return;

            const pathLength = path.getTotalLength();
            gsap.set(path, {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength,
            });

            // Progressively draw S-curve path as mobile timeline scrolls
            gsap.to(path, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: timeline,
                    start: "top 75%",
                    end: "bottom 75%",
                    scrub: 0.8,
                },
            });

            // Individual ScrollTrigger per mobile phase row with bidirectional slide animation
            const rows = timeline.querySelectorAll(".workpath-mobile-row");
            rows.forEach((row, idx) => {
                const phaseConfig = mobilePhases[idx];
                const phaseId = idx + 1;
                const triggerStart =
                    phaseConfig?.mobileAnimation?.scrollTriggerStart || "top 70%";

                ScrollTrigger.create({
                    trigger: row,
                    start: triggerStart,
                    // Forward animation on downward scroll
                    onEnter: () => {
                        setMobileRevealed((prev) => ({ ...prev, [phaseId]: true }));
                    },
                    // Reverse animation on upward scroll
                    onLeaveBack: () => {
                        setMobileRevealed((prev) => ({ ...prev, [phaseId]: false }));
                    },
                    // Re-entrance when scrolling back down
                    onEnterBack: () => {
                        setMobileRevealed((prev) => ({ ...prev, [phaseId]: true }));
                    },
                });
            });
        });

        return () => {
            mm.revert();
        };
    }, [prefersReducedMotion, mobilePhases]);

    return (
        <section
            id="work-pathway"
            ref={sectionRef}
            className={`workpath-section ${className}`}
            aria-label="My Work Pathway"
        >
            <div className="workpath-inner">
                {/* =====================================================
            HEADER COMPOSITION: "My WORK Pathway" + Rifana
            ====================================================== */}
                <header className="workpath-header">
                    <div className="workpath-title-group">
                        <div className="workpath-title-top-row">
                            <span className="workpath-title-my">My</span>

                            <div className="workpath-title-work-container relative flex flex-row">
                                {/* Illustration placed above "WORK" */}
                                <h2 className="workpath-title-work">WORK</h2>
                                <div className="workpath-illustration-wrapper">
                                    <Image
                                        src={WorkingRifanaImg}
                                        alt="Rifana working at her desk with laptop and plants"
                                        width={150}
                                        height={125}
                                        priority
                                        className="workpath-illustration-img"
                                    />
                                </div>
                            </div>
                        </div>

                        <span className="workpath-title-pathway">Pathway</span>
                    </div>

                    <p className="workpath-subtitle">
                        An Iterative Process From Idea To Experience...
                    </p>
                </header>

                {/* =====================================================
            DESKTOP & TABLET VIEW (>= 768px)
            Completely Untouched & Fully Functional Original Desktop Implementation
            ====================================================== */}
                <div ref={desktopContainerRef} className="workpath-desktop-view">
                    <div className="workpath-desktop-timeline">
                        {/* ── Vertical Grid Lines (Background) ── */}
                        <div className="workpath-grid-lines" aria-hidden="true">
                            <div className="workpath-grid-line-col" />
                            <div className="workpath-grid-line-col" />
                            <div className="workpath-grid-line-col" />
                            <div className="workpath-grid-line-col" />
                        </div>

                        {/* ── 1. UPPER CONTENT LAYER (All 4 Phases) ── */}
                        <div className="workpath-upper-layer">
                            <div className="workpath-columns-grid">
                                {phases.map((phase) => {
                                    const isRevealed =
                                        prefersReducedMotion || activeDesktopPhase >= phase.id;

                                    return (
                                        <div
                                            key={phase.id}
                                            className="workpath-upper-col"
                                        >
                                            <motion.div
                                                initial={
                                                    prefersReducedMotion
                                                        ? { opacity: 1, y: 0 }
                                                        : { opacity: 0, y: 22 }
                                                }
                                                animate={
                                                    isRevealed
                                                        ? { opacity: 1, y: 0 }
                                                        : { opacity: 0, y: 22 }
                                                }
                                                transition={{
                                                    duration: 0.55,
                                                    ease: [0.25, 1, 0.5, 1],
                                                }}
                                            >
                                                <h3 className="workpath-phase-num">
                                                    {phase.phaseNumber}
                                                </h3>

                                                <h4 className="workpath-phase-title">
                                                    {phase.title}
                                                </h4>

                                                <ul className="workpath-phase-list">
                                                    {phase.items.map((item, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="workpath-phase-item"
                                                        >
                                                            <span
                                                                className="workpath-bullet"
                                                                aria-hidden="true"
                                                            />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── 2. SVG LAYER (Static Gold Gradient Polygon + Animated Blue Stroke + Gold Dots) ── */}
                        <div className="workpath-desktop-svg-layer" aria-hidden="true">
                            <svg
                                viewBox="0 0 1326 472"
                                preserveAspectRatio="none"
                                className="workpath-desktop-svg"
                            >
                                <defs>
                                    {/* Gold Linear Gradient (#D4AF37 -> #FFCB00 -> #987400 at 30% opacity) */}
                                    <linearGradient
                                        id="workpath-gold-gradient"
                                        x1="8.54%"
                                        y1="0%"
                                        x2="93.59%"
                                        y2="100%"
                                    >
                                        <stop
                                            offset="8.54%"
                                            stopColor="#D4AF37"
                                            stopOpacity="0.30"
                                        />
                                        <stop
                                            offset="51.92%"
                                            stopColor="#FFCB00"
                                            stopOpacity="0.30"
                                        />
                                        <stop
                                            offset="93.59%"
                                            stopColor="#987400"
                                            stopOpacity="0.30"
                                        />
                                    </linearGradient>

                                    {/* Subtle drop shadow for crisp gold dots */}
                                    <filter
                                        id="gold-glow"
                                        x="-50%"
                                        y="-50%"
                                        width="200%"
                                        height="200%"
                                    >
                                        <feDropShadow
                                            dx="0"
                                            dy="1.5"
                                            stdDeviation="2"
                                            floodColor="rgba(152, 116, 0, 0.4)"
                                        />
                                    </filter>
                                </defs>

                                {/* Static Lower Background Polygon (Derived from canonical curve) */}
                                <path
                                    d={LOWER_BACKGROUND_POLYGON_D}
                                    fill="url(#workpath-gold-gradient)"
                                />

                                {/* Animated Blue Timeline Stroke (Identical Canonical Curve) */}
                                {DESKTOP_SEGMENTS.map((seg) => {
                                    const isSegmentDrawn =
                                        prefersReducedMotion || activeDesktopPhase >= seg.id;

                                    return (
                                        <motion.path
                                            key={`path-${seg.id}`}
                                            d={seg.d}
                                            fill="none"
                                            stroke="#987400"
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                            initial={
                                                prefersReducedMotion
                                                    ? { pathLength: 1, opacity: 1 }
                                                    : { pathLength: 0, opacity: 0 }
                                            }
                                            animate={
                                                isSegmentDrawn
                                                    ? { pathLength: 1, opacity: 1 }
                                                    : { pathLength: 0, opacity: 0 }
                                            }
                                            transition={{
                                                pathLength: {
                                                    duration: 0.65,
                                                    ease: [0.4, 0, 0.2, 1],
                                                },
                                                opacity: { duration: 0.1 },
                                            }}
                                        />
                                    );
                                })}

                                {/* Crisp Fully-Opaque Gold Milestone Circles Rendered AFTER the stroke */}
                                <circle
                                    cx={DESKTOP_START_DOT.x}
                                    cy={DESKTOP_START_DOT.y}
                                    r="7.5"
                                    fill="#D4AF37"
                                    stroke="#FFF6D3"
                                    strokeWidth="2.5"
                                    filter="url(#gold-glow)"
                                    opacity={
                                        prefersReducedMotion || activeDesktopPhase >= 1 ? 1 : 0
                                    }
                                    style={{
                                        transformOrigin: `${DESKTOP_START_DOT.x}px ${DESKTOP_START_DOT.y}px`,
                                        transition: prefersReducedMotion
                                            ? "none"
                                            : "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                        transform:
                                            prefersReducedMotion || activeDesktopPhase >= 1
                                                ? "scale(1)"
                                                : "scale(0)",
                                    }}
                                />

                                {DESKTOP_SEGMENTS.map((seg) => {
                                    const isSegmentDrawn =
                                        prefersReducedMotion || activeDesktopPhase >= seg.id;

                                    return (
                                        <circle
                                            key={`dot-${seg.id}`}
                                            cx={seg.dotX}
                                            cy={seg.dotY}
                                            r="7.5"
                                            fill="#D4AF37"
                                            stroke="#FFF6D3"
                                            strokeWidth="2.5"
                                            filter="url(#gold-glow)"
                                            opacity={isSegmentDrawn ? 1 : 0}
                                            style={{
                                                transformOrigin: `${seg.dotX}px ${seg.dotY}px`,
                                                transition: prefersReducedMotion
                                                    ? "none"
                                                    : "opacity 0.35s ease 0.55s, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.55s",
                                                transform: isSegmentDrawn ? "scale(1)" : "scale(0)",
                                            }}
                                        />
                                    );
                                })}
                            </svg>
                        </div>

                        {/* ── 3. LOWER CONTENT LAYER (All 4 Phases) ── */}
                        <div className="workpath-lower-layer">
                            <div className="workpath-columns-grid">
                                {phases.map((phase) => {
                                    const isRevealed =
                                        prefersReducedMotion || activeDesktopPhase >= phase.id;

                                    return (
                                        <div
                                            key={phase.id}
                                            className="workpath-lower-col"
                                        >
                                            <motion.div
                                                initial={
                                                    prefersReducedMotion
                                                        ? { opacity: 1, y: 0 }
                                                        : { opacity: 0, y: -20 }
                                                }
                                                animate={
                                                    isRevealed
                                                        ? { opacity: 1, y: 0 }
                                                        : { opacity: 0, y: -20 }
                                                }
                                                transition={{
                                                    duration: 0.55,
                                                    ease: [0.25, 1, 0.5, 1],
                                                    delay: prefersReducedMotion ? 0 : 0.1,
                                                }}
                                            >
                                                <p className="workpath-phase-desc">
                                                    {phase.description}
                                                </p>
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* =====================================================
            MOBILE VIEW (< 768px)
            Mobile-Specific S-Curve Pathway with Dedicated Positioning & Animations
            ====================================================== */}
                <div className="workpath-mobile-view">
                    <div ref={mobileTimelineRef} className="workpath-mobile-timeline">
                        {/* Background S-Curve SVG */}
                        <div className="workpath-mobile-svg-wrap" aria-hidden="true">
                            <svg
                                viewBox="0 0 380 1340"
                                preserveAspectRatio="none"
                                className="workpath-mobile-svg"
                            >
                                <defs>
                                    <filter
                                        id="mobile-gold-glow"
                                        x="-50%"
                                        y="-50%"
                                        width="200%"
                                        height="200%"
                                    >
                                        <feDropShadow
                                            dx="0"
                                            dy="1.5"
                                            stdDeviation="2"
                                            floodColor="rgba(152, 116, 0, 0.4)"
                                        />
                                    </filter>
                                </defs>

                                {/* Wide Mobile S-Curve Path terminating precisely at (290, 1260) */}
                                <path
                                    ref={mobilePathRef}
                                    d={MOBILE_PATH_D}
                                    fill="none"
                                    stroke="#987400"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeDasharray={prefersReducedMotion ? "none" : "2000"}
                                    strokeDashoffset={prefersReducedMotion ? "0" : "2000"}
                                />

                                {/* 4 Gold Milestone Dots with mobile-only independent marker offsets */}
                                {MOBILE_DOTS.map((dot, idx) => {
                                    const phaseConfig = mobilePhases[idx];
                                    const markerOffset =
                                        phaseConfig?.mobilePosition?.markerOffset || {};
                                    const finalX = dot.x + (markerOffset.x || 0);
                                    const finalY = dot.y + (markerOffset.y || 0);
                                    const isRevealed =
                                        prefersReducedMotion || mobileRevealed[dot.id];

                                    return (
                                        <circle
                                            key={dot.id}
                                            cx={finalX}
                                            cy={finalY}
                                            r="7.5"
                                            fill="#D4AF37"
                                            stroke="#FFF6D3"
                                            strokeWidth="2.5"
                                            filter="url(#mobile-gold-glow)"
                                            opacity={isRevealed ? 1 : 0}
                                            style={{
                                                transformOrigin: `${finalX}px ${finalY}px`,
                                                transition: prefersReducedMotion
                                                    ? "none"
                                                    : "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                                transform: isRevealed ? "scale(1)" : "scale(0)",
                                            }}
                                        />
                                    );
                                })}
                            </svg>
                        </div>

                        {/* 4 Alternating Mobile Phase Sections with dedicated mobile positioning & bidirectional reverse animations */}
                        {mobilePhases.map((phase) => {
                            const isRevealed =
                                prefersReducedMotion || mobileRevealed[phase.id];

                            // Phase 1 & 3: Upper RIGHT, Lower LEFT
                            // Phase 2 & 4: Upper LEFT, Lower RIGHT
                            const isUpperLeft = phase.id % 2 === 0;

                            // Mobile-specific positioning & animation properties
                            const posConfig = phase.mobilePosition || {};
                            const animConfig = phase.mobileAnimation || {};

                            const entranceDistance = animConfig.entranceOffset ?? 35;
                            const duration = animConfig.duration ?? 0.55;
                            const delay = animConfig.delay ?? 0.05;
                            const ease = animConfig.ease ?? "cubic-bezier(0.25, 1, 0.5, 1)";

                            const upperOffset = posConfig.upperContentOffset || {};
                            const lowerOffset = posConfig.lowerContentOffset || {};

                            const upperContent = (
                                <div
                                    className={`workpath-mobile-content workpath-mobile-content--upper ${isUpperLeft
                                        ? "workpath-mobile-content--left"
                                        : "workpath-mobile-content--right"
                                        }`}
                                    style={{
                                        opacity: isRevealed ? 1 : 0,
                                        transform: isRevealed
                                            ? `translate(${upperOffset.x || 0}px, ${upperOffset.y || 0
                                            }px)`
                                            : `translate(${(isUpperLeft
                                                ? -entranceDistance
                                                : entranceDistance) +
                                            (upperOffset.x || 0)
                                            }px, ${upperOffset.y || 0}px)`,
                                        transformOrigin:
                                            posConfig.transformOrigin ||
                                            (isUpperLeft ? "center left" : "center right"),
                                        transition: prefersReducedMotion
                                            ? "none"
                                            : `opacity ${duration}s ${ease} ${delay}s, transform ${duration}s ${ease} ${delay}s`,
                                    }}
                                >
                                    <h3 className="workpath-phase-num">
                                        {phase.phaseNumber}
                                    </h3>
                                    <h4 className="workpath-phase-title">{phase.title}</h4>
                                    <ul className="workpath-phase-list">
                                        {phase.items.map((item, idx) => (
                                            <li key={idx} className="workpath-phase-item">
                                                <span
                                                    className="workpath-bullet"
                                                    aria-hidden="true"
                                                />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );

                            const lowerContent = (
                                <div
                                    className={`workpath-mobile-content workpath-mobile-content--lower ${isUpperLeft
                                        ? "workpath-mobile-content--right"
                                        : "workpath-mobile-content--left"
                                        }`}
                                    style={{
                                        opacity: isRevealed ? 1 : 0,
                                        transform: isRevealed
                                            ? `translate(${lowerOffset.x || 0}px, ${lowerOffset.y || 0
                                            }px)`
                                            : `translate(${(isUpperLeft
                                                ? entranceDistance
                                                : -entranceDistance) +
                                            (lowerOffset.x || 0)
                                            }px, ${lowerOffset.y || 0}px)`,
                                        transformOrigin:
                                            posConfig.transformOrigin ||
                                            (isUpperLeft ? "center right" : "center left"),
                                        transition: prefersReducedMotion
                                            ? "none"
                                            : `opacity ${duration}s ${ease} ${delay + 0.08
                                            }s, transform ${duration}s ${ease} ${delay + 0.08
                                            }s`,
                                    }}
                                >
                                    <p className="workpath-phase-desc">{phase.description}</p>
                                </div>
                            );

                            return (
                                <div
                                    key={phase.id}
                                    data-phase-id={phase.id}
                                    className="workpath-mobile-row"
                                    style={{
                                        gap: `${posConfig.spacing ?? 24}px`,
                                    }}
                                >
                                    {isUpperLeft ? (
                                        <>
                                            {upperContent}
                                            {lowerContent}
                                        </>
                                    ) : (
                                        <>
                                            {lowerContent}
                                            {upperContent}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WorkPathSection;
