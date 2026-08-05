export interface VideoItem {
  id: string;
  slug: string;
  title: string;
  cover: string;
  videoSrc?: string; // .mp4 path, thakle detail page e player dekhabe
  description: string;
}

// TODO: cover image, videoSrc ar description real content diye replace koro
export const VIDEO_ITEMS: VideoItem[] = [
  {
    id: "final-collection",
    slug: "final-collection",
    title: "Final Collection",
    cover: "/files/holiday-vibes/thum1.jpg",
    videoSrc: "/video/final-collection.mp4",
    description: "Final collection-er video.",
  },
  {
    id: "drapping-final-dress",
    slug: "drapping-final-dress",
    title: "Drapping Final Dress",
    cover: "/images/thum2.jpg",
    videoSrc: "/video/drapping-final-dress.mp4",
    description: "Draping process-er video.",
  },
  {
    id: "studio-collection",
    slug: "studio-collection",
    title: "Studio Collection",
    cover: "/images/thum3.jpg",
    videoSrc: "/video/studio-collection.mp4",
    description: "Studio collection-er video.",
  },
  {
    id: "gallery",
    slug: "gallery",
    title: "Gallery",
    cover: "/images/thum4.jpg",
    videoSrc: "/video/gallery.mp4",
    description: "Gallery video.",
  },
];
