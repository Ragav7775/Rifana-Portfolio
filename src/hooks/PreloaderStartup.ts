"use client";

import { HERO_VIDEO_SOURCES } from "@/config/HeroSectionConfig";
import {
  preloadVideo,
  preloadImage,
  CRITICAL_MEDIA_ASSETS,
  BACKGROUND_AVATAR_ASSETS,
  PRELOAD_CONFIG,
  type PreloadItemResult,
} from "./PreloaderMedia";

/* ============================================================================
 * TYPES & CONFIGURATION
 * ========================================================================== */

export interface StartupPreloadStatus {
  isFontReady: boolean;
  isHeroVideoReady: boolean;
  heroVideoResult?: PreloadItemResult;
  error?: string;
}

const FONT_TIMEOUT_MS = 2500;
const HERO_VIDEO_TIMEOUT_MS = 4500;

/* ============================================================================
 * SINGLETON PROMISE REFERENCES (PREVENTS STRICT MODE DUPLICATION)
 * ========================================================================== */

let fontLoadPromise: Promise<boolean> | null = null;
let currentHeroVideoSrc: string | null = null;
let heroVideoPromise: Promise<PreloadItemResult> | null = null;
let backgroundPreloadStarted = false;

function logDebug(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.log("[PreloaderStartup]", ...args);
  }
}

/* ============================================================================
 * LEVEL 0 — TEMPTING FONT PREREQUISITE
 * ========================================================================== */

/**
 * Synchronously checks if the Tempting font is already cached and available.
 */
export function isTemptingFontLoadedSync(): boolean {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return false;
  }
  try {
    return document.fonts.check('400 16px "Tempting"');
  } catch {
    return false;
  }
}

/**
 * Ensures the Tempting font is loaded and registered before the Preloader UI renders.
 * Guaranteed not to block indefinitely via safety timeout fallback.
 */
export function loadTemptingFont(timeoutMs = FONT_TIMEOUT_MS): Promise<boolean> {
  if (fontLoadPromise) {
    return fontLoadPromise;
  }

  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.resolve(true);
  }

  // If already available in document fonts
  if (isTemptingFontLoadedSync()) {
    logDebug("Tempting font is already available (cached).");
    fontLoadPromise = Promise.resolve(true);
    return fontLoadPromise;
  }

  fontLoadPromise = new Promise<boolean>((resolve) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      if (process.env.NODE_ENV === "development") {
        console.warn("[PreloaderStartup] Tempting font load timed out; proceeding with fallback font.");
      }
      resolve(false);
    }, timeoutMs);

    const onFontReady = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      logDebug("Tempting font successfully loaded and verified.");
      resolve(true);
    };

    try {
      // Direct explicit font loading using FontFace API
      const fontFace = new FontFace("Tempting", 'url("/assets/Fonts/Tempting-font.ttf")', {
        weight: "400",
        style: "normal",
      });

      fontFace
        .load()
        .then((loadedFace) => {
          document.fonts.add(loadedFace);
          onFontReady();
        })
        .catch(() => {
          // Fallback to document.fonts.load matching @font-face from globals.css
          document.fonts
            .load('400 16px "Tempting"')
            .then((loaded) => {
              if (loaded && loaded.length > 0) {
                onFontReady();
              } else {
                onFontReady();
              }
            })
            .catch(() => {
              if (settled) return;
              settled = true;
              clearTimeout(timer);
              if (process.env.NODE_ENV === "development") {
                console.warn("[PreloaderStartup] Tempting font failed to load; using system fallback.");
              }
              resolve(false);
            });
        });
    } catch (err) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (process.env.NODE_ENV === "development") {
        console.warn("[PreloaderStartup] FontFace construction error:", err);
      }
      resolve(false);
    }
  });

  return fontLoadPromise;
}

/* ============================================================================
 * LEVEL 1 — CURRENT-DEVICE HERO VIDEO (CRITICAL)
 * ========================================================================== */

/**
 * Preloads ONLY the Hero video for the current device (Desktop or Mobile).
 * The unused device's video is NOT requested.
 */
