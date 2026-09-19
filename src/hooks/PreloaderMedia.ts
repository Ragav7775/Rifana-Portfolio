"use client";

import { StaticImageData } from "next/image";
import { HERO_VIDEO_SOURCES } from "@/config/HeroSectionConfig";

// Navbar images
import curiosityImg from "@/assets/Avatars/Curiosity-Rifana-image.png";
import projectsCheckingImg from "@/assets/Avatars/Projects-Checking-Rifana-image.png";

// About section image
import aboutMeImg from "@/assets/Avatars/AboutMe-Rifana-image.png";

// Remaining avatar images for background queue (Priority 4 - Low)
import profileReadingImg from "@/assets/Avatars/Profile-Reading-Rifana-image.png";
import workingRifanaImg from "@/assets/Avatars/Working-Rifana.png";
import skilledRifanaImg from "@/assets/Avatars/Skilled-Rifana-image.png";
import resumeHoldingImg from "@/assets/Avatars/Resume-Holding-Rifana-image.png";
import contactMessageImg from "@/assets/Avatars/Contact-Message-Rifana-image.png";
import swingingRifanaImg from "@/assets/Avatars/Swinging-Rifana-image.png";
import brandingCreativeImg from "@/assets/Avatars/Braning-Creative-Rifana-image.png";
import uiuxSeatingImg from "@/assets/Avatars/UIUX-Seating-Rifana-image.png";
import logoPaintingImg from "@/assets/Avatars/Logo-Painting-Rifana-image.png";
import bookReadingImg from "@/assets/Avatars/Book-Reading-Rifana-image.png";
import socialMediaImg from "@/assets/Avatars/Socialmedia-photographing-Rifana-image.png";
import posterPeekingImg from "@/assets/Avatars/Poster-peeking-Rifana-image.png";

/* ============================================================================
 * TYPES
 * ========================================================================== */

export type PreloadPriority = "critical" | "high" | "medium" | "low";
export type PreloadStatus = "pending" | "ready" | "failed" | "timeout" | "skipped";

export interface PreloadItemResult {
  name: string;
  url: string;
  type: "video" | "image";
  priority: PreloadPriority;
  status: PreloadStatus;
  durationMs: number;
  error?: string;
}

export interface PreloadSummary {
  hero: PreloadItemResult;
  navbar: PreloadItemResult[];
  about: PreloadItemResult;
  avatars: PreloadItemResult[];
  isCriticalReady: boolean;
  totalTimeMs: number;
}

export interface PreloadOptions {
  isMobile?: boolean;
  timeoutMs?: number;
}

/* ============================================================================
 * CENTRALIZED CONFIGURATION
 * ========================================================================== */

export const PRELOAD_CONFIG = {
  hero: {
    priority: "critical" as PreloadPriority,
    timeoutMs: 4000,
  },
  navbar: {
    priority: "high" as PreloadPriority,
    timeoutMs: 3000,
  },
  about: {
    priority: "medium" as PreloadPriority,
    timeoutMs: 3000,
  },
  avatars: {
    priority: "low" as PreloadPriority,
    timeoutMs: 3500,
    maxConcurrency: 2,
  },
} as const;

/* ============================================================================
 * ASSET REGISTRY (BASED ON VERIFIED PROJECT USAGE)
 * ========================================================================== */

function resolveImageUrl(img: StaticImageData | string): string {
  if (typeof img === "string") return img;
  return img.src;
}

export const CRITICAL_MEDIA_ASSETS = {
  hero: HERO_VIDEO_SOURCES,
  navbar: {
    desktop: {
      name: "Navbar Desktop Ribbon Avatar (Curiosity)",
      url: resolveImageUrl(curiosityImg),
    },
    mobile: {
      name: "Navbar Mobile Ribbon Avatar (Projects Checking)",
      url: resolveImageUrl(projectsCheckingImg),
    },
  },
  about: {
    name: "About Section Portrait",
    url: resolveImageUrl(aboutMeImg),
  },
} as const;

export const BACKGROUND_AVATAR_ASSETS: { name: string; url: string }[] = [
  { name: "Profile Reading Avatar", url: resolveImageUrl(profileReadingImg) },
  { name: "Working Rifana Avatar", url: resolveImageUrl(workingRifanaImg) },
  { name: "Skilled Rifana Avatar", url: resolveImageUrl(skilledRifanaImg) },
  { name: "Resume Holding Avatar", url: resolveImageUrl(resumeHoldingImg) },
  { name: "Contact Message Avatar", url: resolveImageUrl(contactMessageImg) },
  { name: "Swinging Rifana Avatar", url: resolveImageUrl(swingingRifanaImg) },
  { name: "Branding Creative Avatar", url: resolveImageUrl(brandingCreativeImg) },
  { name: "UI/UX Seating Avatar", url: resolveImageUrl(uiuxSeatingImg) },
  { name: "Logo Painting Avatar", url: resolveImageUrl(logoPaintingImg) },
  { name: "Book Reading Avatar", url: resolveImageUrl(bookReadingImg) },
  { name: "Social Media Avatar", url: resolveImageUrl(socialMediaImg) },
  { name: "Poster Peeking Avatar", url: resolveImageUrl(posterPeekingImg) },
];

