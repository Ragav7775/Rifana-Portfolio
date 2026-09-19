"use client";

import React from "react";
import {
  NAVBAR_SCROLL_SVG_CONFIG,
  useNavbarDevice,
  getSVGPositionStyle,
  type NavbarDevice,
  type SVGPosition,
} from "@/config/NavbarConfig";

export interface ScrollSVGProps extends React.SVGProps<SVGSVGElement> {
  device?: NavbarDevice;
  position?: SVGPosition;
}

const BottomRightScrollSVG: React.FC<ScrollSVGProps> = ({
  device,
  width,
  height,
  viewBox,
  position,
  style,
  ...restProps
}) => {
  const currentDevice = useNavbarDevice();
  const resolvedDevice = device ?? currentDevice;
  const cfg = NAVBAR_SCROLL_SVG_CONFIG[resolvedDevice];

  const svgWidth = width ?? cfg.bottomRight.width;
  const svgHeight = height ?? cfg.bottomRight.height;
  const svgViewBox = viewBox ?? cfg.bottomRight.viewBox;

  const positionStyle = position ? getSVGPositionStyle(position) : undefined;
  const mergedStyle = positionStyle ? { ...positionStyle, ...style } : style;

  if (resolvedDevice === "mobile") {
    return (
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={svgViewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={mergedStyle}
        {...restProps}
      >
        <path
          d="M25.622 2.87555L24.9475 3.24339C17.6843 7.19226 12.2448 10.8379 8.55667 14.4138C4.84086 18.0166 2.7014 21.7517 2.52879 25.7874C2.35953 29.7481 4.11459 33.4537 6.92929 37.0558C9.75394 40.6706 13.8596 44.4499 18.8764 48.5776L19.4601 49.0581L220.493 60.6648L221.22 60.2132C227.047 56.5989 231.608 53.209 234.831 49.8188C238.08 46.4012 240.091 42.8515 240.535 38.9776C240.976 35.1311 239.825 31.3603 237.558 27.5221C235.298 23.6942 231.82 19.6203 227.316 15.1058L226.697 14.4847L25.622 2.87555Z"
          fill="url(#paint0_linear_253_173)"
          stroke="black"
          strokeWidth="5"
        />
        <path
          d="M20.5146 49.5891L18.4543 46.9246C28.9115 38.7636 33.8032 32.4621 34.7127 26.5921C35.6054 20.8299 32.8398 14.1422 24.1077 4.94314L26.7612 2.47156L29.4147 -2.45533e-05C38.4245 9.49148 43.0752 18.137 41.6791 27.1482C40.2997 36.0516 33.1972 43.9636 22.5749 52.2535L20.5146 49.5891Z"
          fill="black"
        />
        <path
          d="M35.3056 24.9724C36.3921 24.0413 37.9761 24.1025 38.8435 25.1089C39.7108 26.1154 39.5331 27.686 38.4466 28.6171L36.8761 26.7947L35.3056 24.9724ZM3.08433 26.5827C2.25466 25.545 2.48646 23.9774 3.60208 23.0813C4.7177 22.1853 6.29467 22.3001 7.12434 23.3379L5.10434 24.9603L3.08433 26.5827ZM36.8761 26.7947L38.4466 28.6171C31.4852 34.582 25.6234 38.4199 19.7071 38.1897C13.7586 37.9581 8.74836 33.6671 3.08433 26.5827L5.10434 24.9603L7.12434 23.3379C12.8137 30.454 16.6771 33.0886 20.27 33.2285C23.895 33.3696 28.2424 31.0245 35.3056 24.9724L36.8761 26.7947Z"
          fill="black"
        />
        <path
          d="M55.083 45.967L55.392 43.636L204.234 47.8672L203.351 54.5274L55.083 45.967Z"
          fill="#D4AF37"
        />
        <path
          d="M56.4429 35.308L56.1544 37.6402L204.056 49.2101L204.88 42.5468L56.4429 35.308Z"
          fill="#D4AF37"
        />
        <path
          d="M175.645 31.7724L180.506 14.1072L165.507 13.2413C165.507 13.2413 168.97 12.9205 171.153 14.984C176.32 19.8685 175.645 31.7724 175.645 31.7724Z"
          fill="#BEAA39"
        />
        <path
          d="M168.672 30.7604L171.174 20.9874L172.15 13.6248L158.84 12.8563C158.84 12.8563 160.317 12.8806 163.223 14.8613C170.102 19.5497 168.672 30.7604 168.672 30.7604Z"
          fill="#BEAA39"
        />
        <path
          d="M97.6077 34.3293C97.6077 34.3293 104.007 25.6252 104.335 19.6745C104.614 14.6384 101.601 9.83412 101.601 9.83412L95.8349 9.16346C95.8349 9.16346 98.3634 14.1583 99.3482 19.3338C100.474 25.2502 97.6077 34.3293 97.6077 34.3293Z"
          fill="#BEAA39"
        />
        <defs>
          <linearGradient
            id="paint0_linear_253_173"
            x1="170.582"
            y1="34.5142"
            x2="6.71788"
            y2="12.79"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#268849" />
            <stop offset="1" stopColor="#0A4F3A" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={svgViewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={mergedStyle}
      {...restProps}
    >
      <path
        d="M2.57989 130.131L3.22941 130.921C10.2448 139.436 16.377 143.946 23.1357 144.136C29.7532 144.323 36.1005 140.3 43.3497 134.486L44.1826 133.817L54.602 14.7234L53.8351 13.9083C47.3933 7.05538 41.6494 3.04781 35.0915 2.5518C28.609 2.06166 22.005 5.06709 14.0132 10.3283L13.0031 10.9938L2.57989 130.131Z"
        fill="url(#paint0_linear_184_377)"
        stroke="black"
        strokeWidth="5"
      />
      <path
        d="M44.4186 132.568C29.8039 120.21 19.1647 118.504 2.56033 128.906"
        stroke="black"
        strokeWidth="7"
      />
      <path
        d="M24.1685 122.976C34.8443 131.198 35.1543 134.946 22.5388 141.602"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M41.2009 112.302L39.1301 112.121L42.889 24.8608L48.8058 25.3785L41.2009 112.302Z"
        fill="#D4AF37"
      />
      <path
        d="M31.7314 111.505L33.8033 111.674L44.0818 24.9651L38.1622 24.4818L31.7314 111.505Z"
        fill="#D4AF37"
      />
      <path
        d="M28.5905 41.6211L12.8972 38.7713L12.1279 47.5646C12.1279 47.5646 11.8429 45.5339 13.6761 44.2543C18.0153 41.2254 28.5905 41.6211 28.5905 41.6211Z"
        fill="#BEAA39"
      />
      <path
        d="M27.6914 45.7087L19.0093 44.2419L12.4685 43.6696L11.7858 51.4729C11.7858 51.4729 11.8073 50.607 13.567 48.9033C17.732 44.8706 27.6914 45.7087 27.6914 45.7087Z"
        fill="#BEAA39"
      />
      <path
        d="M30.862 87.3716C30.862 87.3716 23.1295 83.6202 17.843 83.4274C13.3691 83.2642 9.10103 85.0303 9.10103 85.0303L8.50522 88.4109C8.50522 88.4109 12.9425 86.9286 17.5404 86.3513C22.7964 85.6913 30.862 87.3716 30.862 87.3716Z"
        fill="#BEAA39"
      />
      <defs>
        <linearGradient
          id="paint0_linear_184_377"
          x1="31.0263"
          y1="44.589"
          x2="22.5388"
          y2="141.602"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#268849" />
          <stop offset="1" stopColor="#0A4F3A" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default BottomRightScrollSVG;