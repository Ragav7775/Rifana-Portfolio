"use client";

import React, {
    useEffect,
    useId,
    useRef,
    useState,
} from "react";

/* ============================================================
   TYPES
   ============================================================ */

type CursorDirection = "left" | "right";

type HandleSide =
    | "corners"
    | "horizontal"
    | "vertical"
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "all";

export type CursorPosition = {
    x: number;
    y: number;
};

export interface DragAnimatedSVGConfigItem {
    width: number;
    height: number;
    duration: number;
    dashCount: number;
    strokeWidth: number;
    boxSize: number;
    dashSpeed: number;
    delay: number;
    viewportPercentage: number;
    cursorSize: number;
    cursorPosition: CursorPosition;
}

export interface DragAnimatedSVGConfigBreakpoints {
    desktop: DragAnimatedSVGConfigItem;
    tablet: DragAnimatedSVGConfigItem;
    mobile: DragAnimatedSVGConfigItem;
}

export interface DragAnimatedSVGProps {
    /**
     * Selection rectangle width.
     */
    width?: number;

    /**
     * Selection rectangle height.
     */
    height?: number;

    /**
     * Animation duration in seconds.
     */
    duration?: number;

    /**
     * Controls which middle handles are displayed.
     */
    sides?: HandleSide;

    /**
     * Drag direction / cursor type.
     *
     * right:
     *   top-left -> bottom-right
     *
     * left:
     *   top-right -> bottom-left
     */
    cursor?: CursorDirection;

    /**
     * Number of dashes around the COMPLETE rectangle.
     *
     * Examples:
     *
     * dashCount={8}
     * dashCount={12}
     * dashCount={20}
     * dashCount={32}
     *
     * The number stays fixed even when width/height changes.
     */
    dashCount?: number;

    /**
     * Traveling dash speed in cycles per second.
     *
     * Higher values move the dashes faster.
     * If omitted, the current behavior is preserved:
     * one complete dash pattern per `duration`.
     */
    dashSpeed?: number;

    /**
     * Direction of the traveling dash animation.
     *
     * forward:
     *   keeps the current/default travel direction.
     *
     * reverse:
     *   moves the dashes in the opposite direction.
     */
    dashDirection?: "forward" | "reverse";

    /**
     * Optional React content revealed inside the selection rectangle
     * during the same drag animation.
     */
    children?: React.ReactNode;

    /**
     * Size of every selection box/handle in SVG units.
     *
     * This directly controls the corner and center boxes.
     *
     * Example:
     *
     * boxSize={8}
     * boxSize={10}
     * boxSize={14}
     * boxSize={20}
     */
    boxSize?: number;

    /**
     * Cursor scale.
     *
     * 1   = original size
     * 0.5 = half size
     * 2   = double size
     */
    cursorSize?: number;

    /**
     * Additional offsets from the automatically calculated
     * cursor position.
     */
    cursorPosition?: CursorPosition;

    /**
     * Delay before the children reveal/mask animation starts, in seconds.
     * The reveal keeps the same duration and easing as the drag animation.
     */
    delay?: number;

    /**
     * Vertical viewport position, as a percentage from the top of the viewport,
     * at which the overall drag/reveal animation should start.
     * When omitted, the existing immediate-start behavior is preserved.
     */
    viewportPercentage?: number;

    /**
     * Dash stroke width in SVG units.
     * Default: 3
     */
    strokeWidth?: number;

    /**
     * Optional callback fired when the drag/rectangle animation starts.
     */
    onAnimationStart?: () => void;

    /**
     * Optional callback fired when the drag/rectangle animation completes.
     */
    onAnimationComplete?: () => void;

    /**
     * Optional inline styles for the root container.
     */
    style?: React.CSSProperties;

    className?: string;
}


/* ============================================================
   COMPONENT
   ============================================================ */

