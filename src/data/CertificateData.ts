import { StaticImageData } from "next/image";

// Tools & Technologies Logos "Where I’ve Learned & Earned"
import Google_Logo from "@/assets/Logos/Google-logo.png";
import Figma_Logo from "@/assets/Logos/Figama-logo.png";
import Canva_Logo from "@/assets/Logos/Canva-logo.png";
import Coursera_Logo from "@/assets/Logos/Coursera-logo.png";
import Framer_Logo from "@/assets/Logos/Framer-logo.png";
import TCS_Logo from "@/assets/Logos/TCS-logo.png";
import TCS_NQT_Logo from "@/assets/Logos/TCS-NQT-logo.png";
import Great_Learning_Logo from "@/assets/Logos/Great-Learning-logo.png";
import LeWagon_Logo from "@/assets/Logos/Le-Wagon-logo.png";
import Simpli_Learn_Logo from "@/assets/Logos/Simpli-Learn-logo.png";
import Adobe_Photoshop_Logo from "@/assets/Logos/Adobe-Photoshop-logo.png";
import Adobe_Illustrator_Logo from "@/assets/Logos/Adobe-Illustrator-logo.png";
import Adobe_Indesign_Logo from "@/assets/Logos/Adobe-Indesign-logo.png";
import Adobe_Xd_Logo from "@/assets/Logos/Adobe-Xd-logo.png";
import IEEE_Logo from "@/assets/Logos/IEEE-logo.png";
import NPTEL_Logo from "@/assets/Logos/NPTEL-logo.png";

// Certificate images
import Google_Certificate_image_1 from "@/assets/Certificates/Google-Certificate-1.png";
import Google_Certificate_image_2 from "@/assets/Certificates/Google-Certificate-2.png";
import Google_Certificate_image_3 from "@/assets/Certificates/Google-Certificate-3.png";
import Google_Certificate_image_4 from "@/assets/Certificates/Google-Certificate-4.png";
import Google_Certificate_image_5 from "@/assets/Certificates/Google-Certificate-5.png";
import Google_Certificate_image_6 from "@/assets/Certificates/Google-Certificate-6.png";
import Google_Certificate_image_7 from "@/assets/Certificates/Google-Certificate-7.png";
import Canva_Bootcamp_Certificate_image from "@/assets/Certificates/Canva-Bootcamp-Certificate-1.png";
import GreatLearning_Certificate_image from "@/assets/Certificates/Great-Learning-Certificate.jpg";
import LeWagon_Certificate_image from "@/assets/Certificates/Le-wagon-Certificate.png";
import Simpli_Learn_Certificate_image from "@/assets/Certificates/Simpli-Learn-Certificate.png";
import NPTEL_Certificate_image from "@/assets/Certificates/NPTEL-Certificate.png";
import TCS_NQT_Certificate_image from "@/assets/Certificates/TCS-NQT-IT-Score-Mail.png";
import IEEE_Project_Expo_image from "@/assets/Certificates/IEEE-Project-Expo-image.jpeg";

/* ============================================================
   TYPES
   ============================================================ */

export interface CertificateCard {
    id: string;
    title: string;
    description: string;
    image: StaticImageData;
    logo: StaticImageData;
    credentialid?: string;
    certificate_link?: string;
}

export interface MarqueeLogo {
    id: string;
    name: string;
    logo: StaticImageData;
}

/* ============================================================
   CERTIFICATE CARDS DATA
   ============================================================ */

