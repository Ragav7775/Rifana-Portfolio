
import { EditorialProject } from "./BookCoverProjectData";

// Asset Imports for Poster Designs
// import Poster1 from "@/assets/Projects/Poster/Poster-Design-1.png";
// import Poster2 from "@/assets/Projects/Poster/Poster-Design-2.png";
// import Poster3 from "@/assets/Projects/Poster/Poster-Design-3.png";

export const POSTER_PROJECTS: EditorialProject[] = [
    // {
    //     id: "bauhaus-resonance-festival",
    //     slug: "bauhaus-resonance-festival",
    //     title: "Bauhaus Resonance 2024",
    //     metaLabel: "Client :",
    //     metaValue: "Berlin Modernist Institute",
    //     description:
    //         "Exhibition poster commemorating a century of Weimar constructivism. Asymmetrical grid tensions, primary color geometry, and monumental grotesque typography collide to articulate form following emotional resonance.",
    //     coverImage: Poster1,
    //     category: "poster",
    //     tags: ["Exhibition", "Constructivism", "Typographic Grid"],
    //     year: "2024",
    // },
    // {
    //     id: "nocturne-jazz-sessions",
    //     slug: "nocturne-jazz-sessions",
    //     title: "Nocturne Live Jazz",
    //     metaLabel: "Client :",
    //     metaValue: "Blue Horizon Lounge",
    //     description:
    //         "A series of silkscreened gig posters for weekly acoustic improvisations. Fluid saxophone silhouettes emerge from midnight indigo gradients, accented by glowing amber typography.",
    //     coverImage: Poster2,
    //     category: "poster",
    //     tags: ["Live Music", "Silkscreen Print", "Jazz & Blues"],
    //     year: "2024",
    // },
    // {
    //     id: "solarpunk-futures-summit",
    //     slug: "solarpunk-futures-summit",
    //     title: "Solarpunk Futures Summit",
    //     metaLabel: "Client :",
    //     metaValue: "Ecological Design Council",
    //     description:
    //         "A visionary conference poster imagining biophilic vertical forestry and renewable architectural futures. Blends botanical illustration with futuristic modular structural forms.",
    //     coverImage: Poster3,
    //     category: "poster",
    //     tags: ["Conference", "Solarpunk", "Biophilic Architecture"],
    //     year: "2024",
    // },
    // {
    //     id: "cinephile-retrospective-kyoto",
    //     slug: "cinephile-retrospective-kyoto",
    //     title: "Kyoto Cinema Retrospective",
    //     metaLabel: "Client :",
    //     metaValue: "Kansai Film Archives",
    //     description:
    //         "A minimalist film festival poster paying homage to mid-century Japanese cinema classics. Sparse negative space, vertical kanji-inspired lettering, and deep scarlet ink accents.",
    //     coverImage: Poster1,
    //     category: "poster",
    //     tags: ["Film Festival", "Editorial Typography", "Minimalist"],
    //     year: "2023",
    // },
    // {
    //     id: "electric-horizon-expo",
    //     slug: "electric-horizon-expo",
    //     title: "Electric Horizon Expo",
    //     metaLabel: "Client :",
    //     metaValue: "Nordic Clean Mobility",
    //     description:
    //         "High-contrast visual campaign celebrating zero-emission transit innovation across Northern Europe, structured on crisp isometric perspectives and radiant cyan gradients.",
    //     coverImage: Poster2,
    //     category: "poster",
    //     tags: ["Clean Tech", "Mobility Expo", "Nordic Design"],
    //     year: "2024",
    // },
    // {
    //     id: "botanical-monographs-exhibit",
    //     slug: "botanical-monographs-exhibit",
    //     title: "Botanical Monographs",
    //     metaLabel: "Client :",
    //     metaValue: "Royal Horticultural Gallery",
    //     description:
    //         "Fine-art exhibition poster featuring delicate copperplate botanical etchings, deckled paper borders, and archival serif typography celebrating heirloom flora.",
    //     coverImage: Poster3,
    //     category: "poster",
    //     tags: ["Botanical Art", "Etching", "Fine Art Print"],
    //     year: "2023",
    // },
    // {
    //     id: "avant-garde-theatre-fest",
    //     slug: "avant-garde-theatre-fest",
    //     title: "Metamorphosis Theater Fest",
    //     metaLabel: "Client :",
    //     metaValue: "Prague Experimental Stage",
    //     description:
    //         "Expressive theatrical poster visualizing psychological metamorphosis through fractured mirrored planes, dramatic chiaroscuro lighting, and bold distressed type.",
    //     coverImage: Poster1,
    //     category: "poster",
    //     tags: ["Theater", "Expressionist", "Chiaroscuro"],
    //     year: "2024",
    // },
    // {
    //     id: "planetary-horizons-symposium",
    //     slug: "planetary-horizons-symposium",
    //     title: "Planetary Horizons 2024",
    //     metaLabel: "Client :",
    //     metaValue: "Astrophysical Society",
    //     description:
    //         "Cosmological symposium key art portraying deep-field gravitational lensing and cosmic microwave background harmonics in radiant iridescent tones.",
    //     coverImage: Poster2,
    //     category: "poster",
    //     tags: ["Astrophysics", "Symposium", "Cosmic Harmonics"],
    //     year: "2024",
    // },
];

export function getPosterProjectBySlug(slug: string): EditorialProject | undefined {
    return POSTER_PROJECTS.find((proj) => proj.slug === slug);
}
