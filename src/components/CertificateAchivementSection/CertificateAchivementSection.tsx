"use client";

import { useState, useMemo, useId } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Marquee } from "@/components/ui/marquee";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import ExpandableCard, {
    type ExpandableCardItem,
    type ExpandedBoxDeviceConfig,
    EXPANDED_CARD_TRANSITION,
    getSharedLayoutId,
    getCardIdentifier,
} from "@/components/ui/expandable-card";
import {
    certificate_cards,
    logo_marquee,
    type CertificateCard,
    type MarqueeLogo,
} from "@/data/CertificateData";
import "./CertificateAchivementSection.css";

/* ============================================================
   EXPANDED BOX MANUAL POSITION & SIZE CONFIGURATION
   ------------------------------------------------------------
   Individually configure position and dimensions for:
   - Desktop (>= 1024px)
   - Tablet (768px - 1023px)
   - Mobile (< 768px)
   ============================================================ */
export const EXPANDED_BOX_CONFIG: Record<
    "desktop" | "tablet" | "mobile",
    ExpandedBoxDeviceConfig
> = {
    desktop: {
        // Size
        width: 830,
        height: 330,
        maxWidth: "92vw",
        maxHeight: "88vh",
        // Manual Position (Viewport Coordinates)
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "24px",
    },
    tablet: {
        // Size
        width: 620,
        height: "auto",
        maxWidth: "94vw",
        maxHeight: "88vh",
        // Manual Position (Viewport Coordinates)
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "22px",
    },
    mobile: {
        // Size
        width: "calc(100vw - 4.5rem)",
        height: "auto",
        maxWidth: "420px",
        maxHeight: "88vh",
        // Manual Position (Viewport Coordinates)
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "18px",
    },
};

export { EXPANDED_CARD_TRANSITION };

export interface CertificateAchivementSectionProps {
    className?: string;
}

