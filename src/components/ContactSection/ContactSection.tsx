"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useReducedMotion } from "motion/react";
import { Send } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendMessageDialog } from "@/components/ui/send-message-dialog";
import {
  MAIL_CONFIG,
  formatEmailBody,
  buildMailtoUrl,
  buildGmailComposeUrl,
} from "@/config/MailConfig";
import { Globe3D, type GlobeMarker } from "@/components/ui/3d-globe";
import DragAnimatedSVG, {
  type DragAnimatedSVGConfigBreakpoints,
} from "@/components/ui/drag-animated-svg";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import ContactRifanaAvatarImg from "@/assets/Avatars/Curiosity-Rifana-image.png";
import ContactMessageRifanaImg from "@/assets/Avatars/Contact-Message-Rifana-image.png"

import "./ContactSection.css";

/* ============================================================
   MANUALLY DEFINED SVG CONFIGURATION (MATCHING PROJECTSECTION)
   Full config for Desktop, Tablet, and Mobile breakpoints
   ============================================================ */

export const CONTACT_SECTION_CONFIG: DragAnimatedSVGConfigBreakpoints = {
  desktop: {
    width: 1300,
    height: 2200,
    duration: 3,
    dashCount: 132,
    strokeWidth: 6,
    boxSize: 22,
    dashSpeed: 2,
    delay: 0.05,
    viewportPercentage: 45,
    cursorSize: 1.8,
    cursorPosition: { x: -16, y: 145 },
  },
  tablet: {
    width: 1100,
    height: 1200,
    duration: 3,
    dashCount: 92,
    strokeWidth: 5,
    boxSize: 20,
    dashSpeed: 2,
    delay: 0.05,
    viewportPercentage: 40,
    cursorSize: 1.8,
    cursorPosition: { x: -20, y: 150 },
  },
  mobile: {
    width: 1045,
    height: 2025,
    duration: 3,
    dashCount: 92,
    strokeWidth: 4,
    dashSpeed: 1.5,
    boxSize: 24,
    delay: 0.05,
    viewportPercentage: 40,
    cursorSize: 1.8,
    cursorPosition: { x: -20, y: 150 },
  },
};

/**
 * Backward-compatible dimension mapping
 */
export const CONTACT_SECTION_SVG_DIMENSIONS = {
  desktop: { width: CONTACT_SECTION_CONFIG.desktop.width, height: CONTACT_SECTION_CONFIG.desktop.height },
  tablet: { width: CONTACT_SECTION_CONFIG.tablet.width, height: CONTACT_SECTION_CONFIG.tablet.height },
  mobile: { width: CONTACT_SECTION_CONFIG.mobile.width, height: CONTACT_SECTION_CONFIG.mobile.height },
};

/* ============================================================
   MANUALLY DEFINED GLOBE ROTATION SPEED CONFIGURATION
   Easily adjust rotation speed for Desktop, Tablet, and Mobile
   ============================================================ */

export const GLOBE_ROTATION_SPEED = {
  desktop: 1.5,
  tablet: 4.5,
  mobile: 4.5,
} as const;

/* ============================================================
   MANUALLY DEFINED GLOBE SCALE CONFIGURATION
   Final rendered scale for Desktop, Tablet, and Mobile
   ============================================================ */

export const GLOBE_SCALE = {
  desktop: 1.082,
  tablet: 1.125,
  mobile: 1.125,
} as const;

