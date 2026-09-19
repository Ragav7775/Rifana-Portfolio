"use client";
"use no memo";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, type Transition } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";

export type ExpandableCardItem = {
  id?: string;
  title: string;
  description: string;
  image: string;
  logo?: string;
  credentialid?: string;
  ctaText?: string;
  ctaLink?: string;
  content?: React.ReactNode | (() => React.ReactNode);
};

/**
 * ============================================================
 * EXPANDABLE BOX CONFIGURATION
 * ============================================================
 */

export interface ExpandableBoxDeviceConfig {
  /** Width of expanded card */
  width?: string | number;

  /** Height of expanded card */
  height?: string | number;

  /** Maximum width */
  maxWidth?: string | number;

  /** Maximum height */
  maxHeight?: string | number;

  /** Position */
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;

  /** Position translation */
  x?: string | number;
  y?: string | number;

  /** Scale factor */
  scale?: number;
  scaleFactor?: number;

  /** Custom transform */
  transform?: string;

  /** Border radius */
  borderRadius?: string | number;

  /**
   * Width of the expanded image/media column.
   *
   * Examples:
   * imageWidth: 320
   * imageWidth: "320px"
   * imageWidth: "42%"
   * imageWidth: "40vw"
   */
  imageWidth?: string | number;

  /**
   * Duration in seconds.
   */
  duration?: number;

  /**
   * Easing curve.
   */
  easing?: string | [number, number, number, number];

  /** Optional custom CSS class */
  className?: string;
}

export interface ExpandableBoxResponsiveConfig {
  desktop?: ExpandableBoxDeviceConfig;
  tablet?: ExpandableBoxDeviceConfig;
  mobile?: ExpandableBoxDeviceConfig;
}

export type ExpandableBoxConfig =
  | ExpandableBoxResponsiveConfig
  | ExpandableBoxDeviceConfig;

export type ExpandedBoxDeviceConfig = ExpandableBoxDeviceConfig;
export type ExpandedBoxResponsiveConfig = ExpandableBoxResponsiveConfig;

/**
 * ============================================================
 * TRANSITIONS
 * ============================================================
 */

export const SMOOTH_EXPAND_TRANSITION: Transition = {
  type: "tween",
  duration: 0.44,
  ease: [0.4, 0, 0.2, 1],
};

export const DEFAULT_SMOOTH_TRANSITION: Transition =
  SMOOTH_EXPAND_TRANSITION;

/**
 * Backward-compatible spring transition.
 */
export const EXPANDED_CARD_TRANSITION: Transition = {
  type: "spring",
  damping: 32,
  stiffness: 280,
  mass: 0.75,
};

/**
 * ============================================================
 * POSITION OFFSETS
 * ============================================================
 */

export interface PositionOffsets {
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  x?: string | number;
  y?: string | number;
}

/**
 * ============================================================
 * UNIFIED CONFIG
 * ============================================================
 */

export interface ExpandableCardConfig {
  enabled?: boolean;

  expandable_box_config?: ExpandableBoxConfig;
  expandableBoxConfig?: ExpandableBoxConfig;
  expandedBoxConfig?: ExpandableBoxConfig;

  collapsedWidth?: string | number;
  expandedWidth?: string | number;

  collapsedHeight?: string | number;
  expandedHeight?: string | number;

  duration?: number;

  easing?: string | [number, number, number, number];

  scaleFactor?: number;

  positionOffsets?: PositionOffsets;

  expandOn?: "click" | "hover" | "focus";

  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;

  marquee?: boolean;
  marqueeSpeed?: number;

  desktop?: ExpandableBoxDeviceConfig;
  tablet?: ExpandableBoxDeviceConfig;
  mobile?: ExpandableBoxDeviceConfig;

  transition?: Transition;

  onActiveChange?: (isActive: boolean) => void;
}

/**
 * ============================================================
 * COMPONENT PROPS
 * ============================================================
 */

