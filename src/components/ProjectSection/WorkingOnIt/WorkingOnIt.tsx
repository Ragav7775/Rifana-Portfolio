import React from "react";
import Link from "next/link";
import "./WorkingOnIt.css";

export interface WorkingOnItProps {
    categoryTitle?: string;
    categorySlug?: string;
    description?: string;
    className?: string;
}

export function WorkingOnIt({
    categoryTitle,
    categorySlug,
    description,
    className = "",
}: WorkingOnItProps) {
    const displayTitle = categoryTitle || (categorySlug ? categorySlug.replace(/-/g, " ") : "this collection");

    return (
        <section
            className={`working-on-it ${className}`}
            aria-label={`${displayTitle} projects in development`}
        >
            {/* Subtle Status Cue */}
            <div className="working-on-it-status">
                <span className="working-on-it-dot" aria-hidden="true" />
                <span className="working-on-it-label">In Development</span>
            </div>

            {/* Core Typography Message */}
            <h2 className="working-on-it-title">
                Currently No Projects —{" "}
                <span className="working-on-it-accent">I&apos;m Working On It.</span>
            </h2>

            {/* Concise Supportive Note */}
            <p className="working-on-it-text">
                {description ||
                    `Curating selected design case studies and process documentation for ${displayTitle}. Check back soon or explore featured projects.`}
            </p>

            {/* Minimalist Return Link */}
            <div className="working-on-it-nav">
                <Link href="/#projects" className="working-on-it-link">
                    <span aria-hidden="true">&larr;</span> Explore Other Works
                </Link>
            </div>
        </section>
    );
}

export default WorkingOnIt;