/* ============================================================================
 * MODULE-LEVEL PROMISE DEDUPLICATION CACHE
 * ========================================================================== */

const preloadPromiseCache = new Map<string, Promise<PreloadItemResult>>();

function logDebug(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.log("[PreloaderMedia]", ...args);
  }
}

/* ============================================================================
 * IMAGE PRELOADING CORE
 * ========================================================================== */

export function preloadImage(
  url: string,
  name: string,
  priority: PreloadPriority,
  timeoutMs = 3000
): Promise<PreloadItemResult> {
  const cached = preloadPromiseCache.get(url);
  if (cached) {
    return cached;
  }

  const promise = new Promise<PreloadItemResult>((resolve) => {
    if (typeof window === "undefined") {
      resolve({
        name,
        url,
        type: "image",
        priority,
        status: "skipped",
        durationMs: 0,
      });
      return;
    }

    const startTime = performance.now();
    let settled = false;

    const finish = (status: PreloadStatus, error?: string) => {
      if (settled) return;
      settled = true;
      const durationMs = Math.round(performance.now() - startTime);
      logDebug(`${name} (${priority}) -> ${status} in ${durationMs}ms`);
      resolve({
        name,
        url,
        type: "image",
        priority,
        status,
        durationMs,
        error,
      });
    };

    const timer = setTimeout(() => {
      finish("timeout", "Image decode/load exceeded safety timeout");
    }, timeoutMs);

    try {
      const img = new Image();

      const onDone = async () => {
        clearTimeout(timer);
        if ("decode" in img && typeof img.decode === "function") {
          try {
            await img.decode();
            finish("ready");
          } catch {
            // If decode rejects (e.g. abort or format), onload already succeeded
            finish("ready");
          }
        } else {
          finish("ready");
        }
      };

      const onError = () => {
        clearTimeout(timer);
        finish("failed", "Failed to load image resource");
      };

      img.onload = onDone;
      img.onerror = onError;
      img.src = url;

      // In case image was already cached synchronously
      if (img.complete && img.naturalWidth > 0) {
        onDone();
      }
    } catch (err) {
      clearTimeout(timer);
      finish("failed", String(err));
    }
  });

  preloadPromiseCache.set(url, promise);
  return promise;
}

/* ============================================================================
 * VIDEO PRELOADING CORE (METADATA + FIRST FRAME BUFFERING WITHOUT DOUBLE-DOWNLOAD)
 * ========================================================================== */

export function preloadVideo(
  url: string,
  name: string,
  priority: PreloadPriority = "critical",
  timeoutMs = 4000
): Promise<PreloadItemResult> {
  const cached = preloadPromiseCache.get(url);
  if (cached) {
    return cached;
  }

  const promise = new Promise<PreloadItemResult>((resolve) => {
    if (typeof window === "undefined") {
      resolve({
        name,
        url,
        type: "video",
        priority,
        status: "skipped",
        durationMs: 0,
      });
      return;
    }

    const startTime = performance.now();
    let settled = false;

    const finish = (status: PreloadStatus, error?: string) => {
      if (settled) return;
      settled = true;
      const durationMs = Math.round(performance.now() - startTime);
      logDebug(`${name} (${priority}) -> ${status} in ${durationMs}ms`);
      resolve({
        name,
        url,
        type: "video",
        priority,
        status,
        durationMs,
        error,
      });
    };

    const timer = setTimeout(() => {
      finish("timeout", "Video metadata/buffer exceeded safety timeout");
    }, timeoutMs);

    try {
      // Invisible detached video element to populate browser HTTP/media cache
      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;

      const cleanup = () => {
        clearTimeout(timer);
        video.removeEventListener("canplay", onReady);
        video.removeEventListener("loadeddata", onReady);
        video.removeEventListener("error", onError);
      };

      const onReady = () => {
        cleanup();
        finish("ready");
      };

      const onError = () => {
        cleanup();
        finish("failed", video.error ? video.error.message : "Video load error");
      };

      // canplay or loadeddata means metadata is parsed and first frames are buffered
      video.addEventListener("canplay", onReady, { once: true });
      video.addEventListener("loadeddata", onReady, { once: true });
      video.addEventListener("error", onError, { once: true });

      video.src = url;
      video.load();

      // Check if already sufficiently buffered
      if (video.readyState >= 2) {
        onReady();
      }
    } catch (err) {
      clearTimeout(timer);
      finish("failed", String(err));
    }
  });

  preloadPromiseCache.set(url, promise);
  return promise;
}

/* ============================================================================
 * CONTROLLED CONCURRENCY QUEUE FOR BACKGROUND AVATARS (PRIORITY 4 - LOW)
 * ========================================================================== */

