import React from "react";

type PageCornerFrameSVGSide = "left" | "right";

interface PageCornerFrameSVGProps {
    /**
     * Overall width of the SVG.
     *
     * Example:
     * width={800}
     * width="50vw"
     */
    width?: number | string;

    /**
     * Overall height of the SVG.
     *
     * Example:
     * height={1000}
     * height="100vh"
     */
    height?: number | string;

    /**
     * Thickness of the horizontal and vertical bars.
     *
     * Original thickness = 52.2138
     */
    thickness?: number;

    /**
     * Which shape to render.
     */
    side?: PageCornerFrameSVGSide;

    /**
     * Fill color.
     */
    color?: string;

    /**
     * Optional className.
     */
    className?: string;

    /**
     * z-index.
     */
    zIndex?: number;
}

const PageCornerFrameSVG: React.FC<PageCornerFrameSVGProps> = ({
    width = 1677,
    height = 1745,
    thickness = 52.2138,
    side = "right",
    color = "#B08E2F",
    className = "",
    zIndex = 10,
}) => {
    /*
     * -------------------------------------------------------
     * ORIGINAL DESIGN
     * -------------------------------------------------------
     */

    const ORIGINAL_WIDTH = 1677;
    const ORIGINAL_HEIGHT = 1745;

    const ORIGINAL_THICKNESS = 52.2138;

    /*
     * Convert width / height to numeric values.
     *
     * SVG supports strings such as:
     *
     * width="50vw"
     * height="100vh"
     *
     * but those cannot be used directly inside path
     * calculations.
     *
     * For responsive CSS dimensions, the SVG uses a
     * normalized viewBox instead.
     */

    const numericWidth =
        typeof width === "number"
            ? width
            : ORIGINAL_WIDTH;

    const numericHeight =
        typeof height === "number"
            ? height
            : ORIGINAL_HEIGHT;

    /*
     * -------------------------------------------------------
     * THICKNESS SCALE
     * -------------------------------------------------------
     *
     * Keep the original proportions.
     */

    const thicknessRatio =
        thickness / ORIGINAL_THICKNESS;

    /*
     * Original important coordinates:
     *
     * 52.2138 = thickness
     * 102.227 = thickness + ~50
     * 1624.29 = width - ~52.21
     * 1676.5 = width
     * 1674.24 = height - ~70.76
     * 1745 = height
     *
     * We keep these relationships intact.
     */

    const t = ORIGINAL_THICKNESS * thicknessRatio;

    /*
     * -------------------------------------------------------
     * RIGHT SIDE
     *
     * This is based directly on your ORIGINAL SVG:
     *
     * M1676.5 0
     * H857
     * H0
     * ...
     * -------------------------------------------------------
     */

    const createRightPath = () => {
        /*
         * Horizontal scaling.
         */
        const sx = numericWidth / ORIGINAL_WIDTH;

        /*
         * Vertical scaling.
         */
        const sy = numericHeight / ORIGINAL_HEIGHT;

        /*
         * Original coordinates scaled into the new
         * coordinate system.
         */

        const W = numericWidth;
        const H = numericHeight;

        /*
         * Original horizontal values.
         */
        const x1 = 857 * sx;

        const curveStartX =
            68.4916 * sx;

        const horizontalEndX =
            1574.29 * sx;

        const verticalX =
            1624.29 * sx;

        /*
         * Original vertical values.
         */
        const y1 =
            9.52369 * sy;

        const topThickness =
            t * sy;

        const curveY =
            35.41 * sy;

        const cornerEndY =
            102.227 * sy;

        const bottomStartY =
            1674.24 * sy;

        const bottomCurveY1 =
            1699.04 * sy;

        const bottomCurveY2 =
            1721.99 * sy;

        const bottomCurveY3 =
            1734.57 * sy;

        return `
      M ${W} 0

      H ${x1}

      H 0

      L ${4.03302 * sx}
        ${y1}

      C
        ${14.9952 * sx}
        ${curveY}

        ${40.3798 * sx}
        ${topThickness}

        ${curveStartX}
        ${topThickness}

      H ${horizontalEndX}

      C
        ${1601.9 * sx}
        ${topThickness}

        ${verticalX}
        ${74.613 * sy}

        ${verticalX}
        ${cornerEndY}

      V ${bottomStartY}

      C
        ${verticalX}
        ${bottomCurveY1}

        ${1637.41 * sx}
        ${bottomCurveY2}

        ${1658.78 * sx}
        ${bottomCurveY3}

      L ${W}
        ${H}

      V ${919.5 * sy}

      V 0

      Z
    `;
    };

    /*
     * -------------------------------------------------------
     * LEFT SIDE
     *
     * Directly based on your ORIGINAL LEFT SVG.
     * -------------------------------------------------------
     */

    const createLeftPath = () => {
        /*
         * Horizontal scaling.
         */
        const sx =
            numericWidth / ORIGINAL_WIDTH;

        /*
         * Vertical scaling.
         */
        const sy =
            numericHeight / ORIGINAL_HEIGHT;

        const W = numericWidth;
        const H = numericHeight;

        /*
         * Original coordinates.
         */

        const x1 =
            819.5 * sx;

        const curveStartX =
            1608.01 * sx;

        const horizontalStartX =
            102.214 * sx;

        const verticalX =
            52.2138 * sx;

        const y1 =
            9.52369 * sy;

        const topThickness =
            t * sy;

        const curveY =
            35.41 * sy;

        const cornerEndY =
            102.227 * sy;

        const bottomStartY =
            1674.24 * sy;

        const bottomCurveY1 =
            1699.04 * sy;

        const bottomCurveY2 =
            1721.99 * sy;

        const bottomCurveY3 =
            1734.57 * sy;

        return `
      M 0 0

      H ${x1}

      H ${W}

      L ${W - 4.03302 * sx}
        ${y1}

      C
        ${W - 14.9952 * sx}
        ${curveY}

        ${W - 40.3798 * sx}
        ${topThickness}

        ${W - 68.4916 * sx}
        ${topThickness}

      H ${horizontalStartX}

      C
        ${74.5997 * sx}
        ${topThickness}

        ${verticalX}
        ${74.613 * sy}

        ${verticalX}
        ${cornerEndY}

      V ${bottomStartY}

      C
        ${verticalX}
        ${bottomCurveY1}

        ${39.0922 * sx}
        ${bottomCurveY2}

        ${17.7196 * sx}
        ${bottomCurveY3}

      L 0 ${H}

      V ${919.5 * sy}

      V 0

      Z
    `;
    };

    /*
     * -------------------------------------------------------
     * PATH
     * -------------------------------------------------------
     */

    const path =
        side === "right"
            ? createRightPath()
            : createLeftPath();

    /*
     * -------------------------------------------------------
     * SVG
     * -------------------------------------------------------
     */

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${numericWidth} ${numericHeight}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
            style={{
                /*
                 * Page-relative positioning.
                 */
                position: "absolute",

                /*
                 * Always top.
                 */
                top: 0,

                /*
                 * Correct horizontal corner.
                 */
                ...(side === "left"
                    ? {
                        left: 0,
                    }
                    : {
                        right: 0,
                    }),

                /*
                 * Never interfere with other UI.
                 */
                pointerEvents: "none",

                /*
                 * Prevent inline SVG spacing.
                 */
                display: "block",

                /*
                 * Remove default spacing.
                 */
                margin: 0,
                padding: 0,

                /*
                 * Layer.
                 */
                zIndex,
            }}
        >
            <path
                d={path}
                fill={color}
            />
        </svg>
    );
};

export default PageCornerFrameSVG;