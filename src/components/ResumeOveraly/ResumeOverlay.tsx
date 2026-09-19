"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import ResumeHoldingRifanaImg from "@/assets/Avatars/Resume-Holding-Rifana-image.png";
import { DeviceMetrics, formatMaskPointsToClipPath, RESUME_OVERLAY_CONFIG } from "@/config/ResumeOverlayConfig";
import "./ResumeOverlay.css";
import ArrowDrawnSVG from "@/components/ui/arrow-svg";

export function ResumeOverlay() {
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Clear separation of state concerns:
  // 1. isHovered: governed strictly by cursor presence on the cylinder
  // 2. isImageOpen: governed by cylinder toggling or download activation
  // 3. isReturning: transient state while person descends behind cylinder
  // 4. showIndicator: triggers only after person image completes upward rise
  const [isHovered, setIsHovered] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);

  // State ref for robust asynchronous checks and avoiding stale closures
  const stateRef = useRef({ isHovered, isImageOpen, isReturning, showIndicator });
  useEffect(() => {
    stateRef.current = { isHovered, isImageOpen, isReturning, showIndicator };
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Responsive device metrics selection
  useEffect(() => {

    const updateDeviceType = () => {
      const width = window.innerWidth;
      const { mobileMax, tabletMax } = RESUME_OVERLAY_CONFIG.breakpoints;

      if (width <= mobileMax) {
        setDeviceType("mobile");
      } else if (width <= tabletMax) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    updateDeviceType();
    window.addEventListener("resize", updateDeviceType, { passive: true });
    return () => window.removeEventListener("resize", updateDeviceType);
  }, []);

  const metrics: DeviceMetrics = RESUME_OVERLAY_CONFIG[deviceType];
  const { animation, assets, content } = RESUME_OVERLAY_CONFIG;

  // Resolved fall duration modeled after imageRiseDuration
  const imageFallDuration =
    animation.imageFallDuration ??
    animation.imagefallduration ??
    animation.imageReturnDuration;

  // Safe client-side resume PDF download
  const triggerDownload = useCallback(() => {
    try {
      if (downloadLinkRef.current) {
        downloadLinkRef.current.click();
      } else {
        const link = document.createElement("a");
        link.href = assets.pdfPath;
        link.download = assets.pdfFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      window.open(assets.pdfPath, "_blank");
    }
  }, [assets.pdfPath, assets.pdfFilename]);

  // Click-outside and Escape key to close image gracefully
  useEffect(() => {
    if (!isImageOpen) return;

    const handlePointerDownOutside = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (stateRef.current.isImageOpen) {
          setShowIndicator(false);
          setIsImageOpen(false);
          setIsReturning(true);
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (stateRef.current.isImageOpen) {
          setShowIndicator(false);
          setIsImageOpen(false);
          setIsReturning(true);
        }
      }
    };

    window.addEventListener("pointerdown", handlePointerDownOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDownOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isImageOpen]);

  // Cylinder hover handlers: hover remains the authoritative source of cylinder expansion
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Cylinder click handler: toggles the IMAGE state, NOT the cylinder hover state!
  const handleCylinderClick = () => {
    if (stateRef.current.isReturning) return;

    if (!stateRef.current.isImageOpen) {
      // First click: opens/rises the person image
      setShowIndicator(false);
      setIsImageOpen(true);
    } else {
      // Second click: closes ONLY the person image!
      // Cylinder remains expanded because cursor is still hovering over it!
      setShowIndicator(false);
      setIsImageOpen(false);
      setIsReturning(true);
    }
  };

  // Dedicated invisible polygon mask click handler (the ONLY download hit area)
  const handleMaskClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!stateRef.current.isImageOpen || stateRef.current.isReturning) return;

    // 1. Trigger resume PDF download
    triggerDownload();

    // 2. Hide indicator and start person image descent behind the cylinder
    setShowIndicator(false);
    if (animation.postDownloadDelay > 0) {
      setTimeout(() => {
        setIsImageOpen(false);
        setIsReturning(true);
      }, animation.postDownloadDelay * 1000);
    } else {
      setIsImageOpen(false);
      setIsReturning(true);
    }
  };

  // Person animation completion: triggers indicator slide on rise completion, or resets returning state on descent
  const handlePersonAnimationComplete = () => {
    if (stateRef.current.isImageOpen && !stateRef.current.isReturning) {
      // Rifana-image has fully completed its rise animation! Trigger indicator slide animation.
      setShowIndicator(true);
    } else if (stateRef.current.isReturning) {
      setIsReturning(false);
      setShowIndicator(false);
    }
  };

  // The cylinder is expanded if it is currently hovered OR the image is open OR person is returning
  const isCylinderExpanded = isHovered || isImageOpen || isReturning;

  // Prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  // Precomputed polygon clip-path string from device-specific mask points (0-100% of image container)
  const polygonClipPath = formatMaskPointsToClipPath(metrics.maskPoints);

  // Motion transitions
  const cylinderTransition = {
    duration: shouldReduceMotion
      ? 0.05
      : isCylinderExpanded
        ? animation.cylinderExpandDuration
        : animation.cylinderCollapseDuration,
    ease: animation.cylinderEase,
  };

  const currentCylinderWidth = isCylinderExpanded
    ? metrics.cylinderWidth
    : metrics.buttonSize;

  return (
    <aside
      ref={containerRef}
      className="resume-overlay-root"
      aria-label="Resume Download Quick Action"
      style={{
        bottom: `${metrics.bottomOffset}px`,
        left: `${metrics.leftOffset}px`,
        width: `${metrics.cylinderWidth}px`,
        height: `${metrics.cylinderHeight}px`,
      }}
    >
      {/* Hidden anchor for browser-safe client-side download */}
      <a
        ref={downloadLinkRef}
        href={assets.pdfPath}
        download={assets.pdfFilename}
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: "none" }}
      >
        Download Resume
      </a>

      {/* ── Layer 1: Person Emergence Stage (BEHIND cylinder, z-index: 5) ───── */}
      <div
        className="resume-overlay-emergence-stage"
        style={{
          left: `${metrics.imageHorizontalOffset}px`,
          width: `${metrics.imageWidth}px`,
          height: `${metrics.imageHeight + metrics.imageRiseDistance}px`,
        }}
      >
        <motion.div
          className="resume-overlay-person-actor"
          initial={false}
          animate={{
            y: isImageOpen ? 0 : metrics.imageRiseDistance,
            opacity: isImageOpen ? 1 : 0,
          }}
          transition={{
            duration: shouldReduceMotion
              ? 0.05
              : isImageOpen
                ? animation.imageRiseDuration
                : imageFallDuration,
            ease: animation.imageEase,
          }}
          onAnimationComplete={handlePersonAnimationComplete}
          style={{
            bottom: `${metrics.cylinderHeight - metrics.imageOverlap}px`,
            width: `${metrics.imageWidth}px`,
            height: `${metrics.imageHeight}px`,
          }}
        >
          {/* Image Container: holds image, invisible hotspot, and visual indicator */}
          <div
            className="resume-overlay-image-container"
            style={{
              width: `${metrics.imageWidth}px`,
              height: `${metrics.imageHeight}px`,
            }}
          >
            {/* 1. Person Image (Visual only — non-clickable, pointer-events: none) */}
            <Image
              src={ResumeHoldingRifanaImg}
              alt="Rifana holding resume portfolio card"
              width={metrics.imageWidth}
              height={Math.round(
                metrics.imageWidth * (ResumeHoldingRifanaImg.height / ResumeHoldingRifanaImg.width)
              )}
              priority
              className="resume-overlay-img"
            />

            {/* 2. Completely Invisible Custom Polygon Mask Hotspot */}
            {/* Hit-testing is active ONLY inside the configured polygon points */}
            <button
              type="button"
              role="button"
              tabIndex={isImageOpen && !isReturning ? 0 : -1}
              aria-label={content.ariaImageButton}
              onClick={handleMaskClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleMaskClick();
                }
              }}
              className="resume-overlay-invisible-hotspot"
              style={{
                clipPath: polygonClipPath,
                WebkitClipPath: polygonClipPath,
                cursor: isImageOpen && !isReturning ? "pointer" : "default",
                pointerEvents: isImageOpen && !isReturning ? "auto" : "none",
              }}
            />

            {/* 3. Animated Indicator Above Rifana Image (Mirrors AboutSection pattern) */}
            <motion.div
              className="resume-overlay-indicator-wrapper"
              initial={false}
              animate={
                showIndicator && isImageOpen && !isReturning
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 22, scale: 0.94 }
              }
              transition={{
                duration: shouldReduceMotion
                  ? 0.05
                  : animation.indicatorSlideDuration || 0.35,
                ease: animation.indicatorEase || [0.22, 1, 0.36, 1],
              }}
              style={{
                position: "absolute",
                left: `${metrics.indicator.x}%`,
                bottom: `calc(100% + ${metrics.indicator.y}px)`,
                transform: `translateX(-50%) rotate(${metrics.indicator.rotation || 0}deg)`,
                pointerEvents: "none",
              }}
              aria-hidden="true"
            >
              <div className="resume-overlay-indicator-content">
                <span className="resume-overlay-indicator-text">
                  {content.indicatorText}
                </span>
                <ArrowDrawnSVG
                  width={metrics.arrowConfig.width}
                  height={metrics.arrowConfig.height}
                  angle={metrics.arrowConfig.rotation}
                  direction={metrics.arrowConfig.direction}
                  style={{
                    top: `${metrics.arrowConfig.top}`,
                    left: `${metrics.arrowConfig.left}`,
                  }}
                  className="resume-overlay-indicator-arrow"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Layer 2: Circular / Cylinder Pill Button (FOREGROUND, z-index: 10) ─ */}
      <motion.div
        className="resume-overlay-cylinder-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          width: currentCylinderWidth,
          height: metrics.cylinderHeight,
          borderRadius: `${metrics.cylinderRadius}px`,
        }}
        transition={cylinderTransition}
        style={{
          height: `${metrics.cylinderHeight}px`,
        }}
      >
        <Button
          type="button"
          aria-label={
            isCylinderExpanded
              ? content.ariaButtonExpanded
              : content.ariaButtonResting
          }
          className="resume-overlay-btn"
          onClick={handleCylinderClick}
        >
          {/* Circular Icon Anchor (always visible at bottom-left) */}
          <div
            className="resume-overlay-icon-capsule"
            style={{
              width: `${metrics.buttonSize - 8}px`,
              height: `${metrics.buttonSize - 8}px`,
              marginLeft: "2.5px",
            }}
          >
            <svg
              className="resume-overlay-icon-svg"
              width={metrics.buttonSize <= 44 ? "18" : "20"}
              height={metrics.buttonSize <= 44 ? "18" : "20"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 18 15 15" />
            </svg>
          </div>

          {/* Expanded Pill Label (smoothly revealed on expansion) */}
          <motion.div
            className="resume-overlay-label-container"
            initial={false}
            animate={{
              opacity: isCylinderExpanded ? 1 : 0,
              x: isCylinderExpanded ? 0 : -8,
            }}
            transition={{
              duration: shouldReduceMotion ? 0.05 : 0.22,
              ease: "easeOut",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span className="resume-overlay-label-text">
                {content.buttonLabel}
              </span>
              <span className="resume-overlay-label-subtext">
                PDF Document
              </span>
            </div>

            <svg
              className="resume-overlay-arrow-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.div>
        </Button>
      </motion.div>
    </aside>
  );
}

export default ResumeOverlay;
