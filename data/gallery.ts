// @/data/gallery.ts

export interface GalleryImage {
  id: string;
  title: string;
  src: string;
  date: string; // YYYY-MM-DD
  folderId: string;
}

export interface Folder {
  id: string;
  name: string;
  icon?: string;
}

export const GALLERY_FOLDERS: Folder[] = [
  { id: "all", name: "All Photos" },
  { id: "studio", name: "Studio Collection" },
  { id: "holiday", name: "Holiday Vibes" },
  { id: "draping", name: "Draping Process" },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "1",
    title: "Editorial Shot 01",
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000",
    date: "2026-02-15",
    folderId: "studio",
  },
  {
    id: "2",
    title: "Beach Mood",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000",
    date: "2026-01-20",
    folderId: "holiday",
  },
  {
    id: "3",
    title: "Silk Draping Detail",
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000",
    date: "2026-02-10",
    folderId: "draping",
  },
  {
    id: "4",
    title: "Studio Portait Black",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000",
    date: "2026-03-01",
    folderId: "studio",
  },
  {
    id: "5",
    title: "Sunset Vibes",
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000",
    date: "2025-12-25",
    folderId: "holiday",
  },
];
