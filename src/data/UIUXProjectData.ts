import { StaticImageData } from "next/image";


// UI/UX Anime Arcade Assets
import AnimeArcadeMainImg from "@/assets/Projects/UIUX/AnimeArcade/main-image.png";
import AnimeArcadeImg1 from "@/assets/Projects/UIUX/AnimeArcade/img1.png";
import AnimeArcadeImg2 from "@/assets/Projects/UIUX/AnimeArcade/img2.png";
import AnimeArcadeImg3 from "@/assets/Projects/UIUX/AnimeArcade/img3.png";
import AnimeArcadeImg4 from "@/assets/Projects/UIUX/AnimeArcade/img4.png";
import AnimeArcadeImg5 from "@/assets/Projects/UIUX/AnimeArcade/img5.png";
import AnimeArcadeImg6 from "@/assets/Projects/UIUX/AnimeArcade/img6.png";
import AnimeArcadeImg7 from "@/assets/Projects/UIUX/AnimeArcade/img7.png";

// UI/UX Fitness Care Assets
import FitnessCareMainImg from "@/assets/Projects/UIUX/FitnessCare/main-image.png";
import FitnessCareImg1 from "@/assets/Projects/UIUX/FitnessCare/img1.png";
import FitnessCareImg2 from "@/assets/Projects/UIUX/FitnessCare/img2.png";
import FitnessCareImg3 from "@/assets/Projects/UIUX/FitnessCare/img3.png";
import FitnessCareImg4 from "@/assets/Projects/UIUX/FitnessCare/img4.png";
import FitnessCareImg5 from "@/assets/Projects/UIUX/FitnessCare/img5.png";
import FitnessCareImg6 from "@/assets/Projects/UIUX/FitnessCare/img6.png";


// UI/UX Sri Raghava Steel Furnitures Assets
import SriRaghavaSteelFurnituresMainImg from "@/assets/Projects/UIUX/SriRaghavaSteelFurnitures/main-image.jpeg";
import SriRaghavaSteelFurnituresImg1 from "@/assets/Projects/UIUX/SriRaghavaSteelFurnitures/img1.jpeg";
import SriRaghavaSteelFurnituresImg2 from "@/assets/Projects/UIUX/SriRaghavaSteelFurnitures/img2.jpeg";
import SriRaghavaSteelFurnituresImg3 from "@/assets/Projects/UIUX/SriRaghavaSteelFurnitures/img3.jpeg";
import SriRaghavaSteelFurnituresImg4 from "@/assets/Projects/UIUX/SriRaghavaSteelFurnitures/img4.jpeg";
import SriRaghavaSteelFurnituresImg5 from "@/assets/Projects/UIUX/SriRaghavaSteelFurnitures/img5.jpeg";
import SriRaghavaSteelFurnituresImg6 from "@/assets/Projects/UIUX/SriRaghavaSteelFurnitures/img6.png";
import SriRaghavaSteelFurnituresImg7 from "@/assets/Projects/UIUX/SriRaghavaSteelFurnitures/img7.jpeg";
import SriRaghavaSteelFurnituresImg8 from "@/assets/Projects/UIUX/SriRaghavaSteelFurnitures/img8.jpeg";
import SriRaghavaSteelFurnituresImg9 from "@/assets/Projects/UIUX/SriRaghavaSteelFurnitures/img9.jpeg";


/* ============================================================
   TYPES
   ============================================================ */

export interface UIUXProject {
    id: string;
    name: string;
    lable1?: string;
    lable2?: string;
    slug: string;
    category: string;
    platform?: "web" | "mobile";
    subtitle: string;
    summary: string;
    description: string;
    keyFeatures: string[];
    liveLink?: string;
    heroImage: StaticImageData;
    macbookScreenImage: StaticImageData;
    thumbnailImage: StaticImageData;
    mainPages: Array<{
        id: string;
        image: StaticImageData;
    }>;
}


/* ============================================================
   UI/UX PROJECTS DATA
   ============================================================ */

