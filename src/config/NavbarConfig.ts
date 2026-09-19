"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

/* ─── Verbatim Spline/Curve Constants ────────────────────────────── */

export type RibbonAnchor = {
  x: number;
  y: number;
};

export interface RibbonTrajectoryConfig {
  viewBoxWidth: number;
  viewBoxHeight: number;
  neutralY: number;
  angleMultiplier: number;
}

/** Center Ribbon Curve Geometry (from CenterScrollDesktopSVG 1224x162) */
export const RIBBON_ANCHORS: readonly RibbonAnchor[] = [
  { x: 0.000, y: 100.00 }, // Left edge
  { x: 0.263, y: 55.15 },  // Left arch peak (highest point)
  { x: 0.500, y: 85.60 },  // Centerline neutral
  { x: 0.779, y: 108.50 }, // Right arch trough (lowest point)
  { x: 1.000, y: 100.00 }, // Right edge
] as const;

export type MobileCenterlineAnchor = {
  y: number;
  x: number;
};

export interface MobileTrajectoryConfig {
  viewBoxWidth: number;
  viewBoxHeight: number;
  angleMultiplier: number;
  angleInfluence?: number;
}

/** Authoritative Centerline Spline for CenterScrollSVG (304x1376) */
export const MOBILE_CENTERLINE: readonly MobileCenterlineAnchor[] = [
  { y: 0.000, x: 0.378 },
  { y: 0.160, x: 0.540 },
  { y: 0.263, x: 0.659 }, // Right arch peak
  { y: 0.380, x: 0.600 },
  { y: 0.512, x: 0.464 }, // Midline transition
  { y: 0.660, x: 0.350 },
  { y: 0.780, x: 0.321 }, // Left arch trough
  { y: 0.890, x: 0.350 },
  { y: 1.000, x: 0.386 }, // Bottom edge
] as const;

/* ─── Verbatim Spline Calculation Helpers ─────────────────────────── */

