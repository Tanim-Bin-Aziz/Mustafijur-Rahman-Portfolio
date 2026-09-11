export interface Category {
  id: string;
  slug: string;
  title: string;
  cover: string;
  description: string;
}

export interface Project {
  id: string;
  slug: string;
  categorySlug: string; // kon category-r under-e ei project ta
  title: string;
  cover: string;
  projectType: string;
  date: string;
  location: string;
  description: string;
  pdfSrc: string; // ekta project = ekta pdf
  previewImages: string[]; // featured images, gallery e dekhabe
}

/* --------------------------------------------------------------
   Level 1: Categories — Portfolio e click korle ei 4ta card dekhabe
-------------------------------------------------------------- */
export const CATEGORIES: Category[] = [
  {
    id: "academic-hons",
    slug: "academic-hons",
    title: "Academic (Hons)",
    cover: "/files/holiday-vibes/thum1.jpg",
    description: "Academic (Hons)-er shob project ei jaigay pawa jabe.",
  },
  {
    id: "professional",
    slug: "professional",
    title: "Professional",
    cover: "/images/thum2.jpg",
    description: "Professional kaj-er collection.",
  },
  {
    id: "additional-work",
    slug: "additional-work",
    title: "Additional Work",
    cover: "/images/thum3.jpg",
    description: "Additional/extra project work.",
  },
  {
    id: "gallery",
    slug: "gallery",
    title: "Gallery",
    cover: "/images/thum4.jpg",
    description: "Gallery showcase.",
  },
];

