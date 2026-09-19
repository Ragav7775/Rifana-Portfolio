/**
 * resumeOverlayConfig.ts
 *
 * Centralized, strongly-typed configuration for the Resume Download Overlay.
 * Includes separate, independent polygon mask hotspot points for Desktop, Tablet,
 * and Mobile viewports.
 */

export interface MaskPoint {
  /** X coordinate as percentage of image container width (0 to 100) */
  x: number;
  /** Y coordinate as percentage of image container height (0 to 100) */
  y: number;
}

export interface IndicatorPosition {
  /** Horizontal position as percentage of image container width (0 to 100) or px offset */
  x: number;
  /** Vertical position above the image container (px offset above image top) */
  y: number;
  /** Optional rotation in degrees */
  rotation?: number;
  /** Optional arrow rotation in degrees */
  arrowRotation?: number;
}

export interface ArrowConfig {
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
  direction: "left" | "right";
}

export interface DeviceMetrics {
  /** Diameter of the resting circular button (px) */
  buttonSize: number;
  /** Height of the cylinder (px) */
  cylinderHeight: number;
  /** Full expanded width of the cylinder (px) */
  cylinderWidth: number;
  /** Corner radius of the cylinder/circle (px) */
  cylinderRadius: number;
  /** Fixed bottom offset from viewport edge (px) */
  bottomOffset: number;
  /** Fixed left offset from viewport edge (px) */
  leftOffset: number;
  /** Display width of the person image (px) */
  imageWidth: number;
  /** Display height of the person image (px) */
  imageHeight: number;
  /** Vertical rise distance of the person image (px) */
  imageRiseDistance: number;
  /** Visual overlap between person image bottom and cylinder (px) */
  imageOverlap: number;
  /** Horizontal alignment offset of the image relative to cylinder origin (px) */
  imageHorizontalOffset: number;
  /**
   * Independent custom polygon hotspot vertices (0% to 100% of image container).
   * Arbitrary irregular polygon shapes are supported.
   */
  maskPoints: MaskPoint[];
  /** Position configuration for the animated indicator above the rifana-image */
  indicator: IndicatorPosition;

  arrowConfig: ArrowConfig;
}

export interface AnimationMetrics {
  /** Duration for circular button expanding to cylinder (seconds) */
  cylinderExpandDuration: number;
  /** Duration for cylinder contracting back to circular button (seconds) */
  cylinderCollapseDuration: number;
  /** Duration for person image rising upward from cylinder (seconds) */
  imageRiseDuration: number;
  /** Duration for person image falling/descending back into cylinder (seconds) */
  imageFallDuration: number;
  /** Lowercase alias for imageFallDuration */
  imagefallduration?: number;
  /** Duration for person image descending back into cylinder (seconds) */
  imageReturnDuration: number;
  /** Duration for indicator slide animation (seconds) */
  indicatorSlideDuration: number;
  /** Brief delay between download trigger and downward animation (seconds) */
  postDownloadDelay: number;
  /** Easing curve for cylinder expansion/contraction */
  cylinderEase: [number, number, number, number];
  /** Easing curve for person image rising/returning */
  imageEase: [number, number, number, number];
  /** Easing curve for indicator slide animation */
  indicatorEase?: [number, number, number, number];
}

export interface BreakpointConfig {
  /** Viewport width threshold for mobile layout (px) */
  mobileMax: number;
  /** Viewport width threshold for tablet layout (px) */
  tabletMax: number;
}

export interface AssetConfig {
  /** Relative public or static asset URL for PDF download */
  pdfPath: string;
  /** Download attribute filename */
  pdfFilename: string;
}

export interface ContentConfig {
  /** Expanded button text label */
  buttonLabel: string;
  /** Button tooltip or aria-label in resting state */
  ariaButtonResting: string;
  /** Button tooltip or aria-label in expanded state */
  ariaButtonExpanded: string;
  /** Interactive image mask aria-label */
  ariaImageButton: string;
  /** Animated indicator text label mirroring AboutSection pattern */
  indicatorText?: string;
}

export interface ResumeOverlayConfig {
  breakpoints: BreakpointConfig;
  desktop: DeviceMetrics;
  tablet: DeviceMetrics;
  mobile: DeviceMetrics;
  animation: AnimationMetrics;
  assets: AssetConfig;
  content: ContentConfig;
}

