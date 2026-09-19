"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

/* ============================================================================
 * TYPES
 * ========================================================================== */

export type NavbarTarget =
  | "home"
  | "about"
  | "skills"
  | "projects"
  | "contact";

export type DeviceType =
  | "desktop"
  | "tablet"
  | "mobile";

export interface SectionDefinition {
  id: string;
  label: string;
  navbarTarget: NavbarTarget;
}

export interface DeviceSectionNavConfig {
  activationPercent: number;
  navigationOffset: number;
}

export interface SectionNavResponsiveConfig {
  desktop: DeviceSectionNavConfig;
  tablet: DeviceSectionNavConfig;
  mobile: DeviceSectionNavConfig;
}

export type SectionNavConfig = Record<
  NavbarTarget,
  SectionNavResponsiveConfig
>;

/* ============================================================================
 * CANONICAL PHYSICAL SECTIONS
 *
 * IMPORTANT:
 * This list contains the ACTUAL sections on the page, not just navbar items.
 *
 * profile + work-pathway      -> About navbar target
 * certifications              -> Projects navbar target
 * ========================================================================== */

export const CANONICAL_SECTIONS: readonly SectionDefinition[] = [
  {
    id: "home",
    label: "Home",
    navbarTarget: "home",
  },
  {
    id: "about",
    label: "About",
    navbarTarget: "about",
  },
  {
    id: "profile",
    label: "Profile",
    navbarTarget: "about",
  },
  {
    id: "work-pathway",
    label: "Work Path",
    navbarTarget: "about",
  },
  {
    id: "skills",
    label: "Skills",
    navbarTarget: "skills",
  },
  {
    id: "projects",
    label: "Projects",
    navbarTarget: "projects",
  },
  {
    id: "certifications",
    label: "Certifications",
    navbarTarget: "projects",
  },
  {
    id: "contact",
    label: "Contact",
    navbarTarget: "contact",
  },
] as const;

/* ============================================================================
 * RESPONSIVE NAVIGATION CONFIGURATION
 * ========================================================================== */

export const SECTION_NAV_CONFIG: SectionNavConfig = {
  home: {
    desktop: {
      activationPercent: 0.10,
      navigationOffset: 0,
    },
    tablet: {
      activationPercent: 0.10,
      navigationOffset: 0,
    },
    mobile: {
      activationPercent: 0.10,
      navigationOffset: 0,
    },
  },

  about: {
    desktop: {
      activationPercent: 0.10,
      navigationOffset: 0,
    },
    tablet: {
      activationPercent: 0.10,
      navigationOffset: 0,
    },
    mobile: {
      activationPercent: 0.10,
      navigationOffset: 0,
    },
  },

  skills: {
    desktop: {
      activationPercent: 0.20,
      navigationOffset: 0,
    },
    tablet: {
      activationPercent: 0.20,
      navigationOffset: 60,
    },
    mobile: {
      activationPercent: 0.20,
      navigationOffset: 60,
    },
  },

  projects: {
    desktop: {
      activationPercent: 0.20,
      navigationOffset: 10,
    },
    tablet: {
      activationPercent: 0.20,
      navigationOffset: 60,
    },
    mobile: {
      activationPercent: 0.20,
      navigationOffset: 20,
    },
  },

  contact: {
    desktop: {
      activationPercent: 0.30,
      navigationOffset: 10,
    },
    tablet: {
      activationPercent: 0.30,
      navigationOffset: 60,
    },
    mobile: {
      activationPercent: 0.25,
      navigationOffset: 20,
    },
  },
} as const;

/* ============================================================================
 * DEVICE DETECTION
 * ========================================================================== */

export function getDeviceType(): DeviceType {
  if (typeof window === "undefined") {
    return "desktop";
  }

  const width =
    window.visualViewport?.width ??
    document.documentElement.clientWidth ??
    window.innerWidth;

  if (width < 768) {
    return "mobile";
  }

  if (width < 1024) {
    return "tablet";
  }

  return "desktop";
}

