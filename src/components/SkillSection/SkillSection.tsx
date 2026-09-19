"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
    motion,
    useTransform,
    AnimatePresence,
    useMotionValue,
    useSpring,
} from "motion/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { ANIMATION_CONFIG, SkillItemConfig, SKILLS, VIEWPORT_TRIGGER_CONFIG } from "@/data/SkillData";
export { ANIMATION_CONFIG, SKILLS, VIEWPORT_TRIGGER_CONFIG };
export type { SkillItemConfig };
import SkilledRifanaImg from "@/assets/Avatars/Skilled-Rifana-image.png";

import "./SkillSection.css";


/* ============================================================
   INDIVIDUAL SKILL ITEM WITH ACETERNITY ANIMATED TOOLTIP + SHADCN AVATAR
   ============================================================ */

interface SkillItemProps {
    skill: SkillItemConfig;
    inView: boolean;
    isMobile: boolean;
    isTablet: boolean;
    prefersReducedMotion: boolean;
}

function SkillAvatarItem({
    skill,
    inView,
    isMobile,
    isTablet,
    prefersReducedMotion,
}: SkillItemProps) {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const mouseX = useMotionValue(0);
    const animationFrameRef = useRef<number | null>(null);

    const springConfig = { stiffness: 100, damping: 15 };
    const rotate = useSpring(
        useTransform(mouseX, [-50, 50], [-25, 25]),
        springConfig
    );
    const tooltipTranslateX = useSpring(
        useTransform(mouseX, [-50, 50], [-25, 25]),
        springConfig
    );

    // Cancel pending animation frame on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, []);

    // Mouse move handler with proper synchronous capture of target and clientX
    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.currentTarget;
        const clientX = event.clientX;

        if (!target) return;

        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
            if (!target) return;
            const rect = target.getBoundingClientRect();
            const halfWidth = rect.width / 2;

            mouseX.set(clientX - rect.left - halfWidth);
            animationFrameRef.current = null;
        });
    };

    // Calculate target position and size based on active breakpoint
    const targetPos = isMobile
        ? skill.position.mobile
        : isTablet && skill.position.tablet
            ? skill.position.tablet
            : skill.position.desktop;

    const targetSize = isMobile
        ? skill.size.mobile
        : isTablet && skill.size.tablet
            ? skill.size.tablet
            : skill.size.desktop;

    const targetScale = isMobile
        ? skill.scale?.mobile ?? ANIMATION_CONFIG.finalScale
        : skill.scale?.desktop ?? ANIMATION_CONFIG.finalScale;

    // Stagger delay calculation based on configured order
    const staggerDelay = (skill.order - 1) * ANIMATION_CONFIG.stagger;
    const returnDelay = (SKILLS.length - skill.order) * ANIMATION_CONFIG.returnStagger;

    return (
        <motion.div
            className="skill-avatar-wrapper"
            style={
                {
                    width: `${targetSize}px`,
                    height: `${targetSize}px`,
                } as React.CSSProperties
            }
            initial={
                prefersReducedMotion
                    ? {
                        x: targetPos.x,
                        y: targetPos.y,
                        opacity: 1,
                        scale: targetScale,
                    }
                    : {
                        x: 0,
                        y: 0,
                        opacity: ANIMATION_CONFIG.initialOpacity,
                        scale: ANIMATION_CONFIG.initialScale,
                    }
            }
            animate={
                prefersReducedMotion
                    ? {
                        x: targetPos.x,
                        y: targetPos.y,
                        opacity: 1,
                        scale: targetScale,
                    }
                    : inView
                        ? {
                            x: targetPos.x,
                            y: targetPos.y,
                            opacity: ANIMATION_CONFIG.finalOpacity,
                            scale: targetScale,
                            transition: {
                                type: "spring",
                                stiffness: ANIMATION_CONFIG.springStiffness,
                                damping: ANIMATION_CONFIG.springDamping,
                                duration: ANIMATION_CONFIG.duration,
                                delay: staggerDelay,
                            },
                        }
                        : {
                            x: 0,
                            y: 0,
                            opacity: ANIMATION_CONFIG.initialOpacity,
                            scale: ANIMATION_CONFIG.initialScale,
                            transition: {
                                duration: ANIMATION_CONFIG.returnDuration,
                                ease: [0.4, 0, 0.2, 1],
                                delay: returnDelay,
                            },
                        }
            }
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                if (animationFrameRef.current !== null) {
                    cancelAnimationFrame(animationFrameRef.current);
                    animationFrameRef.current = null;
                }
                setIsHovered(false);
                mouseX.set(0);
            }}
            onMouseMove={handleMouseMove}
            tabIndex={0}
            aria-label={skill.name}
        >
            {/* Aceternity Animated Tooltip */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.6 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                                type: "spring",
                                stiffness: 260,
                                damping: 12,
                            },
                        }}
                        exit={{ opacity: 0, y: 12, scale: 0.6 }}
                        style={{
                            translateX: tooltipTranslateX,
                            rotate: rotate,
                            whiteSpace: "nowrap",
                        }}
                        className="skill-animated-tooltip"
                    >
                        {/* Glow Gradient Accent Lines */}
                        <div className="skill-tooltip-glow-1" />
                        <div className="skill-tooltip-glow-2" />
                        <div className="skill-tooltip-name">{skill.tooltip}</div>
                        {skill.designation && (
                            <div className="skill-tooltip-sub">{skill.designation}</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* shadcn/ui Avatar Component */}
            <Avatar className="skill-avatar-root">
                <AvatarImage
                    src={skill.image.src}
                    alt={skill.name}
                    className="skill-avatar-img"
                />
                <AvatarFallback className="skill-avatar-fallback">
                    {skill.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
        </motion.div>
    );
}

