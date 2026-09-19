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

const TopLeftScrollSVG: React.FC<ScrollSVGProps> = ({
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

  const svgWidth = width ?? cfg.topLeft.width;
  const svgHeight = height ?? cfg.topLeft.height;
  const svgViewBox = viewBox ?? cfg.topLeft.viewBox;

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
          d="M19.5323 48.9772L18.9648 48.5376C12.851 43.8164 8.45345 39.6029 5.76233 35.6587C3.05101 31.6848 1.92689 27.7612 2.81883 23.7671C3.69434 19.8471 6.39782 16.3989 10.1176 13.1741C13.8505 9.93795 18.8883 6.68655 24.915 3.19645L25.6163 2.79015L226.649 14.3969L227.247 14.925C232.034 19.152 235.634 23.0132 237.916 26.7212C240.216 30.4592 241.262 34.1854 240.68 38.0513C240.102 41.8899 237.977 45.4715 234.734 48.9916C231.501 52.5023 227.004 56.1159 221.381 60.0457L220.608 60.5864L19.5323 48.9772Z"
          fill="url(#paint0_linear_253_185)"
          stroke="black"
          strokeWidth="5"
        />
        <path
          d="M26.7944 2.38801L24.0643 4.77591C32.2151 14.0113 35.3744 20.7776 34.7255 26.6626C34.0884 32.4396 29.605 38.7088 18.585 46.7674L20.5478 49.5055L22.5107 52.2436C33.8811 43.9288 40.7361 35.9475 41.7324 26.9133C42.7167 17.987 37.8041 9.38132 29.5245 0.000119029L26.7944 2.38801Z"
          fill="black"
        />
        <path
          d="M34.8834 28.3258C35.7085 29.3672 37.2845 29.4885 38.4035 28.5967C39.5225 27.7049 39.7608 26.1378 38.9358 25.0964L36.9096 26.7111L34.8834 28.3258ZM3.57544 23.0475C2.48531 23.9744 2.30109 25.5448 3.16398 26.5551C4.02686 27.5653 5.6101 27.6329 6.70023 26.706L5.13783 24.8768L3.57544 23.0475ZM36.9096 26.7111L38.9358 25.0964C33.6497 18.4244 28.8869 13.973 22.9998 13.5218C17.0808 13.0681 11.0176 16.7199 3.57544 23.0475L5.13783 24.8768L6.70023 26.706C14.1757 20.35 18.6736 18.1981 22.2487 18.4721C25.8558 18.7486 29.5201 21.5561 34.8834 28.3258L36.9096 26.7111Z"
          fill="black"
        />
        <path
          d="M56.2676 10.3838L55.9585 12.7149L203.653 25.6043L204.536 18.9441L56.2676 10.3838Z"
          fill="#D4AF37"
        />
        <path
          d="M54.8013 21.0369L55.1308 18.7071L203.83 24.2616L202.888 30.9182L54.8013 21.0369Z"
          fill="#D4AF37"
        />
        <path
          d="M178.085 37.4216L177.749 55.3743L162.775 54.3357C162.775 54.3357 166.083 55.0867 168.822 53.3359C175.305 49.1918 178.085 37.4216 178.085 37.4216Z"
          fill="#BEAA39"
        />
        <path
          d="M170.948 37.5373L170.579 47.4458L169.408 54.796L156.12 53.8744C156.12 53.8744 157.577 54.0365 161.002 52.4581C169.11 48.7221 170.948 37.5373 170.948 37.5373Z"
          fill="#BEAA39"
        />
        <path
          d="M109.076 26.3987C109.076 26.3987 112.094 35.8658 110.231 41.6923C108.655 46.6232 103.971 50.8038 103.971 50.8038L98.1301 50.534C98.1301 50.534 102.415 46.0912 105.267 41.2266C108.529 35.6657 109.076 26.3987 109.076 26.3987Z"
          fill="#BEAA39"
        />
        <defs>
          <linearGradient
            id="paint0_linear_253_185"
            x1="170.615"
            y1="34.4307"
            x2="6.75114"
            y2="12.7065"
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
        d="M44.1941 133.876L43.4175 134.54C35.03 141.708 28.2078 145.084 21.5186 144.099C14.9693 143.133 9.41707 138.069 3.28765 131.084L2.58345 130.281L13.0028 11.1875L13.8995 10.518C21.4335 4.88776 27.786 1.9385 34.3305 2.5888C40.7995 3.23176 46.7814 7.33832 53.7382 13.9073L54.6173 14.7381L44.1941 133.876Z"
        fill="url(#paint0_linear_184_376)"
        stroke="black"
        strokeWidth="5"
      />
      <path
        d="M2.56804 129.01C19.1067 119.377 29.8804 119.545 44.4263 132.672"
        stroke="black"
        strokeWidth="7"
      />
      <path
        d="M24.176 123.08C12.2347 129.323 11.2785 132.961 22.5464 141.706"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M9.67139 111.731L11.7423 111.912L23.193 25.3251L17.2762 24.8074L9.67139 111.731Z"
        fill="#D4AF37"
      />
      <path
        d="M19.1353 112.59L17.0655 112.397L22.0001 25.2207L27.9136 25.7727L19.1353 112.59Z"
        fill="#D4AF37"
      />
      <path
        d="M33.6914 40.3142L49.6402 40.5112L48.7176 49.2898C48.7176 49.2898 49.3848 47.3507 47.8294 45.7448C44.1478 41.9436 33.6914 40.3142 33.6914 40.3142Z"
        fill="#BEAA39"
      />
      <path
        d="M33.7942 44.4981L42.5967 44.7148L49.1265 45.4011L48.3078 53.1913C48.3078 53.1913 48.4518 52.3372 47.0496 50.329C43.7305 45.5757 33.7942 44.4981 33.7942 44.4981Z"
        fill="#BEAA39"
      />
      <path
        d="M23.8989 80.7714C23.8989 80.7714 32.3092 79.0021 37.4854 80.0939C41.8659 81.0179 45.5799 83.7641 45.5799 83.7641L45.3402 87.1884C45.3402 87.1884 41.3933 84.6767 37.0717 83.0042C32.1315 81.0922 23.8989 80.7714 23.8989 80.7714Z"
        fill="#BEAA39"
      />
      <defs>
        <linearGradient
          id="paint0_linear_184_376"
          x1="31.0342"
          y1="44.6933"
          x2="22.5466"
          y2="141.706"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#268849" />
          <stop offset="1" stopColor="#0A4F3A" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default TopLeftScrollSVG;