export const RESUME_OVERLAY_CONFIG: ResumeOverlayConfig = {
  // Breakpoints
  breakpoints: {
    mobileMax: 640,
    tabletMax: 1024,
  },

  // Desktop Metrics (viewport width > 1024px)
  desktop: {
    buttonSize: 52,
    cylinderHeight: 52,
    cylinderWidth: 184,
    cylinderRadius: 9999,
    bottomOffset: 32,
    leftOffset: 32,
    imageWidth: 110,
    imageHeight: 200,
    imageRiseDistance: 600,
    imageOverlap: 12,
    imageHorizontalOffset: 50,
    // Independent Desktop Mask Hotspot Points (relative to image container 0-100%)
    // Positioned over the resume card area Rifana is holding and pointing to
    maskPoints: [
      { x: 15, y: 0 },
      { x: 0, y: 37 },
      { x: 25, y: 50 },
      { x: 20, y: 100 },
      { x: 70, y: 100 },
      { x: 65, y: 45 },
      { x: 85, y: 45 },
      { x: 98, y: 18 },
      { x: 65, y: 16 },
      { x: 45, y: 0 },
    ],
    // maskPoints: [
    //   { x: 29.3, y: 0.9 },
    //   { x: 14.1, y: 6.8 },
    //   { x: 7.8, y: 14.5 },
    //   { x: 1.2, y: 40.3 },
    //   { x: 11.7, y: 48.3 },
    //   { x: 26.6, y: 52.0 },
    //   { x: 28.5, y: 88.1 },
    //   { x: 22.7, y: 97.4 },
    //   { x: 33.6, y: 98.4 },
    //   { x: 38.7, y: 95.3 },
    //   { x: 36.3, y: 87.2 },
    //   { x: 44.1, y: 64.8 },
    //   { x: 51.2, y: 87.2 },
    //   { x: 48.8, y: 95.1 },
    //   { x: 52.3, y: 98.1 },
    //   { x: 63.7, y: 98.4 },
    //   { x: 66.0, y: 96.0 },
    //   { x: 59.4, y: 88.1 },
    //   { x: 60.2, y: 47.6 },
    //   { x: 84.0, y: 46.4 },
    //   { x: 91.8, y: 33.3 },
    //   { x: 91.4, y: 21.9 },
    //   { x: 64.1, y: 19.1 },
    //   { x: 45.7, y: 3.7 },
    // ],
    indicator: {
      x: -50,
      y: 10,
      rotation: 90,
    },
    arrowConfig: {
      top: 40,
      left: 0,
      width: 80,
      height: 120,
      rotation: 170,
      direction: "left",
    }
  },

  // Tablet Metrics (viewport width between 641px and 1024px)
  tablet: {
    buttonSize: 48,
    cylinderHeight: 48,
    cylinderWidth: 175,
    cylinderRadius: 9999,
    bottomOffset: 24,
    leftOffset: 24,
    imageWidth: 110,
    imageHeight: 200,
    imageRiseDistance: 600,
    imageOverlap: 10,
    imageHorizontalOffset: 40,
    // Independent Tablet Mask Hotspot Points (relative to image container 0-100%)
    maskPoints: [
      { x: 15, y: 0 },
      { x: 0, y: 37 },
      { x: 25, y: 50 },
      { x: 20, y: 100 },
      { x: 70, y: 100 },
      { x: 65, y: 45 },
      { x: 85, y: 45 },
      { x: 98, y: 18 },
      { x: 65, y: 16 },
      { x: 45, y: 0 },
    ],
    indicator: {
      x: -30,
      y: 12,
      rotation: -2,
    },
    arrowConfig: {
      top: 50,
      left: -85,
      width: 80,
      height: 120,
      rotation: 150,
      direction: "right",
    }
  },

  // Mobile Metrics (viewport width <= 640px)
  mobile: {
    buttonSize: 44,
    cylinderHeight: 44,
    cylinderWidth: 165,
    cylinderRadius: 9999,
    bottomOffset: 20,
    leftOffset: 20,
    imageWidth: 110,
    imageHeight: 200,
    imageRiseDistance: 600,
    imageOverlap: 8,
    imageHorizontalOffset: 35,
    // Independent Mobile Mask Hotspot Points (relative to image container 0-100%)
    maskPoints: [
      { x: 15, y: 0 },
      { x: 0, y: 37 },
      { x: 25, y: 50 },
      { x: 20, y: 100 },
      { x: 70, y: 100 },
      { x: 65, y: 45 },
      { x: 85, y: 45 },
      { x: 98, y: 18 },
      { x: 65, y: 16 },
      { x: 45, y: 0 },
    ],
    indicator: {
      x: -40,
      y: 12,
      rotation: -2,
    },
    arrowConfig: {
      top: 40,
      left: -5,
      width: 80,
      height: 120,
      rotation: 170,
      direction: "left",
    }
  },

  // Animation Timing & Physics
  animation: {
    cylinderExpandDuration: 0.38,
    cylinderCollapseDuration: 0.32,
    imageRiseDuration: 0.46,
    imageFallDuration: 0.38,
    imagefallduration: 0.38,
    imageReturnDuration: 0.38,
    indicatorSlideDuration: 0.35,
    postDownloadDelay: 0.08,
    cylinderEase: [0.16, 1, 0.3, 1],
    imageEase: [0.22, 1, 0.36, 1],
    indicatorEase: [0.22, 1, 0.36, 1],
  },

  // Static Assets
  assets: {
    pdfPath: "/assets/Resume/Rifana_UIUX_Resume.pdf",
    pdfFilename: "Rifana_UIUX_Resume.pdf",
  },

  // Accessible Text & Labels
  content: {
    buttonLabel: "Resume",
    ariaButtonResting: "Open resume download overlay",
    ariaButtonExpanded: "Click to toggle Rifana resume view",
    ariaImageButton: "Download Rifana's UI/UX Resume (PDF)",
    indicatorText: "Click Me!",
  },
};

/**
 * Generates a CSS polygon() clip-path string from vertex coordinates (0-100%)
 */
export function formatMaskPointsToClipPath(points: MaskPoint[]): string {
  if (!points || points.length === 0) return "none";
  return `polygon(${points.map((p) => `${p.x}% ${p.y}%`).join(", ")})`;
}
