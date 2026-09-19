import type { DragAnimatedSVGConfigItem } from "@/components/ui/drag-animated-svg";

/* ============================================================
   TYPES
   ============================================================ */

export type HeroResponsiveConfig<T> = {
  desktop: T;
  tablet: T;
  mobile: T;
};

export interface HeroLineAnimationConfig {
  /**
   * Duration of the reveal sweep pass in seconds.
   */
  duration: number;
  /**
   * Internal delay before animation starts in seconds.
   */
  delay: number;
}

export interface HeroTextLineConfig {
  text: string;
  animation: HeroLineAnimationConfig;
}

export interface HeroTextItemConfig {
  colors: string[];
  position: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  line1: HeroTextLineConfig;
  line2: HeroTextLineConfig;
}

export interface HeroVideoItemConfig {
  /**
   * Delay in seconds from the moment dragging animation starts until video playback begins.
   */
  playDelay: number;

  /**
   * Manual video width in percentage relative to the animated selection frame (e.g. "90%", "100%").
   */
  width: string | number;

  /**
   * Manual video height in percentage relative to the animated selection frame (e.g. "90%", "100%").
   */
  height: string | number;
}

/* ============================================================
   1. DRAG-ANIMATED-SVG CONFIGURATION
   ============================================================ */

export const heroDragAnimationConfig: HeroResponsiveConfig<DragAnimatedSVGConfigItem> = {
  desktop: {
    width: 925,
    height: 520, // exact 16:9 ratio (925 / 520 = 1.7788)
    duration: 3,
    dashCount: 120,
    strokeWidth: 3,
    boxSize: 14,
    dashSpeed: 2,
    delay: 0,
    viewportPercentage: 90,
    cursorSize: 1,
    cursorPosition: { x: 8, y: 4 },
  },
  tablet: {
    width: 880,
    height: 495, // exact 16:9 ratio (880 / 495 = 1.7778)
    duration: 3,
    dashCount: 92,
    strokeWidth: 4,
    boxSize: 16,
    dashSpeed: 2,
    delay: 0,
    viewportPercentage: 90,
    cursorSize: 1,
    cursorPosition: { x: 12, y: 6 },
  },
  mobile: {
    width: 1053,
    height: 2172, // exact 9:16 ratio (1053 / 2172 = 0.4848)
    duration: 3.5,
    dashCount: 84,
    strokeWidth: 8,
    boxSize: 32,
    dashSpeed: 2,
    delay: 0.1,
    viewportPercentage: 90,
    cursorSize: 2.5,
    cursorPosition: { x: 1480, y: 280 },
  },
};

/* ============================================================
   2. VIDEO PLAYBACK CONFIGURATION
   ============================================================ */

export const HERO_VIDEO_SOURCES = {
  desktop: "/assets/Hero/hero-section-desktop-animation.mp4",
  tablet: "/assets/Hero/hero-section-desktop-animation.mp4",
  mobile: "/assets/Hero/hero-section-mobile-animation.mp4",
} as const;

export const heroVideoConfig: HeroResponsiveConfig<HeroVideoItemConfig> = {
  desktop: {
    playDelay: 0.3,
    width: "95%",
    height: "95%",
  },
  tablet: {
    playDelay: 0.3,
    width: "95%",
    height: "95%",
  },
  mobile: {
    playDelay: 0.4,
    width: "100%",
    height: "100%",
  },
};

/* ============================================================
   3. TEXT ANIMATION CONFIGURATION
   Independent animation settings for Line 1 and Line 2;
   typography is strictly managed in HeroSection.css
   ============================================================ */

export const BRAND_SWEEP_PALETTE = [
  "#07553D",
  "#d4af37",
  "#00dd61",
  "#07553D",
];

export const MAGIC_UI_DIA_PALETTE = [
  "#c679c4",
  "#fa3d1d",
  "#ffb005",
  "#e1e1fe",
  "#0358f7",
];

export const heroTextAnimationConfig: {
  graphicDesigner: HeroResponsiveConfig<HeroTextItemConfig>;
  uiUxDesigner: HeroResponsiveConfig<HeroTextItemConfig>;
} = {
  graphicDesigner: {
    desktop: {
      colors: BRAND_SWEEP_PALETTE,
      position: {
        top: "12%",
        right: "0%",
      },
      line1: {
        text: "GRAPHIC",
        animation: {
          duration: 2.5,
          delay: 2.5,
        },
      },
      line2: {
        text: "Designer",
        animation: {
          duration: 2.5,
          delay: 2.75,
        },
      },
    },
    tablet: {
      colors: BRAND_SWEEP_PALETTE,
      position: {
        top: "12%",
        right: "0.5%",
      },
      line1: {
        text: "GRAPHIC",
        animation: {
          duration: 2.5,
          delay: 2.5,
        },
      },
      line2: {
        text: "Designer",
        animation: {
          duration: 2.5,
          delay: 2.75,
        },
      },
    },
    mobile: {
      colors: BRAND_SWEEP_PALETTE,
      position: {
        top: "10%",
        right: "1%",
      },
      line1: {
        text: "GRAPHIC",
        animation: {
          duration: 2.5,
          delay: 2.5,
        },
      },
      line2: {
        text: "Designer",
        animation: {
          duration: 2.5,
          delay: 2.75,
        },
      },
    },
  },

  uiUxDesigner: {
    desktop: {
      colors: BRAND_SWEEP_PALETTE,
      position: {
        bottom: "20%",
        left: "-2%",
      },
      line1: {
        text: "UI/UX",
        animation: {
          duration: 2.5,
          delay: 2.5,
        },
      },
      line2: {
        text: "Designer",
        animation: {
          duration: 2.5,
          delay: 2.75,
        },
      },
    },
    tablet: {
      colors: BRAND_SWEEP_PALETTE,
      position: {
        bottom: "20%",
        left: "-1%",
      },
      line1: {
        text: "UI/UX",
        animation: {
          duration: 2.5,
          delay: 2.5,
        },
      },
      line2: {
        text: "Designer",
        animation: {
          duration: 2.5,
          delay: 2.75,
        },
      },
    },
    mobile: {
      colors: BRAND_SWEEP_PALETTE,
      position: {
        bottom: "20%",
        left: "-5%",
      },
      line1: {
        text: "UI/UX",
        animation: {
          duration: 2.5,
          delay: 2.5,
        },
      },
      line2: {
        text: "Designer",
        animation: {
          duration: 2.5,
          delay: 2.75,
        },
      },
    },
  },
};
