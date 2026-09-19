"use client";

import React, {
  type ComponentPropsWithoutRef,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Content to be displayed in the marquee, or a render function receiving track index
   */
  children: React.ReactNode | ((trackIndex: number) => React.ReactNode);
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content when non-seamless
   * @default 4
   */
  repeat?: number;
  /**
   * Enable smooth dragging/sliding of items with mouse or touch
   * @default false
   */
  draggable?: boolean;
  /**
   * Enable mathematically seamless infinite looping using a single two-group track (0% -> -50%)
   * @default false
   */
  seamless?: boolean;
  /**
   * Optional duration override in seconds or CSS string (e.g. 35, "35s")
   */
  duration?: number | string;
  /**
   * Optional external pause control
   * @default false
   */
  isPaused?: boolean;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  draggable = false,
  seamless = false,
  duration,
  isPaused = false,
  ...props
}: MarqueeProps) {
  // DOM and state refs for draggable interaction
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const group0Ref = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);

  const startPosRef = useRef(0);
  const lastPointerPosRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const pointerVelocityRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);

  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const trackSizeRef = useRef(0);
  const isHoveredRef = useRef(false);

  // Measure single track group size for infinite wrapping
  const updateTrackSize = useCallback(() => {
    if (group0Ref.current) {
      const rect = group0Ref.current.getBoundingClientRect();
      const size = vertical ? rect.height : rect.width;
      if (size > 0) {
        trackSizeRef.current = size;
      }
    }
  }, [vertical]);

  // Read duration in seconds from prop or CSS variable
  const getDurationSec = useCallback(() => {
    if (typeof duration === "number" && duration > 0) return duration;
    if (typeof duration === "string") {
      const parsed = parseFloat(duration);
      if (!isNaN(parsed) && parsed > 0) {
        return duration.endsWith("ms") ? parsed / 1000 : parsed;
      }
    }
    if (containerRef.current) {
      const computed = getComputedStyle(containerRef.current);
      const cssDuration = computed.getPropertyValue("--duration").trim();
      if (cssDuration) {
        const parsed = parseFloat(cssDuration);
        if (!isNaN(parsed) && parsed > 0) {
          return cssDuration.endsWith("ms") ? parsed / 1000 : parsed;
        }
      }
    }
    return 40;
  }, [duration]);

  // High-performance RAF animation & physics loop when draggable is enabled
  useEffect(() => {
    if (!draggable) return;

    updateTrackSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && group0Ref.current) {
      resizeObserver = new ResizeObserver(() => {
        updateTrackSize();
      });
      resizeObserver.observe(group0Ref.current);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
    }

    let rafId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const trackSize = trackSizeRef.current;
      const durationSec = getDurationSec();
      const baseSpeed =
        trackSize > 0 && durationSec > 0 ? trackSize / durationSec : 30;
      const direction = reverse ? 1 : -1;
      const targetVelocity = direction * baseSpeed;

      // Check external pause or hover pause
      const isCardExpanded = className?.includes("is-card-expanded") ?? false;
      const shouldPause =
        isPaused || isCardExpanded || (pauseOnHover && isHoveredRef.current);

      if (!isDraggingRef.current) {
        if (shouldPause) {
          // Smooth deceleration to complete stop
          velocityRef.current *= Math.pow(0.05, dt);
          if (Math.abs(velocityRef.current) < 0.5) velocityRef.current = 0;
        } else {
          // If we had inertia from a drag flick, smoothly decay towards targetVelocity
          if (Math.abs(velocityRef.current - targetVelocity) > 1) {
            const friction = 0.93;
            velocityRef.current =
              targetVelocity +
              (velocityRef.current - targetVelocity) *
                Math.pow(friction, dt * 60);
          } else {
            velocityRef.current = targetVelocity;
          }
        }

        // Apply physical translation
        if (Math.abs(velocityRef.current) > 0.01 && trackSize > 0) {
          offsetRef.current += velocityRef.current * dt;

          // Infinite seamless modulo wrapping
          while (offsetRef.current <= -trackSize) {
            offsetRef.current += trackSize;
          }
          while (offsetRef.current > 0) {
            offsetRef.current -= trackSize;
          }

          if (trackRef.current) {
            trackRef.current.style.transform = vertical
              ? `translate3d(0, ${offsetRef.current}px, 0)`
              : `translate3d(${offsetRef.current}px, 0, 0)`;
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [
    draggable,
    reverse,
    pauseOnHover,
    isPaused,
    className,
    vertical,
    getDurationSec,
    updateTrackSize,
  ]);

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable || e.button !== 0) return;

    updateTrackSize();

    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    pointerIdRef.current = e.pointerId;

    const clientPos = vertical ? e.clientY : e.clientX;
    startPosRef.current = clientPos;
    lastPointerPosRef.current = clientPos;
    lastPointerTimeRef.current = performance.now();
    pointerVelocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    const clientPos = vertical ? e.clientY : e.clientX;
    const delta = clientPos - lastPointerPosRef.current;
    const now = performance.now();
    const dt = (now - lastPointerTimeRef.current) / 1000;

    // Threshold of 5px to differentiate click/tap from drag
    if (!hasDraggedRef.current && Math.abs(clientPos - startPosRef.current) > 5) {
      hasDraggedRef.current = true;
      setIsDragging(true);
      isDraggingRef.current = true;

      if (pointerIdRef.current !== null) {
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(pointerIdRef.current);
        } catch {
          // ignore
        }
      }
    }

    if (isDraggingRef.current) {
      offsetRef.current += delta;

      const trackSize = trackSizeRef.current;
      if (trackSize > 0) {
        while (offsetRef.current <= -trackSize) {
          offsetRef.current += trackSize;
        }
        while (offsetRef.current > 0) {
          offsetRef.current -= trackSize;
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = vertical
          ? `translate3d(0, ${offsetRef.current}px, 0)`
          : `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      if (dt > 0.005) {
        const instantVelocity = delta / dt;
        pointerVelocityRef.current =
          pointerVelocityRef.current * 0.3 + instantVelocity * 0.7;
        lastPointerPosRef.current = clientPos;
        lastPointerTimeRef.current = now;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    if (pointerIdRef.current !== null) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(
          pointerIdRef.current
        );
      } catch {
        // ignore
      }
      pointerIdRef.current = null;
    }

    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);

      // Clamp flick velocity to smooth physical bounds
      const maxVelocity = 2800;
      velocityRef.current = Math.max(
        -maxVelocity,
        Math.min(maxVelocity, pointerVelocityRef.current)
      );

      // Keep hasDraggedRef true briefly to suppress trailing click event on card/link
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 60);
    }
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    isHoveredRef.current = true;
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    isHoveredRef.current = false;
  };

  // Intercept click on children ONLY if the user actually dragged
  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  // ── NON-DRAGGABLE FALLBACK: PURE CSS ANIMATION ──────────────
  if (!draggable) {
    if (seamless) {
      return (
        <div
          {...props}
          className={cn(
            "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
            {
              "flex-row": !vertical,
              "flex-col": vertical,
            },
            className
          )}
          data-seamless="true"
          data-reverse={reverse ? "true" : "false"}
        >
          <div
            data-seamless-track="true"
            data-reverse={reverse ? "true" : "false"}
            className={cn(
              "marquee-seamless-track flex shrink-0 will-change-transform",
              vertical
                ? "flex-col animate-marquee-seamless-vertical"
                : "flex-row animate-marquee-seamless",
              pauseOnHover && "group-hover:[animation-play-state:paused]",
              reverse && "[animation-direction:reverse]"
            )}
            style={{
              width: vertical ? undefined : "max-content",
              height: vertical ? "max-content" : undefined,
            }}
          >
            {/* GROUP A: Original authoritative content */}
            <div
              className={cn(
                "marquee-seamless-group flex shrink-0 items-center justify-around",
                vertical ? "flex-col gap-(--gap)" : "flex-row gap-(--gap)"
              )}
              style={{
                paddingRight: !vertical ? "var(--gap)" : undefined,
                paddingBottom: vertical ? "var(--gap)" : undefined,
              }}
            >
              {typeof children === "function" ? children(0) : children}
            </div>

            {/* GROUP B: Exact duplicate clone for a mathematically seamless loop */}
            <div
              aria-hidden="true"
              className={cn(
                "marquee-seamless-group marquee-seamless-duplicate flex shrink-0 items-center justify-around",
                vertical ? "flex-col gap-(--gap)" : "flex-row gap-(--gap)"
              )}
              style={{
                paddingRight: !vertical ? "var(--gap)" : undefined,
                paddingBottom: vertical ? "var(--gap)" : undefined,
              }}
            >
              {typeof children === "function" ? children(1) : children}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        {...props}
        className={cn(
          "group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
          {
            "flex-row": !vertical,
            "flex-col": vertical,
          },
          className
        )}
      >
        {Array(repeat)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={cn("flex shrink-0 justify-around gap-(--gap)", {
                "animate-marquee flex-row": !vertical,
                "animate-marquee-vertical flex-col": vertical,
                "group-hover:[animation-play-state:paused]": pauseOnHover,
                "[animation-direction:reverse]": reverse,
              })}
            >
              {typeof children === "function" ? children(i) : children}
            </div>
          ))}
      </div>
    );
  }

  // ── DRAGGABLE MARQUEE: HIGH-PERFORMANCE RAF PHYSICS ENGINE ──
  return (
    <div
      {...props}
      ref={containerRef}
      onClickCapture={handleClickCapture}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onDragStart={(e) => e.preventDefault()}
      data-draggable="true"
      data-reverse={reverse ? "true" : "false"}
      style={{
        touchAction: vertical ? "pan-x" : "pan-y",
        userSelect: "none",
        WebkitUserSelect: "none",
        cursor: isDragging ? "grabbing" : "grab",
        ...props.style,
      }}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] select-none marquee-draggable",
        isDragging && "is-dragging",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      <div
        ref={trackRef}
        className={cn(
          "marquee-seamless-track flex shrink-0 will-change-transform marquee-draggable-track",
          vertical ? "flex-col" : "flex-row"
        )}
        style={{
          width: vertical ? undefined : "max-content",
          height: vertical ? "max-content" : undefined,
          willChange: "transform",
          animation: "none",
        }}
      >
        {/* GROUP A: Original authoritative content */}
        <div
          ref={group0Ref}
          className={cn(
            "marquee-seamless-group flex shrink-0 items-center justify-around",
            vertical ? "flex-col gap-(--gap)" : "flex-row gap-(--gap)"
          )}
          style={{
            paddingRight: !vertical ? "var(--gap)" : undefined,
            paddingBottom: vertical ? "var(--gap)" : undefined,
          }}
        >
          {typeof children === "function" ? children(0) : children}
        </div>

        {/* GROUP B: Exact duplicate clone for seamless wrapping */}
        <div
          aria-hidden="true"
          className={cn(
            "marquee-seamless-group marquee-seamless-duplicate flex shrink-0 items-center justify-around",
            vertical ? "flex-col gap-(--gap)" : "flex-row gap-(--gap)"
          )}
          style={{
            paddingRight: !vertical ? "var(--gap)" : undefined,
            paddingBottom: vertical ? "var(--gap)" : undefined,
          }}
        >
          {typeof children === "function" ? children(1) : children}
        </div>
      </div>
    </div>
  );
}

export default Marquee;
