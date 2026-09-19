"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import "./Navbar.css";
import CenterScrollSVG from "./CenterScrollSVG";
import TopLeftScrollSVG from "./TopLeftScrollSVG";
import BottomRightScrollSVG from "./BottomRightScrollSVG";
import {
  NAVBAR_SCROLL_SVG_CONFIG,
  useNavbarDevice,
  getRibbonGeometry,
  getSVGPositionStyle,
  getInitialScrollTransform,
  parseCoordinate,
  DESKTOP_NAV_LINKS,
  type DesktopNavLink as NavLink,
} from "@/config/NavbarConfig";
import { useActiveSection, type NavbarTarget } from "@/hooks/useNavigateHook";

const targetToIndexMap: Record<NavbarTarget, number> = {
  home: 0,
  about: 1,
  skills: 2,
  projects: 3,
  contact: 4,
};

export type { NavLink };
export { DESKTOP_NAV_LINKS };

export interface NavbarDesktopProps {
  className?: string;
}

export function NavbarDesktop({ className = "" }: NavbarDesktopProps) {
  const device = useNavbarDevice();
  const activeDeviceKey = device === "mobile" ? "desktop" : device;
  const cfg = NAVBAR_SCROLL_SVG_CONFIG[activeDeviceKey];

  const leftPositionStyle = getSVGPositionStyle(cfg.topLeft.position);
  const rightPositionStyle = getSVGPositionStyle(cfg.bottomRight.position);

  // Active navigation link index
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  const { activeTarget, navigateTo } = useActiveSection("home");

  // S-curve snake wire dynamic state
  const [curvedWireWidth, setCurvedWireWidth] = useState(50);
  const [curvedSnakeAmp, setCurvedSnakeAmp] = useState(-3.0);

  // Desktop DOM Refs
  const centerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const navLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeUnderlineRef = useRef<HTMLDivElement>(null);

  // Cached geometry state
  const geomRef = useRef<{
    width: number;
    height: number;
    scrollW: number;
    scrollH: number;
    isReady: boolean;
  }>({
    width: cfg.container.width,
    height: cfg.container.height,
    scrollW: cfg.container.scrollW,
    scrollH: cfg.container.scrollH,
    isReady: false,
  });

  // Animation state tracking (runs once on mount, never restarts on scroll or resize)
  const animProgressRef = useRef(0);
  const dropProgressRef = useRef(0);
  const isInitialDropDoneRef = useRef(false);
  const hasEntranceRunRef = useRef(false);

  // Underline animation RAF tracking & current position tracking
  const underlineAnimIdRef = useRef<number | null>(null);
  const currentUnderlinePosRef = useRef<{
    x: number;
    y: number;
    normX: number;
    angle: number;
    amp: number;
    w: number;
  }>({
    x: 0,
    y: 0,
    normX: DESKTOP_NAV_LINKS[0].normX,
    angle: DESKTOP_NAV_LINKS[0].angleDeg,
    amp: DESKTOP_NAV_LINKS[0].snakeAmp ?? -3.0,
    w: 34,
  });

  /* ─── Instant Calculation of S-Curve Snake Underline ─────── */
  const positionActiveUnderlineInstant = useCallback((idx: number) => {
    if (!textRef.current || !activeUnderlineRef.current || !navLinkRefs.current[idx]) return;
    const targetEl = navLinkRefs.current[idx];
    if (!targetEl) return;

    const parentRect = textRef.current.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const linkConfig = DESKTOP_NAV_LINKS[idx];

    const relX = (targetRect.left - parentRect.left) + targetRect.width / 2;
    const relY = (targetRect.top - parentRect.top) + targetRect.height + 2;
    const width = Math.max(34, targetRect.width * 0.9);

    currentUnderlinePosRef.current = {
      x: relX,
      y: relY,
      normX: linkConfig.normX,
      angle: linkConfig.angleDeg,
      amp: linkConfig.snakeAmp ?? -3.0,
      w: width,
    };

    setCurvedWireWidth(width);
    setCurvedSnakeAmp(linkConfig.snakeAmp ?? -3.0);

    activeUnderlineRef.current.style.width = `${width}px`;
    activeUnderlineRef.current.style.transform = `translate3d(${relX - width / 2}px, ${relY}px, 0) rotate(${linkConfig.angleDeg}deg)`;
    activeUnderlineRef.current.style.opacity = isInitialDropDoneRef.current ? "1" : "0";
    activeUnderlineRef.current.style.visibility = isInitialDropDoneRef.current ? "visible" : "hidden";
  }, []);

  /* ─── Desktop Snake-Traveling S-Curve Wire Animation ─────── */
  const animateSnakeUnderline = useCallback((fromIdx: number, toIdx: number) => {
    if (!textRef.current || !activeUnderlineRef.current) return;
    const fromEl = navLinkRefs.current[fromIdx];
    const toEl = navLinkRefs.current[toIdx];
    if (!fromEl || !toEl) {
      positionActiveUnderlineInstant(toIdx);
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      if (underlineAnimIdRef.current !== null) {
        cancelAnimationFrame(underlineAnimIdRef.current);
        underlineAnimIdRef.current = null;
      }
      positionActiveUnderlineInstant(toIdx);
      return;
    }

    // Safely cancel any running underline animation so only the newest transition controls the underline
    const isMidFlight = underlineAnimIdRef.current !== null;
    if (underlineAnimIdRef.current !== null) {
      cancelAnimationFrame(underlineAnimIdRef.current);
      underlineAnimIdRef.current = null;
    }

    const parentRect = textRef.current.getBoundingClientRect();
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const startX = isMidFlight
      ? currentUnderlinePosRef.current.x
      : (fromRect.left - parentRect.left) + fromRect.width / 2;
    const startY = isMidFlight
      ? currentUnderlinePosRef.current.y
      : (fromRect.top - parentRect.top) + fromRect.height + 2;
    const startW = isMidFlight
      ? currentUnderlinePosRef.current.w
      : Math.max(34, fromRect.width * 0.9);
    const startAngle = isMidFlight
      ? currentUnderlinePosRef.current.angle
      : DESKTOP_NAV_LINKS[fromIdx].angleDeg;
    const startNormX = isMidFlight
      ? currentUnderlinePosRef.current.normX
      : DESKTOP_NAV_LINKS[fromIdx].normX;
    const startAmp = isMidFlight
      ? currentUnderlinePosRef.current.amp
      : (DESKTOP_NAV_LINKS[fromIdx].snakeAmp ?? -3.0);

    const destX = (toRect.left - parentRect.left) + toRect.width / 2;
    const destY = (toRect.top - parentRect.top) + toRect.height + 2;
    const destW = Math.max(34, toRect.width * 0.9);
    const destAngle = DESKTOP_NAV_LINKS[toIdx].angleDeg;
    const destNormX = DESKTOP_NAV_LINKS[toIdx].normX;
    const destAmp = DESKTOP_NAV_LINKS[toIdx].snakeAmp ?? -3.0;

    const H = geomRef.current.height || parentRect.height;
    const fromGeom = getRibbonGeometry(startNormX, cfg.topLeft.path, cfg.topLeft.trajectory);
    const toGeom = getRibbonGeometry(destNormX, cfg.topLeft.path, cfg.topLeft.trajectory);

    // Compute baseline offsets from the ribbon curve at source and destination
    const offsetFrom = startY - fromGeom.deltaYNorm * H;
    const offsetTo = destY - toGeom.deltaYNorm * H;

    // Compute angle offsets from the ribbon tangent at source and destination
    const angleOffsetFrom = startAngle - fromGeom.angleDeg;
    const angleOffsetTo = destAngle - toGeom.angleDeg;

    const DURATION = cfg.animation.underlineDuration;
    const easeSnakeTravel = cfg.animation.easeSnakeTravel;
    let startTimestamp: number | null = null;

    const step = (now: number) => {
      if (!startTimestamp) startTimestamp = now;
      const elapsed = now - startTimestamp;
      const t = Math.min(1, elapsed / DURATION);
      const easedT = easeSnakeTravel(t);

      // Move normalized position along the authoritative Catmull-Rom ribbon path
      const curNormX = startNormX + (destNormX - startNormX) * easedT;
      const curGeom = getRibbonGeometry(curNormX, cfg.topLeft.path, cfg.topLeft.trajectory);

      // Center point X moves between measured centers
      const curX = startX + (destX - startX) * easedT;

      // Center point Y derives directly from the authoritative ribbon geometry plus interpolated baseline offset
      const curBaselineOffset = offsetFrom + (offsetTo - offsetFrom) * easedT;
      const curY = curGeom.deltaYNorm * H + curBaselineOffset;

      // Underline orientation follows the ribbon curve tangent
      const curAngleOffset = angleOffsetFrom + (angleOffsetTo - angleOffsetFrom) * easedT;
      const curAngle = curGeom.angleDeg + curAngleOffset;

      const curW = startW + (destW - startW) * easedT;
      const curAmp = startAmp + (destAmp - startAmp) * easedT + Math.sin(t * Math.PI * 2) * 2.0;

      currentUnderlinePosRef.current = {
        x: curX,
        y: curY,
        normX: curNormX,
        angle: curAngle,
        amp: curAmp,
        w: curW,
      };

      setCurvedWireWidth(curW);
      setCurvedSnakeAmp(curAmp);

      if (activeUnderlineRef.current) {
        activeUnderlineRef.current.style.width = `${curW}px`;
        activeUnderlineRef.current.style.transform = `translate3d(${curX - curW / 2}px, ${curY}px, 0) rotate(${curAngle}deg)`;
        activeUnderlineRef.current.style.opacity = "1";
        activeUnderlineRef.current.style.visibility = "visible";
      }

      if (t < 1) {
        underlineAnimIdRef.current = requestAnimationFrame(step);
      } else {
        underlineAnimIdRef.current = null;
        positionActiveUnderlineInstant(toIdx);
      }
    };

    underlineAnimIdRef.current = requestAnimationFrame(step);
  }, [cfg.animation.underlineDuration, cfg.animation.easeSnakeTravel, cfg.topLeft.path, cfg.topLeft.trajectory, positionActiveUnderlineInstant]);

  /* ─── Nav Link Click Handler ─────────────────────────────── */
  const handleNavClick = useCallback(
    (index: number, href: string, e: React.MouseEvent) => {
      e.preventDefault();
      const oldIdx = activeIdxRef.current;
      if (index !== oldIdx) {
        setActiveIdx(index);
        activeIdxRef.current = index;
        animateSnakeUnderline(oldIdx, index);
      }
      navigateTo(href);
    },
    [animateSnakeUnderline, navigateTo]
  );

  /* ─── Synchronize Active Underline with Observed Section ──── */
  useEffect(() => {
    const newIdx = targetToIndexMap[activeTarget] ?? 0;
    if (newIdx !== activeIdxRef.current) {
      const oldIdx = activeIdxRef.current;
      setActiveIdx(newIdx);
      activeIdxRef.current = newIdx;
      if (isInitialDropDoneRef.current) {
        animateSnakeUnderline(oldIdx, newIdx);
      } else {
        positionActiveUnderlineInstant(newIdx);
      }
    }
  }, [activeTarget, animateSnakeUnderline, positionActiveUnderlineInstant]);

  /* ─── Desktop Render Frame Engine ────────────────────────── */
  const renderFrame = useCallback((progress: number, dropT: number = 1) => {
    const { width: W, height: H, scrollW: Sw } = geomRef.current;
    const p = Math.max(0, Math.min(1, progress));
    const dT = Math.max(0, Math.min(1, dropT));

    const vh = typeof window !== "undefined" ? window.innerHeight : 900;
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;

    // Horizontal Start Positions directly from Configuration
    const startXLeft = parseCoordinate(cfg.topLeft.start.x, W, vw);
    const startXRight = parseCoordinate(cfg.bottomRight.start.x, W, vw);

    // Vertical Drop Start Offsets directly from Configuration
    const startDropYLeft = parseCoordinate(cfg.topLeft.start.y, H, vh);
    const startDropYRight = parseCoordinate(cfg.bottomRight.start.y, H, vh);

    // Horizontal Final Positions (Configured edges of center SVG)
    const endXLeft = Sw * cfg.topLeft.end.xOffsetRatio;
    const endXRight = W + Sw * cfg.bottomRight.end.xOffsetRatio;

    // Interpolated Horizontal Positions: begins at startX, separates to endX
    const xLeft = startXLeft + (endXLeft - startXLeft) * p;
    const xRight = startXRight + (endXRight - startXRight) * p;

    // Curved Ribbon Coordinates & Tangent Angles along exact Catmull-Rom spline
    const ribbonXLeft = cfg.topLeft.ribbonXStart * (1 - p);
    const geomLeft = getRibbonGeometry(ribbonXLeft, cfg.topLeft.path, cfg.topLeft.trajectory);
    const deltaYLeft = geomLeft.deltaYNorm * H;
    const curveInfluence = Math.sin(p * Math.PI);
    const startRotLeft = cfg.topLeft.start.rotationDeg || 0;
    const angleLeft = (startRotLeft * (1 - dT)) + (geomLeft.angleDeg * curveInfluence) + (cfg.topLeft.end.rotationDeg * p);

    const ribbonXRight = cfg.bottomRight.ribbonXStart + (cfg.bottomRight.ribbonXEnd - cfg.bottomRight.ribbonXStart) * p;
    const geomRight = getRibbonGeometry(ribbonXRight, cfg.bottomRight.path, cfg.bottomRight.trajectory);
    const deltaYRight = geomRight.deltaYNorm * H;
    const startRotRight = cfg.bottomRight.start.rotationDeg || 0;
    const angleRight = (startRotRight * (1 - dT)) + (geomRight.angleDeg * curveInfluence) + (cfg.bottomRight.end.rotationDeg * p);

    // Interpolated Vertical Positions: starts at configured start.y when dT=0, lands at ribbon curve when dT=1
    const effectiveYLeft = startDropYLeft * (1 - dT) + (deltaYLeft * dT);
    const effectiveYRight = startDropYRight * (1 - dT) + (deltaYRight * dT);

    // Apply Left Scroll Transform preserving center anchor
    if (leftRef.current) {
      leftRef.current.style.transform =
        `translate3d(${xLeft}px, calc(-50% + ${effectiveYLeft}px), 0) rotate(${angleLeft}deg)`;
    }

    // Apply Right Scroll Transform preserving center anchor
    if (rightRef.current) {
      rightRef.current.style.transform =
        `translate3d(${xRight}px, calc(-50% + ${effectiveYRight}px), 0) rotate(${angleRight}deg)`;
    }

    // Center SVG is present in drop layout to eliminate gap, revealed after landing
    if (svgWrapRef.current) {
      const insetX = (1 - p) * 50;
      svgWrapRef.current.style.clipPath = `inset(0% ${insetX}% 0% ${insetX}%)`;
      if (dT < 0.95) {
        svgWrapRef.current.style.opacity = "0";
      } else {
        svgWrapRef.current.style.opacity = "1";
      }
    }

    // Apply Nav Text Opacity
    if (textRef.current) {
      const textOpacity = Math.max(0, Math.min(1, (p - 0.35) / 0.65));
      textRef.current.style.opacity = `${textOpacity}`;
    }

    if (activeUnderlineRef.current) {
      activeUnderlineRef.current.style.opacity = isInitialDropDoneRef.current ? "1" : "0";
      activeUnderlineRef.current.style.visibility = isInitialDropDoneRef.current ? "visible" : "hidden";
    }
  }, [
    cfg.topLeft.start.x,
    cfg.topLeft.start.y,
    cfg.topLeft.start.rotationDeg,
    cfg.topLeft.end.xOffsetRatio,
    cfg.topLeft.end.rotationDeg,
    cfg.topLeft.ribbonXStart,
    cfg.topLeft.path,
    cfg.topLeft.trajectory,
    cfg.bottomRight.start.x,
    cfg.bottomRight.start.y,
    cfg.bottomRight.start.rotationDeg,
    cfg.bottomRight.end.xOffsetRatio,
    cfg.bottomRight.end.rotationDeg,
    cfg.bottomRight.ribbonXStart,
    cfg.bottomRight.ribbonXEnd,
    cfg.bottomRight.path,
    cfg.bottomRight.trajectory,
  ]);

  /* ─── Update Dimensions via ResizeObserver ───────────────── */
  const measureGeometry = useCallback(() => {
    if (!centerRef.current) return;
    const rect = centerRef.current.getBoundingClientRect();
    if (svgWrapRef.current) {
      svgWrapRef.current.style.width = `${rect.width}px`;
      svgWrapRef.current.style.height = `${rect.height * 0.8}px`;
    }
    const scrollW = leftRef.current ? leftRef.current.getBoundingClientRect().width : cfg.container.scrollW;
    const scrollH = leftRef.current ? leftRef.current.getBoundingClientRect().height : cfg.container.scrollH;

    geomRef.current = {
      width: rect.width || cfg.container.width,
      height: rect.height || cfg.container.height,
      scrollW: scrollW || cfg.container.scrollW,
      scrollH: scrollH || cfg.container.scrollH,
      isReady: true,
    };

    // Apply programmatic position on measurement
    if (leftRef.current) {
      if (leftPositionStyle.top !== undefined) leftRef.current.style.top = String(leftPositionStyle.top);
      if (leftPositionStyle.bottom !== undefined) leftRef.current.style.bottom = String(leftPositionStyle.bottom);
      if (leftPositionStyle.left !== undefined) leftRef.current.style.left = String(leftPositionStyle.left);
      if (leftPositionStyle.right !== undefined) leftRef.current.style.right = String(leftPositionStyle.right);
    }
    if (rightRef.current) {
      if (rightPositionStyle.top !== undefined) rightRef.current.style.top = String(rightPositionStyle.top);
      if (rightPositionStyle.bottom !== undefined) rightRef.current.style.bottom = String(rightPositionStyle.bottom);
      if (rightPositionStyle.left !== undefined) rightRef.current.style.left = String(rightPositionStyle.left);
      if (rightPositionStyle.right !== undefined) rightRef.current.style.right = String(rightPositionStyle.right);
    }

    // If entrance has already run, preserve final state (progress=1, dropT=1)
    if (hasEntranceRunRef.current) {
      renderFrame(1, 1);
    } else {
      renderFrame(animProgressRef.current, dropProgressRef.current);
    }
    if (underlineAnimIdRef.current === null) {
      positionActiveUnderlineInstant(activeIdxRef.current);
    }
  }, [
    cfg.container.width,
    cfg.container.height,
    cfg.container.scrollW,
    cfg.container.scrollH,
    leftPositionStyle,
    rightPositionStyle,
    renderFrame,
    positionActiveUnderlineInstant,
  ]);

  /* ─── Desktop Entrance Animation Sequence ────────────────── */
  useEffect(() => {
    // If entrance animation has already run once on mount, keep final state and do NOT restart
    if (hasEntranceRunRef.current) {
      renderFrame(1, 1);
      if (underlineAnimIdRef.current === null) {
        positionActiveUnderlineInstant(activeIdxRef.current);
      }
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      measureGeometry();
      animProgressRef.current = 1;
      dropProgressRef.current = 1;
      isInitialDropDoneRef.current = true;
      hasEntranceRunRef.current = true;
      renderFrame(1, 1);
      positionActiveUnderlineInstant(activeIdxRef.current);
      return;
    }

    measureGeometry();

    let animationFrameId: number;
    let startTime: number | null = null;

    const {
      dropDuration: DROP_DURATION,
      holdDuration: HOLD_DURATION,
      separateDuration: SEPARATE_DURATION,
      easeEntrance,
      easeSeparation,
    } = cfg.animation;

    animProgressRef.current = 0;
    dropProgressRef.current = 0;
    isInitialDropDoneRef.current = false;
    renderFrame(0, 0);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < DROP_DURATION) {
        const t = elapsed / DROP_DURATION;
        const easedT = easeEntrance(t);
        dropProgressRef.current = easedT;
        animProgressRef.current = 0;
        renderFrame(0, easedT);
        animationFrameId = requestAnimationFrame(step);
      } else if (elapsed < DROP_DURATION + HOLD_DURATION) {
        dropProgressRef.current = 1;
        animProgressRef.current = 0;
        renderFrame(0, 1);
        animationFrameId = requestAnimationFrame(step);
      } else if (elapsed < DROP_DURATION + HOLD_DURATION + SEPARATE_DURATION) {
        const separateElapsed = elapsed - (DROP_DURATION + HOLD_DURATION);
        const t = separateElapsed / SEPARATE_DURATION;
        const easedT = easeSeparation(t);
        dropProgressRef.current = 1;
        animProgressRef.current = easedT;
        renderFrame(easedT, 1);
        animationFrameId = requestAnimationFrame(step);
      } else {
        dropProgressRef.current = 1;
        animProgressRef.current = 1;
        isInitialDropDoneRef.current = true;
        hasEntranceRunRef.current = true;
        renderFrame(1, 1);
        positionActiveUnderlineInstant(activeIdxRef.current);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [cfg.animation, measureGeometry, renderFrame, positionActiveUnderlineInstant]);

  /* ─── ResizeObserver for Desktop ─────────────────────────── */
  useEffect(() => {
    if (!centerRef.current) return;

    const ro = new ResizeObserver(() => {
      measureGeometry();
    });

    ro.observe(centerRef.current);
    window.addEventListener("resize", measureGeometry);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureGeometry);
    };
  }, [measureGeometry]);

  // Clean up any active underline animation on unmount
  useEffect(() => {
    return () => {
      if (underlineAnimIdRef.current !== null) {
        cancelAnimationFrame(underlineAnimIdRef.current);
        underlineAnimIdRef.current = null;
      }
    };
  }, []);

  // Compute S-curve SVG bezier path coordinates
  const wireW = curvedWireWidth;
  const p1x = wireW * 0.28;
  const p1y = 8 - curvedSnakeAmp;
  const p2x = wireW * 0.72;
  const p2y = 8 + curvedSnakeAmp;
  const sCurvePathD = `M 2 8 C ${p1x} ${p1y}, ${p2x} ${p2y}, ${wireW - 2} 8`;

  return (
    <header className={`navbar-wrapper ${className}`} aria-label="Site navigation">
      <nav className="navbar">
        {/* Shared Coordinate System Container */}
        <div ref={centerRef} className="navbar-center">

          {/* Center SVG Sheet with dynamic clip-path reveal */}
          <div ref={svgWrapRef} className="navbar-svg-wrapper">
            <CenterScrollSVG className="center-svg" device={activeDeviceKey} />
          </div>

          {/* Nav links positioned along curve */}
          <div ref={textRef} className="navbar-text">
            {DESKTOP_NAV_LINKS.map((link, idx) => (
              <a
                key={link.label}
                ref={(el) => { navLinkRefs.current[idx] = el; }}
                href={link.href}
                className={`nav-text-item ${activeIdx === idx ? "active" : ""}`}
                onClick={(e) => handleNavClick(idx, link.href, e)}
                style={{
                  transform: `rotate(${link.angleDeg}deg) translateY(${link.yOffsetRatio * 100}%)`,
                }}
              >
                {link.label}
              </a>
            ))}

            {/* Desktop Traveling Horizontal S/Snake-Shaped Underline (NO dot) */}
            <div ref={activeUnderlineRef} className="navbar-active-underline-container">
              <svg
                width={wireW}
                height="16"
                viewBox={`0 0 ${wireW} 16`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="navbar-curved-wire-svg"
              >
                <defs>
                  <linearGradient id="goldSnakeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.15" />
                    <stop offset="15%" stopColor="#D4AF37" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#FFF6D3" stopOpacity="1" />
                    <stop offset="85%" stopColor="#D4AF37" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.15" />
                  </linearGradient>
                  <filter id="goldSnakeGlowFilter" x="-20%" y="-50%" width="140%" height="200%">
                    <feGaussianBlur stdDeviation="1.2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Glowing S-curve wire body */}
                <path
                  d={sCurvePathD}
                  stroke="url(#goldSnakeGrad)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  filter="url(#goldSnakeGlowFilter)"
                />
                {/* Thin core string highlight */}
                <path
                  d={sCurvePathD}
                  stroke="#FFF6D3"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Left Decorative Scroll - Initial off-screen transform exists on very first render */}
          <div
            ref={leftRef}
            className="navbar-scroll navbar-scroll-left"
            style={{
              ...leftPositionStyle,
              width: cfg.topLeft.width,
              height: cfg.topLeft.height,
              transform: getInitialScrollTransform(cfg.topLeft.start),
            }}
          >
            <TopLeftScrollSVG className="scroll-svg" device={activeDeviceKey} />
          </div>

          {/* Right Decorative Scroll - Initial off-screen transform exists on very first render */}
          <div
            ref={rightRef}
            className="navbar-scroll navbar-scroll-right"
            style={{
              ...rightPositionStyle,
              width: cfg.bottomRight.width,
              height: cfg.bottomRight.height,
              transform: getInitialScrollTransform(cfg.bottomRight.start),
            }}
          >
            <BottomRightScrollSVG className="scroll-svg" device={activeDeviceKey} />
          </div>

        </div>
      </nav>
    </header>
  );
}

export default NavbarDesktop;

