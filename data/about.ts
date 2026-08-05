export interface AboutItem {
  id: string;
  slug: string;
  title: string;
  cover: string;
  description: string;
}

// TODO: cover image ar description real content diye replace koro
export const ABOUT_ITEMS: AboutItem[] = [
  {
    id: "education",
    slug: "education",
    title: "Education",
    cover: "/files/holiday-vibes/thum1.jpg",
    description: "Academic background ar degree-r details.",
  },
  {
    id: "experience",
    slug: "experience",
    title: "Experience",
    cover: "/images/thum2.jpg",
    description: "Work experience ar job history.",
  },
  {
    id: "certification",
    slug: "certification",
    title: "Certification",
    cover: "/images/thum3.jpg",
    description: "Certifications ar courses.",
  },
  {
    id: "cv",
    slug: "cv",
    title: "CV",
    cover: "/images/thum4.jpg",
    description: "CV / resume download link.",
  },
];
