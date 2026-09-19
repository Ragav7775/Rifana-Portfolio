"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import "./globals.css";
import { Preloader } from "@/components/Preloader";
import { Navbar } from "@/components/NavBar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ProfileSection } from "@/components/ProfileSection";
import { SkillSection } from "@/components/SkillSection";
import { ProjectSection } from "@/components/ProjectSection";
import { WorkPathSection } from "@/components/WorkPathSection";
import { CertificateAchivementSection } from "@/components/CertificateAchivementSection";
import { ContactSection } from "@/components/ContactSection";
import { FooterSection } from "@/components/FooterSection";
import { ResumeOverlay } from "@/components/ResumeOveraly";
import { scrollToSection, getAndClearScrollTarget } from "@/hooks/useNavigateHook";
import { markPreloaderComplete, shouldSkipPreloader } from "@/hooks/PreloaderSession";

const emptySubscribe = () => () => {};

export default function Home() {
  const isSessionSkipped = useSyncExternalStore(
    emptySubscribe,
    shouldSkipPreloader,
    () => false
  );
  const [manualComplete, setManualComplete] = useState(false);
  const isPreloaderComplete = isSessionSkipped || manualComplete;
  const scrolledOnMountRef = useRef(false);

  const handlePreloaderComplete = useCallback(() => {
    markPreloaderComplete();
    setManualComplete(true);
  }, []);

  // Handle navigation to sections (via state target or hash) when page content is mounted
  useEffect(() => {
    if (!isPreloaderComplete) return;

    const handleTargetScroll = () => {
      if (typeof window === "undefined") return;

      const pendingTarget = getAndClearScrollTarget();
      const hash = window.location.hash.replace(/^#/, "").trim();
      const target = pendingTarget || hash;
      if (!target) return;

      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(target);
        if (el) {
          scrollToSection(target);
          // Ensure URL stays completely clean without any hash fragment
          if (window.location.hash && window.history.replaceState) {
            window.history.replaceState(null, "", window.location.pathname);
          }
        } else if (attempts < 8) {
          attempts++;
          setTimeout(tryScroll, 75);
        }
      };

      setTimeout(tryScroll, 100);
    };

    if (!scrolledOnMountRef.current) {
      scrolledOnMountRef.current = true;
      handleTargetScroll();
    }

    window.addEventListener("hashchange", handleTargetScroll);
    return () => {
      window.removeEventListener("hashchange", handleTargetScroll);
    };
  }, [isPreloaderComplete]);

  return (
    <>
      {!isPreloaderComplete && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {isPreloaderComplete && (
        <>
          {/* ================================================================
              NAVBAR — fixed, overlays everything, z-index: 100
              ================================================================ */}
          <nav className="w-full flex justify-center items-center">
            <Navbar />
          </nav>

          {/* ================================================================
              PAGE CONTENT: ABOUT SECTION & PORTFOLIO
              ================================================================ */}
          <main className="main-page" style={{ background: "var(--color-bg, #fff6d3)" }}>
            {/* Hero Section */}
            <HeroSection />
            {/* About Section */}
            <AboutSection />
            {/* Profile & Education Section */}
            <ProfileSection />
            {/* Work Pathway Section */}
            <WorkPathSection />
            {/* Skill Sets Section */}
            <SkillSection />
            {/* Projects Section */}
            <ProjectSection />
            {/* Certifications & Achievements Section */}
            <CertificateAchivementSection />
            {/* Contact Section */}
            <ContactSection />
          </main>

          {/* ================================================================
              FOOTER SECTION: AVATARS, NAVIGATION, SOCIALS & QUOTE
              ================================================================ */}
          <FooterSection />

          {/* ================================================================
              RESUME DOWNLOAD OVERLAY (Fixed bottom-left quick action)
              ================================================================ */}
          <ResumeOverlay />
        </>
      )}
    </>
  );
}