/* ============================================================
   SKILL SECTION COMPONENT
   ============================================================ */

export interface SkillSectionProps {
    className?: string;
}

export function SkillSection({ className = "" }: SkillSectionProps) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const headerRef = useRef<HTMLElement | null>(null);
    const [inView, setInView] = useState<boolean>(false);
    const { isMobile, isTablet } = useMediaQuery();
    const prefersReducedMotion = usePrefersReducedMotion();

    // Exact Header-Targeted Viewport Trigger Detection (Desktop: 0px, Mobile: 20% viewport)
    useEffect(() => {
        let ticking = false;

        const updateVisibility = () => {
            const header = headerRef.current;
            const section = sectionRef.current;
            if (!header || !section) return;

            const headerRect = header.getBoundingClientRect();
            const sectionRect = section.getBoundingClientRect();
            // const viewportHeight = window.innerHeight;
            // const isMobileView = window.innerWidth < 768;

            // // Trigger Point:
            // // Desktop: 0px (when top edge of .skill-header reaches top of browser viewport)
            // // Mobile: 20% of browser window height from top
            // const triggerPoint = isMobileView ? viewportHeight * 0.20 : 0;
            const viewportHeight = window.innerHeight;
            const width = window.innerWidth;

            let triggerPercentage: number;

            if (width < 768) {
                // Mobile: 20%
                triggerPercentage = VIEWPORT_TRIGGER_CONFIG.mobile;
            } else if (width < 1024) {
                // Tablet: 20%
                triggerPercentage = VIEWPORT_TRIGGER_CONFIG.tablet;
            } else {
                // Desktop: 10%
                triggerPercentage = VIEWPORT_TRIGGER_CONFIG.desktop;
            }

            const triggerPoint = viewportHeight * triggerPercentage;

            // Trigger when .skill-header top crosses or reaches the trigger line
            const hasReachedTrigger = headerRect.top <= triggerPoint;

            // Section is still relevant/visible (not completely scrolled off top)
            const isNotCompletelyGone = sectionRect.bottom > triggerPoint;

            setInView(hasReachedTrigger && isNotCompletelyGone);
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateVisibility);
                ticking = true;
            }
        };

        updateVisibility();

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", updateVisibility);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", updateVisibility);
        };
    }, []);

    return (
        <section
            id="skills"
            ref={sectionRef}
            className={`skill-section ${className}`}
            aria-label="Skill Sets"
        >
            <div className="skill-inner">
                {/* =====================================================
            HEADER COMPOSITION: "SKILL" + "Sets" (Trigger Target)
            ====================================================== */}
                <header
                    ref={headerRef}
                    className="skill-header"
                >
                    <div className="skill-title-group">
                        <h2 className="skill-title-main">SKILL</h2>
                        <span className="skill-title-script">Sets</span>
                    </div>
                </header>

                {/* =====================================================
            STAGE CONTAINER: Center Character + Exploding Skill Avatars
            ====================================================== */}
                <div className="skill-stage-container">
                    {/* Centered Anchor Character */}
                    <div className="skill-character-anchor">
                        <div className="skill-character-frame">
                            <Image
                                src={SkilledRifanaImg}
                                alt="Rifana standing with crossed arms as center anchor for skill sets"
                                width={200}
                                height={380}
                                priority
                                className="skill-character-img"
                            />
                        </div>
                    </div>

                    {/* Floating Skill Avatars that spawn outward from center */}
                    <div className="skill-avatars-container" aria-hidden="false">
                        {SKILLS.map((skill) => (
                            <SkillAvatarItem
                                key={skill.id}
                                skill={skill}
                                inView={inView}
                                isMobile={isMobile}
                                isTablet={isTablet}
                                prefersReducedMotion={prefersReducedMotion}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SkillSection;