/* ============================================================================
 * TARGET RESOLUTION
 * ========================================================================== */

/**
 * Converts a physical section ID or navbar target into a NavbarTarget.
 *
 * Examples:
 *
 * "profile"        -> "about"
 * "work-pathway"   -> "about"
 * "certifications" -> "projects"
 * "about"          -> "about"
 * "projects"       -> "projects"
 */
export function resolveNavbarTarget(
  id: string
): NavbarTarget {
  const cleanId = id
    .replace(/^#/, "")
    .trim();

  if (!cleanId || cleanId === "home") {
    return "home";
  }

  const section =
    CANONICAL_SECTIONS.find(
      (item) =>
        item.id === cleanId ||
        item.navbarTarget === cleanId
    );

  return section?.navbarTarget ?? "home";
}

/* ============================================================================
 * DEVICE-SPECIFIC CONFIG ACCESSORS
 * ========================================================================== */

export function getDesktopNavConfig(
  target: NavbarTarget
): DeviceSectionNavConfig {
  return SECTION_NAV_CONFIG[target].desktop;
}

export function getTabletNavConfig(
  target: NavbarTarget
): DeviceSectionNavConfig {
  return SECTION_NAV_CONFIG[target].tablet;
}

export function getMobileNavConfig(
  target: NavbarTarget
): DeviceSectionNavConfig {
  return SECTION_NAV_CONFIG[target].mobile;
}

export function getCurrentNavConfig(
  target: NavbarTarget
): DeviceSectionNavConfig {
  const device = getDeviceType();

  switch (device) {
    case "mobile":
      return getMobileNavConfig(target);

    case "tablet":
      return getTabletNavConfig(target);

    case "desktop":
    default:
      return getDesktopNavConfig(target);
  }
}

/* ============================================================================
 * DEBUG
 * ========================================================================== */

function navDebugEnabled(): boolean {
  if (
    process.env.NODE_ENV !==
    "development"
  ) {
    return false;
  }

  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  return Boolean(
    (
      window as typeof window & {
        __NAV_DEBUG__?: boolean;
      }
    ).__NAV_DEBUG__
  );
}

/* ============================================================================
 * PROGRAMMATIC SECTION NAVIGATION
 * ========================================================================== */

export function scrollToSection(
  targetId: string
): void {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined"
  ) {
    return;
  }

  const cleanId = targetId
    .replace(/^#/, "")
    .trim();

  /* --------------------------------------------------------------------------
   * HOME
   * ------------------------------------------------------------------------ */

  if (
    !cleanId ||
    cleanId === "home"
  ) {
    const reduceMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion
        ? "auto"
        : "smooth",
    });

    return;
  }

  /* --------------------------------------------------------------------------
   * FIND PHYSICAL TARGET ELEMENT
   * ------------------------------------------------------------------------ */

  const element =
    document.getElementById(cleanId);

  if (!element) {
    console.warn(
      `[Navigation] Section "${cleanId}" was not found.`
    );
    return;
  }

  /* --------------------------------------------------------------------------
   * RESOLVE NAVBAR TARGET
   * ------------------------------------------------------------------------ */

  const navbarTarget =
    resolveNavbarTarget(cleanId);

  /* --------------------------------------------------------------------------
   * RESOLVE CURRENT DEVICE
   * ------------------------------------------------------------------------ */

  const device =
    getDeviceType();

  let config: DeviceSectionNavConfig;

  switch (device) {
    case "mobile":
      config =
        getMobileNavConfig(
          navbarTarget
        );
      break;

    case "tablet":
      config =
        getTabletNavConfig(
          navbarTarget
        );
      break;

    case "desktop":
    default:
      config =
        getDesktopNavConfig(
          navbarTarget
        );
      break;
  }

  /* --------------------------------------------------------------------------
   * CALCULATE SCROLL POSITION
   * ------------------------------------------------------------------------ */

  const elementTop =
    element.getBoundingClientRect()
      .top +
    window.scrollY;

  const targetPosition = Math.max(
    0,
    elementTop -
    config.navigationOffset
  );

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (navDebugEnabled()) {
    console.log(
      "[NAVIGATION]",
      {
        viewportWidth:
          window.innerWidth,
        viewportHeight:
          window.innerHeight,
        device,
        physicalSection:
          cleanId,
        navbarTarget,
        activationPercent:
          config.activationPercent,
        navigationOffset:
          config.navigationOffset,
        elementTop,
        targetPosition,
      }
    );
  }

  window.scrollTo({
    top: targetPosition,
    behavior: reduceMotion
      ? "auto"
      : "smooth",
  });
}