export type ExpandableCardProps = {
  cards: ExpandableCardItem[];

  expandable_box_config?: ExpandableBoxConfig;
  expandableBoxConfig?: ExpandableBoxConfig;
  expandedBoxConfig?: ExpandableBoxConfig;

  duration?: number;

  easing?: string | [number, number, number, number];

  scaleFactor?: number;

  positionOffsets?: PositionOffsets;

  transition?: Transition;

  config?: ExpandableCardConfig;

  renderCard?: (
    card: ExpandableCardItem,
    openCard: (
      card: ExpandableCardItem,
      trackIndex?: number
    ) => void,
    layoutId: string,
    trackIndex: number,
    getLayoutId?: (
      type: string,
      card: ExpandableCardItem,
      trackIndex: number
    ) => string
  ) => React.ReactNode;

  renderContainer?: (
    renderTrackCards: (
      trackIndex?: number
    ) => React.ReactNode
  ) => React.ReactNode;

  onActiveChange?: (isActive: boolean) => void;

  scopeId?: string;
};

/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

export const getCardIdentifier = (
  card: ExpandableCardItem
): string =>
  card.id ||
  card.credentialid ||
  card.title
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase();

export const getSharedLayoutId = (
  type: string,
  card: ExpandableCardItem,
  trackIndex: number = 0,
  scopeId: string = ""
): string =>
  `${type}-${getCardIdentifier(card)}-${trackIndex}-${scopeId}`;

/**
 * Convert number/string config values to CSS values.
 */
const formatCssValue = (
  value?: string | number
): string | undefined => {
  if (value === undefined) return undefined;

  return typeof value === "number"
    ? `${value}px`
    : value;
};

/**
 * ============================================================
 * EXPANDABLE CARD
 * ============================================================
 */

