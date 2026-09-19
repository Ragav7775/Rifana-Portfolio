"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { ArrowUpRight, ArrowUp, MapPin } from "lucide-react";
import { scrollToSection } from "@/hooks/useNavigateHook";
import { SendMessageDialog } from "@/components/ui/send-message-dialog";

import FooterSwingingRifanaImg from "@/assets/Avatars/Swinging-Rifana-image.png";
import FooterCuriosityRifanaImg from "@/assets/Avatars/Curiosity-Rifana-image.png";
import FooterCreativeRifanaImg from "@/assets/Avatars/Braning-Creative-Rifana-image.png";

import "./FooterSection.css";

/* ============================================================
   TYPES & DATA CONTRACTS
   ============================================================ */

export interface FooterSectionProps {
  className?: string;
  id?: string;
}

export interface FooterAvatarData {
  id: string;
  image: StaticImageData;
  title: string;
  subtitle: string;
  quoteTag: string;
  alt: string;
  width: number;
  height: number;
}

export interface FooterSocialLink {
  name: string;
  handle: string;
  href: string;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  isExternal?: boolean;
}

/* ============================================================
   FOOTER AVATARS CONFIGURATION (3 CREATIVE FACETS)
   ============================================================ */

export const FOOTER_AVATARS: FooterAvatarData[] = [
  {
    id: "storyteller",
    image: FooterSwingingRifanaImg,
    title: "Visual Storyteller",
    subtitle: "Motion & Delight",
    quoteTag: "Narrative",
    alt: "Rifana swinging joyfully — representing visual storytelling",
    width: 170,
    height: 140,
  },
  {
    id: "curiosity",
    image: FooterCuriosityRifanaImg,
    title: "Inquisitive Mind",
    subtitle: "Research & Inquiry",
    quoteTag: "Curiosity",
    alt: "Rifana exploring with curious wonder",
    width: 155,
    height: 150,
  },
  {
    id: "thoughtful-ux",
    image: FooterCreativeRifanaImg,
    title: "Thoughtful UX",
    subtitle: "Empathy & Systems",
    quoteTag: "Systems",
    alt: "Rifana holding a message — representing thoughtful UX design",
    width: 150,
    height: 175,
  },
];

/* ============================================================
   ACCESSIBLE SOCIAL BRAND ICONS
   ============================================================ */

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
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

function FigmaIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 2a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4V2H8zm8 0h-4v8h4a4 4 0 1 0 0-8zm-8 8a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4v-8H8zm8 0h-4v8h4a4 4 0 1 0 0-8zm-8 8a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4v-4H8z" />
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

/* ============================================================
   SOCIAL CHANNELS CONFIGURATION (4 AUTHENTIC SOCIAL PLATFORMS)
   ============================================================ */

export const FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  {
    name: "Instagram",
    handle: "@she_ui_ux",
    href: "https://www.instagram.com/she_ui_ux",
    label: "Follow Rifana on Instagram (opens in new tab)",
    icon: InstagramIcon,
    isExternal: true,
  },
  {
    name: "LinkedIn",
    handle: "/in/rifana",
    href: "https://www.linkedin.com/in/rifana-a-uiux",
    label: "Connect with Rifana on LinkedIn (opens in new tab)",
    icon: LinkedInIcon,
    isExternal: true,
  },
  {
    name: "Figma",
    handle: "@rifana",
    href: "https://www.figma.com/@rifana",
    label: "Explore design systems on Figma (opens in new tab)",
    icon: FigmaIcon,
    isExternal: true,
  },
  {
    name: "GitHub",
    handle: "github.com",
    href: "https://github.com/Rifana7jasmine",
    label: "Inspect engineering prototypes on GitHub (opens in new tab)",
    icon: GitHubIcon,
    isExternal: true,
  },
];


/* ============================================================
   CREATIVE PERSONAS SHOWCASE (COMPACT UNBOXED STRIP)
   ============================================================ */

