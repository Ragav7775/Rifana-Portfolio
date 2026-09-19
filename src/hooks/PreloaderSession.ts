"use client";

/**
 * ============================================================================
 * PRELOADER SESSION STATE TRACKER
 * ============================================================================
 * Ensures the preloader displays only once per website session — specifically
 * on initial page load or when the full website is refreshed in the browser.
 * Persists the completion flag across client-side route changes (e.g., navigating
 * between project pages and the main page) so the preloader does not reappear.
 */

const PRELOADER_SESSION_KEY = "portfolio_preloader_shown";

/**
 * In-memory fallback flag in case sessionStorage is inaccessible.
 */
let inMemoryPreloaderShown = false;

/**
 * Returns true if the preloader should be skipped for this render.
 *
 * Rules:
 * 1. Server-side rendering always returns false to avoid hydration mismatch.
 * 2. If the user refreshed the browser (F5 / reload button), reset the session
 * 3. If the session storage flag or in-memory flag is set, return true so the
 *    preloader is skipped.
 */
export function shouldSkipPreloader(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    if (inMemoryPreloaderShown) {
      return true;
    }

    // Check if the current page load was triggered by a browser reload/refresh
    const navEntries = performance.getEntriesByType("navigation");
    const navTiming = navEntries[0] as PerformanceNavigationTiming | undefined;
    const isBrowserReload =
      navTiming?.type === "reload" ||
      (window.performance as { navigation?: { type?: number } })?.navigation?.type === 1;

    // A unique token for the current document lifecycle
    const currentLifecycleToken = String(performance.timeOrigin || Date.now());
    const handledReloadToken = sessionStorage.getItem("portfolio_preloader_reload_handled");

    if (isBrowserReload && handledReloadToken !== currentLifecycleToken) {
      // Mark this browser reload as consumed for this tab lifecycle
      sessionStorage.setItem("portfolio_preloader_reload_handled", currentLifecycleToken);
      sessionStorage.removeItem(PRELOADER_SESSION_KEY);
      inMemoryPreloaderShown = false;
      return false;
    }

    const storedValue = sessionStorage.getItem(PRELOADER_SESSION_KEY);
    if (storedValue === "true") {
      inMemoryPreloaderShown = true;
      return true;
    }

    return false;
  } catch {
    return inMemoryPreloaderShown;
  }
}

/**
 * Marks the preloader as complete for the current session.
 */
export function markPreloaderComplete(): void {
  inMemoryPreloaderShown = true;

  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem(PRELOADER_SESSION_KEY, "true");
  } catch {
    // Graceful fallback if storage is disabled or quota exceeded
  }
}

/**
 * Resets the preloader session flag (for testing or full session reset).
 */
export function resetPreloaderSession(): void {
  inMemoryPreloaderShown = false;

  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.removeItem(PRELOADER_SESSION_KEY);
  } catch {
    // ignore
  }
}