export function preloadCurrentDeviceHeroVideo(
  isMobileExplicit?: boolean,
  timeoutMs = HERO_VIDEO_TIMEOUT_MS
): Promise<PreloadItemResult> {
  if (typeof window === "undefined") {
    return Promise.resolve({
      name: "Hero Video",
      url: "",
      type: "video",
      priority: "critical",
      status: "skipped",
      durationMs: 0,
    });
  }

  // Determine active device synchronously matching useMediaQuery convention (ground truth: max-width: 767px)
  const isMobile =
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : Boolean(isMobileExplicit);

  const heroSrc = isMobile
    ? HERO_VIDEO_SOURCES.mobile
    : HERO_VIDEO_SOURCES.desktop;

  const heroName = isMobile
    ? "Hero Mobile Video (Current Device)"
    : "Hero Desktop Video (Current Device)";

  // Check if current device hero video is already being preloaded
  if (heroVideoPromise && currentHeroVideoSrc === heroSrc) {
    return heroVideoPromise;
  }

  currentHeroVideoSrc = heroSrc;
  logDebug(`Dispatching Level 1 Critical Hero Video for ${isMobile ? "MOBILE" : "DESKTOP"}: ${heroSrc}`);

  heroVideoPromise = preloadVideo(heroSrc, heroName, "critical", timeoutMs);
  return heroVideoPromise;
}

/* ============================================================================
 * LEVEL 2 & LEVEL 3 — BACKGROUND SECONDARY PRELOADS (NON-BLOCKING)
 * ========================================================================== */

/**
 * Starts background preloading of Navbar media, About image, and Avatar queue.
 * These requests are strictly decoupled from the Preloader release gate.
 */
export function startBackgroundMediaPreload(isMobileExplicit?: boolean): void {
  if (backgroundPreloadStarted || typeof window === "undefined") {
    return;
  }
  backgroundPreloadStarted = true;

  const isMobile =
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : Boolean(isMobileExplicit);

  const navbarAsset = isMobile
    ? CRITICAL_MEDIA_ASSETS.navbar.mobile
    : CRITICAL_MEDIA_ASSETS.navbar.desktop;

  logDebug("Starting Level 2 Background Preloads (Navbar & About)...");

  // Level 2: Navbar active ribbon avatar
  preloadImage(
    navbarAsset.url,
    navbarAsset.name,
    PRELOAD_CONFIG.navbar.priority,
    PRELOAD_CONFIG.navbar.timeoutMs
  ).catch(() => { });

  // Level 2: About section portrait
  preloadImage(
    CRITICAL_MEDIA_ASSETS.about.url,
    CRITICAL_MEDIA_ASSETS.about.name,
    PRELOAD_CONFIG.about.priority,
    PRELOAD_CONFIG.about.timeoutMs
  ).catch(() => { });

  // Level 3: Low-priority avatar queue (throttled concurrency of 2)
  setTimeout(() => {
    logDebug("Starting Level 3 Background Avatar Queue...");
    let index = 0;
    const concurrency = PRELOAD_CONFIG.avatars.maxConcurrency;

    async function avatarWorker() {
      while (index < BACKGROUND_AVATAR_ASSETS.length) {
        const item = BACKGROUND_AVATAR_ASSETS[index++];
        if (!item) break;
        try {
          await preloadImage(
            item.url,
            item.name,
            PRELOAD_CONFIG.avatars.priority,
            PRELOAD_CONFIG.avatars.timeoutMs
          );
        } catch {
          // Never throw or disrupt application
        }
      }
    }

    const workers = Array.from({ length: Math.min(concurrency, BACKGROUND_AVATAR_ASSETS.length) }, () =>
      avatarWorker()
    );
    Promise.allSettled(workers).catch(() => { });
  }, 100);
}

/* ============================================================================
 * ORCHESTRATION CONTROLLER: PREPARE STARTUP PRELOAD
 * ========================================================================== */

/**
 * Initializes the optimized startup sequence:
 *
 * 1. Begins Tempting font load (Level 0 - Prerequisite before Preloader UI).
 * 2. Begins Current-Device Hero Video preload (Level 1 - Prerequisite before Preloader release).
 * 3. Dispatches background secondary preloads (Level 2 & Level 3 - Non-blocking).
 */
export function initStartupPreload(isMobileExplicit?: boolean) {
  if (typeof window === "undefined") {
    return {
      fontPromise: Promise.resolve(true),
      heroVideoPromise: Promise.resolve(null),
    };
  }

  // Level 0: Font load
  const fontP = loadTemptingFont();

  // Level 1: Current device Hero video (starts in parallel immediately)
  const heroP = preloadCurrentDeviceHeroVideo(isMobileExplicit);

  // Level 2 & 3: Background media
  startBackgroundMediaPreload(isMobileExplicit);

  return {
    fontPromise: fontP,
    heroVideoPromise: heroP,
  };
}

/**
 * Resets all startup preload singletons (for testing or full session resets).
 */
export function resetStartupPreload(): void {
  fontLoadPromise = null;
  currentHeroVideoSrc = null;
  heroVideoPromise = null;
  backgroundPreloadStarted = false;
}