/* --------------------------------------------------------------
   Level 2: Projects — kono category card-e click korle
   ei list theke matching categorySlug-er project card gula dekhabe
   Protyek category-te 3ta kore project rakha hoyeche (1ta real,
   baki gula TODO placeholder — tumi real content diye replace koro)
-------------------------------------------------------------- */
export const PROJECTS: Project[] = [
  /* ---------------- Academic (Hons) ---------------- */
  {
    id: "holiday-vibes",
    slug: "holiday-vibes",
    categorySlug: "academic-hons",
    title: "Holiday Vibes",
    cover: "/files/holiday-vibes/thum1.jpg",
    projectType: "Illustrations, Flats, and Print work",
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
    id: "academic-project-2",
    slug: "academic-project-2",
    categorySlug: "academic-hons",
    title: "Academic Project 2", // TODO: real title
    cover: "/images/thum2.jpg",
    projectType: "TODO — project type",
    date: "TODO",
    location: "TODO",
    description: "TODO — ei project-er real description add koro.",
    pdfSrc: "/files/holiday-vibes/RMG development.pdf", // TODO: real pdf
    previewImages: ["/images/img1.jpg", "/images/img2.jpg"],
  },
  {
    id: "academic-project-3",
    slug: "academic-project-3",
    categorySlug: "academic-hons",
    title: "Academic Project 3", // TODO: real title
    cover: "/images/thum3.jpg",
    projectType: "TODO — project type",
    date: "TODO",
    location: "TODO",
    description: "TODO — ei project-er real description add koro.",
    pdfSrc: "/files/holiday-vibes/RMG development.pdf", // TODO: real pdf
    previewImages: ["/images/img3.jpg", "/images/img4.jpg"],
  },

  /* ---------------- Professional ---------------- */
  {
    id: "urban-essentials",
    slug: "urban-essentials",
    categorySlug: "professional",
    title: "Urban Essentials",
    cover: "/images/thum2.jpg",
    projectType: "Fashion Collection, Tech Pack, Print Design",
    date: "January 2026",
    location: "Dhaka, BD",
    description:
      "A modern streetwear-inspired capsule collection created for young adults. The project includes concept development, print exploration, technical packs, and presentation boards for production.",
    pdfSrc: "/files/urban-essentials/tech-pack.pdf",
    previewImages: [
      "/images/img1.jpg",
      "/images/img2.jpg",
      "/images/img3.jpg",
      "/images/img4.jpg",
    ],
  },
  {
    id: "professional-project-2",
    slug: "professional-project-2",
    categorySlug: "professional",
    title: "Professional Project 2", // TODO
    cover: "/images/thum3.jpg",
    projectType: "TODO — project type",
    date: "TODO",
    location: "TODO",
    description: "TODO — ei project-er real description add koro.",
    pdfSrc: "/files/urban-essentials/tech-pack.pdf", // TODO
    previewImages: ["/images/img5.jpg", "/images/img1.jpg"],
  },
  {
    id: "professional-project-3",
    slug: "professional-project-3",
    categorySlug: "professional",
    title: "Professional Project 3", // TODO
    cover: "/images/thum4.jpg",
    projectType: "TODO — project type",
    date: "TODO",
    location: "TODO",
    description: "TODO — ei project-er real description add koro.",
    pdfSrc: "/files/urban-essentials/tech-pack.pdf", // TODO
    previewImages: ["/images/img2.jpg", "/images/img3.jpg"],
  },

  /* ---------------- Additional Work ---------------- */
  {
    id: "coastal-retreat",
    slug: "coastal-retreat",
    categorySlug: "additional-work",
    title: "Coastal Retreat",
    cover: "/images/thum3.jpg",
    projectType: "Resort Wear, Textile Design, Collection Development",
    date: "May 2026",
    location: "Cox's Bazar, BD",
    description:
      "A resort-inspired apparel collection featuring lightweight fabrics, tropical prints, and relaxed silhouettes. The project covers mood boards, print development, garment illustrations, and production-ready documentation.",
    pdfSrc: "/files/coastal-retreat/collection-book.pdf",
    previewImages: [
      "/images/img4.jpg",
      "/images/img5.jpg",
      "/images/img1.jpg",
      "/images/img2.jpg",
    ],
  },
  {
    id: "additional-project-2",
    slug: "additional-project-2",
    categorySlug: "additional-work",
    title: "Additional Project 2", // TODO
    cover: "/images/thum4.jpg",
    projectType: "TODO — project type",
    date: "TODO",
    location: "TODO",
    description: "TODO — ei project-er real description add koro.",
    pdfSrc: "/files/coastal-retreat/collection-book.pdf", // TODO
    previewImages: ["/images/img3.jpg", "/images/img4.jpg"],
  },
  {
    id: "additional-project-3",
    slug: "additional-project-3",
    categorySlug: "additional-work",
    title: "Additional Project 3", // TODO
    cover: "/images/thum2.jpg",
    projectType: "TODO — project type",
    date: "TODO",
    location: "TODO",
    description: "TODO — ei project-er real description add koro.",
    pdfSrc: "/files/coastal-retreat/collection-book.pdf", // TODO
    previewImages: ["/images/img5.jpg", "/images/img1.jpg"],
  },

  /* ---------------- Gallery ---------------- */
  {
    id: "gallery-1",
    slug: "gallery-1",
    categorySlug: "gallery",
    title: "Gallery Showcase", // TODO
    cover: "/images/thum4.jpg",
    projectType: "TODO — project type",
    date: "TODO",
    location: "TODO",
    description: "TODO — ei project-er real description add koro.",
    pdfSrc: "/files/coastal-retreat/collection-book.pdf", // TODO
    previewImages: ["/images/img1.jpg", "/images/img3.jpg"],
  },
  {
    id: "gallery-2",
    slug: "gallery-2",
    categorySlug: "gallery",
    title: "Gallery 2", // TODO
    cover: "/images/thum2.jpg",
    projectType: "TODO — project type",
    date: "TODO",
    location: "TODO",
    description: "TODO — ei project-er real description add koro.",
    pdfSrc: "/files/coastal-retreat/collection-book.pdf", // TODO
    previewImages: ["/images/img4.jpg", "/images/img2.jpg"],
  },
  {
    id: "gallery-3",
    slug: "gallery-3",
    categorySlug: "gallery",
    title: "Gallery 3", // TODO
    cover: "/images/thum3.jpg",
    projectType: "TODO — project type",
    date: "TODO",
    location: "TODO",
    description: "TODO — ei project-er real description add koro.",
    pdfSrc: "/files/coastal-retreat/collection-book.pdf", // TODO
    previewImages: ["/images/img5.jpg", "/images/img1.jpg"],
  },
];

/* --------------------------------------------------------------
   Helpers
-------------------------------------------------------------- */
export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getProjectsByCategory(categorySlug: string) {
  return PROJECTS.filter((p) => p.categorySlug === categorySlug);
}

export function getProject(categorySlug: string, slug: string) {
  return PROJECTS.find(
    (p) => p.categorySlug === categorySlug && p.slug === slug,
  );
}
