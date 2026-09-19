/**
 * ============================================================================
 * PRELOADER RESPONSIVE CONFIGURATION & DYNAMIC TRANSFORM CALCULATIONS
 * ============================================================================
 * Centralized configuration for circle dimensions, fluid wave sizes,
 * starting and ending positions, and animation durations across
 * Desktop, Tablet, and Mobile breakpoints.
 */

export interface Position {
    x: number;
    y: number;
}

export interface DevicePreloaderConfig {
    circle: {
        width: number;
        height: number;
        backgroundColor?: string;
    };
    fluidWave: {
        width: number;
        height: number;
        startPosition?: Position;
        endPosition?: Position;
        start?: Position;
        end?: Position;
    };
    duration: number; // Duration in milliseconds
}

export interface PreloaderConfig {
    desktop: DevicePreloaderConfig;
    tablet: DevicePreloaderConfig;
    mobile: DevicePreloaderConfig;
}

export const preloaderConfig: PreloaderConfig = {
    desktop: {
        circle: {
            width: 150,
            height: 150,
            backgroundColor: "#ffffff",
        },
        fluidWave: {
            width: 831,
            height: 224,
            startPosition: { x: 0, y: 110 },
            endPosition: { x: -620, y: -75 },
        },
        duration: 5000,
    },
    tablet: {
        circle: {
            width: 240,
            height: 240,
            backgroundColor: "#ffffff",
        },
        fluidWave: {
            width: 1031,
            height: 324,
            startPosition: { x: 20, y: 200 },
            endPosition: { x: -750, y: -60 },
        },
        duration: 4500,
    },
    mobile: {
        circle: {
            width: 190,
            height: 190,
            backgroundColor: "#ffffff",
        },
        fluidWave: {
            width: 1031,
            height: 324,
            startPosition: { x: 20, y: 150 },
            endPosition: { x: -780, y: -65 },
        },
        duration: 4500,
    },
};

export interface WaveTransforms {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    travelX: number;
    travelY: number;
    distance: number;
    speed: number;
    angleDegrees?: number;
}

/**
 * Mathematically derives the fluid wave animation trajectory from
 * configured starting position, ending position, dimensions, and duration.
 *
 * Trajectory Calculation:
 * - startX, startY: retrieved directly from startPosition (or default 0, 0)
 * - endX, endY: retrieved directly from endPosition (or computed from wave & circle dimensions)
 * - deltaX: endX - startX
 * - deltaY: endY - startY
 * - travelX: Math.abs(deltaX)
 * - travelY: Math.abs(deltaY)
 * - distance: Math.round(Math.hypot(deltaX, deltaY))
 * - speed: distance / (duration / 1000) in pixels per second
 * - angleDegrees: Math.atan2(deltaY, deltaX) * (180 / Math.PI)
 */
export function calculateWaveTransforms(
    circle: { width: number; height: number },
    fluidWave: {
        width: number;
        height: number;
        startPosition?: Position;
        endPosition?: Position;
        start?: Position;
        end?: Position;
    },
    duration: number = 0
): WaveTransforms {
    const startX = fluidWave.startPosition?.x ?? fluidWave.start?.x ?? 0;
    const startY = fluidWave.startPosition?.y ?? fluidWave.start?.y ?? 0;

    const defaultTravelX = Math.max(0, fluidWave.width - circle.width);
    const defaultTravelY = Math.max(0, fluidWave.height - circle.height);

    const endX = fluidWave.endPosition?.x ?? fluidWave.end?.x ?? -defaultTravelX;
    const endY = fluidWave.endPosition?.y ?? fluidWave.end?.y ?? -defaultTravelY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const travelX = Math.abs(deltaX);
    const travelY = Math.abs(deltaY);

    const distance = Math.round(Math.hypot(deltaX, deltaY));
    const speed = duration > 0 ? Number((distance / (duration / 1000)).toFixed(2)) : 0;
    const angleDegrees = Number((Math.atan2(deltaY, deltaX) * (180 / Math.PI)).toFixed(2));

    return {
        startX,
        startY,
        endX,
        endY,
        travelX,
        travelY,
        distance,
        speed,
        angleDegrees,
    };
}