export default function ExpandableCard({
  cards,
  config,
  expandable_box_config,
  expandableBoxConfig,
  expandedBoxConfig,
  duration: propDuration,
  easing: propEasing,
  scaleFactor: propScaleFactor,
  positionOffsets,
  renderCard,
  renderContainer,
  onActiveChange,
  transition,
  scopeId,
}: ExpandableCardProps) {
  const isEnabled = config?.enabled !== false;

  const [active, setActive] = useState<{
    card: ExpandableCardItem;
    trackIndex: number;
  } | null>(null);

  const internalId = useId();
  const effectiveScopeId = scopeId || internalId;

  const ref = useRef<HTMLDivElement>(null);

  /**
   * ==========================================================
   * RESPONSIVE DEVICE DETECTION
   * ==========================================================
   *
   * desktop : >= 1024
   * tablet  : 768 - 1023
   * mobile  : < 768
   */

  const [deviceType, setDeviceType] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setDeviceType("mobile");
      } else if (width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /**
   * ==========================================================
   * RESOLVE CONFIG
   * ==========================================================
   */

  const rawBoxConfig =
    expandable_box_config ||
    expandableBoxConfig ||
    expandedBoxConfig ||
    config?.expandable_box_config ||
    config?.expandableBoxConfig ||
    config?.expandedBoxConfig;

  const activeBoxConfig:
    | ExpandableBoxDeviceConfig
    | undefined = useMemo(() => {
      if (!rawBoxConfig) return undefined;

      const isResponsive =
        "desktop" in rawBoxConfig ||
        "tablet" in rawBoxConfig ||
        "mobile" in rawBoxConfig;

      if (isResponsive) {
        const responsive =
          rawBoxConfig as ExpandableBoxResponsiveConfig;

        return (
          responsive[deviceType] ||
          responsive.desktop ||
          responsive.tablet ||
          responsive.mobile
        );
      }

      return rawBoxConfig as ExpandableBoxDeviceConfig;
    }, [rawBoxConfig, deviceType]);

  /**
   * ==========================================================
   * EFFECTIVE TRANSITION
   * ==========================================================
   */

  const effectiveTransition: Transition = useMemo(() => {
    if (transition) return transition;

    if (config?.transition) {
      return config.transition;
    }

    const duration =
      activeBoxConfig?.duration ??
      propDuration ??
      config?.duration;

    const easing =
      activeBoxConfig?.easing ??
      propEasing ??
      config?.easing;

    if (
      duration !== undefined ||
      easing !== undefined
    ) {
      return {
        type: "tween",
        duration: duration ?? 0.44,
        ease: (easing as Transition["ease"]) ?? [0.4, 0, 0.2, 1],
      };
    }

    return DEFAULT_SMOOTH_TRANSITION;
  }, [
    transition,
    config,
    activeBoxConfig,
    propDuration,
    propEasing,
  ]);

  const layoutTransition = useMemo(() => {
    return {
      layout: effectiveTransition,
      ...effectiveTransition,
    };
  }, [effectiveTransition]);

  const closeOnOutsideClick =
    config?.closeOnOutsideClick ?? true;

  const closeOnEscape =
    config?.closeOnEscape ?? true;

  const effectiveOnActiveChange =
    config?.onActiveChange || onActiveChange;

  /**
   * ==========================================================
   * BODY SCROLL LOCK
   * ==========================================================
   */

  useEffect(() => {
    if (!active) return;

    const scrollbarWidth =
      window.innerWidth -
      document.documentElement.clientWidth;

    const previousBodyOverflow =
      document.body.style.overflow;

    const previousBodyPaddingRight =
      document.body.style.paddingRight;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight =
        `${scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousBodyOverflow;

      document.body.style.paddingRight =
        previousBodyPaddingRight;
    };
  }, [active]);

  /**
   * ==========================================================
   * MARQUEE PAUSE
   * ==========================================================
   */

  useEffect(() => {
    if (!active) return;

    effectiveOnActiveChange?.(true);

    if (typeof document !== "undefined") {
      document
        .querySelectorAll(".cert-marquee")
        .forEach((element) => {
          element.classList.add(
            "is-card-expanded"
          );
        });
    }
  }, [
    active,
    effectiveOnActiveChange,
  ]);

  /**
   * ==========================================================
   * ESCAPE CLOSE
   * ==========================================================
   */

  const handleClose = () => {
    setActive(null);
  };

  useEffect(() => {
    const onKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape" &&
        closeOnEscape
      ) {
        handleClose();
      }
    };

    if (active) {
      window.addEventListener(
        "keydown",
        onKeyDown
      );
    }

    return () => {
      window.removeEventListener(
        "keydown",
        onKeyDown
      );
    };
  }, [
    active,
    closeOnEscape,
  ]);

  /**
   * ==========================================================
   * OUTSIDE CLICK
   * ==========================================================
   */

  useOutsideClick(ref, () => {
    if (
      active &&
      closeOnOutsideClick
    ) {
      handleClose();
    }
  });

  /**
   * ==========================================================
   * LAYOUT IDS
   * ==========================================================
   */

  const getLayoutId = (
    type: string,
    card: ExpandableCardItem,
    trackIndex: number = 0
  ) =>
    getSharedLayoutId(
      type,
      card,
      trackIndex,
      effectiveScopeId
    );

  /**
   * ==========================================================
   * OPEN CARD
   * ==========================================================
   */

  const openCard = (
    card: ExpandableCardItem,
    trackIndex: number = 0
  ) => {
    if (!isEnabled) return;

    effectiveOnActiveChange?.(true);

    if (typeof document !== "undefined") {
      document
        .querySelectorAll(".cert-marquee")
        .forEach((element) => {
          element.classList.add(
            "is-card-expanded"
          );
        });
    }

    setActive({
      card,
      trackIndex,
    });
  };

  /**
 * CSS properties used by the expandable card.
 *
 * React.CSSProperties does not include arbitrary CSS
 * custom properties, so we explicitly type our variable.
 */
  type ExpandableCardCSSProperties = React.CSSProperties & {
    "--expandable-image-width"?: string;
  };


  /**
   * ==========================================================
   * MODAL STYLE
   * ==========================================================
   */

  const modalStyle: ExpandableCardCSSProperties =
    useMemo(() => {
      const style: ExpandableCardCSSProperties = {};

      if (activeBoxConfig) {
        const width = formatCssValue(
          activeBoxConfig.width
        );

        const height = formatCssValue(
          activeBoxConfig.height
        );

        const maxWidth = formatCssValue(
          activeBoxConfig.maxWidth
        );

        const maxHeight = formatCssValue(
          activeBoxConfig.maxHeight
        );

        const borderRadius =
          formatCssValue(
            activeBoxConfig.borderRadius
          );

        const imageWidth =
          formatCssValue(
            activeBoxConfig.imageWidth
          );

        if (width !== undefined) {
          style.width = width;
        }

        if (height !== undefined) {
          style.height = height;
        }

        if (maxWidth !== undefined) {
          style.maxWidth = maxWidth;
        }

        if (maxHeight !== undefined) {
          style.maxHeight = maxHeight;
        }

        if (borderRadius !== undefined) {
          style.borderRadius =
            borderRadius;
        }

        /**
         * Image width is exposed as a CSS
         * custom property so the media
         * column can use it without causing
         * layout-animation distortion.
         */
        if (imageWidth !== undefined) {
          style["--expandable-image-width"] =
            imageWidth;
        }

        if (
          activeBoxConfig.top !==
          undefined &&
          activeBoxConfig.top !== "50%"
        ) {
          style.top = formatCssValue(
            activeBoxConfig.top
          );

          style.position = "fixed";
        }

        if (
          activeBoxConfig.left !==
          undefined &&
          activeBoxConfig.left !== "50%"
        ) {
          style.left = formatCssValue(
            activeBoxConfig.left
          );

          style.position = "fixed";
        }

        if (
          activeBoxConfig.right !==
          undefined
        ) {
          style.right = formatCssValue(
            activeBoxConfig.right
          );

          style.position = "fixed";
        }

        if (
          activeBoxConfig.bottom !==
          undefined
        ) {
          style.bottom = formatCssValue(
            activeBoxConfig.bottom
          );

          style.position = "fixed";
        }

        if (
          activeBoxConfig.transform !==
          undefined &&
          activeBoxConfig.transform !==
          "translate(-50%, -50%)"
        ) {
          style.transform =
            activeBoxConfig.transform;
        }
      }

      /**
       * Direct position overrides.
       */

      const offsets =
        positionOffsets ||
        config?.positionOffsets;

      if (
        offsets?.top !==
        undefined
      ) {
        style.top = formatCssValue(
          offsets.top
        );
        style.position = "fixed";
      }

      if (
        offsets?.left !==
        undefined
      ) {
        style.left = formatCssValue(
          offsets.left
        );
        style.position = "fixed";
      }

      if (
        offsets?.right !==
        undefined
      ) {
        style.right = formatCssValue(
          offsets.right
        );
        style.position = "fixed";
      }

      if (
        offsets?.bottom !==
        undefined
      ) {
        style.bottom = formatCssValue(
          offsets.bottom
        );
        style.position = "fixed";
      }

      const xVal =
        offsets?.x ??
        activeBoxConfig?.x;

      const yVal =
        offsets?.y ??
        activeBoxConfig?.y;

      if (
        xVal !== undefined ||
        yVal !== undefined
      ) {
        style.translate =
          `${formatCssValue(xVal ?? 0)} ` +
          `${formatCssValue(yVal ?? 0)}`;
      }

      /**
       * Scale.
       */

      const scaleVal =
        propScaleFactor ??
        config?.scaleFactor ??
        activeBoxConfig?.scaleFactor ??
        activeBoxConfig?.scale;

      if (
        scaleVal !== undefined &&
        scaleVal !== 1
      ) {
        style.scale = scaleVal;
      }

      return style;
    }, [
      activeBoxConfig,
      positionOffsets,
      propScaleFactor,
      config?.positionOffsets,
      config?.scaleFactor,
    ]);

  /**
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <LayoutGroup id={`expandable-${effectiveScopeId}`}>
      {/* ======================================================
          BACKDROP
          ====================================================== */}

      <AnimatePresence>
        {active && (
          <motion.div
            key="modal-backdrop"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              type: "tween",
              duration: 0.44,
              ease: [0.4, 0, 0.2, 1],
            }}
            onClick={handleClose}
            className="fixed inset-0 z-40 h-full w-full bg-black/60 backdrop-blur-[2px] cursor-pointer"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ======================================================
          EXPANDED CARD
          ====================================================== */}

      <AnimatePresence
        onExitComplete={() => {
          effectiveOnActiveChange?.(
            false
          );

          if (
            typeof document !==
            "undefined"
          ) {
            document
              .querySelectorAll(
                ".cert-marquee"
              )
              .forEach((element) => {
                element.classList.remove(
                  "is-card-expanded"
                );
              });
          }
        }}
      >
        {active && (
          <motion.div
            layoutRoot
            key="modal-overlay-container"
            className="fixed inset-0 z-100 flex items-center justify-center p-2 sm:p-4 md:p-5 overflow-hidden overscroll-contain pointer-events-none"
          >

            <motion.div
              key={`modal-card-${getCardIdentifier(
                active.card
              )}-${active.trackIndex}`}
              layoutId={getLayoutId(
                "card",
                active.card,
                active.trackIndex
              )}
              layout
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-labelledby={getLayoutId(
                "title",
                active.card,
                active.trackIndex
              )}
              initial={false}
              transition={layoutTransition}
              style={{
                ...modalStyle,
              }}
              className={cn(
                `pointer-events-auto relative flex flex-col md:flex-row overflow-hidden overscroll-contain bg-white shadow-2xl w-[92vw] max-w-4xl max-h-[88vh] rounded-2xl isolate`,
                activeBoxConfig?.className
              )}
            >
              {/* ==================================================
                  CLOSE BUTTON
                  ================================================== */}

              <motion.button
                type="button"
                key={
                  `close-btn-${getCardIdentifier(
                    active.card
                  )}-${effectiveScopeId}`
                }
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: {
                    duration: 0.1,
                  },
                }}
                aria-label="Close expanded card"
                onClick={handleClose}
                className="absolute right-3.5 top-3.5 z-110 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 shadow-md backdrop-blur-sm transition-colors cursor-pointer"
              >
                <CloseIcon />
              </motion.button>

              {/* ==================================================
                  MEDIA / IMAGE COLUMN
                  
                  IMPORTANT:
                  - NO layoutId here.
                  - This prevents FLIP from scaling the artwork
                    from the 2:3 grid box into a different shape.
                  - The image itself uses object-contain.
                  - The media panel grows with the card height.
                  ================================================== */}

              <div
                className="expandable-card-media relative flex shrink-0 items-center justify-center place-self-center bg-neutral-100 overflow-hidden p-3 sm:p-4 w-full md:h-full md:max-w-[70%] mx-auto"
                style={{
                  width:
                    deviceType === "mobile"
                      ? "var(--expandable-image-width, 100%)"
                      : "var(--expandable-image-width, 50%)",

                  maxWidth:
                    deviceType === "mobile"
                      ? "100%"
                      : "70%",

                  flexShrink: 0,
                  marginInline: "auto",
                }}
              >
                <img
                  src={active.card.image}
                  alt={active.card.title}
                  className="expandable-card-expanded-image block w-full h-auto max-w-full max-h-full object-contain object-center rounded-lg shadow-sm select-none"
                  draggable={false}
                />
              </div>

              {/* ==================================================
                  DETAILS COLUMN
                  ================================================== */}

              <div
                className="flex min-w-0 min-h-0 flex-1 flex-col justify-between p-3.5 sm:p-5 lg:p-6 overflow-y-auto overscroll-contain h-full max-h-full"
              >

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: 0.15,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  }}
                  transition={{
                    type: "tween",
                    duration: 0.36,
                    delay: 0.08,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="min-w-0 flex-1 md:pt-6"
                >
                  {/* ============================================
                      LOGO
                      ============================================ */}

                  {active.card.logo && (
                    <motion.div
                      layoutId={getLayoutId(
                        "logo",
                        active.card,
                        active.trackIndex
                      )}
                      className="mb-2.5 flex items-center"
                      transition={
                        effectiveTransition
                      }
                    >
                      <img
                        src={
                          active.card.logo
                        }
                        alt=""
                        aria-hidden="true"
                        className="h-7 w-auto max-w-32.5 object-contain object-left"
                      />
                    </motion.div>
                  )}

                  {/* ============================================
                      TITLE / DESCRIPTION
                      ============================================ */}

                  <motion.div
                    layoutId={getLayoutId(
                      "footer",
                      active.card,
                      active.trackIndex
                    )}
                    transition={
                      effectiveTransition
                    }
                    className="flex flex-col"
                  >
                    <motion.h3
                      id={getLayoutId(
                        "title",
                        active.card,
                        active.trackIndex
                      )}
                      layoutId={getLayoutId(
                        "title",
                        active.card,
                        active.trackIndex
                      )}
                      transition={
                        effectiveTransition
                      }
                      className="text-base sm:text-lg lg:text-xl font-bold text-neutral-900 font-heading leading-tight"
                    >
                      {active.card.title}
                    </motion.h3>

                    <div className="mt-2 overflow-hidden">
                      <p
                        className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal"
                      >
                        {active.card.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* ============================================
                      CREDENTIAL ID
                      ============================================ */}

                  {active.card.credentialid && (
                    <div
                      className="mt-3 flex items-center gap-2"
                    >
                      <span
                        className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
                      >
                        Credential ID:
                      </span>

                      <span
                        className="rounded-md bg-(--color-primary-dark)/10 px-2 py-0.5 text-xs font-mono font-medium text-(--color-primary) border border-(--color-primary-dark)/20"
                      >
                        {
                          active.card
                            .credentialid
                        }
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* ==================================================
                    CTA
                    ================================================== */}

                {active.card.ctaText &&
                  active.card.ctaLink && (
                    <motion.a
                      layout
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      href={
                        active.card.ctaLink
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-md"
                    >
                      {
                        active.card
                          .ctaText
                      }
                    </motion.a>
                  )}

                {/* ==================================================
                    EXTRA CONTENT
                    ================================================== */}

                {active.card.content && (
                  <div
                    className="relative mt-2.5 border-t border-neutral-200 pt-2.5"
                  >
                    <div
                      className="text-xs text-neutral-600"
                    >
                      {typeof active.card
                        .content ===
                        "function"
                        ? active.card.content()
                        : active.card
                          .content}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          COLLAPSED CARDS
          ======================================================== */}

      {renderContainer ? (
        renderContainer(
          (trackIndex = 0) =>
            cards.map((card) =>
              renderCard ? (
                <React.Fragment
                  key={`${getCardIdentifier(
                    card
                  )}-${trackIndex}-${effectiveScopeId}`}
                >
                  {renderCard(
                    card,
                    (selectedCard, selectedTrack) =>
                      openCard(
                        selectedCard,
                        selectedTrack !==
                          undefined
                          ? selectedTrack
                          : trackIndex
                      ),
                    getLayoutId(
                      "card",
                      card,
                      trackIndex
                    ),
                    trackIndex,
                    getLayoutId
                  )}
                </React.Fragment>
              ) : null
            )
        )
      ) : (
        <div className="w-full">
          {cards.map((card) =>
            renderCard ? (
              <React.Fragment
                key={`${getCardIdentifier(
                  card
                )}-0-${effectiveScopeId}`}
              >
                {renderCard(
                  card,
                  (selectedCard, selectedTrack) =>
                    openCard(
                      selectedCard,
                      selectedTrack !==
                        undefined
                        ? selectedTrack
                        : 0
                    ),
                  getLayoutId(
                    "card",
                    card,
                    0
                  ),
                  0,
                  getLayoutId
                )}
              </React.Fragment>
            ) : (
              <motion.button
                type="button"
                key={`${getCardIdentifier(
                  card
                )}-0-${effectiveScopeId}`}
                layout
                layoutId={getLayoutId(
                  "card",
                  card,
                  0
                )}
                onClick={() =>
                  openCard(card, 0)
                }
                transition={
                  layoutTransition
                }
                className="flex w-full cursor-pointer flex-col rounded-xl p-4 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
                aria-label={`Open ${card.title}`}
              >
                <div
                  className="flex w-full flex-col gap-4"
                >
                  <motion.div
                    layoutId={getLayoutId(
                      "image",
                      card,
                      0
                    )}
                    transition={
                      effectiveTransition
                    }
                  >
                    <img
                      width={500}
                      height={300}
                      src={card.image}
                      alt={card.title}
                      className="h-60 w-full rounded-lg object-cover object-top"
                    />
                  </motion.div>

                  <div
                    className="flex flex-col justify-center"
                  >
                    {card.logo && (
                      <motion.img
                        layoutId={getLayoutId(
                          "logo",
                          card,
                          0
                        )}
                        transition={
                          effectiveTransition
                        }
                        src={card.logo}
                        alt=""
                        aria-hidden="true"
                        className="mb-2 h-7 w-auto max-w-30 object-contain object-left"
                      />
                    )}

                    <motion.h3
                      layoutId={getLayoutId(
                        "title",
                        card,
                        0
                      )}
                      transition={
                        effectiveTransition
                      }
                      className="text-base font-medium text-neutral-800"
                    >
                      {card.title}
                    </motion.h3>

                    <motion.p
                      layoutId={getLayoutId(
                        "description-wrap",
                        card,
                        0
                      )}
                      transition={
                        effectiveTransition
                      }
                      className="mt-1 text-base text-neutral-600"
                    >
                      {card.description}
                    </motion.p>

                    {card.credentialid && (
                      <p
                        className="mt-2 break-all text-xs text-neutral-500"
                      >
                        Credential ID:{" "}
                        {
                          card.credentialid
                        }
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            )
          )}
        </div>
      )}
    </LayoutGroup>
  );
}

/**
 * ============================================================
 * CLOSE ICON
 * ============================================================
 */

export const CloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path
        stroke="none"
        d="M0 0h24v24H0z"
        fill="none"
      />

      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
};