/* ============================================================
   VALIDATION SCHEMA (ZOD SOURCE OF TRUTH)
   ============================================================ */

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(254, "Email cannot exceed 254 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message cannot exceed 5000 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/* ============================================================
   PREDEFINED CONSTANTS & PLACEHOLDERS
   ============================================================ */

export const CONTACT_CONFIG = {
  recipientEmail: MAIL_CONFIG.recipientEmail,
  subject: MAIL_CONFIG.subjects.contactForm,
  socials: {
    linkedin: "https://www.linkedin.com/in/rifana-a-uiux/",
    github: "https://github.com/Rifana7jasmine",
    instagram: "https://www.instagram.com/she_ui_ux/",
  },
} as const;

export { formatEmailBody, buildMailtoUrl, buildGmailComposeUrl };

/* ============================================================
   CHENNAI AVATAR MARKER FOR 3D GLOBE
   ============================================================ */

const CHENNAI_MARKERS: GlobeMarker[] = [
  {
    lat: 13.0827,
    lng: 80.2707,
    src: ContactRifanaAvatarImg.src,
    label: "Chennai, India",
    size: 32,
  },
];

/* ============================================================
   SOCIAL BRAND ICONS (ACCESSIBLE SVG PRIMITIVES)
   ============================================================ */

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}



/* ============================================================
   COMPONENT PROPS
   ============================================================ */

