export interface Project {
  id: string;
  slug: string;
  title: string;
  cover: string;
  // projectType: string;
  date: string;
  location: string;
  description: string;
  pdfSrc: string; // ekta project = ekta pdf
  previewImages: string[]; // featured images (4/5 ta), gallery e dekhabe
}

export const PROJECTS: Project[] = [
  {
    id: "holiday-vibes",
    slug: "holiday-vibes",
    title: "Academic (Hons)",
    cover: "/files/holiday-vibes/thum1.jpg",
    // projectType: "Illustrations, Flats, and Print work",
    date: "September 2025",
    location: "Fleetwood, BD",
    description:
      "This is a three-piece holiday collection that was designed to fit into a storefront's holiday collection for 2025. The main focus was on the printwork, which was all hand-designed using Procreate.",
    pdfSrc: "/files/holiday-vibes/RMG development.pdf",
    previewImages: [
      "/images/Swatch/1.png",
      "/images/Swatch/2.png",
      "/images/Swatch/3.png",
      "/images/Swatch/4.png",
    ],
  },
  {
    id: "urban-essentials",
    slug: "urban-essentials",
    title: "Professional",
    cover: "/images/thum2.jpg",
    // projectType: "Fashion Collection, Tech Pack, Print Design",
    date: "January 2026",
    location: "Dhaka, BD",
    description:
      "A modern streetwear-inspired capsule collection created for young adults. The project includes concept development, print exploration, technical packs, and presentation boards for production.",
    pdfSrc: "/files/urban-essentials/tech-pack.pdf",
    previewImages: [
      "/images/projects/urban-essentials/featured-1.webp",
      "/images/projects/urban-essentials/featured-2.webp",
      "/images/projects/urban-essentials/featured-3.webp",
      "/images/projects/urban-essentials/featured-4.webp",
    ],
  },
  {
    id: "coastal-retreat",
    slug: "coastal-retreat",
    title: "Additional Work",
    cover: "/images/thum3.jpg",
    // projectType: "Resort Wear, Textile Design, Collection Development",
    date: "May 2026",
    location: "Cox's Bazar, BD",
    description:
      "A resort-inspired apparel collection featuring lightweight fabrics, tropical prints, and relaxed silhouettes. The project covers mood boards, print development, garment illustrations, and production-ready documentation.",
    pdfSrc: "/files/coastal-retreat/collection-book.pdf",
    previewImages: [
      "/images/projects/coastal-retreat/featured-1.webp",
      "/images/projects/coastal-retreat/featured-2.webp",
      "/images/projects/coastal-retreat/featured-3.webp",
      "/images/projects/coastal-retreat/featured-4.webp",
    ],
  },
  {
    id: "Gallery",
    slug: "Gallery",
    title: "Gallery",
    cover: "/images/thum4.jpg",
    // projectType: "Resort Wear, Textile Design, Collection Development",
    date: "May 2026",
    location: "Cox's Bazar, BD",
    description:
      "A resort-inspired apparel collection featuring lightweight fabrics, tropical prints, and relaxed silhouettes. The project covers mood boards, print development, garment illustrations, and production-ready documentation.",
    pdfSrc: "/files/coastal-retreat/collection-book.pdf",
    previewImages: [
      "/images/projects/coastal-retreat/featured-1.webp",
      "/images/projects/coastal-retreat/featured-2.webp",
      "/images/projects/coastal-retreat/featured-3.webp",
      "/images/projects/coastal-retreat/featured-4.webp",
    ],
  },
];