async function runBackgroundAvatarQueue(
  avatars: { name: string; url: string }[],
  concurrency = PRELOAD_CONFIG.avatars.maxConcurrency
): Promise<PreloadItemResult[]> {
  const results: PreloadItemResult[] = [];
  let index = 0;

  async function worker() {
    while (index < avatars.length) {
      const current = avatars[index++];
      if (!current) break;
      try {
        const res = await preloadImage(
          current.url,
          current.name,
          PRELOAD_CONFIG.avatars.priority,
          PRELOAD_CONFIG.avatars.timeoutMs
        );
        results.push(res);
      } catch {
        // Avatars must never throw or disrupt the application
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, avatars.length) }, () => worker());
  await Promise.allSettled(workers);
  return results;
}

/* ============================================================================
 * SINGLETON ACTIVE PRELOAD EXECUTION
 * ========================================================================== */

let activePreloadPromise: Promise<PreloadSummary> | null = null;
let backgroundAvatarResults: PreloadItemResult[] = [];

/**
 * Initiates the priority-based media preloading sequence:
 *
 * PRIORITY 1: Hero Video (Critical - current viewport matched)
 * PRIORITY 2: Navbar Media (High - active device ribbon avatar)
 * PRIORITY 3: About Section Image (Medium - portrait illustration)
 * PRIORITY 4: Other Avatar Images (Low - background queue, non-blocking)
 *
 * Resolves when CRITICAL media (Hero + Navbar + About) are ready or timed out.
 */
export function preloadCriticalMedia(options?: PreloadOptions): Promise<PreloadSummary> {
  if (activePreloadPromise) {
    return activePreloadPromise;
  }

  activePreloadPromise = (async () => {
    const startTime = performance.now();

    // Determine viewport synchronously from browser window when available
    const isMobile =
      typeof window !== "undefined"
        ? window.matchMedia("(max-width: 767px)").matches
        : Boolean(options?.isMobile);

    const heroSrc = isMobile
      ? CRITICAL_MEDIA_ASSETS.hero.mobile
      : CRITICAL_MEDIA_ASSETS.hero.desktop;

    const heroName = isMobile
      ? "Hero Mobile Video"
      : "Hero Desktop Video";

    const navbarAsset = isMobile
      ? CRITICAL_MEDIA_ASSETS.navbar.mobile
      : CRITICAL_MEDIA_ASSETS.navbar.desktop;

    logDebug(`Starting Media Preload Sequence (Viewport: ${isMobile ? "Mobile" : "Desktop/Tablet"})...`);

    // 1. PRIORITY 1 — HERO VIDEO (starts immediately)
    const heroPromise = preloadVideo(
      heroSrc,
      heroName,
      PRELOAD_CONFIG.hero.priority,
      options?.timeoutMs ?? PRELOAD_CONFIG.hero.timeoutMs
    );

    // 2. PRIORITY 2 — NAVBAR CRITICAL MEDIA (starts immediately)
    const navbarPromise = preloadImage(
      navbarAsset.url,
      navbarAsset.name,
      PRELOAD_CONFIG.navbar.priority,
      PRELOAD_CONFIG.navbar.timeoutMs
    );

    // 3. PRIORITY 3 — ABOUT SECTION IMAGE (starts immediately)
    const aboutPromise = preloadImage(
      CRITICAL_MEDIA_ASSETS.about.url,
      CRITICAL_MEDIA_ASSETS.about.name,
      PRELOAD_CONFIG.about.priority,
      PRELOAD_CONFIG.about.timeoutMs
    );

    // 4. PRIORITY 4 — AVATAR BACKGROUND QUEUE (starts in background, does NOT block critical release)
    runBackgroundAvatarQueue(BACKGROUND_AVATAR_ASSETS)
      .then((avatarRes) => {
        backgroundAvatarResults = avatarRes;
        logDebug(`Background avatar queue completed with ${avatarRes.length} assets.`);
      })
      .catch(() => { });

    // Wait for the Critical Tier (Hero + Navbar + About) to settle
    const [heroResult, navbarResult, aboutResult] = await Promise.all([
      heroPromise,
      navbarPromise,
      aboutPromise,
    ]);

    const totalTimeMs = Math.round(performance.now() - startTime);
    const isCriticalReady =
      heroResult.status === "ready" &&
      navbarResult.status === "ready" &&
      aboutResult.status === "ready";

    logDebug(`Critical Media Ready in ${totalTimeMs}ms (Hero: ${heroResult.status}, Navbar: ${navbarResult.status}, About: ${aboutResult.status})`);

    return {
      hero: heroResult,
      navbar: [navbarResult],
      about: aboutResult,
      avatars: backgroundAvatarResults,
      isCriticalReady,
      totalTimeMs,
    };
  })();

  return activePreloadPromise;
}

/**
 * Resets the active media preload promise (for testing or full page resets).
 */
export function resetMediaPreload(): void {
  activePreloadPromise = null;
  preloadPromiseCache.clear();
  backgroundAvatarResults = [];
}
