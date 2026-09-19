"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "./AboutSection.css";

import {
  CardBody,
  CardContainer,
} from "@/components/ui/3d-card";

import {
  TopPolygonSVG,
  BottomPolygonSVG,
} from "@/components/ui/polygon-svg";

import AboutMe_Rifana_image from "@/assets/Avatars/AboutMe-Rifana-image.png";
import ArrowDrawnSVG from "../ui/arrow-svg";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { StagingAnimatedText } from "@/components/ui/staging-animated-text";

export interface AboutSectionProps {
  className?: string;
}

export interface ArrowDrawnSVGProps {
  width: number;
  height: number;
  angle: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface AboutImgViewportType {
  ViewportDistance: number;
}

// viewport percentage from the top of the screen to trigger the animation
export const AboutImgViewport: Record<
  "desktop" | "tablet" | "mobile",
  AboutImgViewportType
> = {
  desktop: {
    ViewportDistance: 25,
  },
  tablet: {
    ViewportDistance: 25,
  },
  mobile: {
    ViewportDistance: 30,
  },
}

export interface AboutSubheadingViewportType {
  ViewportDistance: number;
}

// viewport percentage from the top of the screen to trigger the staging animation for about-subheading-rifana
export const AboutSubheadingViewport: Record<
  "desktop" | "tablet" | "mobile",
  AboutSubheadingViewportType
> = {
  desktop: {
    ViewportDistance: 60,
  },
  tablet: {
    ViewportDistance: 60,
  },
  mobile: {
    ViewportDistance: 60,
  },
};


export const ARROW_CONFIG: Record<
  "AboutMe" | "ItsMe",
  Record<"desktop" | "tablet" | "mobile", ArrowDrawnSVGProps>
> = {
  AboutMe: {
    desktop: {
      width: 80,
      height: 100,
      angle: 180,
      top: 15,
      right: 60,
    },
    tablet: {
      width: 80,
      height: 100,
      angle: 190,
      top: 10,
      right: 65,
    },
    mobile: {
      width: 65,
      height: 85,
      angle: 210,
      top: 4,
      right: 75,
    },
  },
  ItsMe: {
    desktop: {
      width: 45,
      height: 65,
      angle: 240,
      bottom: 0,
      right: 75,
    },
    tablet: {
      width: 45,
      height: 65,
      angle: 235,
      bottom: 0,
      right: 180,
    },
    mobile: {
      width: 45,
      height: 55,
      angle: 245,
      bottom: 0,
      right: 80,
    },
  }
}

export function AboutSection({ className = "" }: AboutSectionProps) {
  const imageColumnRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLHeadingElement>(null);

  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isSubheadingTriggered, setIsSubheadingTriggered] = useState(false);

  // Responsive device media queries matching project breakpoints
  const { isMobile, isTablet } = useMediaQuery()

  const AboutMeArrowConfig = isMobile
    ? ARROW_CONFIG.AboutMe.mobile
    : isTablet
      ? ARROW_CONFIG.AboutMe.tablet
      : ARROW_CONFIG.AboutMe.desktop;

  const ItsMeArrowConfig = isMobile
    ? ARROW_CONFIG.ItsMe.mobile
    : isTablet
      ? ARROW_CONFIG.ItsMe.tablet
      : ARROW_CONFIG.ItsMe.desktop;

  // Image column 3D reveal viewport detection
  useEffect(() => {
    const element = imageColumnRef.current;

    if (!element) return;

    const viewportDistance =
      isMobile
        ? AboutImgViewport.mobile.ViewportDistance
        : isTablet
          ? AboutImgViewport.tablet.ViewportDistance
          : AboutImgViewport.desktop.ViewportDistance;

    const checkViewportPosition = () => {
      const rect = element.getBoundingClientRect();

      const triggerPoint =
        window.innerHeight * (viewportDistance / 100);

      if (rect.top <= triggerPoint) {
        setHasEnteredViewport(true);

        window.removeEventListener("scroll", checkViewportPosition);
        window.removeEventListener("resize", checkViewportPosition);
      }
    };

    // Check immediately when the effect is created.
    checkViewportPosition();

    window.addEventListener("scroll", checkViewportPosition, {
      passive: true,
    });

    window.addEventListener("resize", checkViewportPosition);

    return () => {
      window.removeEventListener("scroll", checkViewportPosition);
      window.removeEventListener("resize", checkViewportPosition);
    };
  }, [isMobile, isTablet]);

  // Subheading staging animation viewport detection
  useEffect(() => {
    const element = subheadingRef.current;

    if (!element) return;

    const viewportDistance =
      isMobile
        ? AboutSubheadingViewport.mobile.ViewportDistance
        : isTablet
          ? AboutSubheadingViewport.tablet.ViewportDistance
          : AboutSubheadingViewport.desktop.ViewportDistance;

    const checkSubheadingPosition = () => {
      const rect = element.getBoundingClientRect();

      const triggerPoint =
        window.innerHeight * (viewportDistance / 100);

      if (rect.top <= triggerPoint) {
        setIsSubheadingTriggered(true);

        window.removeEventListener("scroll", checkSubheadingPosition);
        window.removeEventListener("resize", checkSubheadingPosition);
      }
    };

    checkSubheadingPosition();

    window.addEventListener("scroll", checkSubheadingPosition, {
      passive: true,
    });

    window.addEventListener("resize", checkSubheadingPosition);

    return () => {
      window.removeEventListener("scroll", checkSubheadingPosition);
      window.removeEventListener("resize", checkSubheadingPosition);
    };
  }, [isMobile, isTablet]);

