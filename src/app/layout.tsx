import React from "react";
import type { Metadata, Viewport } from "next";
import { Alegreya, Inter, The_Nautigal, Unna } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import {
    getSiteUrl,
    SITE_METADATA,
    generatePersonJsonLd,
    generateWebsiteJsonLd,
} from "@/lib/seo";

/* ============================================================
   GOOGLE FONTS
   ============================================================ */

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const alegreya = Alegreya({
    subsets: ["latin"],
    variable: "--font-alegreya",
    style: ["normal", "italic"],
    display: "swap",
});

const unna = Unna({
    subsets: ["latin"],
    variable: "--font-unna",
    weight: ["400", "700"],
    style: ["normal", "italic"],
    display: "swap",
});

const nautigal = The_Nautigal({
    subsets: ["latin"],
    variable: "--font-nautigal",
    weight: ["400", "700"],
    display: "swap",
});


/* ============================================================
   VIEWPORT
   ============================================================ */

export const viewport: Viewport = {
    themeColor: "#07553D",
    colorScheme: "light",
    width: "device-width",
    initialScale: 1,
};

/* ============================================================
   METADATA
   ============================================================ */

export const metadata: Metadata = {
    metadataBase: new URL(getSiteUrl()),

    title: {
        default: SITE_METADATA.title,
        template: SITE_METADATA.titleTemplate,
    },

    description: SITE_METADATA.description,

    keywords: SITE_METADATA.keywords,

    authors: [
        {
            name: SITE_METADATA.authorName,
            url: getSiteUrl(),
        },
    ],

    creator: SITE_METADATA.authorName,

    alternates: {
        canonical: "/",
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    openGraph: {
        type: "website",
        locale: "en_US",
        url: getSiteUrl(),
        siteName: SITE_METADATA.title,
        title: SITE_METADATA.title,
        description: SITE_METADATA.description,
    },

    twitter: {
        card: "summary_large_image",
        title: SITE_METADATA.title,
        description: SITE_METADATA.description,
    },
};

/* ============================================================
   ROOT LAYOUT
   ============================================================ */

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    const personJsonLd = generatePersonJsonLd();
    const websiteJsonLd = generateWebsiteJsonLd();

    return (
        <html
            lang="en"
            className={cn(
                "h-full",
                "antialiased",

                // Font variables
                inter.variable,
                alegreya.variable,
                unna.variable,
                nautigal.variable,
            )}
            data-scroll-behavior="smooth"
        >
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(personJsonLd),
                    }}
                />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(websiteJsonLd),
                    }}
                />
            </head>

            <body className="min-h-full flex flex-col">
                {children}
            </body>
        </html>
    );
}