/* ============================================================================
 * ACTIVE SECTION ORDER
 *
 * We evaluate REAL PHYSICAL sections from bottom to top.
 * This is important because several physical sections map to the same
 * navbar target.
 * ========================================================================== */

/* ============================================================================
 * ACTIVE SECTION HOOK
 * ========================================================================== */

export function useActiveSection(
  initialSection: NavbarTarget = "home"
) {
  const [activeTarget, setActiveTarget] =
    useState<NavbarTarget>(
      initialSection
    );

  const activeTargetRef =
    useRef<NavbarTarget>(
      initialSection
    );

  const programmaticScrollRef =
    useRef(false);

  const scrollTimerRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  /* --------------------------------------------------------------------------
   * ACTIVE TARGET UPDATE
   * ------------------------------------------------------------------------ */

  const updateActiveTarget =
    useCallback(
      (target: NavbarTarget) => {
        if (
          activeTargetRef.current ===
          target
        ) {
          return;
        }

        activeTargetRef.current =
          target;

        setActiveTarget(target);

        if (
          typeof document !==
          "undefined"
        ) {
          document.documentElement.dataset.activeSection =
            target;
        }
      },
      []
    );

  /* --------------------------------------------------------------------------
   * ACTIVE SECTION CALCULATION
   * ------------------------------------------------------------------------ */

  const computeActiveSection =
    useCallback(() => {
      if (
        typeof window ===
        "undefined" ||
        typeof document ===
        "undefined"
      ) {
        return;
      }

      const device =
        getDeviceType();

      const viewportHeight =
        window.innerHeight;

      const scrollY =
        window.scrollY;

      /* ----------------------------------------------------------------------
       * HOME GUARD
       * -------------------------------------------------------------------- */

      if (scrollY <= 60) {
        updateActiveTarget(
          "home"
        );
        return;
      }

      /* ----------------------------------------------------------------------
       * BOTTOM GUARD
       * -------------------------------------------------------------------- */

      const documentHeight =
        document.documentElement
          .scrollHeight;

      const distanceToBottom =
        documentHeight -
        (viewportHeight + scrollY);

      if (
        distanceToBottom <= 180
      ) {
        updateActiveTarget(
          "contact"
        );
        return;
      }

      /* ----------------------------------------------------------------------
       * PHYSICAL SECTION EVALUATION
       *
       * THIS is the important correction.
       *
       * We DO NOT do:
       *
       * document.getElementById("about")
       * document.getElementById("projects")
       *
       * because that ignores:
       *
       * profile
       * work-pathway
       * certifications
       *
       * Instead, we walk through the actual physical sections.
       * -------------------------------------------------------------------- */

      let matchedTarget:
        | NavbarTarget
        | null = null;

      let matchedPhysicalSection:
        | string
        | null = null;

      let matchedActivationPoint =
        0;

      for (
        let index =
          CANONICAL_SECTIONS.length -
          1;
        index >= 1;
        index--
      ) {
        const section =
          CANONICAL_SECTIONS[index];

        /**
         * Find the REAL physical section.
         */
        const element =
          document.getElementById(
            section.id
          );

        if (!element) {
          continue;
        }

        const rect =
          element.getBoundingClientRect();

        /**
         * IMPORTANT:
         *
         * Configuration comes from the NAVBAR TARGET,
         * not from the physical section.
         *
         * Therefore:
         *
         * profile
         *      -> about config
         *
         * work-pathway
         *      -> about config
         *
         * certifications
         *      -> projects config
         */
        let config: DeviceSectionNavConfig;

        switch (device) {
          case "mobile":
            config =
              getMobileNavConfig(
                section.navbarTarget
              );
            break;

          case "tablet":
            config =
              getTabletNavConfig(
                section.navbarTarget
              );
            break;

          case "desktop":
          default:
            config =
              getDesktopNavConfig(
                section.navbarTarget
              );
            break;
        }

        const activationPoint =
          viewportHeight *
          config.activationPercent;

        /**
         * IMPORTANT:
         *
         * navigationOffset is NOT used here.
         *
         * Only activationPercent determines when a
         * physical section becomes active.
         */
        if (
          rect.top <=
          activationPoint &&
          rect.bottom > 0
        ) {
          matchedTarget =
            section.navbarTarget;

          matchedPhysicalSection =
            section.id;

          matchedActivationPoint =
            activationPoint;

          if (navDebugEnabled()) {
            console.log(
              "[ACTIVE NAV]",
              {
                device,
                physicalSection:
                  section.id,
                navbarTarget:
                  section.navbarTarget,
                activationPercent:
                  config.activationPercent,
                activationPoint,
                sectionTop:
                  rect.top,
                sectionBottom:
                  rect.bottom,
              }
            );
          }

          break;
        }
      }

      /* ----------------------------------------------------------------------
       * FINAL ACTIVE TARGET
       * -------------------------------------------------------------------- */

      const finalTarget =
        matchedTarget ?? "home";

      if (
        typeof document !==
        "undefined"
      ) {
        document.documentElement.dataset.activeSection =
          finalTarget;

        document.documentElement.dataset.activePhysicalSection =
          matchedPhysicalSection ??
          "home";

        document.documentElement.dataset.activeDevice =
          device;
      }

      if (navDebugEnabled()) {
        console.log(
          "[ACTIVE NAV RESULT]",
          {
            device,
            finalTarget,
            matchedPhysicalSection,
            matchedActivationPoint,
            scrollY,
          }
        );
      }

      updateActiveTarget(
        finalTarget
      );
    }, [updateActiveTarget]);

  /* --------------------------------------------------------------------------
   * PROGRAMMATIC NAVIGATION
   * ------------------------------------------------------------------------ */

  const navigateTo =
    useCallback(
      (id: string) => {
        const cleanId =
          id.replace(/^#/, "")
            .trim();

        const target =
          resolveNavbarTarget(
            cleanId
          );

        programmaticScrollRef.current =
          true;

        if (
          scrollTimerRef.current
        ) {
          clearTimeout(
            scrollTimerRef.current
          );
        }

        /**
         * Immediately update the navbar indicator.
         */
        updateActiveTarget(
          target
        );

        /**
         * Scroll using the CURRENT device's
         * target-specific navigationOffset.
         */
        scrollToSection(
          cleanId
        );

        const finishNavigation =
          () => {
            window.removeEventListener(
              "scrollend",
              finishNavigation
            );

            if (
              scrollTimerRef.current
            ) {
              clearTimeout(
                scrollTimerRef.current
              );
            }

            programmaticScrollRef.current =
              false;

            computeActiveSection();
          };

        window.addEventListener(
          "scrollend",
          finishNavigation,
          {
            once: true,
          }
        );

        scrollTimerRef.current =
          setTimeout(() => {
            finishNavigation();
          }, 950);
      },
      [
        computeActiveSection,
        updateActiveTarget,
      ]
    );

  /* --------------------------------------------------------------------------
   * SCROLL / RESIZE
   * ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    let ticking = false;

    const scheduleUpdate =
      () => {
        if (ticking) {
          return;
        }

        ticking = true;

        window.requestAnimationFrame(
          () => {
            computeActiveSection();
            ticking = false;
          }
        );
      };

    const onScroll = () => {
      if (
        programmaticScrollRef.current
      ) {
        return;
      }

      scheduleUpdate();
    };

    const onResize = () => {
      scheduleUpdate();
    };

    const onUserInterrupt =
      () => {
        if (
          programmaticScrollRef.current
        ) {
          programmaticScrollRef.current =
            false;

          if (
            scrollTimerRef.current
          ) {
            clearTimeout(
              scrollTimerRef.current
            );
          }

          scheduleUpdate();
        }
      };

    /* Initial calculation */
    computeActiveSection();

    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      onResize,
      { passive: true }
    );

    window.addEventListener(
      "orientationchange",
      onResize,
      { passive: true }
    );

    window.addEventListener(
      "wheel",
      onUserInterrupt,
      { passive: true }
    );

    window.addEventListener(
      "touchstart",
      onUserInterrupt,
      { passive: true }
    );

    if (
      window.visualViewport
    ) {
      window.visualViewport.addEventListener(
        "resize",
        onResize,
        { passive: true }
      );
    }

    return () => {
      window.removeEventListener(
        "scroll",
        onScroll
      );

      window.removeEventListener(
        "resize",
        onResize
      );

      window.removeEventListener(
        "orientationchange",
        onResize
      );

      window.removeEventListener(
        "wheel",
        onUserInterrupt
      );

      window.removeEventListener(
        "touchstart",
        onUserInterrupt
      );

      if (
        window.visualViewport
      ) {
        window.visualViewport.removeEventListener(
          "resize",
          onResize
        );
      }

      if (
        scrollTimerRef.current
      ) {
        clearTimeout(
          scrollTimerRef.current
        );
      }
    };
  }, [computeActiveSection]);

  return {
    activeTarget,
    navigateTo,
    scrollToSection,
  };
}