const DragAnimatedSVG: React.FC<DragAnimatedSVGProps> = ({
    width = 956,
    height = 167,
    duration = 2.8,
    sides = "all",
    cursor = "right",

    /*
     * Configurable visual properties.
     */
    dashCount = 20,
    dashSpeed,
    dashDirection = "forward",
    delay = 0,
    viewportPercentage = 90,
    strokeWidth = 3,
    children,
    boxSize = 10,
    cursorSize = 1,
    cursorPosition: {
        x: cursorOffsetX = 0,
        y: cursorOffsetY = 0
    } = {},

    onAnimationStart,
    onAnimationComplete,

    className = "",
    style,
}) => {
    const onAnimationStartRef = useRef(onAnimationStart);
    useEffect(() => {
        onAnimationStartRef.current = onAnimationStart;
    }, [onAnimationStart]);

    const onAnimationCompleteRef = useRef(onAnimationComplete);
    useEffect(() => {
        onAnimationCompleteRef.current = onAnimationComplete;
    }, [onAnimationComplete]);

    /* ==========================================================
       CONSTANTS
       ========================================================== */

    /*
     * Original geometry.
     */
    const RIGHT_BOX_X = 3.5;
    const RIGHT_BOX_Y = 5.5;

    const LEFT_BOX_X = 47.5005;
    const LEFT_BOX_Y = 5.5;

    /*
     * Valid ranges.
     */
    const MIN_DASH_COUNT = 1;
    const MAX_DASH_COUNT = 200;

    const MIN_BOX_SIZE = 1;
    const MAX_BOX_SIZE = 100;

    const MIN_CURSOR_SIZE = 0.1;
    const MAX_CURSOR_SIZE = 10;


    /* ==========================================================
       SAFE PROPS
       ========================================================== */

    const safeWidth = Math.max(
        40,
        Number.isFinite(Number(width))
            ? Number(width)
            : 956
    );

    const safeHeight = Math.max(
        40,
        Number.isFinite(Number(height))
            ? Number(height)
            : 167
    );

    const safeDuration = Math.max(
        0.2,
        Number.isFinite(Number(duration))
            ? Number(duration)
            : 2.8
    );

    const safeDelay = Math.max(
        0,
        Number.isFinite(Number(delay))
            ? Number(delay)
            : 0
    );

    const hasViewportPercentage =
        Number.isFinite(Number(viewportPercentage));

    const safeViewportPercentage = Math.min(
        100,
        Math.max(
            0,
            hasViewportPercentage
                ? Number(viewportPercentage)
                : 0
        )
    );

    /*
     * dashCount must be an integer.
     */
    const safeDashCount = Math.min(
        MAX_DASH_COUNT,
        Math.max(
            MIN_DASH_COUNT,
            Math.round(
                Number.isFinite(Number(dashCount))
                    ? Number(dashCount)
                    : 20
            )
        )
    );

    /*
     * Dash speed is expressed as complete dash-pattern cycles per second.
     * The default preserves the current behavior: one cycle per `duration`.
     */
    const safeDashSpeed = Math.min(
        100,
        Math.max(
            0.01,
            Number.isFinite(Number(dashSpeed)) && Number(dashSpeed) > 0
                ? Number(dashSpeed)
                : 1 / safeDuration
        )
    );

    const dashAnimationDuration =
        1000 / safeDashSpeed;

    /*
     * Direct box size.
     *
     * Unlike the previous implementation, this does NOT
     * automatically scale with width/height.
     *
     * The caller has direct control.
     */
    const safeBoxSize = Math.min(
        MAX_BOX_SIZE,
        Math.max(
            MIN_BOX_SIZE,
            Number.isFinite(Number(boxSize))
                ? Number(boxSize)
                : 10
        )
    );

    const boxHalf =
        safeBoxSize / 2;

    /*
     * Cursor size.
     */
    const safeCursorSize = Math.min(
        MAX_CURSOR_SIZE,
        Math.max(
            MIN_CURSOR_SIZE,
            Number.isFinite(Number(cursorSize))
                ? Number(cursorSize)
                : 1
        )
    );

    /*
     * Cursor offsets.
     */
    const safeCursorOffsetX =
        Number.isFinite(Number(cursorOffsetX))
            ? Number(cursorOffsetX)
            : 0;

    const safeCursorOffsetY =
        Number.isFinite(Number(cursorOffsetY))
            ? Number(cursorOffsetY)
            : 0;

    const safeStrokeWidth = Math.max(
        0.5,
        Number.isFinite(Number(strokeWidth))
            ? Number(strokeWidth)
            : 3
    );


    /* ==========================================================
       ACTIVE RECTANGLE ORIGIN
       ========================================================== */

    const BOX_X =
        cursor === "left"
            ? LEFT_BOX_X
            : RIGHT_BOX_X;

    const BOX_Y =
        cursor === "left"
            ? LEFT_BOX_Y
            : RIGHT_BOX_Y;


    /* ==========================================================
       RECTANGLE GEOMETRY
       ========================================================== */

    const left = BOX_X;

    const top = BOX_Y;

    const right =
        BOX_X + safeWidth;

    const bottom =
        BOX_Y + safeHeight;

    const centerX =
        BOX_X + safeWidth / 2;

    const centerY =
        BOX_Y + safeHeight / 2;


    /* ==========================================================
       DYNAMIC DASH METRICS
       ========================================================== */

    /*
     * Keep the requested dashCount exact around the final rectangle.
     * One dash + one gap occupies one `perimeter / dashCount` cycle.
     */
    const perimeter =
        2 * (safeWidth + safeHeight);

    const dashUnit =
        perimeter / (safeDashCount * 2);

    const dashArray =
        `${dashUnit} ${dashUnit}`;

    const dashTravelDistance =
        dashUnit * 2;


    /* ==========================================================
       SVG SIZE
       ========================================================== */

    const svgWidth =
        cursor === "left"
            ? Math.max(
                1007,
                right + 4
            )
            : right + 70;

    const svgHeight =
        cursor === "left"
            ? Math.max(
                220,
                bottom + 48
            )
            : bottom + 70;


    /* ==========================================================
       UNIQUE CLIP IDS
       ========================================================== */

    const reactId = useId();

    const clipId =
        `drag-selection-${cursor}-${reactId.replace(/:/g, "")}`;

    const childrenMaskId =
        `drag-children-mask-${cursor}-${reactId.replace(/:/g, "")}`;


    /* ==========================================================
       REFS
       ========================================================== */

    const rectRef =
        useRef<SVGRectElement>(null);

    const childrenMaskRectRef =
        useRef<SVGRectElement>(null);

    const childrenWrapperRef =
        useRef<HTMLDivElement>(null);

    const componentRef =
        useRef<HTMLDivElement>(null);

    const [viewportAnimationStarted, setViewportAnimationStarted] =
        useState(!hasViewportPercentage);


    const cursorRef =
        useRef<SVGGElement>(null);

    const tlRef =
        useRef<SVGRectElement>(null);

    const tcRef =
        useRef<SVGRectElement>(null);

    const trRef =
        useRef<SVGRectElement>(null);

    const mlRef =
        useRef<SVGRectElement>(null);

    const mrRef =
        useRef<SVGRectElement>(null);

    const blRef =
        useRef<SVGRectElement>(null);

    const bcRef =
        useRef<SVGRectElement>(null);

    const brRef =
        useRef<SVGRectElement>(null);


    /* ==========================================================
       HANDLE POSITIONS
       ========================================================== */

    /*
     * All positions are calculated from the actual boxSize.
     *
     * This keeps the center of every box exactly aligned with
     * the rectangle/corner position.
     */

    const handlePositions = {

        /* TOP */

        tl: {
            x:
                left -
                boxHalf,

            y:
                top -
                boxHalf,
        },

        tc: {
            x:
                centerX -
                boxHalf,

            y:
                top -
                boxHalf,
        },

        tr: {
            x:
                right -
                boxHalf,

            y:
                top -
                boxHalf,
        },


        /* MIDDLE */

        ml: {
            x:
                left -
                boxHalf,

            y:
                centerY -
                boxHalf,
        },

        mr: {
            x:
                right -
                boxHalf,

            y:
                centerY -
                boxHalf,
        },


        /* BOTTOM */

        bl: {
            x:
                left -
                boxHalf,

            y:
                bottom -
                boxHalf,
        },

        bc: {
            x:
                centerX -
                boxHalf,

            y:
                bottom -
                boxHalf,
        },

        br: {
            x:
                right -
                boxHalf,

            y:
                bottom -
                boxHalf,
        },
    };


    /* ==========================================================
       MIDDLE HANDLE VISIBILITY
       ========================================================== */

    const showTop =
        sides === "all" ||
        sides === "vertical" ||
        sides === "top";

    const showBottom =
        sides === "all" ||
        sides === "vertical" ||
        sides === "bottom";

    const showLeft =
        sides === "all" ||
        sides === "horizontal" ||
        sides === "left";

    const showRight =
        sides === "all" ||
        sides === "horizontal" ||
        sides === "right";


    /* ==========================================================
       ANIMATION
       ========================================================== */

    useEffect(() => {
        const component = componentRef.current;

        if (!component) {
            return;
        }

        let hasStarted = false;
        let animationCleanup: (() => void) | null = null;

        const startAnimation = () => {
            if (hasStarted) {
                return;
            }

            hasStarted = true;
            setViewportAnimationStarted(true);
            onAnimationStartRef.current?.();

            const rect = rectRef.current;
            const childrenMaskRect = childrenMaskRectRef.current;
            const childrenWrapper = childrenWrapperRef.current;
            const cursorElement = cursorRef.current;

            if (!rect || !cursorElement) {
                return;
            }

            const handles = [
                tlRef.current,
                tcRef.current,
                trRef.current,
                mlRef.current,
                mrRef.current,
                blRef.current,
                bcRef.current,
                brRef.current,
            ];

            rect
                .getAnimations()
                .forEach((animation) => animation.cancel());

            childrenMaskRect
                ?.getAnimations()
                .forEach((animation) => animation.cancel());

            childrenWrapper
                ?.getAnimations()
                .forEach((animation) => animation.cancel());

            cursorElement
                .getAnimations()
                .forEach((animation) => animation.cancel());

            handles.forEach((handle) => {
                handle
                    ?.getAnimations()
                    .forEach((animation) => animation.cancel());
            });

            const isLeftDrag = cursor === "left";

            /*
             * EXACT ORIGINAL DRAG GEOMETRY:
             *
             * right:
             *   top-left -> bottom-right
             *
             * left:
             *   top-right -> bottom-left
             *
             * The dashed stroke itself is attached to this expanding rect.
             * Because the rect perimeter grows with the animation, the dashes
             * are naturally pulled/extracted from the starting corner exactly
             * like the original component.
             */
            const startX = isLeftDrag ? right : left;
            const startY = top;
            const endX = isLeftDrag ? left : right;
            const endY = bottom;

            rect.setAttribute("x", String(startX));
            rect.setAttribute("y", String(startY));
            rect.setAttribute("width", "0");
            rect.setAttribute("height", "0");

            if (childrenMaskRect) {
                childrenMaskRect.setAttribute("x", String(startX));
                childrenMaskRect.setAttribute("y", String(startY));
                childrenMaskRect.setAttribute("width", "0");
                childrenMaskRect.setAttribute("height", "0");
            }

            /* Always restart the dash phase at the original position. */
            rect.style.strokeDashoffset = "0";

            const rectangleKeyframes = isLeftDrag
                ? [
                    {
                        x: `${right}px`,
                        y: `${top}px`,
                        width: "0px",
                        height: "0px",
                    },
                    {
                        x: `${right}px`,
                        y: `${top}px`,
                        width: "0px",
                        height: "0px",
                        offset: 0.18,
                    },
                    {
                        x: `${left}px`,
                        y: `${top}px`,
                        width: `${safeWidth}px`,
                        height: `${safeHeight}px`,
                    },
                ]
                : [
                    {
                        x: `${left}px`,
                        y: `${top}px`,
                        width: "0px",
                        height: "0px",
                    },
                    {
                        x: `${left}px`,
                        y: `${top}px`,
                        width: "0px",
                        height: "0px",
                        offset: 0.18,
                    },
                    {
                        x: `${left}px`,
                        y: `${top}px`,
                        width: `${safeWidth}px`,
                        height: `${safeHeight}px`,
                    },
                ];

            const rectangleAnimation = rect.animate(
                rectangleKeyframes,
                {
                    duration: safeDuration * 1000,
                    easing: "cubic-bezier(.25,.1,.25,1)",
                    fill: "forwards",
                }
            );

            const childrenRevealAnimation = childrenMaskRect
                ? childrenMaskRect.animate(
                    rectangleKeyframes,
                    {
                        duration: safeDuration * 1000,
                        delay: safeDelay * 1000,
                        easing: "cubic-bezier(.25,.1,.25,1)",
                        fill: "forwards",
                    }
                )
                : null;

            /*
             * SYNCHRONIZED REVEAL MASK (SCALING RECTANGLE):
             *
             * The reveal effect is contained within a scaling rectangle that
             * mirrors the behavior of the dragging rectangle with exact:
             * - Shape width (safeWidth)
             * - Shape height (safeHeight)
             * - Speed (safeDuration * 1000)
             * - startDuration (0.18 hold)
             * - endDuration (1.0 end)
             * - start position (startX, startY)
             * - end position (left, top -> right, bottom)
             */
            const vbX = cursor === "right" ? -10 : 0;
            const vbW = svgWidth + 10;
            const vbH = svgHeight;

            const startXPct = ((startX - vbX) / vbW) * 100;
            const startYPct = (startY / vbH) * 100;

            const leftPct = ((left - vbX) / vbW) * 100;
            const topPct = (top / vbH) * 100;
            const widthPct = (safeWidth / vbW) * 100;
            const heightPct = (safeHeight / vbH) * 100;
            const rightPct = leftPct + widthPct;
            const bottomPct = topPct + heightPct;

            const revealClipKeyframes = isLeftDrag
                ? [
                    {
                        clipPath: `polygon(${startXPct}% ${startYPct}%, ${startXPct}% ${startYPct}%, ${startXPct}% ${startYPct}%, ${startXPct}% ${startYPct}%)`,
                    },
                    {
                        clipPath: `polygon(${startXPct}% ${startYPct}%, ${startXPct}% ${startYPct}%, ${startXPct}% ${startYPct}%, ${startXPct}% ${startYPct}%)`,
                        offset: 0.18,
                    },
                    {
                        clipPath: `polygon(${leftPct}% ${topPct}%, ${rightPct}% ${topPct}%, ${rightPct}% ${bottomPct}%, ${leftPct}% ${bottomPct}%)`,
                    },
                ]
                : [
                    {
                        clipPath: `polygon(${startXPct}% ${startYPct}%, ${startXPct}% ${startYPct}%, ${startXPct}% ${startYPct}%, ${startXPct}% ${startYPct}%)`,
                    },
                    {
                        clipPath: `polygon(${startXPct}% ${startYPct}%, ${startXPct}% ${startYPct}%, ${startXPct}% ${startYPct}%, ${startXPct}% ${startYPct}%)`,
                        offset: 0.18,
                    },
                    {
                        clipPath: `polygon(${leftPct}% ${topPct}%, ${rightPct}% ${topPct}%, ${rightPct}% ${bottomPct}%, ${leftPct}% ${bottomPct}%)`,
                    },
                ];

            let wrapperRevealAnimation: Animation | null = null;
            if (childrenWrapper) {
                childrenWrapper.style.clipPath = `polygon(${startXPct}% ${startYPct}%, ${startXPct}% ${startYPct}%, ${startXPct}% ${startYPct}%, ${startXPct}% ${startYPct}%)`;
                wrapperRevealAnimation = childrenWrapper.animate(
                    revealClipKeyframes,
                    {
                        duration: safeDuration * 1000,
                        delay: safeDelay * 1000,
                        easing: "cubic-bezier(.25,.1,.25,1)",
                        fill: "forwards",
                    }
                );
            }

            /*
             * IMPORTANT:
             *
             * The dash motion is deliberately NOT started until the
             * original drag/rectangle animation has completely finished.
             * This keeps the original drag appearance intact and prevents
             * dash phase drift while the rectangle dimensions are changing.
             *
             * The travel distance is exactly one complete dynamic dash+gap
             * pattern, so every dashCount value loops seamlessly.
             */
            let dashAnimation: Animation | null = null;

            void rectangleAnimation.finished
                .then(() => {
                    if (!rect.isConnected) {
                        return;
                    }

                    // Preserve the original completion behavior when there is no reveal delay.
                    // With a delay, the reveal animation must be allowed to complete on its own.
                    if (safeDelay === 0) {
                        if (childrenWrapper) {
                            childrenWrapper.style.clipPath = "none";
                        }
                        if (childrenMaskRect) {
                            childrenMaskRect.setAttribute("x", String(left));
                            childrenMaskRect.setAttribute("y", String(top));
                            childrenMaskRect.setAttribute("width", String(safeWidth));
                            childrenMaskRect.setAttribute("height", String(safeHeight));
                        }
                    }

                    rect.style.strokeDashoffset = "0";

                    const dashOffset =
                        dashDirection === "reverse"
                            ? dashTravelDistance
                            : -dashTravelDistance;

                    dashAnimation = rect.animate(
                        [
                            {
                                strokeDashoffset: 0,
                            },
                            {
                                strokeDashoffset: dashOffset,
                            },
                        ],
                        {
                            duration: dashAnimationDuration,
                            easing: "linear",
                            iterations: Infinity,
                            fill: "forwards",
                        }
                    );

                    onAnimationCompleteRef.current?.();
                })
                .catch(() => {
                    // Expected when the effect is cleaned up/restarted.
                });

            const animateHandle = (
                element: SVGRectElement | null,
                visible: boolean,
                targetX: number,
                targetY: number
            ) => {
                if (!element) {
                    return;
                }

                if (!visible) {
                    element.style.display = "none";
                    return;
                }

                element.style.display = "block";

                const initialX = startX - boxHalf;
                const initialY = startY - boxHalf;

                element.setAttribute("x", String(initialX));
                element.setAttribute("y", String(initialY));

                element.animate(
                    [
                        {
                            x: `${initialX}px`,
                            y: `${initialY}px`,
                        },
                        {
                            x: `${initialX}px`,
                            y: `${initialY}px`,
                            offset: 0.18,
                        },
                        {
                            x: `${targetX}px`,
                            y: `${targetY}px`,
                        },
                    ],
                    {
                        duration: safeDuration * 1000,
                        easing: "cubic-bezier(.25,.1,.25,1)",
                        fill: "forwards",
                    }
                );
            };

            animateHandle(tlRef.current, true, handlePositions.tl.x, handlePositions.tl.y);
            animateHandle(trRef.current, true, handlePositions.tr.x, handlePositions.tr.y);
            animateHandle(blRef.current, true, handlePositions.bl.x, handlePositions.bl.y);
            animateHandle(brRef.current, true, handlePositions.br.x, handlePositions.br.y);

            animateHandle(tcRef.current, showTop, handlePositions.tc.x, handlePositions.tc.y);
            animateHandle(bcRef.current, showBottom, handlePositions.bc.x, handlePositions.bc.y);
            animateHandle(mlRef.current, showLeft, handlePositions.ml.x, handlePositions.ml.y);
            animateHandle(mrRef.current, showRight, handlePositions.mr.x, handlePositions.mr.y);

            const cursorTipX = isLeftDrag ? 34.5 : 974.5;
            const cursorTipY = isLeftDrag ? 177 : 180;

            const cursorStartX =
                startX - cursorTipX + safeCursorOffsetX;
            const cursorStartY =
                startY - cursorTipY + safeCursorOffsetY;
            const cursorEndX =
                endX - cursorTipX + safeCursorOffsetX;
            const cursorEndY =
                endY - cursorTipY + safeCursorOffsetY;

            const startTransform =
                `translate(${cursorStartX}px, ${cursorStartY}px) scale(${safeCursorSize})`;
            const endTransform =
                `translate(${cursorEndX}px, ${cursorEndY}px) scale(${safeCursorSize})`;

            cursorElement.style.transformOrigin =
                `${cursorTipX}px ${cursorTipY}px`;
            cursorElement.style.transform = startTransform;

            cursorElement.animate(
                [
                    { transform: startTransform },
                    {
                        transform: startTransform,
                        offset: 0.18,
                    },
                    { transform: endTransform },
                ],
                {
                    duration: safeDuration * 1000,
                    easing: "cubic-bezier(.25,.1,.25,1)",
                    fill: "forwards",
                }
            );

            animationCleanup = () => {
                rectangleAnimation.cancel();
                childrenRevealAnimation?.cancel();
                wrapperRevealAnimation?.cancel();
                dashAnimation?.cancel();

                rect
                    .getAnimations()
                    .forEach((animation) => animation.cancel());

                cursorElement
                    .getAnimations()
                    .forEach((animation) => animation.cancel());

                handles.forEach((handle) => {
                    handle
                        ?.getAnimations()
                        .forEach((animation) => animation.cancel());
                });
            };
        };

        const viewportTriggerPx = () =>
            (window.innerHeight * safeViewportPercentage) / 100;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (hasStarted) {
                    return;
                }

                const triggerY = viewportTriggerPx();

                if (entry.boundingClientRect.top <= triggerY) {
                    observer.disconnect();
                    startAnimation();
                }
            },
            {
                threshold: 0,
            }
        );

        if (!hasViewportPercentage) {
            startAnimation();
        } else {
            observer.observe(component);
        }

        const handleScrollOrResize = () => {
            if (hasStarted) {
                return;
            }

            if (component.getBoundingClientRect().top <= viewportTriggerPx()) {
                observer.disconnect();
                startAnimation();
            }
        };

        if (hasViewportPercentage) {
            window.addEventListener("scroll", handleScrollOrResize, { passive: true });
            window.addEventListener("resize", handleScrollOrResize);
            handleScrollOrResize();
        }

        return () => {
            observer.disconnect();
            if (hasViewportPercentage) {
                window.removeEventListener("scroll", handleScrollOrResize);
                window.removeEventListener("resize", handleScrollOrResize);
            }

            animationCleanup?.();
        };
    }, [
        cursor,
        safeWidth,
        safeHeight,
        safeDuration,
        safeDelay,
        hasViewportPercentage,
        safeViewportPercentage,
        safeDashCount,
        dashTravelDistance,
        safeDashSpeed,
        dashAnimationDuration,
        dashDirection,
        safeBoxSize,
        boxHalf,
        safeCursorSize,
        safeCursorOffsetX,
        safeCursorOffsetY,
        sides,
        left,
        top,
        right,
        bottom,
        centerX,
        centerY,
        showTop,
        showBottom,
        showLeft,
        showRight,
    ]);

    /* ==========================================================
       SVG
       ========================================================== */

    // If cursor is right, start the viewBox at -10 to add 10px of space on the left.
    // We also add +10 to the total width to ensure the right side doesn't get clipped by the shift.
    const viewBoxX = cursor === "right" ? -10 : 0;
    const viewBoxWidth = svgWidth + 10;

    return (
        <div
            ref={componentRef}
            className={className}
            style={{
                position: "relative",
                display: "block",
                width: "100%",
                aspectRatio: `${viewBoxWidth} / ${svgHeight}`,
                visibility:
                    hasViewportPercentage && !viewportAnimationStarted
                        ? "hidden"
                        : "visible",
                ...style,
            }}
        >
            {/*
             * CHILDREN LAYER
             *
             * This is a real HTML/React subtree, not foreignObject.
             * Therefore normal React behavior remains intact: buttons,
             * inputs, animations, portals, event handlers, etc. all work.
             *
             * The SVG mask below controls which part is visible.
             */}
            {children ? (
                <div
                    id={childrenMaskId}
                    ref={childrenWrapperRef}
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        // WebkitMaskImage: `url(#${childrenMaskId})`,
                        // maskImage: `url(#${childrenMaskId})`,
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "0 0",
                        maskPosition: "0 0",
                        WebkitMaskSize: "100% 100%",
                        maskSize: "100% 100%",
                    }}
                >
                    {children}
                </div>
            ) : null}

            <svg
                width={svgWidth}
                height={svgHeight}
                // viewBox format: "min-x min-y width height"
                viewBox={`${viewBoxX} 0 ${viewBoxWidth} ${svgHeight}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "block",
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    overflow: "visible",
                }}
            >

                {/* =================================================
                SELECTION RECTANGLE / TRAVELING DASHES
                ================================================= */}
                <rect
                    ref={rectRef}
                    x={cursor === "left" ? right : left}
                    y={top}
                    width={0}
                    height={0}
                    fill="none"
                    stroke="black"
                    strokeWidth={safeStrokeWidth}
                    strokeDasharray={dashArray}
                    strokeDashoffset={0}
                />

                {/*
             * SVG REVEAL MASK
             *
             * Black = hidden
             * White = visible
             * The white rectangle is animated with the exact same
             * keyframes as the selection rectangle.
             */}
                <defs>
                    <mask
                        id={childrenMaskId}
                        maskUnits="userSpaceOnUse"
                        maskContentUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width={svgWidth}
                        height={svgHeight}
                        style={{ maskType: "luminance" } as React.CSSProperties}
                    >
                        <rect
                            x="0"
                            y="0"
                            width={svgWidth}
                            height={svgHeight}
                            fill="black"
                        />
                        <rect
                            ref={childrenMaskRectRef}
                            x={cursor === "left" ? right : left}
                            y={top}
                            width={0}
                            height={0}
                            fill="white"
                        />
                    </mask>
                </defs>

                {/* =================================================
                TOP LEFT
                ================================================= */}

                <rect
                    ref={tlRef}

                    x={handlePositions.tl.x}
                    y={handlePositions.tl.y}

                    width={safeBoxSize}
                    height={safeBoxSize}

                    fill="black"
                />


                {/* =================================================
                TOP CENTER
                ================================================= */}

                <rect
                    ref={tcRef}

                    x={handlePositions.tc.x}
                    y={handlePositions.tc.y}

                    width={safeBoxSize}
                    height={safeBoxSize}

                    fill="black"

                    style={{
                        display:
                            showTop
                                ? "block"
                                : "none",
                    }}
                />


                {/* =================================================
                TOP RIGHT
                ================================================= */}

                <rect
                    ref={trRef}

                    x={handlePositions.tr.x}
                    y={handlePositions.tr.y}

                    width={safeBoxSize}
                    height={safeBoxSize}

                    fill="black"
                />


                {/* =================================================
                LEFT CENTER
                ================================================= */}

                <rect
                    ref={mlRef}

                    x={handlePositions.ml.x}
                    y={handlePositions.ml.y}

                    width={safeBoxSize}
                    height={safeBoxSize}

                    fill="black"

                    style={{
                        display:
                            showLeft
                                ? "block"
                                : "none",
                    }}
                />


                {/* =================================================
                RIGHT CENTER
                ================================================= */}

                <rect
                    ref={mrRef}

                    x={handlePositions.mr.x}
                    y={handlePositions.mr.y}

                    width={safeBoxSize}
                    height={safeBoxSize}

                    fill="black"

                    style={{
                        display:
                            showRight
                                ? "block"
                                : "none",
                    }}
                />


                {/* =================================================
                BOTTOM LEFT
                ================================================= */}

                <rect
                    ref={blRef}

                    x={handlePositions.bl.x}
                    y={handlePositions.bl.y}

                    width={safeBoxSize}
                    height={safeBoxSize}

                    fill="black"
                />


                {/* =================================================
                BOTTOM CENTER
                ================================================= */}

                <rect
                    ref={bcRef}

                    x={handlePositions.bc.x}
                    y={handlePositions.bc.y}

                    width={safeBoxSize}
                    height={safeBoxSize}

                    fill="black"

                    style={{
                        display:
                            showBottom
                                ? "block"
                                : "none",
                    }}
                />


                {/* =================================================
                BOTTOM RIGHT
                ================================================= */}

                <rect
                    ref={brRef}

                    x={handlePositions.br.x}
                    y={handlePositions.br.y}

                    width={safeBoxSize}
                    height={safeBoxSize}

                    fill="black"
                />


                {/* =================================================
                CURSOR
                ================================================= */}

                <g
                    ref={cursorRef}
                    style={{
                        transformBox: "fill-box",
                    }}
                >

                    {cursor === "left" ? (

                        /*
                         * ==================================================
                         * LEFT-FACING CURSOR
                         * ==================================================
                         */

                        <g
                            clipPath={`url(#${clipId})`}
                        >

                            <path
                                d="M39.5277 177.058C39.2619 176.951 38.9646 176.954 38.7012 177.067C38.4379 177.179 38.2301 177.392 38.1235 177.658L36.5157 181.667C36.4091 181.933 36.4125 182.23 36.5251 182.494C36.6377 182.757 36.8503 182.965 37.1161 183.071C37.382 183.178 37.6792 183.175 37.9426 183.062C38.2059 182.949 38.4138 182.737 38.5204 182.471L40.1281 178.462C40.2347 178.196 40.2313 177.899 40.1187 177.635C40.0061 177.372 39.7935 177.164 39.5277 177.058ZM46.0315 183.412C45.9759 183.281 45.8949 183.163 45.7934 183.064C45.6919 182.964 45.5718 182.886 45.44 182.833C45.3081 182.78 45.1672 182.754 45.0251 182.755C44.8831 182.757 44.7428 182.787 44.6122 182.843L40.6402 184.543C40.5074 184.597 40.3867 184.677 40.2851 184.778C40.1836 184.879 40.1032 185 40.0487 185.132C39.9941 185.265 39.9666 185.407 39.9676 185.55C39.9686 185.694 39.9981 185.836 40.0545 185.967C40.1109 186.099 40.1929 186.219 40.2959 186.318C40.3989 186.418 40.5207 186.497 40.6542 186.549C40.7878 186.601 40.9304 186.626 41.0737 186.623C41.2171 186.619 41.3583 186.587 41.4892 186.528L45.4604 184.83C45.7237 184.718 45.9314 184.505 46.038 184.24C46.1446 183.974 46.1413 183.677 46.0287 183.413M30.4326 177.159C30.302 177.215 30.1835 177.296 30.0842 177.397C29.9848 177.499 29.9065 177.619 29.8536 177.751C29.8007 177.883 29.7744 178.024 29.7761 178.166C29.7778 178.308 29.8075 178.448 29.8635 178.578L31.5682 182.55C31.6223 182.683 31.7023 182.804 31.8035 182.905C31.9047 183.007 32.0251 183.087 32.1578 183.142C32.2904 183.196 32.4325 183.224 32.5759 183.223C32.7193 183.222 32.8611 183.192 32.9929 183.136C33.1248 183.079 33.2441 182.997 33.3439 182.894C33.4437 182.791 33.522 182.67 33.5742 182.536C33.6264 182.402 33.6515 182.26 33.648 182.117C33.6445 181.973 33.6125 181.832 33.5538 181.701L31.8559 177.73C31.7433 177.467 31.5308 177.259 31.265 177.152C30.9992 177.046 30.702 177.049 30.4387 177.162M46.132 192.504C46.2386 192.238 46.2352 191.941 46.1226 191.678C46.01 191.414 45.7974 191.207 45.5316 191.1L41.5223 189.492C41.2565 189.386 40.9592 189.389 40.6958 189.502C40.4325 189.614 40.2247 189.827 40.1181 190.093C40.0115 190.359 40.0148 190.656 40.1274 190.919C40.24 191.182 40.4526 191.39 40.7184 191.497L44.7277 193.105C44.9935 193.211 45.2908 193.208 45.5542 193.095C45.8175 192.983 46.0254 192.77 46.132 192.504ZM34.6788 189.149L27.235 207.712C27.1558 207.911 27.0193 208.082 26.843 208.203C26.6666 208.324 26.4583 208.39 26.2445 208.392C26.0306 208.395 25.8209 208.334 25.6418 208.217C25.4627 208.1 25.3223 207.932 25.2385 207.736L22.1645 200.546C21.7143 199.492 20.8642 198.661 19.801 198.234L13.322 195.636C13.114 195.553 12.9372 195.406 12.8161 195.218C12.6949 195.029 12.6355 194.808 12.646 194.584C12.6565 194.36 12.7364 194.145 12.8747 193.968C13.013 193.792 13.2027 193.663 13.4176 193.599L33.371 187.711C33.5656 187.653 33.7723 187.651 33.9681 187.706C34.1636 187.761 34.3397 187.87 34.4762 188.02C34.6127 188.17 34.7042 188.356 34.74 188.556C34.7758 188.755 34.7546 188.961 34.6788 189.149Z"
                                fill="black"
                            />

                        </g>

                    ) : (

                        /*
                         * ==================================================
                         * RIGHT-FACING CURSOR
                         * ==================================================
                         */

                        <g
                            clipPath={`url(#${clipId})`}
                        >

                            <path
                                d="M974.642 180.058C974.908 179.951 975.206 179.954 975.469 180.067C975.732 180.179 975.94 180.392 976.047 180.658L977.654 184.667C977.761 184.933 977.758 185.23 977.645 185.494C977.532 185.757 977.32 185.965 977.054 186.071C976.788 186.178 976.491 186.175 976.228 186.062C975.964 185.949 975.756 185.737 975.65 185.471L974.042 181.462C973.935 181.196 973.939 180.899 974.051 180.635C974.164 180.372 974.377 180.164 974.642 180.058ZM968.139 186.412C968.194 186.281 968.275 186.163 968.377 186.064C968.478 185.964 968.598 185.886 968.73 185.833C968.862 185.78 969.003 185.754 969.145 185.755C969.287 185.757 969.427 185.787 969.558 185.843L973.53 187.543C973.663 187.597 973.783 187.677 973.885 187.778C973.987 187.879 974.067 188 974.122 188.132C974.176 188.265 974.204 188.407 974.203 188.55C974.202 188.694 974.172 188.836 974.116 188.967C974.059 189.099 973.977 189.219 973.874 189.318C973.771 189.418 973.649 189.497 973.516 189.549C973.382 189.601 973.24 189.626 973.096 189.623C972.953 189.619 972.812 189.587 972.681 189.528L968.71 187.83C968.446 187.718 968.239 187.505 968.132 187.24C968.026 186.974 968.029 186.677 968.141 186.413M983.738 180.159C983.868 180.215 983.987 180.296 984.086 180.397C984.185 180.499 984.264 180.619 984.317 180.751C984.369 180.883 984.396 181.024 984.394 181.166C984.392 181.308 984.363 181.448 984.307 181.578L982.602 185.55C982.548 185.683 982.468 185.804 982.367 185.905C982.265 186.007 982.145 186.087 982.012 186.142C981.88 186.196 981.738 186.224 981.594 186.223C981.451 186.222 981.309 186.192 981.177 186.136C981.045 186.079 980.926 185.997 980.826 185.894C980.726 185.791 980.648 185.67 980.596 185.536C980.544 185.402 980.519 185.26 980.522 185.117C980.526 184.973 980.558 184.832 980.616 184.701L982.314 180.73C982.427 180.467 982.639 180.259 982.905 180.152C983.171 180.046 983.468 180.049 983.732 180.162M968.038 195.504C967.932 195.238 967.935 194.941 968.048 194.678C968.16 194.414 968.373 194.207 968.639 194.1L972.648 192.492C972.914 192.386 973.211 192.389 973.474 192.502C973.738 192.614 973.946 192.827 974.052 193.093C974.159 193.359 974.155 193.656 974.043 193.919C973.93 194.182 973.718 194.39 973.452 194.497L969.442 196.105C969.177 196.211 968.879 196.208 968.616 196.095C968.353 195.983 968.145 195.77 968.038 195.504ZM979.491 192.149L986.935 210.712C987.014 210.911 987.151 211.082 987.327 211.203C987.504 211.324 987.712 211.39 987.926 211.392C988.14 211.395 988.349 211.334 988.528 211.217C988.707 211.1 988.848 210.932 988.932 210.736L992.006 203.546C992.456 202.492 993.306 201.661 994.369 201.234L1000.85 198.636C1001.06 198.553 1001.23 198.406 1001.35 198.218C1001.48 198.029 1001.53 197.808 1001.52 197.584C1001.51 197.36 1001.43 197.145 1001.3 196.968C1001.16 196.792 1000.97 196.663 1000.75 196.599L980.799 190.711C980.605 190.653 980.398 190.651 980.202 190.706C980.007 190.761 979.831 190.87 979.694 191.02C979.557 191.17 979.466 191.356 979.43 191.556C979.394 191.755 979.416 191.961 979.491 192.149Z"
                                fill="black"
                            />

                        </g>

                    )}

                </g>


                {/* =================================================
                CURSOR CLIP PATH
                ================================================= */}

                <defs>

                    {cursor === "left" ? (

                        <clipPath id={clipId}>

                            <rect
                                width="43.1962"
                                height="43.1962"
                                fill="white"
                                transform="matrix(-0.928156 -0.372193 -0.372193 0.928156 56.1699 179.077)"
                            />

                        </clipPath>

                    ) : (

                        <clipPath id={clipId}>

                            <rect
                                width="43.1962"
                                height="43.1962"
                                fill="white"
                                transform="translate(958 182.077) rotate(-21.8509)"
                            />

                        </clipPath>

                    )}

                </defs>

            </svg>
        </div>
    );
};

export default DragAnimatedSVG;
