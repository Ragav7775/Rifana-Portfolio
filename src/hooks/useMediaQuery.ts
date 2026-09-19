"use client";

import { useCallback, useSyncExternalStore } from "react";

const MEDIA_QUERIES = {
    mobile: "(max-width: 767px)",
    tablet: "(min-width: 768px) and (max-width: 1023px)",
    desktop: "(min-width: 1024px)",
} as const;

interface UseMediaQueryResult {
    matches: boolean;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}

export function useMediaQuery(query?: string): UseMediaQueryResult {
    const customMatch = useMediaQueryValue(query || "");
    const matches = query ? customMatch : false;
    const isMobile = useMediaQueryValue(MEDIA_QUERIES.mobile);
    const isTablet = useMediaQueryValue(MEDIA_QUERIES.tablet);
    const isDesktop = useMediaQueryValue(MEDIA_QUERIES.desktop);

    return {
        matches,
        isMobile,
        isTablet,
        isDesktop,
    };
}

export function usePrefersReducedMotion(): boolean {
    return useMediaQueryValue("(prefers-reduced-motion: reduce)");
}

function useMediaQueryValue(query: string): boolean {
    const subscribe = useCallback(
        (callback: () => void) => {
            if (typeof window === "undefined" || !query) {
                return () => {};
            }

            const mediaQuery = window.matchMedia(query);
            mediaQuery.addEventListener("change", callback);

            return () => {
                mediaQuery.removeEventListener("change", callback);
            };
        },
        [query]
    );

    const getSnapshot = useCallback(() => {
        if (typeof window === "undefined" || !query) {
            return false;
        }
        return window.matchMedia(query).matches;
    }, [query]);

    const getServerSnapshot = useCallback(() => false, []);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