export const certificate_cards: CertificateCard[] = [
    {
        id: "cert-google-1",
        title: "Foundations of User Experience (UX) Design",
        description: "Built foundational knowledge of UX design, including user-centered design principles and the UX process. Developed an understanding of how to identify user needs and create effective design solutions.",
        image: Google_Certificate_image_1,
        logo: Google_Logo,
        // credentialid: "GGL-UX-01",
    },
    {
        id: "cert-google-2",
        title: "Start the UX Design Process: Empathize, Define & Ideate",
        description: "Learned to apply empathy, problem definition, and ideation to solve user-centered design challenges. Explored methods for understanding users and generating meaningful design concepts.",
        image: Google_Certificate_image_2,
        logo: Google_Logo,
        // credentialid: "GGL-UX-02",
    },
    {
        id: "cert-google-3",
        title: "Build Wireframes & Low-Fidelity Prototypes",
        description: "Learned to translate user needs and ideas into wireframes and low-fidelity prototypes. Practiced structuring layouts and testing early design concepts before development.",
        image: Google_Certificate_image_3,
        logo: Google_Logo,
        // credentialid: "GGL-UX-03",
    },
    {
        id: "cert-google-4",
        title: "Conduct UX Research & Test Early Concepts",
        description: "Developed skills in UX research, user interviews, and testing early design concepts. Learned to gather user feedback and use insights to improve design decisions.",
        image: Google_Certificate_image_4,
        logo: Google_Logo,
        // credentialid: "GGL-UX-04",
    },
    {
        id: "cert-google-5",
        title: "Create High-Fidelity Designs & Prototypes in Figma",
        description: "Learned to transform design concepts into detailed high-fidelity interfaces and interactive prototypes. Developed practical experience using Figma to create polished, user-centered designs.",
        image: Google_Certificate_image_5,
        logo: Google_Logo,
        // credentialid: "GGL-UX-05",
    },
    {
        id: "cert-google-6",
        title: "Design a User Experience for Social Good & Prepare for Jobs",
        description: "Applied UX design principles to develop solutions focused on real-world social needs and user impact. Also strengthened portfolio, presentation, and job-readiness skills for a UX design career.",
        image: Google_Certificate_image_6,
        logo: Google_Logo,
        // credentialid: "GGL-UX-06",
    },
    {
        id: "cert-google-7",
        title: "Build Dynamic User Interfaces (UI) for Websites",
        description: "Developed skills for creating responsive and dynamic user interfaces for modern websites. Learned to apply UI design principles to build engaging and functional web experiences.",
        image: Google_Certificate_image_7,
        logo: Google_Logo,
        // credentialid: "GGL-UX-07",
    },
    {
        id: "cert-canva",
        title: "Canva Design Bootcamp Certification",
        description: "Completed a 3-day Canva Bootcamp focused on developing practical skills in visual design and Canva. Gained hands-on experience creating engaging and visually appealing digital content.",
        image: Canva_Bootcamp_Certificate_image,
        logo: Canva_Logo,
        credentialid: "LUECNVAPR1247",
    },
    {
        id: "cert-greatlearning",
        title: "UI/UX for Beginners & Digital Product Design",
        description: "Completed a beginner-level UI/UX course covering essential principles of user interface and user experience design. Built foundational knowledge of designing intuitive, user-friendly digital experiences.",
        image: GreatLearning_Certificate_image,
        logo: Great_Learning_Logo,
        // credentialid: "300184803",
    },
    {
        id: "cert-lewagon",
        title: "Introduction to UI/UX Design",
        description: "Completed an introductory UI/UX design course covering fundamental concepts and design principles. Gained a basic understanding of user interfaces, user experience, and digital product design.",
        image: LeWagon_Certificate_image,
        logo: LeWagon_Logo,
        credentialid: "kavlkpjn2c",
    },
    {
        id: "cert-simplilearn",
        title: "Introduction to Graphic Design & Basics of UI/UX",
        description: "Successfully completed Simplilearn SkillUp’s online course covering fundamental graphic design principles and UI/UX concepts. Gained foundational knowledge in creating user-focused designs and advancing visual design skills.",
        image: Simpli_Learn_Certificate_image,
        logo: Simpli_Learn_Logo,
        // credentialid: "5119915",
    },
    {
        id: "cert-nptel",
        title: "Design & Implementation of Human-Computer Interfaces",
        description: "Elite NPTEL Certification from IIT Guwahati on human-computer interaction, cognitive models, and interface engineering.",
        image: NPTEL_Certificate_image,
        logo: NPTEL_Logo,
        credentialid: "NPTEL24CS126S1356300615",
    },
    {
        id: "cert-tcs-nqt",
        title: "TCS National Qualifier Test (NQT)",
        description: "Completed a 12-week NPTEL course focused on designing and implementing human-computer interfaces. Achieved a consolidated score of 67%, demonstrating knowledge of HCI concepts and interface design.",
        image: TCS_NQT_Certificate_image,
        logo: TCS_NQT_Logo,
        credentialid: "TCS-NQT-2026",
    },
    {
        id: "cert-ieee",
        title: "Runner-Up – Nexus 2K24 IEEE Project Expo",
        description: "Secured Runner-Up among 120+ teams at Veltech University’s Nexus 2K24 Project Expo for developing a Deep Fake Image Detection solution using AI/ML to combat digital misinformation.",
        image: IEEE_Project_Expo_image,
        logo: IEEE_Logo,
        credentialid: "IEEE-EXPO-2024",
    },
];

/* ============================================================
   LOGO MARQUEE DATA ("Where I’ve Learned & Earned")
   ============================================================ */

export const logo_marquee: MarqueeLogo[] = [
    {
        id: "logo-google",
        name: "Google",
        logo: Google_Logo,
    },
    {
        id: "logo-figma",
        name: "Figma",
        logo: Figma_Logo,
    },
    {
        id: "logo-canva",
        name: "Canva",
        logo: Canva_Logo,
    },
    {
        id: "logo-coursera",
        name: "Coursera",
        logo: Coursera_Logo,
    },
    {
        id: "logo-framer",
        name: "Framer",
        logo: Framer_Logo,
    },
    {
        id: "logo-tcs",
        name: "TCS",
        logo: TCS_Logo,
    },
    {
        id: "logo-tcs-nqt",
        name: "TCS NQT",
        logo: TCS_NQT_Logo,
    },
    {
        id: "logo-great-learning",
        name: "Great Learning",
        logo: Great_Learning_Logo,
    },
    {
        id: "logo-le-wagon",
        name: "Le Wagon",
        logo: LeWagon_Logo,
    },
    {
        id: "logo-simplilearn",
        name: "SimpliLearn",
        logo: Simpli_Learn_Logo,
    },
    {
        id: "logo-adobe-photoshop",
        name: "Adobe Photoshop",
        logo: Adobe_Photoshop_Logo,
    },
    {
        id: "logo-adobe-illustrator",
        name: "Adobe Illustrator",
        logo: Adobe_Illustrator_Logo,
    },
    {
        id: "logo-adobe-indesign",
        name: "Adobe InDesign",
        logo: Adobe_Indesign_Logo,
    },
    {
        id: "logo-adobe-xd",
        name: "Adobe XD",
        logo: Adobe_Xd_Logo,
    },
    {
        id: "logo-ieee",
        name: "IEEE",
        logo: IEEE_Logo,
    },
    {
        id: "logo-nptel",
        name: "NPTEL",
        logo: NPTEL_Logo,
    },
];