export function FooterPersonas() {
  const [activePersona, setActivePersona] = useState<string | null>(null);

  return (
    <div
      className="footer-personas-wrap"
      aria-label="Creative Personas: Three Facets of Practice"
    >
      <div className="footer-personas-header">
        <span className="footer-personas-kicker">Creative Personas</span>
        <span className="footer-personas-divider-line" aria-hidden="true" />
        <span className="footer-personas-kicker-desc">Three Facets</span>
      </div>

      <div className="footer-personas-strip" role="list">
        {FOOTER_AVATARS.map((persona) => {
          const isActive = activePersona === persona.id;
          return (
            <div
              key={persona.id}
              role="listitem"
              tabIndex={0}
              className={`footer-persona-item footer-persona-${persona.id} ${isActive ? "is-active" : ""
                }`}
              onMouseEnter={() => setActivePersona(persona.id)}
              onMouseLeave={() => setActivePersona(null)}
              onFocus={() => setActivePersona(persona.id)}
              onBlur={() => setActivePersona(null)}
              aria-label={`${persona.title}: ${persona.subtitle}`}
            >
              <div className="footer-persona-glow" aria-hidden="true" />

              <div className="footer-persona-visual">
                <Image
                  src={persona.image}
                  alt={persona.alt}
                  width={persona.width}
                  height={persona.height}
                  className="footer-persona-image"
                  loading="lazy"
                />
              </div>

              <div className="footer-persona-details">
                <span className="footer-persona-tag">{persona.quoteTag}</span>
                <span className="footer-persona-title">{persona.title}</span>
                <span className="footer-persona-subtitle">{persona.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const FooterAvatars = FooterPersonas;

/* ============================================================
   MAIN COMPACT & RESPONSIVE EDITORIAL FOOTER COMPONENT
   ============================================================ */

export function FooterSection({ className = "", id = "footer" }: FooterSectionProps) {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState<boolean>(false);

  const scrollToTop = () => {
    scrollToSection("home");
  };

  return (
    <footer
      id={id}
      role="contentinfo"
      className={`footer-section ${className}`}
      aria-label="Editorial Portfolio Closing Section"
    >
      <div className="footer-container">
        {/* ── TIER 1: ASYMMETRICAL EDITORIAL TOP SPREAD (HERO + PERSONAS) ── */}
        <div className="footer-top-spread">
          {/* Left Column: Hero Closing Statement & Actions */}
          <div className="footer-hero-column">
            <div
              className="footer-availability-pill"
              aria-label="Current Status: Available in Chennai, India"
            >
              <MapPin className="footer-pill-icon" aria-hidden="true" />
              <span>Chennai, India</span>
              <span className="footer-pill-separator" aria-hidden="true">
                •
              </span>
              <span className="footer-status-indicator" aria-hidden="true" />
              <span className="footer-status-label">Available for Collaborations</span>
            </div>

            <h2 className="footer-hero-heading">
              LET&apos;S CREATE
              <br />
              <span className="footer-hero-highlight">SOMETHING MEANINGFUL.</span>
            </h2>

            <p className="footer-hero-copy">
              Transforming research, creative inquiry, and complex systems into
              purposeful digital experiences. Open for select full-time roles and
              product design collaborations.
            </p>
          </div>

          {/* Right Column: Creative Personas Trio */}
          <div className="footer-personas-column">
            <FooterPersonas />
          </div>
        </div>

        {/* ── TIER 2: SOCIAL CONNECTIVITY ───────────────────────── */}
        <div className="footer-social-connectivity-container">
          <button
            type="button"
            className="footer-primary-cta"
            onClick={() => setIsEmailDialogOpen(true)}
            aria-label="Start a conversation: Open message dialog"
          >
            <span className="footer-primary-cta-label">Start a Conversation</span>
            <span className="footer-primary-cta-arrow" aria-hidden="true">
              <ArrowUpRight className="footer-arrow-icon" />
            </span>
          </button>

          <div
            className="footer-social-strip"
            role="list"
            aria-label="Social Channels"
          >
            {FOOTER_SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="listitem"
                  className="footer-social-pill"
                  aria-label={social.label}
                >
                  <div className="footer-social-icon-box" aria-hidden="true">
                    <Icon className="footer-social-svg" />
                  </div>
                  <span className="footer-social-name">{social.name}</span>
                  <ArrowUpRight className="footer-social-arrow" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>

        {/* ── TIER 3: EDITORIAL CLOSING BAR ─────────────────────── */}
        <div className="footer-bottom-spread">
          <div className="footer-closing-bar">
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} Rifana. All rights reserved.
            </p>

            <div className="footer-closing-signoff" aria-label="Editorial Sign-off">
              <span className="footer-signoff-lead">
                {`“Looks like we’ve reached the end…”`}
              </span>
              <span className="footer-signoff-sub">
                {`“But there’s always another idea around the corner.”`}
              </span>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="footer-back-to-top"
              aria-label="Scroll smoothly back to top of the page"
            >
              <span>Back to Top</span>
              <ArrowUp className="footer-back-icon" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <SendMessageDialog
        open={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
      />
    </footer>
  );
}

export default FooterSection;
