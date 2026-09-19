import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page Not Found — Rifana Portfolio",
    description: "The page you are looking for does not exist or has been moved.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {
    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--color-bg, #fff6d3)",
                color: "var(--color-dark-green, #07553d)",
                padding: "2rem 1.5rem",
                fontFamily: "var(--font-inter, sans-serif)",
            }}
        >
            <div
                style={{
                    maxWidth: "580px",
                    width: "100%",
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.65)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderRadius: "1.5rem",
                    border: "1px solid rgba(7, 85, 61, 0.14)",
                    padding: "3rem 2rem",
                    boxShadow: "0 16px 40px -12px rgba(7, 85, 61, 0.08)",
                }}
            >
                <span
                    style={{
                        display: "inline-block",
                        fontFamily: "var(--font-tempting, serif)",
                        fontSize: "clamp(4rem, 10vw, 6.5rem)",
                        lineHeight: 1,
                        color: "var(--color-gold, #d4af37)",
                        fontWeight: 400,
                        marginBottom: "0.5rem",
                    }}
                >
                    404
                </span>

                <h1
                    style={{
                        fontFamily: "var(--font-tempting, serif)",
                        fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                        fontWeight: 400,
                        color: "var(--color-dark-green, #07553d)",
                        margin: "0 0 1rem",
                    }}
                >
                    Page Not Found
                </h1>

                <p
                    style={{
                        fontFamily: "var(--font-alegreya, serif)",
                        fontSize: "1rem",
                        lineHeight: 1.6,
                        color: "rgba(7, 85, 61, 0.8)",
                        marginBottom: "2rem",
                    }}
                >
                    The creative piece or route you were looking for doesn&apos;t exist or might have been reorganized.
                    Let&apos;s guide you back to the portfolio showcase.
                </p>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                        flexWrap: "wrap",
                    }}
                >
                    <Link
                        href="/"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.75rem 1.625rem",
                            borderRadius: "9999px",
                            backgroundColor: "var(--color-dark-green, #07553d)",
                            color: "#ffffff",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                        }}
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