  const handleRevealComplete = () => {
    setAnimationComplete(true);
  };

  return (
    <section
      id="about"
      className={`about-section ${className}`}
      aria-label="About Rifana"
    >
      <div className="about-container">

        {/* =====================================================
            LEFT CONTENT
        ====================================================== */}
        <div className="about-content">

          <h1 className="about-heading-hello">
            HELLO!
          </h1>

          <p className="about-subheading-gentle">
            Gentle Ladies &amp; Gentlemen,
          </p>

          <h2
            ref={subheadingRef}
            className="about-subheading-rifana"
          >
            <StagingAnimatedText
              text="I am Rifana."
              replay={isSubheadingTriggered}
              duration={0.06}
              delay={0.04}
              underline={false}
              underlineGradient="from-[#07553D] via-[#D4AF37] to-[#07553D]"
              underlineHeight="h-[2.5px]"
              underlineOffset="-bottom-2"
              className="about-subheading-rifana-staging"
              textClassName="about-subheading-rifana-text"
            />
          </h2>


          <p className="about-body-text">
            I’m An UI/UX And Graphic Designer With A Curious Mind And A
            Slightly Unhealthy Habit Of Wondering,
          </p>

          <p className="about-body-quote">
            “Can This Be Designed Better?”
          </p>

          <p className="about-body-text">
            I Enjoy Exploring The Space Where People, Visuals And Technology
            Meet. Understanding How Something Works, How Someone Experiences
            It And How Design Can Bring The Two Together. Whether I’m Shaping
            A Digital Interface, Building A Visual Concept Or Experimenting
            With Typography And Illustration, I’m Drawn To Designs That Have
            A Purpose Behind Them Rather Than Simply Looking Good. My
            Computer Science And AI/ML Background Gives Me A Technical
            Perspective, While Design Gives Me The Freedom To Think Visually,
            Experiment And Tell Stories. I’m Still Growing As A Designer, But
            I See That As Part Of The Process. Staying Curious, Trying New
            Things, Learning From What Doesn’t Work, And Turning Every Project
            Into Another Step Forward.
          </p>

          <div
            className="about-annotation-aboutme"
            aria-hidden="true"
          >
            <ArrowDrawnSVG
              width={AboutMeArrowConfig.width}
              height={AboutMeArrowConfig.height}
              angle={AboutMeArrowConfig.angle}
              direction="right"
              style={{
                top: `${AboutMeArrowConfig.top}px`,
                right: `${AboutMeArrowConfig.right}px`,
              }}
              className="about-annotation-aboutme-arrow"
            />
            <span className="about-annotation-aboutme-text">
              About Me
            </span>
          </div>
        </div>


        {/* =====================================================
            RIGHT IMAGE / REVEAL / 3D CARD
        ====================================================== */}
        <div
          ref={imageColumnRef}
          className="about-image-column"
        >

          <CardContainer
            className={`about-3d-card ${animationComplete
              ? "about-3d-card--active"
              : "about-3d-card--locked"
              }`}
            containerClassName="about-3d-card-container"
          >

            <CardBody className="about-3d-card-body">

              <div
                className={`
                  about-image-wrapper
                  ${hasEnteredViewport ? "about-image-wrapper--reveal" : ""}
                  ${animationComplete ? "about-image-wrapper--revealed" : ""}
                `}
              >

                {/* =================================================
                    TOP POLYGON
                ================================================== */}
                <TopPolygonSVG
                  className="about-polygon about-polygon-top"
                  aria-hidden="true"
                  onAnimationEnd={handleRevealComplete}
                />


                {/* =================================================
                    PHOTO
                ================================================== */}
                <div className="about-photo-frame">

                  <Image
                    src={AboutMe_Rifana_image}
                    alt="Portrait of Rifana - UI/UX & Graphic Designer"
                    fill
                    loading="eager"
                    priority={false}
                    sizes="
                      (max-width: 600px) 80vw,
                      (max-width: 960px) 480px,
                      440px
                    "
                    className="about-photo-img"
                  />

                </div>


                {/* =================================================
                    BOTTOM POLYGON
                ================================================== */}
                <BottomPolygonSVG
                  className="about-polygon about-polygon-bottom"
                  aria-hidden="true"
                />

              </div>

            </CardBody>

          </CardContainer>


          {/* =====================================================
              IT'S ME ANNOTATION
          ====================================================== */}
          <div
            className="about-annotation-itsme"
            aria-hidden="true"
          >
            <span className="about-annotation-itsme-text">
              {"It's Me"}
            </span>
            <ArrowDrawnSVG
              width={ItsMeArrowConfig.width}
              height={ItsMeArrowConfig.height}
              angle={ItsMeArrowConfig.angle}
              direction="left"
              style={{
                bottom: `${ItsMeArrowConfig.bottom}px`,
                right: `${ItsMeArrowConfig.right}px`,
              }}
              className="about-annotation-itsme-arrow"
            />
          </div>

        </div>

      </div>
    </section>
  );
}

export default AboutSection;