export interface ContactSectionProps {
  className?: string;
  id?: string;
  /**
   * Optional manual override for globe rotation speeds per breakpoint.
   * If omitted, GLOBE_ROTATION_SPEED constants are used.
   */
  rotationSpeed?: {
    desktop?: number;
    tablet?: number;
    mobile?: number;
  };
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export function ContactSection({
  className = "",
  id = "contact",
  rotationSpeed,
}: ContactSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Responsive device media queries matching project breakpoints
  const { isMobile, isTablet } = useMediaQuery();

  // Manual rotation speed control with breakpoint-optimized settings
  const baseRotationSpeed = isMobile
    ? (rotationSpeed?.mobile ?? GLOBE_ROTATION_SPEED.mobile)
    : isTablet
      ? (rotationSpeed?.tablet ?? GLOBE_ROTATION_SPEED.tablet)
      : (rotationSpeed?.desktop ?? GLOBE_ROTATION_SPEED.desktop);

  const activeRotationSpeed = shouldReduceMotion ? 0.05 : baseRotationSpeed;

  const svgConfig = isMobile
    ? CONTACT_SECTION_CONFIG.mobile
    : isTablet
      ? CONTACT_SECTION_CONFIG.tablet
      : CONTACT_SECTION_CONFIG.desktop;

  const [globeLoaded, setGlobeLoaded] = useState(false);
  const handleGlobeReady = useCallback(() => setGlobeLoaded(true), []);
  const globeEndScale = isMobile
    ? GLOBE_SCALE.mobile
    : isTablet
      ? GLOBE_SCALE.tablet
      : GLOBE_SCALE.desktop;

  const globeConfig = useMemo(
    () => ({
      radius: 2.35,
      autoRotateSpeed: activeRotationSpeed,
      ambientIntensity: 0.85,
      pointLightIntensity: 1.8,
      showAtmosphere: false,
      enableZoom: false,
      enablePan: false,
      backgroundColor: null,
      initialRotation: {
        x: 0.12,
        y: 4.4,
      },
      markerSize: 32,
    }),
    [activeRotationSpeed]
  );

  /**
   * Compute pixel-perfect coordinates mapping the children card
   * to the internal selection rectangle geometry of DragAnimatedSVG
   * (BOX_X = 47.5005, BOX_Y = 5.5 for cursor="left")
   */
  const frameStyle = useMemo<React.CSSProperties>(() => {
    const BOX_X = 47.5005;
    const BOX_Y = 5.5;
    const right = BOX_X + svgConfig.width;
    const bottom = BOX_Y + svgConfig.height;
    const svgWidth = Math.max(1007, right + 4);
    const svgHeight = Math.max(220, bottom + 48);

    return {
      position: "absolute",
      left: `${(BOX_X / svgWidth) * 100}%`,
      top: `${(BOX_Y / svgHeight) * 100}%`,
      width: `${(svgConfig.width / svgWidth) * 100}%`,
      height: `${(svgConfig.height / svgHeight) * 100}%`,
    };
  }, [svgConfig.width, svgConfig.height]);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<ContactFormData | null>(
    null
  );

  // Form Management
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Valid Submission Handler
  const onSubmit = (data: ContactFormData) => {
    setSubmittedData(data);
    setIsDialogOpen(true);
  };



  return (
    <section
      id={id}
      aria-label="Contact Section"
      className={`contact-section ${className}`}
    >
      <div className="contact-inner">
        {/* ==============================================================
            OVERALL SECTION HEADER: CONTACT + Get In [Rifana] Touch...
            ============================================================== */}
        <header className="contact-section-header">
          <h2 className="contact-section-title-main">CONTACT</h2>
          <div className="contact-section-title-sub-wrap">
            <span className="contact-section-title-script">Get In</span>
            <div className="contact-section-header-character">
              <Image
                src={ContactMessageRifanaImg}
                alt="Rifana with contact message"
                width={80}
                height={100}
                priority
                style={{ width: "auto", height: "auto" }}
                className="contact-header-char-img"
              />
            </div>
            <span className="contact-section-title-script contact-section-title-script-touch">Touch...</span>
          </div>
        </header>

        {/* ==============================================================
            TWO-COLUMN CONTAINER: BIG GLOBE ON LEFT, FORM ON RIGHT
            ============================================================== */}
        <div className="contact-container">
          {/* ────────────────────────────────────────────────────────────
              LEFT SIDE: 3D GLOBE (LARGER / PROMINENT) WITH CHENNAI MARKER
              (NO ATMOSPHERE)
              ──────────────────────────────────────────────────────────── */}
          <div
            className="contact-globe-wrapper"
            style={{
              position: "relative",
              width: "100%",
              height: isMobile ? "clamp(320px, 85vw, 480px)" : isTablet ? "420px" : "100%",
              minHeight: isMobile ? "320px" : isTablet ? "420px" : undefined,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "visible",
              flex: "0 0 auto",
            }}
          >
            <motion.div
              className="contact-globe-inner"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: globeLoaded ? 1 : 0,
                scale: globeLoaded || shouldReduceMotion ? globeEndScale : 0.85,
              }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 1.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                position: "relative",
                transformOrigin: "center center",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                overflow: "visible",
              }}
            >
              <Globe3D
                markers={CHENNAI_MARKERS}
                config={globeConfig}
                onReady={handleGlobeReady}
                className="contact-globe-canvas"
              />
            </motion.div>
          </div>

          {/* ────────────────────────────────────────────────────────────
              RIGHT SIDE: CONTACT CARD ENCAPSULATED IN DRAG-ANIMATED-SVG
              (Identical architectural pattern as established in ProjectSection)
              ──────────────────────────────────────────────────────────── */}
          <div className="contact-card-wrapper">
            {/* Main Dashed Container with DragAnimatedSVG */}
            <div className="contact-dashed-container">
              <DragAnimatedSVG
                width={svgConfig.width}
                height={svgConfig.height}
                duration={shouldReduceMotion ? 0.01 : svgConfig.duration}
                sides="all"
                cursor="left"
                dashCount={svgConfig.dashCount}
                strokeWidth={svgConfig.strokeWidth}
                boxSize={svgConfig.boxSize}
                cursorSize={svgConfig.cursorSize}
                cursorPosition={svgConfig.cursorPosition}
                dashSpeed={shouldReduceMotion ? 0 : svgConfig.dashSpeed}
                dashDirection="reverse"
                delay={svgConfig.delay}
                viewportPercentage={svgConfig.viewportPercentage}
                className="contact-drag-svg"
              >
                {/* Encapsulated Card Content Frame - Positioned inside Selection Box */}
                <div className="contact-card-frame" style={frameStyle}>
                  <Card className="contact-card">
                    {/* Simple, Styled Card Header with Clean Typography */}
                    <CardHeader className="contact-card-header">
                      <CardTitle className="contact-card-title">
                        Send a Message
                      </CardTitle>
                      <CardDescription className="contact-card-description">
                        Have an opportunity or question? Let&apos;s connect.
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="contact-content">
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="contact-form"
                        noValidate
                      >
                        {/* Name Input */}
                        <div className="contact-field">
                          <label htmlFor="contact-name" className="contact-label">
                            Name{" "}
                            <span className="contact-required" aria-hidden="true">
                              *
                            </span>
                          </label>
                          <Input
                            id="contact-name"
                            placeholder="Enter your name"
                            autoComplete="name"
                            aria-required="true"
                            aria-invalid={errors.name ? "true" : "false"}
                            aria-describedby={
                              errors.name ? "contact-name-error" : undefined
                            }
                            className={`contact-input ${errors.name ? "contact-input-error" : ""
                              }`}
                            {...register("name")}
                          />
                          {errors.name && (
                            <p
                              id="contact-name-error"
                              className="contact-error"
                              role="alert"
                            >
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        {/* Email Input */}
                        <div className="contact-field">
                          <label htmlFor="contact-email" className="contact-label">
                            Email{" "}
                            <span className="contact-required" aria-hidden="true">
                              *
                            </span>
                          </label>
                          <Input
                            id="contact-email"
                            type="email"
                            placeholder="name@domain.com"
                            autoComplete="email"
                            aria-required="true"
                            aria-invalid={errors.email ? "true" : "false"}
                            aria-describedby={
                              errors.email ? "contact-email-error" : undefined
                            }
                            className={`contact-input ${errors.email ? "contact-input-error" : ""
                              }`}
                            {...register("email")}
                          />
                          {errors.email && (
                            <p
                              id="contact-email-error"
                              className="contact-error"
                              role="alert"
                            >
                              {errors.email.message}
                            </p>
                          )}
                        </div>

                        {/* Message Input */}
                        <div className="contact-field">
                          <label htmlFor="contact-message" className="contact-label">
                            Message{" "}
                            <span className="contact-required" aria-hidden="true">
                              *
                            </span>
                          </label>
                          <Textarea
                            id="contact-message"
                            rows={4}
                            placeholder="Describe your project, ideas, or questions..."
                            aria-required="true"
                            aria-invalid={errors.message ? "true" : "false"}
                            aria-describedby={
                              errors.message ? "contact-message-error" : undefined
                            }
                            className={`contact-textarea ${errors.message ? "contact-input-error" : ""
                              }`}
                            {...register("message")}
                          />
                          {errors.message && (
                            <p
                              id="contact-message-error"
                              className="contact-error"
                              role="alert"
                            >
                              {errors.message.message}
                            </p>
                          )}
                        </div>

                        {/* Submit Action */}
                        <div className="contact-actions">
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="contact-submit-btn"
                          >
                            {isSubmitting ? (
                              <>
                                <span className="contact-spinner" aria-hidden="true" />
                                <span>Validating...</span>
                              </>
                            ) : (
                              <>
                                <Send className="contact-btn-icon" aria-hidden="true" />
                                <span>Send Message</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>

                    {/* Social Links Footer */}
                    <CardFooter className="contact-footer">
                      <div
                        className="contact-socials"
                        role="region"
                        aria-label="Social connections"
                      >
                        <a
                          href={CONTACT_CONFIG.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-social-link"
                          aria-label="Connect on LinkedIn (opens in a new tab)"
                        >
                          <LinkedInIcon
                            className="contact-social-icon"
                            aria-hidden="true"
                          />
                          <span className="contact-social-text">LinkedIn</span>
                        </a>
                        <a
                          href={CONTACT_CONFIG.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-social-link"
                          aria-label="View code on GitHub (opens in a new tab)"
                        >
                          <GitHubIcon
                            className="contact-social-icon"
                            aria-hidden="true"
                          />
                          <span className="contact-social-text">GitHub</span>
                        </a>
                        <a
                          href={CONTACT_CONFIG.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-social-link"
                          aria-label="Follow on Instagram (opens in a new tab)"
                        >
                          <InstagramIcon
                            className="contact-social-icon"
                            aria-hidden="true"
                          />
                          <span className="contact-social-text">Instagram</span>
                        </a>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </DragAnimatedSVG>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          SEND MESSAGE DISPATCH DIALOG (SHARED COMPONENT)
          ============================================================== */}
      <SendMessageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        submittedData={submittedData}
      />
    </section>
  );
}

export default ContactSection;