export const UIUX_PROJECTS: UIUXProject[] = [
    {
        id: "anime-arcade",
        name: "Anime Arcade",
        lable1: "Anime",
        lable2: "Arcade",
        slug: "animaarcade",
        category: "uiux",
        platform: "web",
        subtitle: "Crunchyroll Recreation Website",
        summary: "Anime Arcade is a recreation of the Crunchyroll streaming experience, created to explore and improve the design of an anime-focused content platform. The project focuses on intuitive navigation, organized content discovery, engaging visual presentation, and a streamlined browsing experience for anime enthusiasts.",
        description: "Anime Arcade Is An Anime Streaming Platform Concept Designed To Make Content Discovery Simple, Engaging, And Intuitive. It Combines Structured Categorization, Seamless Navigation, And Strong Visual Hierarchy For A More Immersive Browsing Experience.",
        keyFeatures: [
            "User Experience (UX): Recreated The Core Browsing Experience With Intuitive Navigation And Clearly Structured Content.",
            "Content Discoverability: Organized Anime Titles Into Categories And Sections To Make Exploration And Navigation More Efficient.",
            "Visual Hierarchy: Applied Structured Layouts, Typography, Imagery, And Content Cards To Create A Clear And Engaging Interface.",
            "Streamlined Navigation: Designed Accessible Navigation Across Major Sections To Help Users Move Through The Platform With Minimal Friction.",
            "Anime-Focused Visual Design: Developed A Vibrant Interface Inspired By The Visual Language Of Anime Streaming Platforms While Maintaining A Clean Layout.",
            "Engaging Content Presentation: Designed Prominent Banners, Anime Cards, And Content Sections To Encourage Browsing And Discovery.",
        ],
        liveLink: "https://www.figma.com/proto/xgzonIHJVJnStHyzwCJ7FP/ANIME-ARCADE--RECREATION-WEBSITE-?node-id=334-1286&viewport=-3040%2C3487%2C0.08&t=LNCpdi4VLrA3qlXK-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=343%3A3710&page-id=0%3A1",
        heroImage: AnimeArcadeMainImg,
        macbookScreenImage: AnimeArcadeMainImg,
        thumbnailImage: AnimeArcadeMainImg,
        mainPages: [
            {
                id: "main-page-1",
                image: AnimeArcadeImg1,
            },
            {
                id: "main-page-2",
                image: AnimeArcadeImg2,
            },
            {
                id: "main-page-3",
                image: AnimeArcadeImg3,
            },
            {
                id: "main-page-4",
                image: AnimeArcadeImg4,
            },
            {
                id: "main-page-5",
                image: AnimeArcadeImg5,
            },
            {
                id: "main-page-6",
                image: AnimeArcadeImg6,
            },
            {
                id: "main-page-7",
                image: AnimeArcadeImg7,
            },
        ],
    },
    {
        id: "sri-raghava-steel-furnitures",
        name: "Sri Raghava Steel Furnitures",
        lable1: "Sri Raghava",
        lable2: "Steel Furnitures",
        slug: "sri-raghava-steel-furnitures",
        category: "uiux",
        platform: "web",
        subtitle: "Furniture E-Commerce Website",
        summary: "Sri Raghava Steel Furnitures is a digital furniture shopping experience designed to bring products, offers, and store information together in one accessible platform. The project focuses on intuitive product discovery, organized categories, efficient filtering, promotional presentation, and a streamlined shopping journey.",
        description: "Sri Raghava Steel Furnitures Is A Furniture E-Commerce Website Concept Designed To Create A Structured And Accessible Shopping Experience. It Combines Organized Product Discovery, Category-Based Navigation, Filtering, Promotional Displays, Store Location Access, And Account Management To Provide A Seamless Journey From Browsing Products To Purchase.",
        keyFeatures: [
            "Product Discovery: Organized Furniture Products With Clear Categories, Product Cards, Pricing, Offers, And Essential Product Information To Support Easy Browsing.",
            "Category Navigation: Structured Categories For Living Room, Bedroom, Dining, Kitchen, Study, And Office Furniture To Help Users Quickly Access Relevant Products.",
            "Product Filtering: Included Category-Based Navigation, Price Filters, Sorting Options, And Product Counts To Make Product Exploration More Efficient.",
            "Promotional Design: Designed Promotional Banners And Offer Sections To Highlight Seasonal Deals, Discounts, And Featured Furniture Products.",
            "Store Locator: Integrated A Dedicated Store Location Section With An Interactive Map, Address Details, And Directions To Help Customers Locate The Store.",
            "Account Experience: Created Login And Sign-Up Interfaces With Password Recovery And Google Sign-In Options For A Convenient Account Management Experience.",
            "Responsive Shopping Experience: Structured The Interface Around Clear Navigation, Product-Focused Layouts, And Accessible Interactions To Support A Seamless Furniture Shopping Journey."
        ],
        liveLink: "https://sri-raghava-steel-furniture.web.app",
        heroImage: SriRaghavaSteelFurnituresMainImg,
        macbookScreenImage: SriRaghavaSteelFurnituresMainImg,
        thumbnailImage: SriRaghavaSteelFurnituresMainImg,
        mainPages: [
            {
                id: "main-page-1",
                image: SriRaghavaSteelFurnituresImg1,
            },
            {
                id: "main-page-2",
                image: SriRaghavaSteelFurnituresImg2,
            },
            {
                id: "main-page-3",
                image: SriRaghavaSteelFurnituresImg3,
            },
            {
                id: "main-page-4",
                image: SriRaghavaSteelFurnituresImg4,
            },
            {
                id: "main-page-5",
                image: SriRaghavaSteelFurnituresImg5,
            },
            {
                id: "main-page-6",
                image: SriRaghavaSteelFurnituresImg6,
            },
            {
                id: "main-page-7",
                image: SriRaghavaSteelFurnituresImg7,
            },
            {
                id: "main-page-8",
                image: SriRaghavaSteelFurnituresImg8,
            },
            {
                id: "main-page-9",
                image: SriRaghavaSteelFurnituresImg9,
            },
        ],
    },
    {
        id: "fitness-care",
        name: "Fitness Care",
        lable1: "Fitness",
        lable2: "Care",
        slug: "fitnesscare",
        category: "uiux",
        platform: "mobile",
        subtitle: "Fitness & Wellness Mobile App",
        summary: "Fitness Care is a fitness and wellness mobile app concept designed to make workout planning, exercise tracking, and progress monitoring simple, engaging, and intuitive. The project focuses on personalized onboarding, structured workout routines, accessible fitness information, and a motivating experience that helps users stay consistent with their fitness goals.",
        description: "Fitness Care Is A Wellness-Focused Mobile App Concept Designed To Bring Workouts, Fitness Goals, And Progress Tracking Into One Streamlined Experience. It Combines Personalized Onboarding, Structured Exercises, Progress Visualization, And Profile Management To Create A Motivating And Accessible Fitness Journey.",
        keyFeatures: [
            "Personalized Onboarding: Created A Simple Onboarding Flow To Collect Essential User Details Such As Gender, Date Of Birth, Weight, And Height For A More Personalized Experience.",
            "Workout Planning: Organized Exercises Into Structured Sets With Repetitions, Duration, Rest Periods, Difficulty Levels, And Estimated Calorie Burn.",
            "Exercise Experience: Designed Clear And Focused Exercise Screens To Help Users Follow Their Workout Routines With Minimal Friction.",
            "Progress Tracking: Presented Fitness Statistics, Charts, And Goal-Based Indicators To Help Users Understand And Monitor Their Progress.",
            "Profile Management: Structured Personal Data, Achievements, Activity History, And Workout Progress Within An Accessible Profile Interface.",
            "Motivational Experience: Incorporated Illustrations, Workout Completion Screens, And Clear Calls To Action To Create An Encouraging And Rewarding Fitness Journey."
        ],
        liveLink: "https://www.figma.com/proto/wiSJvzj5pv8e1tvxPJHlP5/Fitness-Tracker-app-UI?node-id=1-2&p=f&viewport=237%2C438%2C0.18&t=CTS13l56ojblyJAr-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A103&page-id=0%3A1",
        heroImage: FitnessCareMainImg,
        macbookScreenImage: FitnessCareMainImg,
        thumbnailImage: FitnessCareMainImg,
        mainPages: [
            {
                id: "main-page-1",
                image: FitnessCareMainImg,
            },
            {
                id: "main-page-2",
                image: FitnessCareImg1,
            },
            {
                id: "main-page-3",
                image: FitnessCareImg2,
            },
            {
                id: "main-page-4",
                image: FitnessCareImg3,
            },
            {
                id: "main-page-5",
                image: FitnessCareImg4,
            },
            {
                id: "main-page-6",
                image: FitnessCareImg5,
            },
            {
                id: "main-page-7",
                image: FitnessCareImg6,
            },
        ],
    },
];



export function getUIUXProjectBySlug(slug: string): UIUXProject | undefined {
    return UIUX_PROJECTS.find((proj) => proj.slug === slug);
}
