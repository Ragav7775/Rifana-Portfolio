"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import "./Navbar.css";
import CenterScrollSVG from "./CenterScrollSVG";
import TopLeftScrollSVG from "./TopLeftScrollSVG";
import BottomRightScrollSVG from "./BottomRightScrollSVG";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import {
  NAVBAR_SCROLL_SVG_CONFIG,
  MOBILE_NAV_ANIMATION,
  getMobileCenterline,
  getSVGPositionStyle,
  resolveTransformCoord,
  parseCoordinate,
  MOBILE_NAV_LINKS,
  type MobileNavLink,
} from "@/config/NavbarConfig";
import { useActiveSection, type NavbarTarget } from "@/hooks/useNavigateHook";

const mobileTargetMap: Record<NavbarTarget, number> = {
  home: 0,
  about: 1,
  skills: 2,
  projects: 3,
  contact: 4,
};

export type { MobileNavLink };
export { MOBILE_NAV_LINKS };

export interface NavbarMobileProps {
  className?: string;
}

export function NavbarMobile({ className = "" }: NavbarMobileProps) {
  const { activeTarget, navigateTo } = useActiveSection("home");
  const activeIdx = mobileTargetMap[activeTarget] ?? 0;

  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Mobile DOM Refs
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileRevealGroupRef = useRef<HTMLDivElement>(null);
  const mobileBottomCapRef = useRef<HTMLDivElement>(null);

  const mobileCfg = NAVBAR_SCROLL_SVG_CONFIG.mobile;

  const mobileTopCapPosition = getSVGPositionStyle(mobileCfg.topLeft.position);
  const mobileBottomCapPosition = getSVGPositionStyle(mobileCfg.bottomRight.position);

  /* ─── Coordinated Curved Unroll Animation Sequence ────────── */
  useEffect(() => {
    if (!mobileSheetOpen) {
      // When closed, reset state
      if (mobileRevealGroupRef.current) {
        mobileRevealGroupRef.current.style.clipPath = "inset(0% 0% 100% 0%)";
      }
      if (mobileBottomCapRef.current) {
        const w = mobileContainerRef.current?.offsetWidth || mobileCfg.container.width;
        const h = mobileContainerRef.current?.offsetHeight || mobileCfg.container.height;
        const startX = parseCoordinate(mobileCfg.bottomRight.start.x, w);
        const startY = parseCoordinate(mobileCfg.bottomRight.start.y, h);
        const startRot = mobileCfg.bottomRight.start.rotationDeg || 0;
        mobileBottomCapRef.current.style.transform = `translate3d(calc(-50% + ${startX}px), ${startY}px, 0) rotate(${startRot}deg)`;
      }
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      if (mobileRevealGroupRef.current) {
        mobileRevealGroupRef.current.style.clipPath = "inset(0% 0% 0% 0%)";
      }
      if (mobileBottomCapRef.current && mobileContainerRef.current) {
        const h = mobileContainerRef.current.offsetHeight || mobileCfg.container.height;
        const w = mobileContainerRef.current.offsetWidth || mobileCfg.container.width;
        const bottomPt = getMobileCenterline(1.0, mobileCfg.bottomRight.path, mobileCfg.bottomRight.trajectory);
        const curX = (bottomPt.xNorm - 0.5) * w;
        mobileBottomCapRef.current.style.transform = `translate3d(calc(-50% + ${curX}px), ${h - 48}px, 0)`;
      }
      return;
    }

    const containerH = mobileContainerRef.current?.offsetHeight || mobileCfg.container.height;
    const containerW = mobileContainerRef.current?.offsetWidth || mobileCfg.container.width;

    const startX = parseCoordinate(mobileCfg.bottomRight.start.x, containerW);
    const startY = parseCoordinate(mobileCfg.bottomRight.start.y, containerH);
    const startRot = mobileCfg.bottomRight.start.rotationDeg || 0;

    // Set initial position from configured start
    if (mobileRevealGroupRef.current) {
      mobileRevealGroupRef.current.style.clipPath = "inset(0% 0% 100% 0%)";
    }
    if (mobileBottomCapRef.current) {
      mobileBottomCapRef.current.style.transform = `translate3d(calc(-50% + ${startX}px), ${startY}px, 0) rotate(${startRot}deg)`;
    }

    let animId: number;
    let startTime: number | null = null;
    const UNROLL_DURATION = mobileCfg.animation.unrollDuration;
    const easeUnroll = mobileCfg.animation.easeUnroll;

    const step = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / UNROLL_DURATION);
      const easedT = easeUnroll(t);

      const cH = mobileContainerRef.current?.offsetHeight || mobileCfg.container.height;
      const cW = mobileContainerRef.current?.offsetWidth || mobileCfg.container.width;

      const sX = parseCoordinate(mobileCfg.bottomRight.start.x, cW);
      const sY = parseCoordinate(mobileCfg.bottomRight.start.y, cH);
      const sRot = mobileCfg.bottomRight.start.rotationDeg || 0;

      // Authoritative motion along center SVG spline starting from configured start
      const splinePt = getMobileCenterline(easedT, mobileCfg.bottomRight.path, mobileCfg.bottomRight.trajectory);
      const splineX = (splinePt.xNorm - 0.5) * cW;
      const curY = sY + easedT * (cH - 48 - sY);
      const curX = sX + (splineX - sX) * easedT;
      const curAngle = sRot * (1 - easedT) + splinePt.angleDeg * Math.sin(easedT * Math.PI) * (mobileCfg.bottomRight.trajectory.angleInfluence ?? 0.18);

      // Move Bottom Right Scroll SVG along the exact curved trajectory
      if (mobileBottomCapRef.current) {
        mobileBottomCapRef.current.style.transform =
          `translate3d(calc(-50% + ${curX}px), ${curY}px, 0) rotate(${curAngle}deg)`;
      }

      // Synchronously reveal center ribbon AND content together without fade
      if (mobileRevealGroupRef.current) {
        mobileRevealGroupRef.current.style.clipPath =
          `inset(0% 0% ${(1 - easedT) * 100}% 0%)`;
      }

      if (t < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [
    mobileSheetOpen,
    mobileCfg.animation.unrollDuration,
    mobileCfg.animation.easeUnroll,
    mobileCfg.container.height,
    mobileCfg.container.width,
    mobileCfg.bottomRight.path,
    mobileCfg.bottomRight.trajectory,
    mobileCfg.bottomRight.start.rotationDeg,
    mobileCfg.bottomRight.start.x,
    mobileCfg.bottomRight.start.y,
  ]);

  /* ─── Mobile Nav Link Click Handler ──────────────────────── */
  const handleMobileNavClick = useCallback(
    (_index: number, href: string) => {
      navigateTo(href);
      setMobileSheetOpen(false);
    },
    [navigateTo]
  );

  return (
    <div className={`navbar-mobile-wrapper ${className}`} aria-label="Mobile site navigation">
      {/* ── Mobile Menu Trigger Button (Hidden when Sheet is open) ───────── */}
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className={`mobile-menu-trigger ${mobileSheetOpen ? "hidden-when-open" : ""}`}
            aria-label="Open navigation menu"
            style={{
              opacity: mobileSheetOpen ? 0 : 1,
              pointerEvents: mobileSheetOpen ? "none" : "auto",
              visibility: mobileSheetOpen ? "hidden" : "visible",
            }}
          >
            <Menu className="w-6 h-6 text-[#fff6d3]" />
          </button>
        </SheetTrigger>

        {/* ── 30% Width Mobile Sheet Drawer (Slide in from Right) ─────────── */}
        <SheetContent
          side="right"
          className="mobile-sheet-content"
          showCloseButton={false}
          style={{
            "--mobile-sheet-duration": `${MOBILE_NAV_ANIMATION.duration}s`,
            "--mobile-sheet-easing": MOBILE_NAV_ANIMATION.easing,
          } as React.CSSProperties}
        >
          <SheetTitle className="sr-only">Site Navigation</SheetTitle>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setMobileSheetOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/40 border border-[#d4af37]/60 text-[#fff6d3] hover:bg-black/60 transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Vertical Ancient Scroll Container */}
          <div ref={mobileContainerRef} className="mobile-sheet-scroll-container">

            {/* Top Scroll Cap (Anchored at top) */}
            <div className="mobile-top-scroll-cap" style={mobileTopCapPosition}>
              <TopLeftScrollSVG className="w-full h-full object-fill" device="mobile" />
            </div>

            {/* Coordinated Reveal Group: Center Ribbon SVG + Nav Links Reveal Together */}
            <div ref={mobileRevealGroupRef} className="mobile-reveal-group">
              {/* Vertical Center Ribbon SVG */}
              <div className="mobile-center-ribbon-wrapper">
                <CenterScrollSVG className="mobile-center-ribbon-svg" device="mobile" />
              </div>

              {/* Vertical Navigation Items along S-Curve: [golden dot] [Text] */}
              <div className="mobile-nav-items-container">
                {MOBILE_NAV_LINKS.map((item, idx) => {
                  const pt = getMobileCenterline(item.yRatio, mobileCfg.bottomRight.path, mobileCfg.bottomRight.trajectory);
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`mobile-nav-item ${activeIdx === idx ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleMobileNavClick(idx, item.href);
                      }}
                      style={{
                        top: `${item.yRatio * 100}%`,
                        left: `${pt.xNorm * 100 + (item.xOffset ?? 0)}%`,
                        transform: `translate(-50%, -50%) rotate(${item.angleDeg}deg)`,
                      }}
                    >
                      {/* Golden Dot ALWAYS BEFORE the text */}
                      <span className="mobile-nav-dot" aria-hidden="true" />
                      <span className="mobile-nav-label">{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Bottom Scroll Cap (Follows curved motion path from top to bottom) */}
            <div
              ref={mobileBottomCapRef}
              className="mobile-bottom-scroll-cap"
              style={{
                ...mobileBottomCapPosition,
                transform: `translate3d(calc(-50% + ${resolveTransformCoord(mobileCfg.bottomRight.start.x)}), ${resolveTransformCoord(mobileCfg.bottomRight.start.y)}, 0) rotate(${mobileCfg.bottomRight.start.rotationDeg || 0}deg)`,
              }}
            >
              <BottomRightScrollSVG className="w-full h-full object-fill" device="mobile" />
            </div>

          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default NavbarMobile;

