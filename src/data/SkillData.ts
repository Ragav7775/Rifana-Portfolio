
import { StaticImageData } from "next/image";

// Assets
import AdobeIllustratorImg from "@/assets/Skills/Adobe-Illustrator-image.png";
import AdobeIndesignImg from "@/assets/Skills/Adobe-Indesign-image.png";
import AdobeXdImg from "@/assets/Skills/Adobe-Xd-image.png";
import CanvaImg from "@/assets/Skills/Canva-image.png";
import CssImg from "@/assets/Skills/Css-image.png";
import FigjamImg from "@/assets/Skills/Figjam-image.png";
import FigmaImg from "@/assets/Skills/Figma-image.png";
import FramerImg from "@/assets/Skills/Framer-image.png";
import HtmlImg from "@/assets/Skills/Html-image.png";
import JavascriptImg from "@/assets/Skills/Javascript-image.png";
import PhotoshopImg from "@/assets/Skills/Photoshop-image.png";
import PythonImg from "@/assets/Skills/Python-image.png";
import PhotopeaImg from "@/assets/Skills/PhotoPea-image.png";
import InkscapeImg from "@/assets/Skills/Inkscape-image.png";




/* ============================================================
   ANIMATION CONFIGURATION
   Easily tweak the explosion / return speed, stagger, and scaling
   ============================================================ */

export const ANIMATION_CONFIG = {
    duration: 0.75, // Time for each avatar to reach its position (seconds)
    stagger: 0.08, // Delay between each avatar's launch (seconds)
    returnDuration: 0.5, // Time to collapse back to center (seconds)
    returnStagger: 0.03, // Delay between each avatar's return (seconds)
    initialScale: 0.25, // Scale when collapsed at center
    finalScale: 1, // Final scale when expanded
    initialOpacity: 0, // Opacity when collapsed
    finalOpacity: 1, // Opacity when expanded
    springStiffness: 140, // Spring stiffness for elastic feel
    springDamping: 15, // Spring damping
};

export const VIEWPORT_TRIGGER_CONFIG = {
    desktop: 0.15, // 15% from top
    tablet: 0.35,  // 35% from top
    mobile: 0.25,  // 25% from top
};

/* ============================================================
   MANUAL SKILL CONFIGURATION ARRAY
   Control each skill's position, size, scale, tooltip, and order
   ============================================================ */

export interface SkillItemConfig {
    id: string;
    name: string;
    tooltip: string;
    designation?: string;
    image: StaticImageData;
    position: {
        desktop: { x: number; y: number };
        tablet?: { x: number; y: number };
        mobile: { x: number; y: number };
    };
    size: {
        desktop: number;
        tablet?: number;
        mobile: number;
    };
    scale?: {
        desktop?: number;
        mobile?: number;
    };
    order: number;
}