/* ============================================================================
 * ROUTE & SECTION NAVIGATION HOOK (STATE-BASED, CLEAN URLS WITHOUT HASH)
 * ========================================================================== */

const NAV_SCROLL_TARGET_KEY = "portfolio_nav_scroll_target";
let inMemoryScrollTarget: string | null = null;

export function setScrollTarget(target: string | null): void {
  inMemoryScrollTarget = target;
  if (typeof window === "undefined") return;

  try {
    if (target) {
      sessionStorage.setItem(NAV_SCROLL_TARGET_KEY, target);
    } else {
      sessionStorage.removeItem(NAV_SCROLL_TARGET_KEY);
    }
  } catch {
    // Ignore storage quota or access errors
  }
}

export function getAndClearScrollTarget(): string | null {
  const target = inMemoryScrollTarget || (typeof window !== "undefined" ? sessionStorage.getItem(NAV_SCROLL_TARGET_KEY) : null);
  inMemoryScrollTarget = null;

  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(NAV_SCROLL_TARGET_KEY);
    } catch {
      // Ignore
    }
  }

  return target;
}

export interface NavigateOptions {
  replace?: boolean;
  retainHash?: boolean;
}

export function useNavigate() {
  const router = useRouter();

  const navigateTo = useCallback(
    (targetId: string, options?: NavigateOptions) => {
      if (typeof window === "undefined") {
        return;
      }

      const cleanId = targetId.replace(/^#/, "").trim();
      const isHomePage =
        window.location.pathname === "/" || window.location.pathname === "";

      if (isHomePage) {
        scrollToSection(cleanId);
        if (options?.retainHash) {
          if (window.history.pushState) {
            window.history.pushState(null, "", cleanId ? `/#${cleanId}` : "/");
          }
        } else if (window.location.hash && window.history.replaceState) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      } else {
        // Store the target section intent in state without altering the target URL path
        setScrollTarget(cleanId);

        // Navigate cleanly to "/" without appending any hash
        if (options?.replace) {
          router.replace("/");
        } else {
          router.push("/");
        }
      }
    },
    [router]
  );

  return {
    navigateTo,
    scrollToSection,
    router,
  };
}

export default scrollToSection;