/**
 * Generates responsive CSS custom properties dynamically derived from preloaderConfig.
 * Ensures circle, wave dimensions, start/end transforms, trajectory distance, speed,
 * and duration are perfectly synchronized across all breakpoints.
 */
export function generatePreloaderCSSVariables(
    config: PreloaderConfig = preloaderConfig
): string {
    const desktopTransforms = calculateWaveTransforms(
        config.desktop.circle,
        config.desktop.fluidWave,
        config.desktop.duration
    );
    const tabletTransforms = calculateWaveTransforms(
        config.tablet.circle,
        config.tablet.fluidWave,
        config.tablet.duration
    );
    const mobileTransforms = calculateWaveTransforms(
        config.mobile.circle,
        config.mobile.fluidWave,
        config.mobile.duration
    );

    return `
    /* Mobile defaults (< 768px) */
    .preloader-overlay {
      --preloader-circle-w: ${config.mobile.circle.width}px;
      --preloader-circle-h: ${config.mobile.circle.height}px;
      --preloader-circle-bg: ${config.mobile.circle.backgroundColor || "#ffffff"};
      --preloader-wave-w: ${config.mobile.fluidWave.width}px;
      --preloader-wave-h: ${config.mobile.fluidWave.height}px;
      --preloader-start-x: ${mobileTransforms.startX}px;
      --preloader-start-y: ${mobileTransforms.startY}px;
      --preloader-end-x: ${mobileTransforms.endX}px;
      --preloader-end-y: ${mobileTransforms.endY}px;
      --preloader-travel-x: ${mobileTransforms.travelX}px;
      --preloader-travel-y: ${mobileTransforms.travelY}px;
      --preloader-travel-distance: ${mobileTransforms.distance}px;
      --preloader-speed: ${mobileTransforms.speed}px/s;
      --preloader-duration: ${config.mobile.duration}ms;
      --preloader-font-size: 1.5rem;
    }

    /* Tablet (768px - 1023px) */
    @media (min-width: 768px) {
      .preloader-overlay {
        --preloader-circle-w: ${config.tablet.circle.width}px;
        --preloader-circle-h: ${config.tablet.circle.height}px;
        --preloader-circle-bg: ${config.tablet.circle.backgroundColor || "#ffffff"};
        --preloader-wave-w: ${config.tablet.fluidWave.width}px;
        --preloader-wave-h: ${config.tablet.fluidWave.height}px;
        --preloader-start-x: ${tabletTransforms.startX}px;
        --preloader-start-y: ${tabletTransforms.startY}px;
        --preloader-end-x: ${tabletTransforms.endX}px;
        --preloader-end-y: ${tabletTransforms.endY}px;
        --preloader-travel-x: ${tabletTransforms.travelX}px;
        --preloader-travel-y: ${tabletTransforms.travelY}px;
        --preloader-travel-distance: ${tabletTransforms.distance}px;
        --preloader-speed: ${tabletTransforms.speed}px/s;
        --preloader-duration: ${config.tablet.duration}ms;
        --preloader-font-size: 1.85rem;
      }
    }

    /* Desktop (>= 1024px) */
    @media (min-width: 1024px) {
      .preloader-overlay {
        --preloader-circle-w: ${config.desktop.circle.width}px;
        --preloader-circle-h: ${config.desktop.circle.height}px;
        --preloader-circle-bg: ${config.desktop.circle.backgroundColor || "#ffffff"};
        --preloader-wave-w: ${config.desktop.fluidWave.width}px;
        --preloader-wave-h: ${config.desktop.fluidWave.height}px;
        --preloader-start-x: ${desktopTransforms.startX}px;
        --preloader-start-y: ${desktopTransforms.startY}px;
        --preloader-end-x: ${desktopTransforms.endX}px;
        --preloader-end-y: ${desktopTransforms.endY}px;
        --preloader-travel-x: ${desktopTransforms.travelX}px;
        --preloader-travel-y: ${desktopTransforms.travelY}px;
        --preloader-travel-distance: ${desktopTransforms.distance}px;
        --preloader-speed: ${desktopTransforms.speed}px/s;
        --preloader-duration: ${config.desktop.duration}ms;
        --preloader-font-size: 1.125rem;
      }
    }
  `;
}

export default preloaderConfig;