export const SKILLS: SkillItemConfig[] = [
    {
        id: "indesign",
        name: "Adobe InDesign",
        tooltip: "Adobe InDesign",
        designation: "Layout & Editorial Design",
        image: AdobeIndesignImg,
        position: {
            desktop: { x: -160, y: -320 },
            tablet: { x: -130, y: -220 },
            mobile: { x: -85, y: -190 },
        },
        size: {
            desktop: 112,
            tablet: 85,
            mobile: 56,
        },
        order: 1,
    },
    {
        id: "figma",
        name: "Figma",
        tooltip: "Figma",
        designation: "UI/UX & Prototyping",
        image: FigmaImg,
        position: {
            desktop: { x: 125, y: -280 },
            tablet: { x: 80, y: -170 },
            mobile: { x: 45, y: -220 },
        },
        size: {
            desktop: 125,
            tablet: 95,
            mobile: 62,
        },
        order: 2,
    },
    {
        id: "framer",
        name: "Framer",
        tooltip: "Framer",
        designation: "Interactive Web Design",
        image: FramerImg,
        position: {
            desktop: { x: -250, y: -160 },
            tablet: { x: -175, y: -100 },
            mobile: { x: -125, y: -110 },
        },
        size: {
            desktop: 110,
            tablet: 84,
            mobile: 54,
        },
        order: 3,
    },
    {
        id: "xd",
        name: "Adobe XD",
        tooltip: "Adobe XD",
        designation: "Experience Design",
        image: AdobeXdImg,
        position: {
            desktop: { x: -380, y: -80 },
            tablet: { x: -280, y: -40 },
            mobile: { x: -120, y: -25 },
        },
        size: {
            desktop: 100,
            tablet: 76,
            mobile: 50,
        },
        order: 4,
    },
    {
        id: "canva",
        name: "Canva",
        tooltip: "Canva",
        designation: "Visual Assets & Content",
        image: CanvaImg,
        position: {
            desktop: { x: -280, y: 25 },
            tablet: { x: -185, y: 25 },
            mobile: { x: -100, y: 40 },
        },
        size: {
            desktop: 130,
            tablet: 98,
            mobile: 62,
        },
        order: 5,
    },
    {
        id: "css",
        name: "CSS3",
        tooltip: "CSS3",
        designation: "Styling & Responsive Layout",
        image: CssImg,
        position: {
            desktop: { x: 140, y: -50 },
            tablet: { x: 105, y: -10 },
            mobile: { x: 70, y: -110 },
        },
        size: {
            desktop: 82,
            tablet: 64,
            mobile: 48,
        },
        order: 6,
    },
    {
        id: "illustrator",
        name: "Adobe Illustrator",
        tooltip: "Adobe Illustrator",
        designation: "Vector Illustration & Branding",
        image: AdobeIllustratorImg,
        position: {
            desktop: { x: 285, y: -100 },
            tablet: { x: 215, y: -15 },
            mobile: { x: 45, y: -25 },
        },
        size: {
            desktop: 120,
            tablet: 90,
            mobile: 58,
        },
        order: 7,
    },
    {
        id: "photoshop",
        name: "Adobe Photoshop",
        tooltip: "Adobe Photoshop",
        designation: "Photo Editing & Artistry",
        image: PhotoshopImg,
        position: {
            desktop: { x: 125, y: 125 },
            tablet: { x: 100, y: 125 },
            mobile: { x: 65, y: 45 },
        },
        size: {
            desktop: 130,
            tablet: 98,
            mobile: 62,
        },
        order: 8,
    },
    {
        id: "html",
        name: "HTML5",
        tooltip: "HTML5",
        designation: "Semantic Web Structure",
        image: HtmlImg,
        position: {
            desktop: { x: 310, y: 85 },
            tablet: { x: 245, y: 110 },
            mobile: { x: 70, y: 140 },
        },
        size: {
            desktop: 95,
            tablet: 72,
            mobile: 50,
        },
        order: 9,
    },
    {
        id: "figjam",
        name: "FigJam",
        tooltip: "FigJam",
        designation: "Brainstorming & Diagrams",
        image: FigjamImg,
        position: {
            desktop: { x: -175, y: 150 },
            tablet: { x: -120, y: 140 },
            mobile: { x: -65, y: 145 },
        },
        size: {
            desktop: 98,
            tablet: 75,
            mobile: 52,
        },
        order: 10,
    },
    {
        id: "javascript",
        name: "JavaScript",
        tooltip: "JavaScript",
        designation: "Dynamic Web Logic",
        image: JavascriptImg,
        position: {
            desktop: { x: -320, y: 185 },
            tablet: { x: -225, y: 150 },
            mobile: { x: -135, y: 120 },
        },
        size: {
            desktop: 100,
            tablet: 76,
            mobile: 52,
        },
        order: 11,
    },
    {
        id: "python",
        name: "Python",
        tooltip: "Python",
        designation: "AI/ML & Data Engineering",
        image: PythonImg,
        position: {
            desktop: { x: -20, y: 220 },
            tablet: { x: -20, y: 185 },
            mobile: { x: 0, y: 165 },
        },
        size: {
            desktop: 118,
            tablet: 88,
            mobile: 58,
        },
        order: 12,
    },
    {
        id: "Photopea",
        name: "PhotoPea",
        tooltip: "PhotoPea",
        designation: "Photo Editing & Artistry",
        image: PhotopeaImg,
        position: {
            desktop: { x: -410, y: 60 },
            tablet: { x: -260, y: -180 },
            mobile: { x: -120, y: 185 },
        },
        size: {
            desktop: 80,
            tablet: 65,
            mobile: 50,
        },
        order: 13,
    },
    {
        id: "Inkscape",
        name: "Inkscape",
        tooltip: "Inkscape",
        designation: "Vector Illustration & Branding",
        image: InkscapeImg,
        position: {
            desktop: { x: 280, y: 240 },
            tablet: { x: 220, y: -180 },
            mobile: { x: 65, y: 210 },
        },
        size: {
            desktop: 90,
            tablet: 80,
            mobile: 45,
        },
        order: 14,
    },
];