"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  preloaderConfig,
  generatePreloaderCSSVariables,
  type PreloaderConfig,
} from "@/config/PreloaderConfig";
import { shouldSkipPreloader, markPreloaderComplete } from "@/hooks/PreloaderSession";
import {
  loadTemptingFont,
  preloadCurrentDeviceHeroVideo,
  startBackgroundMediaPreload,
} from "@/hooks/PreloaderStartup";
import "./Preloader.css";

export interface PreloaderProps {
  onComplete?: () => void;
  className?: string;
  config?: PreloaderConfig;
}

export const FluidWaveSVG = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      width="831"
      height="224"
      viewBox="0 0 831 224"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M133.9 33.8118L122.704 41.4327C95.363 60.0449 79 90.9781 79 124.053C79 179.252 123.748 224 178.947 224H727.451C784.64 224 831 177.64 831 120.451V111.911C831 86.1435 819.392 61.7467 799.398 45.4919L786.183 34.7479C761.487 14.6703 725.921 15.2927 701.943 36.222C678.609 56.5881 644.188 57.7895 619.492 39.1L613.23 34.3609C586.386 14.0467 549.3 14.0943 522.509 34.4774L520.798 35.7788C493.228 56.7546 455.116 56.996 427.283 36.3711L426.022 35.437C397.689 14.4421 358.893 14.6879 330.829 36.04C303.326 56.9645 265.437 57.6611 237.184 37.7618L232.694 34.5993C203.141 13.7847 163.781 13.4709 133.9 33.8118Z"
        fill="url(#paint0_linear_710_664)"
      />
      <path
        d="M54.8997 33.8118L43.7044 41.4327C16.363 60.0449 0 90.9781 0 124.053C0 179.252 44.7477 224 99.9468 224H648.451C705.64 224 752 177.64 752 120.451V111.911C752 86.1435 740.392 61.7467 720.398 45.4919L707.183 34.7479C682.487 14.6703 646.921 15.2927 622.943 36.222C599.61 56.5881 565.189 57.7896 540.492 39.1001L534.23 34.3609C507.386 14.0467 470.3 14.0943 443.509 34.4774L441.798 35.7788C414.228 56.7546 376.116 56.996 348.283 36.3711L347.022 35.437C318.689 14.4421 279.893 14.6879 251.829 36.04C224.326 56.9645 186.437 57.6611 158.184 37.7618L153.694 34.5993C124.141 13.7847 84.7806 13.471 54.8997 33.8118Z"
        fill="url(#paint1_linear_710_664)"
        fillOpacity="0.69"
      />
      <defs>
        <linearGradient
          id="paint0_linear_710_664"
          x1="455.25"
          y1="56.8163"
          x2="455.25"
          y2="224"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#008C62" />
          <stop offset="1" stopColor="#00291D" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_710_664"
          x1="376.25"
          y1="56.8163"
          x2="376.25"
          y2="224"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#03C88C" />
          <stop offset="1" stopColor="#00442F" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const ThreeDotsSVG = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 6"
      width="24"
      height="6"
      style={{ opacity: 1, filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))" }}
      aria-hidden="true"
    >
      <circle cx="4" cy="3" r="3" fill="currentColor">
        <animate
          id="SVG9IgbRbsl"
          attributeName="r"
          begin="0;SVGFUNpCWdG.end-0.25s"
          dur="0.75s"
          values="3;.2;3"
        />
      </circle>
      <circle cx="12" cy="3" r="3" fill="currentColor">
        <animate
          attributeName="r"
          begin="SVG9IgbRbsl.end-0.6s"
          dur="0.75s"
          values="3;.2;3"
        />
      </circle>
      <circle cx="20" cy="3" r="3" fill="currentColor">
        <animate
          id="SVGFUNpCWdG"
          attributeName="r"
          begin="SVG9IgbRbsl.end-0.45s"
          dur="0.75s"
          values="3;.2;3"
        />
      </circle>
    </svg>
  );
};