export function CertificateAchivementSection({
    className = "",
}: CertificateAchivementSectionProps) {
    const scopeId = useId();

    /* ============================================================
       MARQUEE PAUSE BEHAVIOR (Decoupled & Non-Stick)
       ------------------------------------------------------------
       - `isAnyCardExpanded`: true when an expanded card is open or
         transitioning.
       - Marquee track animation is frozen instantly on card click,
         and kept frozen until the reverse collapse animation has
         completely finished, ensuring no card movement or jitter.
       ============================================================ */
    const [isAnyCardExpanded, setIsAnyCardExpanded] = useState<boolean>(false);

    /* ============================================================
       DATA PREPARATION
       ------------------------------------------------------------
       Map certificates into standard ExpandableCardItem objects.
       ============================================================ */
    const expandableCards: ExpandableCardItem[] = useMemo(() => {
        return certificate_cards.map((cert: CertificateCard) => ({
            id: cert.id || cert.credentialid,
            title: cert.title,
            description: cert.description,
            image: typeof cert.image === "string" ? cert.image : cert.image.src,
            logo: cert.logo
                ? typeof cert.logo === "string"
                    ? cert.logo
                    : cert.logo.src
                : undefined,
            credentialid: cert.credentialid,
        }));
    }, []);

    return (
        <section
            id="certifications"
            aria-label="Certifications and Achievements"
            className={`cert-achievement-section ${className}`}
        >
            <div className="cert-achievement-inner">
                {/* ── Section Header ──────────────────────────────────── */}
                <div className="cert-section-header">
                    <div className="cert-title-group">
                        <span className="cert-title-main">My</span>
                        <div className="cert-title-script-group">
                            <h2 className="cert-title-script-line-1">Certifications &</h2>
                            <h2 className="cert-title-script-line-2">Achievements</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Certificate Cards Marquee with ExpandableCard Pattern ── */}
            <div className="cert-marquee-wrap">
                <ExpandableCard
                    cards={expandableCards}
                    scopeId={scopeId}
                    expandedBoxConfig={EXPANDED_BOX_CONFIG}
                    transition={EXPANDED_CARD_TRANSITION}
                    onActiveChange={(isActive) => setIsAnyCardExpanded(isActive)}
                    renderContainer={(renderTrackCards) => (
                        <Marquee
                            draggable={true}
                            reverse={false}
                            pauseOnHover={true}
                            seamless
                            className={`cert-marquee ${isAnyCardExpanded ? "is-card-expanded" : ""}`}
                            aria-live="polite"
                        >
                            {(trackIndex) => renderTrackCards(trackIndex)}
                        </Marquee>
                    )}
                    renderCard={(card, openCard, layoutId, trackIndex) => (
                        <motion.div
                            key={`cert-card-motion-${getCardIdentifier(card)}-${trackIndex}-${scopeId}`}
                            layoutId={layoutId}
                            transition={EXPANDED_CARD_TRANSITION}
                            className="cert-card-motion-wrap cursor-pointer"
                            style={{ willChange: "transform" }}
                            onClick={() => openCard(card, trackIndex)}
                        >
                            <Card
                                className="cert-card"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openCard(card, trackIndex);
                                }}
                                role="button"
                                tabIndex={0}
                                aria-expanded={isAnyCardExpanded}
                                aria-label={`View ${card.title} certificate details`}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        openCard(card, trackIndex);
                                    }
                                }}
                            >
                                {/* Header: Organization Logo (Centered) */}
                                <CardHeader className="cert-card-header">
                                    <div className="cert-card-logo-wrap">
                                        {card.logo && (
                                            <motion.img
                                                layoutId={getSharedLayoutId("logo", card, trackIndex, scopeId)}
                                                transition={EXPANDED_CARD_TRANSITION}
                                                src={card.logo}
                                                alt="Organization Logo"
                                                className="cert-card-logo"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        )}
                                    </div>
                                </CardHeader>

                                {/* Main Area: Certificate Preview Image */}
                                <CardContent className="cert-card-content">
                                    <motion.div
                                        layoutId={getSharedLayoutId("image", card, trackIndex, scopeId)}
                                        transition={EXPANDED_CARD_TRANSITION}
                                        className="cert-card-img-wrap"
                                    >
                                        <img
                                            src={card.image}
                                            alt={card.title}
                                            className="cert-card-img"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </motion.div>
                                </CardContent>

                                {/* Footer: Title & 1-line Description with Line Clamp */}
                                <CardFooter className="cert-card-footer">
                                    <motion.div
                                        layoutId={getSharedLayoutId("footer", card, trackIndex, scopeId)}
                                        transition={EXPANDED_CARD_TRANSITION}
                                        className="cert-card-footer-wrap"
                                    >
                                        <motion.div
                                            layoutId={getSharedLayoutId("title", card, trackIndex, scopeId)}
                                            transition={EXPANDED_CARD_TRANSITION}
                                            className="w-full"
                                        >
                                            <CardTitle className="cert-card-title">
                                                {card.title}
                                            </CardTitle>
                                        </motion.div>

                                        <motion.div
                                            layoutId={getSharedLayoutId("description-wrap", card, trackIndex, scopeId)}
                                            transition={EXPANDED_CARD_TRANSITION}
                                            className="cert-card-desc-wrap w-full overflow-hidden"
                                        >
                                            <CardDescription className="cert-card-desc">
                                                {card.description}
                                            </CardDescription>
                                        </motion.div>
                                    </motion.div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )}
                />
            </div>

            <div className="cert-achievement-inner">
                {/* ── "Where I’ve Learned & Earned" Section ────────────── */}
                <div className="cert-earned-section">
                    <div className="cert-earned-header">
                        <h3 className="cert-earned-heading">Where I’ve Learned & Earned</h3>
                    </div>

                    {/* 
                     * Logo Marquee (Left-to-Right):
                     * Transparent backgrounds cleanly on the section canvas.
                     */}
                    <div className="cert-logo-marquee-wrap">
                        <Marquee
                            seamless
                            reverse={true}
                            pauseOnHover={true}
                            className="cert-logo-marquee"
                        >
                            {logo_marquee.map((item: MarqueeLogo) => (
                                <div
                                    key={item.id}
                                    className="cert-logo-item"
                                    title={item.name}
                                    aria-label={item.name}
                                >
                                    <Image
                                        src={item.logo}
                                        alt={item.name}
                                        className="cert-logo-img"
                                        width={110}
                                        height={42}
                                    />
                                </div>
                            ))}
                        </Marquee>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CertificateAchivementSection;
