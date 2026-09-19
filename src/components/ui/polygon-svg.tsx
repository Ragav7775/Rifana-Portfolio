import React from "react";

export const TopPolygonSVG: React.FC<React.SVGProps<SVGSVGElement>> = (
    props
) => (
    <svg
        width="490"
        height="250"
        viewBox="0 0 490 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M2.59343 246.811L476.57 4.67581e-05L5.80233e-05 5.40498e-05L2.59343 246.811Z"
            fill="#07553D"
        />
    </svg>
);

export const BottomPolygonSVG: React.FC<React.SVGProps<SVGSVGElement>> = (
    props
) => (
    <svg
        width="490"
        height="250"
        viewBox="0 0 490 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M481.047 2.85069e-05L9.78236e-06 252.144L481.047 247.832L481.047 2.85069e-05Z"
            fill="#07553D"
        />
    </svg>
);