"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useReducedMotion } from "motion/react";
import DragAnimatedSVG from "@/components/ui/drag-animated-svg";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  heroDragAnimationConfig,
  heroVideoConfig,
  heroTextAnimationConfig,
  HERO_VIDEO_SOURCES,
} from "@/config/HeroSectionConfig";
import "./HeroSection.css";

/* ============================================================
   PROPS
   ============================================================ */

export interface HeroSectionProps {
  className?: string;
  style?: React.CSSProperties;
}

/* ============================================================
   HERO SECTION COMPONENT
   ============================================================ */

export function HeroSection({ className = "", style }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasEndedRef = useRef<boolean>(false);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const shouldReduceMotion = useReducedMotion();

  // Responsive device media queries matching project conventions
  const { isMobile, isTablet } = useMediaQuery();

  // Responsive configurations
  const svgConfig = isMobile
    ? heroDragAnimationConfig.mobile
    : isTablet
      ? heroDragAnimationConfig.tablet
      : heroDragAnimationConfig.desktop;

  const videoConfig = isMobile
    ? heroVideoConfig.mobile
    : isTablet
      ? heroVideoConfig.tablet
      : heroVideoConfig.desktop;

  const graphicTextConfig = isMobile
    ? heroTextAnimationConfig.graphicDesigner.mobile
    : isTablet
      ? heroTextAnimationConfig.graphicDesigner.tablet
      : heroTextAnimationConfig.graphicDesigner.desktop;

  const uiUxTextConfig = isMobile
    ? heroTextAnimationConfig.uiUxDesigner.mobile
    : isTablet
      ? heroTextAnimationConfig.uiUxDesigner.tablet
      : heroTextAnimationConfig.uiUxDesigner.desktop;

  // Video source based on responsive breakpoint
  const videoSrc = isMobile
    ? HERO_VIDEO_SOURCES.mobile
    : HERO_VIDEO_SOURCES.desktop;

  // Animation lifecycle state:
  // Drag start initiates video and text reveal delay countdowns
  const [isDragStarted, setIsDragStarted] = useState<boolean>(() => Boolean(shouldReduceMotion));

  // Callback when DragAnimatedSVG drag animation begins
  const handleDragStart = useCallback(() => {
    setIsDragStarted(true);
  }, []);

  // Callback when DragAnimatedSVG drag animation finishes
  const handleDragComplete = useCallback(() => {
    setIsDragStarted(true);
  }, []);

  // Fallback timer: ensures text animations and video trigger even if animation event is interrupted
  useEffect(() => {
    if (shouldReduceMotion) return;

    // Safety timer for drag start fallback
    const startSafetyTimer = setTimeout(() => {
      setIsDragStarted(true);
    }, (svgConfig.delay + 0.1) * 1000);

    return () => {
      clearTimeout(startSafetyTimer);
    };
  }, [svgConfig.delay, shouldReduceMotion]);

  /**
   * Compute pixel-perfect coordinates mapping the video frame
   * to the internal selection rectangle geometry of DragAnimatedSVG
   * using the FrameStyle reference implementation.
   */
  const { frameStyle, viewBoxWidth, centerOffsetPercent } = useMemo(() => {
    const BOX_X = 3.5;
    const BOX_Y = 5.5;
    const right = BOX_X + svgConfig.width;
    const bottom = BOX_Y + svgConfig.height;
    const svgWidth = right + 70;
    const svgHeight = bottom + 70;
    const viewBoxX = -10;
    const vbWidth = svgWidth + 10;

    // Symmetrical horizontal alignment calculation:
    // Left margin of selection rectangle is BOX_X - viewBoxX = 3.5 - (-10) = 13.5px.
    // Right margin of selection rectangle is 70px.
    // Total difference = 70 - 13.5 = 56.5px.
    // Offset needed to perfectly center the animated selection frame inside the wrapper = 28.25px.
    const leftMargin = BOX_X - viewBoxX;
    const rightMargin = 70;
    const centerOffset = (rightMargin - leftMargin) / 2;
    const offsetPercent = (centerOffset / vbWidth) * 100;

    return {
      viewBoxWidth: vbWidth,
      centerOffsetPercent: offsetPercent,
      frameStyle: {
        position: "absolute" as const,
        left: `${((BOX_X - viewBoxX) / vbWidth) * 100}%`,
        top: `${(BOX_Y / svgHeight) * 100}%`,
        width: `${(svgConfig.width / vbWidth) * 100}%`,
        height: `${(svgConfig.height / svgHeight) * 100}%`,
      },
    };
  }, [svgConfig.width, svgConfig.height]);

  // Video playback trigger: counts from when dragging animation starts + configured playDelay
  useEffect(() => {
    if (!isDragStarted) return;

    const video = videoRef.current;
    if (!video) return;

    const delayMs = shouldReduceMotion ? 0 : Math.max(0, videoConfig.playDelay * 1000);

    playTimerRef.current = setTimeout(() => {
      if (!hasEndedRef.current) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay may be restricted by browser policy — silently ignore
          });
        }
      }
    }, delayMs);

    return () => {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
      }
    };
  }, [isDragStarted, videoConfig.playDelay, shouldReduceMotion]);

  // IntersectionObserver: pause when out of view, resume when in view (if drag started & not ended)
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const handleEnded = () => {
      hasEndedRef.current = true;
    };

    video.addEventListener("ended", handleEnded);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!video) return;

        if (entry.isIntersecting) {
          // Resume only if drag started and video has not ended
          if (isDragStarted && !hasEndedRef.current) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // Silently handle autoplay restriction
              });
            }
          }
        } else {
          // Pause whenever scrolled out of view
          if (!video.paused) {
            video.pause();
          }
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      video.removeEventListener("ended", handleEnded);
    };
  }, [isDragStarted, videoSrc]);

  return (
    <section
      id="home"
      aria-label="Hero background video"
      className={`hero-section ${className}`.trim()}
      style={style}
    >
      <div className="hero-video-frame">
        {/* ── 4-Tier Hierarchy: Positioning Container -> DragAnimatedSVG Wrapper -> Actual SVG / Frame -> Video ── */}
        <div
          ref={containerRef}
          className="hero-drag-svg-wrapper"
          style={{
            maxWidth: `${viewBoxWidth}px`,
          }}
        >
          <DragAnimatedSVG
            width={svgConfig.width}
            height={svgConfig.height}
            duration={shouldReduceMotion ? 0.01 : svgConfig.duration}
            sides="horizontal"
            cursor="right"
            dashCount={svgConfig.dashCount}
            strokeWidth={svgConfig.strokeWidth}
            boxSize={svgConfig.boxSize}
            cursorSize={svgConfig.cursorSize}
            cursorPosition={svgConfig.cursorPosition}
            dashSpeed={shouldReduceMotion ? 0 : svgConfig.dashSpeed}
            dashDirection="reverse"
            delay={svgConfig.delay}
            viewportPercentage={svgConfig.viewportPercentage}
            onAnimationStart={handleDragStart}
            onAnimationComplete={handleDragComplete}
            className="hero-drag-svg"
            style={{
              transform: `translateX(${centerOffsetPercent}%)`,
            }}
          >
            {/* Encapsulated Video Frame - Positioned inside Selection Box */}
            <div className="hero-video-frame-inner" style={frameStyle}>
              <video
                ref={videoRef}
                key={videoSrc}
                src={videoSrc}
                muted
                playsInline
                preload="auto"
                className="hero-video"
                aria-hidden="true"
                style={{
                  width: typeof videoConfig.width === "number" ? `${videoConfig.width}%` : (videoConfig.width ?? "100%"),
                  height: typeof videoConfig.height === "number" ? `${videoConfig.height}%` : (videoConfig.height ?? "100%"),
                }}
              />
            </div>
          </DragAnimatedSVG>

          {/* ────────────────────────────────────────────────────────────
                2. TEXT ANIMATION 1 — TOP RIGHT: "Graphic / Design"
                Separately labeled line1 and line2 elements with distinct styles
                ──────────────────────────────────────────────────────────── */}
          <div
            className="hero-text-overlay hero-text-top-right"
            style={{
              position: "absolute",
              ...graphicTextConfig.position,
              zIndex: 10,
              pointerEvents: "none",
            }}
            aria-label={`${graphicTextConfig.line1.text} ${graphicTextConfig.line2.text}`}
          >
            {/* line1: Graphic */}
            <div
              className="hero-text-line hero-text-line1"
              data-line="line1"
            >
              <DiaTextReveal
                text={graphicTextConfig.line1.text}
                start={isDragStarted}
                delay={shouldReduceMotion ? 0 : graphicTextConfig.line1.animation.delay}
                duration={shouldReduceMotion ? 0.01 : graphicTextConfig.line1.animation.duration}
                colors={graphicTextConfig.colors}
                textColor={"#000000"}
                background={false}
                className="hero-dia-reveal hero-dia-line1"
              />
            </div>

            {/* line2: Design */}
            <div
              className="hero-text-line hero-text-line2"
              data-line="line2"
            >
              <DiaTextReveal
                text={graphicTextConfig.line2.text}
                start={isDragStarted}
                delay={shouldReduceMotion ? 0 : graphicTextConfig.line2.animation.delay}
                duration={shouldReduceMotion ? 0.01 : graphicTextConfig.line2.animation.duration}
                colors={graphicTextConfig.colors}
                textColor={"var(--color-primary, #07553D)"}
                background={false}
                className="hero-dia-reveal hero-dia-line2"
              />
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────
                3. TEXT ANIMATION 2 — BOTTOM LEFT: "UI/UX / Design"
                Separately labeled line1 and line2 elements with distinct styles
                ──────────────────────────────────────────────────────────── */}
          <div
            className="hero-text-overlay hero-text-bottom-left"
            style={{
              position: "absolute",
              ...uiUxTextConfig.position,
              zIndex: 10,
              pointerEvents: "none",
            }}
            aria-label={`${uiUxTextConfig.line1.text} ${uiUxTextConfig.line2.text}`}
          >
            {/* line1: UI/UX */}
            <div
              className="hero-text-line hero-text-line1"
              data-line="line1"
            >
              <DiaTextReveal
                text={uiUxTextConfig.line1.text}
                start={isDragStarted}
                delay={shouldReduceMotion ? 0 : uiUxTextConfig.line1.animation.delay}
                duration={shouldReduceMotion ? 0.01 : uiUxTextConfig.line1.animation.duration}
                colors={uiUxTextConfig.colors}
                textColor={"#000000"}
                background={false}
                className="hero-dia-reveal hero-dia-line1"
              />
            </div>

            {/* line2: Design */}
            <div
              className="hero-text-line hero-text-line2"
              data-line="line2"
            >
              <DiaTextReveal
                text={uiUxTextConfig.line2.text}
                start={isDragStarted}
                delay={shouldReduceMotion ? 0 : uiUxTextConfig.line2.animation.delay}
                duration={shouldReduceMotion ? 0.01 : uiUxTextConfig.line2.animation.duration}
                colors={uiUxTextConfig.colors}
                textColor={"var(--color-primary, #07553D)"}
                background={false}
                className="hero-dia-reveal hero-dia-line2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
