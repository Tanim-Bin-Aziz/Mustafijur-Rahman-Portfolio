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
    id: "profile",
    slug: "profile",
    title: "Profile",
    cover: "/images/thum3.jpg",
    description: "About me and my background.",
  },
  {
    id: "cv",
    slug: "cv",
    title: "CV",
    cover: "/images/thum4.jpg",
    description: "CV / resume download link.",
  },
];