export function getRibbonGeometry(
  xNormalized: number,
  anchors: readonly RibbonAnchor[] = RIBBON_ANCHORS,
  trajectory: RibbonTrajectoryConfig = {
    viewBoxWidth: 1224,
    viewBoxHeight: 162,
    neutralY: 85.60,
    angleMultiplier: 8,
  }
) {
  const x = Math.max(0, Math.min(1, xNormalized));

  let i = 0;
  while (i < anchors.length - 2 && anchors[i + 1].x < x) {
    i++;
  }

  const p0 = anchors[Math.max(0, i - 1)];
  const p1 = anchors[i];
  const p2 = anchors[i + 1];
  const p3 = anchors[Math.min(anchors.length - 1, i + 2)];

  const t = (x - p1.x) / (p2.x - p1.x);
  const t2 = t * t;
  const t3 = t2 * t;

  // Catmull-Rom spline formulation for smooth C1 curve
  const y = 0.5 * (
    (2 * p1.y) +
    (-p0.y + p2.y) * t +
    (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
    (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
  );

  // Derivative dy/dt
  const dydt = 0.5 * (
    (-p0.y + p2.y) +
    2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t +
    3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t2
  );
  const dxdt = (p2.x - p1.x);
  const dydx = dydt / (dxdt * trajectory.viewBoxWidth);

  const deltaYNorm = (y - trajectory.neutralY) / trajectory.viewBoxHeight;
  const angleDeg = Math.atan2(
    dydx * (trajectory.viewBoxHeight / trajectory.viewBoxWidth) * trajectory.angleMultiplier,
    1
  ) * (180 / Math.PI);

  return { deltaYNorm, angleDeg };
}

export function getMobileCenterline(
  yNorm: number,
  anchors: readonly MobileCenterlineAnchor[] = MOBILE_CENTERLINE,
  trajectory: MobileTrajectoryConfig = {
    viewBoxWidth: 304,
    viewBoxHeight: 1376,
    angleMultiplier: 3,
  }
) {
  const y = Math.max(0, Math.min(1, yNorm));
  let i = 0;
  while (i < anchors.length - 2 && anchors[i + 1].y < y) {
    i++;
  }
  const p0 = anchors[Math.max(0, i - 1)];
  const p1 = anchors[i];
  const p2 = anchors[i + 1];
  const p3 = anchors[Math.min(anchors.length - 1, i + 2)];

  const t = (y - p1.y) / (p2.y - p1.y || 1);
  const t2 = t * t;
  const t3 = t2 * t;

  // Catmull-Rom spline value
  const x = 0.5 * (
    (2 * p1.x) +
    (-p0.x + p2.x) * t +
    (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
    (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
  );

  // Tangent derivative dx/dt
  const dxdt = 0.5 * (
    (-p0.x + p2.x) +
    2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t +
    3 * (-p0.x + 3 * p1.x - 3 * p2.y + p3.x) * t2
  );
  const dydt = (p2.y - p1.y || 1);
  const dxdy = dxdt / dydt;
  const angleDeg = Math.atan2(
    dxdy * (trajectory.viewBoxWidth / trajectory.viewBoxHeight) * trajectory.angleMultiplier,
    1
  ) * (180 / Math.PI);

  return { xNorm: x, angleDeg };
}

/* ─── Easing Formulation ─────────────────────────────────────────── */

export function cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
  return function (t: number): number {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let u = t;
    for (let i = 0; i < 8; i++) {
      const currentX = ((1 - 3 * p2x + 3 * p1x) * u + (3 * p2x - 6 * p1x)) * u * u + 3 * p1x * u - t;
      const currentSlope = 3 * (1 - 3 * p2x + 3 * p1x) * u * u + 2 * (3 * p2x - 6 * p1x) * u + 3 * p1x;
      if (Math.abs(currentSlope) < 1e-6) break;
      u -= currentX / currentSlope;
      u = Math.max(0, Math.min(1, u));
    }
    return ((1 - 3 * p2y + 3 * p1y) * u + (3 * p2y - 6 * p1y)) * u * u + 3 * p1y * u;
  };
}

/* ─── Mobile Sheet Animation Configuration ────────────────────────── */

export const MOBILE_NAV_ANIMATION = {
  duration: 0.35, // in seconds (350ms)
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
} as const;

/* ─── Centralized Navigation Items Data ───────────────────────────── */

export interface DesktopNavLink {
  label: string;
  href: string;
  angleDeg: number;
  yOffsetRatio: number;
  normX: number; // Normalized horizontal position along Center SVG (0 to 1)
  snakeAmp?: number; // S-curve wave amplitude in px
}

export interface MobileNavLink {
  label: string;
  href: string;
  yRatio: number; // 0 to 1 along vertical sheet
  angleDeg: number;
  xOffset?: number;
}

export const DESKTOP_NAV_LINKS: readonly DesktopNavLink[] = [
  { label: "Home", href: "#", angleDeg: -8, yOffsetRatio: -0.50, normX: 0.22, snakeAmp: -5.0 },
  { label: "About", href: "#about", angleDeg: 6, yOffsetRatio: -0.40, normX: 0.38, snakeAmp: 4.5 },
  { label: "Skills", href: "#skills", angleDeg: 5, yOffsetRatio: 0.30, normX: 0.55, snakeAmp: -4.5 },
  { label: "Projects", href: "#projects", angleDeg: 0, yOffsetRatio: 0.52, normX: 0.72, snakeAmp: 3.5 },
  { label: "Contact", href: "#contact", angleDeg: -6, yOffsetRatio: 0.30, normX: 0.88, snakeAmp: -5.5 },
] as const;

export const MOBILE_NAV_LINKS: readonly MobileNavLink[] = [
  { label: "Home", href: "#home", yRatio: 0.15, angleDeg: -3, xOffset: -2 },
  { label: "About", href: "#about", yRatio: 0.325, angleDeg: -1, xOffset: -6 },
  { label: "Skills", href: "#skills", yRatio: 0.50, angleDeg: 1, xOffset: 12 },
  { label: "Projects", href: "#projects", yRatio: 0.675, angleDeg: 2, xOffset: 12 },
  { label: "Contact", href: "#contact", yRatio: 0.85, angleDeg: 4, xOffset: 6 },
] as const;

/* ─── Centralized Responsive Navbar Scroll SVG Configuration ──────── */

export interface SVGPosition {
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  x?: string | number;
  y?: string | number;
}

export function resolveCoord(val?: string | number): string | undefined {
  if (val === undefined || val === null) return undefined;
  if (typeof val === "number") return `${val}px`;
  return val;
}

export function getSVGPositionStyle(position?: SVGPosition): React.CSSProperties {
  if (!position) return {};
  const resolvedTop = resolveCoord(position.top ?? position.y);
  const resolvedBottom = resolveCoord(position.bottom);
  const resolvedLeft = resolveCoord(position.left ?? position.x);
  const resolvedRight = resolveCoord(position.right);

  const style: React.CSSProperties = {};
  if (resolvedTop !== undefined) style.top = resolvedTop;
  if (resolvedBottom !== undefined) style.bottom = resolvedBottom;
  if (resolvedLeft !== undefined) style.left = resolvedLeft;
  if (resolvedRight !== undefined) style.right = resolvedRight;
  return style;
}

export function resolveTransformCoord(val?: string | number): string {
  if (val === undefined || val === null) return "0px";
  if (typeof val === "number") return `${val}px`;
  const str = String(val).trim();
  if (
    str.startsWith("calc(") ||
    str.endsWith("%") ||
    str.endsWith("px") ||
    str.endsWith("vh") ||
    str.endsWith("vw") ||
    str.endsWith("rem") ||
    str.endsWith("em")
  ) {
    return str;
  }
  const parsed = parseFloat(str);
  return isNaN(parsed) ? str : `${parsed}px`;
}

export function getInitialScrollTransform(start: {
  x: string | number;
  y: string | number;
  rotationDeg?: number;
}): string {
  const x = resolveTransformCoord(start.x);
  const y = resolveTransformCoord(start.y);
  const rot = start.rotationDeg ? ` rotate(${start.rotationDeg}deg)` : "";
  return `translate3d(${x}, calc(-50% + ${y}), 0)${rot}`;
}

function parseSingleCoord(
  str: string,
  referenceSize: number,
  viewportSize: number
): number {
  const s = str.trim();
  if (s.endsWith("vh")) {
    const vh = viewportSize || (typeof window !== "undefined" ? window.innerHeight : 900);
    return (parseFloat(s) / 100) * vh;
  }
  if (s.endsWith("vw")) {
    const vw = viewportSize || (typeof window !== "undefined" ? window.innerWidth : 1440);
    return (parseFloat(s) / 100) * vw;
  }
  if (s.endsWith("%")) {
    return (parseFloat(s) / 100) * referenceSize;
  }
  if (s.endsWith("px")) {
    return parseFloat(s);
  }
  const parsed = parseFloat(s);
  return isNaN(parsed) ? 0 : parsed;
}

export function parseCoordinate(
  val: string | number | undefined,
  referenceSize: number = 0,
  viewportSize: number = 0
): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === "number") return val;

  const str = String(val).trim();

  // Handle calc(...) expressions such as "calc(50% - 50px)" or "calc(50% - 0px)"
  if (str.startsWith("calc(") && str.endsWith(")")) {
    const inner = str.slice(5, -1).trim();
    const tokens = inner.match(/([+-]?\s*[\d.]+(?:%|px|vh|vw)?|[+-])/g);
    if (tokens) {
      let total = 0;
      let currentOp = "+";
      for (const token of tokens) {
        const t = token.trim();
        if (t === "+" || t === "-") {
          currentOp = t;
        } else {
          const num = parseSingleCoord(t, referenceSize, viewportSize);
          if (currentOp === "+") {
            total += num;
          } else {
            total -= num;
          }
        }
      }
      return total;
    }
  }

  return parseSingleCoord(str, referenceSize, viewportSize);
}

export interface ScrollSVGVisualConfig {
  width: number;
  height: number;
  viewBox: string;
  position: SVGPosition;
  start: {
    x: string | number;
    y: string | number;
    rotationDeg: number;
  };
  end: {
    xOffsetRatio: number;
    yOffset: number;
    rotationDeg: number;
  };
  duration: number;
  speed: number;
  ribbonXStart: number;
  ribbonXEnd: number;
  path: readonly RibbonAnchor[] | readonly MobileCenterlineAnchor[];
  trajectory: RibbonTrajectoryConfig | MobileTrajectoryConfig;
}

export const NAVBAR_SCROLL_SVG_CONFIG = {
  desktop: {
    container: {
      width: 825,
      height: 120,
      scrollW: 50,
      scrollH: 120,
    },
    centerRibbon: {
      width: 1224,
      height: 162,
      viewBox: "0 0 1224 162",
    },
    animation: {
      dropDuration: 1000,     // Stage 1: Drop from top together as ONE attached unit (ms)
      holdDuration: 300,      // Stage 2: Brief pause at center (ms)
      separateDuration: 1600, // Stage 3: Curved side separation movement (ms)
      unrollDuration: 0,
      underlineDuration: 920, // Snake travel underline duration (ms)
      easeEntrance: cubicBezier(0.22, 1, 0.36, 1),
      easeSeparation: cubicBezier(0.25, 1, 0.45, 1),
      easeSnakeTravel: cubicBezier(0.25, 1, 0.35, 1),
      easeUnroll: cubicBezier(0.25, 1, 0.45, 1),
    },
    topLeft: {
      width: 80,
      height: 100,
      viewBox: "0 0 58 147",
      position: {
        top: "50%",
        left: 0,
      },
      start: {
        x: "calc(46%)",
        y: "-150vh",
        rotationDeg: 0,
      },
      end: {
        xOffsetRatio: -0.30, // -Sw * 0.25 (-12.5px from center container edge)
        yOffset: 0,
        rotationDeg: 0,
      },
      duration: 1600,
      speed: 1,
      ribbonXStart: 0.5,
      ribbonXEnd: 0.0,
      path: RIBBON_ANCHORS,
      trajectory: {
        viewBoxWidth: 1224,
        viewBoxHeight: 162,
        neutralY: 85.60,
        angleMultiplier: 8,
      },
    },
    bottomRight: {
      width: 80,
      height: 100,
      viewBox: "0 0 58 147",
      position: {
        top: "50%",
        left: 4,
      },
      start: {
        x: "calc(50%)",
        y: "-150vh",
        rotationDeg: 0,
      },
      end: {
        xOffsetRatio: -0.75, // W - Sw * 0.75 (787.5px)
        yOffset: 0,
        rotationDeg: 0,
      },
      duration: 1600,
      speed: 1,
      ribbonXStart: 0.5,
      ribbonXEnd: 1.0,
      path: RIBBON_ANCHORS,
      trajectory: {
        viewBoxWidth: 1224,
        viewBoxHeight: 162,
        neutralY: 85.60,
        angleMultiplier: 8,
      },
    },
  },

  tablet: {
    container: {
      width: 720,
      height: 100,
      scrollW: 44,
      scrollH: 100,
    },
    centerRibbon: {
      width: 1224,
      height: 162,
      viewBox: "0 0 1224 162",
    },
    animation: {
      dropDuration: 1000,
      holdDuration: 300,
      separateDuration: 1600,
      unrollDuration: 0,
      underlineDuration: 920,
      easeEntrance: cubicBezier(0.22, 1, 0.36, 1),
      easeSeparation: cubicBezier(0.25, 1, 0.45, 1),
      easeSnakeTravel: cubicBezier(0.25, 1, 0.35, 1),
      easeUnroll: cubicBezier(0.25, 1, 0.45, 1),
    },
    topLeft: {
      width: 50,
      height: 80,
      viewBox: "0 0 58 147",
      position: {
        top: "50%",
        left: 0,
      },
      start: {
        x: "calc(45%)",
        y: "-150vh",
        rotationDeg: 0,
      },
      end: {
        xOffsetRatio: -0.50,
        yOffset: 0,
        rotationDeg: 0,
      },
      duration: 1600,
      speed: 1,
      ribbonXStart: 0.5,
      ribbonXEnd: 0.0,
      path: RIBBON_ANCHORS,
      trajectory: {
        viewBoxWidth: 1224,
        viewBoxHeight: 162,
        neutralY: 85.60,
        angleMultiplier: 8,
      },
    },
    bottomRight: {
      width: 50,
      height: 80,
      viewBox: "0 0 58 147",
      position: {
        top: "50%",
        left: 0,
      },
      start: {
        x: "calc(50%)",
        y: "-150vh",
        rotationDeg: 0,
      },
      end: {
        xOffsetRatio: -0.30,
        yOffset: 0,
        rotationDeg: 0,
      },
      duration: 1600,
      speed: 1,
      ribbonXStart: 0.5,
      ribbonXEnd: 1.0,
      path: RIBBON_ANCHORS,
      trajectory: {
        viewBoxWidth: 1224,
        viewBoxHeight: 162,
        neutralY: 85.60,
        angleMultiplier: 8,
      },
    },
  },

  mobile: {
    container: {
      width: 240,
      height: 600,
      scrollW: 115,
      scrollH: 48,
    },
    centerRibbon: {
      width: 304,
      height: 1376,
      viewBox: "0 0 304 1376",
    },
    animation: {
      dropDuration: 0,
      holdDuration: 0,
      separateDuration: 0,
      unrollDuration: 3000, // 5000ms vertical unroll along center spline
      underlineDuration: 0,
      easeEntrance: cubicBezier(0.22, 1, 0.36, 1),
      easeSeparation: cubicBezier(0.25, 1, 0.45, 1),
      easeSnakeTravel: cubicBezier(0.25, 1, 0.35, 1),
      easeUnroll: cubicBezier(0.25, 1, 0.45, 1),
    },
    topLeft: {
      width: 150,
      height: 50,
      viewBox: "0 0 244 64",
      position: {
        top: "-50px",
        left: "44%",
      },
      start: {
        x: "44%",
        y: -48,
        rotationDeg: 0,
      },
      end: {
        xOffsetRatio: 0,
        yOffset: -48,
        rotationDeg: 0,
      },
      duration: 0, // Anchored top cap
      speed: 1,
      ribbonXStart: 0.44,
      ribbonXEnd: 0.44,
      path: [{ y: 0.000, x: 0.44 }] as const,
      trajectory: {
        viewBoxWidth: 304,
        viewBoxHeight: 1376,
        angleMultiplier: 1,
      },
    },
    bottomRight: {
      width: 250,
      height: 50,
      viewBox: "0 0 244 64",
      position: {
        top: "-24px",
        left: "52%",
      },
      start: {
        // x: "calc(-50% + (0.378 - 0.5) * 100%)",
        x: 0,
        y: 0,
        rotationDeg: 0,
      },
      end: {
        xOffsetRatio: 0,
        yOffset: 0,
        rotationDeg: 0,
      },
      duration: 5000,
      speed: 1,
      ribbonXStart: 0.378,
      ribbonXEnd: 0.386,
      path: MOBILE_CENTERLINE,
      trajectory: {
        viewBoxWidth: 304,
        viewBoxHeight: 1376,
        angleMultiplier: 3,
        angleInfluence: 0.18,
      },
    },
  },
} as const;

/* ─── Unified Responsive Breakpoint Selection ─────────────────────── */

export type NavbarDevice = "desktop" | "tablet" | "mobile";

export function useNavbarDevice(): NavbarDevice {
  const { isMobile, isTablet } = useMediaQuery();

  if (isMobile) return "mobile";
  if (isTablet) return "tablet";
  return "desktop";
}

export function getNavbarScrollConfig(device: NavbarDevice) {
  return NAVBAR_SCROLL_SVG_CONFIG[device];
}
