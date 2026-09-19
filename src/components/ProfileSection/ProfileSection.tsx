"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import ProfileReadingImg from "@/assets/Avatars/Profile-Reading-Rifana-image.png";
import "./ProfileSection.css";

/* ============================================================
   EDUCATION DATA
   ============================================================ */

export interface EducationEntry {
    id: number;
    institution: string;
    date: string;
    description: string;
}

export const EDUCATION_DATA: EducationEntry[] = [
    {
        id: 1,
        institution: "S.A Engineering College",
        date: "2022 — 2026",
        description:
            "B.E In Computer Science (Artificial Intelligence & Machine Learning) With A CGPA Of 9.05/10. Focused On Machine Learning, Deep Learning, Data Structures And AI System Design.",
    },
    {
        id: 2,
        institution: "Certifications & Continuous Learning",
        date: "2024",
        description:
            "Completed Design & Implementation Of Human-Computer Interfaces Through NPTEL, IIT Guwahati, Strengthening My Understanding Of Human-Computer Interaction And Interface Design, With An Elite Certification.",
    },
];

/* ============================================================
   PROFILE SECTION COMPONENT
   ============================================================ */

export interface ProfileSectionProps {
    className?: string;
}

export function ProfileSection({ className = "" }: ProfileSectionProps) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const timelineContainerRef = useRef<HTMLDivElement | null>(null);
    const timelineLineRef = useRef<HTMLDivElement | null>(null);
    const markersRef = useRef<(HTMLDivElement | null)[]>([]);
    const contentsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Reduced motion preference
    const prefersReducedMotion = usePrefersReducedMotion();

    // GSAP ScrollTrigger Timeline Animation (Forward & Reverse)
    useEffect(() => {
        if (typeof window === "undefined") return;

        if (prefersReducedMotion) {
            if (timelineLineRef.current) {
                timelineLineRef.current.style.transform = "scaleY(1)";
            }
            markersRef.current.forEach((marker) => {
                if (marker) {
                    marker.style.opacity = "1";
                    marker.style.transform = "translate(-50%, -50%) scale(1)";
                }
            });
            contentsRef.current.forEach((content) => {
                if (content) {
                    content.style.opacity = "1";
                    content.style.transform = "translateX(0)";
                }
            });
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const timelineEl = timelineContainerRef.current;
            const lineEl = timelineLineRef.current;
            if (!timelineEl || !lineEl) return;

            // Initial states
            gsap.set(lineEl, { scaleY: 0, transformOrigin: "top center" });
            markersRef.current.forEach((marker) => {
                if (marker) gsap.set(marker, { scale: 0, opacity: 0 });
            });
            contentsRef.current.forEach((content) => {
                if (content) gsap.set(content, { x: -40, opacity: 0 });
            });

            // Master scrubbed timeline synchronized with user scroll
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: timelineEl,
                    start: "top 78%",
                    end: "bottom 70%",
                    scrub: 0.8,
                },
            });

            // Step 1: Draw line from top to Milestone 1
            tl.to(lineEl, {
                scaleY: 0.35,
                ease: "none",
                duration: 1,
            })
                // Reveal Milestone 1 dot with lively pop
                .to(
                    markersRef.current[0],
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.35,
                        ease: "back.out(1.7)",
                    },
                    "-=0.15"
                )
                // Slide in Entry 1 Content from LEFT to RIGHT
                .to(
                    contentsRef.current[0],
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: "power2.out",
                    },
                    "-=0.3"
                )
                // Step 2: Continue drawing line from Milestone 1 to Milestone 2
                .to(lineEl, {
                    scaleY: 1,
                    ease: "none",
                    duration: 1.2,
                })
                // Reveal Milestone 2 dot
                .to(
                    markersRef.current[1],
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.35,
                        ease: "back.out(1.7)",
                    },
                    "-=0.15"
                )
                // Slide in Entry 2 Content from LEFT to RIGHT
                .to(
                    contentsRef.current[1],
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: "power2.out",
                    },
                    "-=0.3"
                );
        }, sectionRef);

        return () => ctx.revert();
    }, [prefersReducedMotion]);

    return (
        <section
            id="profile"
            ref={sectionRef}
            className={`profile-section ${className}`}
            aria-label="Profile and Education"
        >
            <div className="profile-inner">
                {/* =====================================================
            HEADER COMPOSITION: "PROFILE" + "Get To Know Me!"
            ====================================================== */}
                <header className="profile-header">
                    <div className="profile-title-wrapper">
                        <h1 className="profile-title-main">PROFILE</h1>
                        <span className="profile-title-script">Get To Know Me!</span>
                    </div>
                </header>

                {/* =====================================================
            MAIN EDITORIAL LAYOUT: Education Timeline + Illustration
            ====================================================== */}
                <div className="profile-body-layout">
                    {/* Left Column: Education Heading & Vertical Timeline */}
                    <div className="profile-education-area">
                        {/* Education Subheader with Book Icon and Mobile Illustration */}
                        <div className="profile-education-header">
                            <div className="profile-education-heading">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.9999 32.2233V12.2217C19.9999 9.16667 17.4999 6.66667 14.4449 6.66667H3.33325V26.6667H14.5133C19.9999 26.6667 19.9999 32.2233 19.9999 32.2233ZM19.9999 12.2217C19.9999 9.16501 22.4999 6.66667 25.5549 6.66667H36.6666V26.6667H25.5549C19.9999 26.6667 19.9999 32.2233 19.9999 32.2233M23.1249 34.0967C23.4727 33.3765 24.0144 32.7675 24.6892 32.3382C25.364 31.9089 26.1452 31.6764 26.9449 31.6667H34.9999M16.8749 34.0967C16.5335 33.3716 15.9933 32.7583 15.3171 32.3281C14.6408 31.8979 13.8564 31.6686 13.0549 31.6667H4.99992" stroke="black" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <h2 className="profile-education-title">Education</h2>
                            </div>

                            {/* Mobile-Only Illustration inside the education header */}
                            <div
                                className="profile-mobile-illustration"
                                aria-hidden="true"
                            >
                                <Image
                                    src={ProfileReadingImg}
                                    alt="Rifana sitting and reading a book"
                                    width={100}
                                    height={95}
                                    priority
                                    className="profile-mobile-illustration-img"
                                />
                            </div>
                        </div>

                        {/* Timeline & Entries Container */}
                        <div
                            ref={timelineContainerRef}
                            className="profile-timeline-container"
                        >
                            {/* Vertical Continuous Progress Line (Drawn from Top to Bottom) */}
                            <div className="profile-timeline-line-wrap" aria-hidden="true">
                                <div
                                    ref={timelineLineRef}
                                    className="profile-timeline-line-fill"
                                />
                            </div>

                            {/* Education Entries List */}
                            <div className="profile-education-entries">
                                {EDUCATION_DATA.map((entry, index) => (
                                    <article
                                        key={entry.id}
                                        className="profile-education-item"
                                    >
                                        {/* Circular Green Milestone Dot on Timeline Line */}
                                        <div
                                            ref={(el) => {
                                                markersRef.current[index] = el;
                                            }}
                                            className="profile-milestone-marker"
                                            aria-hidden="true"
                                        >
                                            <span className="profile-milestone-dot" />
                                        </div>

                                        {/* Entry Content (Slides from Left to Right) */}
                                        <div
                                            ref={(el) => {
                                                contentsRef.current[index] = el;
                                            }}
                                            className="profile-education-content"
                                        >
                                            <h3 className="profile-entry-institution">
                                                {entry.institution}
                                            </h3>
                                            <p className="profile-entry-date">{entry.date}</p>
                                            <p className="profile-entry-desc">
                                                {entry.description}
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Profile Reading Illustration (Desktop & Tablet) */}
                    <div className="profile-illustration-area">
                        <div className="profile-illustration-frame">
                            <Image
                                src={ProfileReadingImg}
                                alt="Rifana sitting and reading a book next to stacked books and a small plant"
                                width={440}
                                height={420}
                                priority
                                className="profile-illustration-img"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProfileSection;