export function Preloader({
  onComplete,
  className = "",
  config = preloaderConfig,
}: PreloaderProps) {
  const { isMobile, isTablet } = useMediaQuery();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isFontReady, setIsFontReady] = useState(false);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const [isHeroVideoReady, setIsHeroVideoReady] = useState(false);
  const hasCompletedRef = useRef(false);

  const activeDuration = useMemo(() => {
    if (isMobile) return config.mobile.duration;
    if (isTablet) return config.tablet.duration;
    return config.desktop.duration;
  }, [isMobile, isTablet, config]);

  const handleComplete = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    markPreloaderComplete();
    setIsDismissed(true);
    onComplete?.();
  }, [onComplete]);

  // If preloader was already shown in this session (and not a browser refresh), skip immediately
  useEffect(() => {
    if (shouldSkipPreloader()) {
      handleComplete();
    }
  }, [handleComplete]);

  // Level 0: Ensure Tempting font is loaded before mounting the visual Preloader circle/text
  useEffect(() => {
    if (shouldSkipPreloader() || isFontReady) return;

    let mounted = true;
    loadTemptingFont()
      .then(() => {
        if (mounted) {
          setIsFontReady(true);
        }
      })
      .catch(() => {
        // Font failure or timeout must never permanently block the page
        if (mounted) {
          setIsFontReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, [isFontReady]);

  // Level 1: Preload ONLY the current device's Hero video in parallel
  useEffect(() => {
    if (shouldSkipPreloader()) return;

    let mounted = true;
    preloadCurrentDeviceHeroVideo(isMobile)
      .then(() => {
        if (mounted) {
          setIsHeroVideoReady(true);
        }
      })
      .catch(() => {
        // Critical hero video errors must never block preloader release
        if (mounted) {
          setIsHeroVideoReady(true);
        }
      });

    // Level 2 & Level 3: Start background preloads (Navbar, About, Avatars)
    startBackgroundMediaPreload(isMobile);

    return () => {
      mounted = false;
    };
  }, [isMobile]);

  // Lock body scroll while preloader is active, safely restore on unmount
  useEffect(() => {
    if (shouldSkipPreloader()) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Animation fallback timer: starts only when the visual circle is mounted (isFontReady = true)
  useEffect(() => {
    if (!isFontReady) return;

    const timer = setTimeout(() => {
      setIsAnimationFinished(true);
    }, activeDuration);

    return () => {
      clearTimeout(timer);
    };
  }, [isFontReady, activeDuration]);

  // Synchronized Release Condition: Both visual animation AND current-device Hero video readiness must be met
  useEffect(() => {
    if (isAnimationFinished && isHeroVideoReady) {
      handleComplete();
    }
  }, [isAnimationFinished, isHeroVideoReady, handleComplete]);

  // Global safety ceiling: ensures preloader always releases even under abnormal network stall
  useEffect(() => {
    if (!isFontReady) return;

    const safetyCeilingTimer = setTimeout(() => {
      handleComplete();
    }, activeDuration + 3000);

    return () => {
      clearTimeout(safetyCeilingTimer);
    };
  }, [isFontReady, activeDuration, handleComplete]);

  const cssVariables = useMemo(() => {
    return generatePreloaderCSSVariables(config);
  }, [config]);

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === "preloaderFluidWave") {
      setIsAnimationFinished(true);
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      <div
        className={`preloader-overlay ${className}`}
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <span className="sr-only">Loading</span>
        {isFontReady && (
          <div className="preloader-circle" aria-hidden="true">
            {/* Animated Fluid Wave moving diagonally from top-left to bottom-right */}
            <div
              className="preloader-wave-wrapper"
              onAnimationEnd={handleAnimationEnd}
            >
              <FluidWaveSVG className="preloader-wave-svg" />
              <div className="preloader-wave-body" />
            </div>

            {/* Centered Loading Text + Animated Three Dots */}
            <div className="preloader-text-container">
              <span className="preloader-loading-label">Loading</span>
              <ThreeDotsSVG className="preloader-dots-icon" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Preloader;