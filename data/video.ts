export interface VideoItem {
  id: string;
  slug: string;
  title: string;
  cover: string;
  videoSrc: string; // .mp4 path
  description: string;
  mode: "autoplay" | "click-fullscreen"; // autoplay = loop-e cholte thakbe, click-fullscreen = click korle fullscreen player khulbe
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
    mode: "autoplay",
  },
  {
    id: "drapping-final-dress",
    slug: "drapping-final-dress",
    title: "Drapping Final Dress",
    cover: "/images/thum2.jpg",
    videoSrc: "/video/drapping-final-dress.mp4",
    description: "Draping process-er video.",
    mode: "autoplay",
  },
  {
    id: "studio-collection",
    slug: "studio-collection",
    title: "Studio Collection",
    cover: "/images/thum3.jpg",
    videoSrc: "/video/studio-collection.mp4",
    description: "Studio collection-er video.",
    mode: "click-fullscreen",
  },
];

/* ---------------------------------------------------------
   CLO 3D ar Additional Work — video gallery (sort/search/folder)
--------------------------------------------------------- */
export interface VideoFolder {
  id: string;
  name: string;
}

export interface VideoGalleryItem {
  id: string;
  title: string;
  src: string; // video path
  date: string; // YYYY-MM-DD, sort-er jonno
  folderId: string;
}

export const CLO3D_FOLDERS: VideoFolder[] = [
  { id: "all", name: "All Videos" },
  { id: "garments", name: "Garment Simulations" },
  { id: "fabric", name: "Fabric Tests" },
];

// TODO: real CLO 3D render video-gula diye replace koro
export const CLO3D_VIDEOS: VideoGalleryItem[] = [
  {
    id: "clo-1",
    title: "CLO 3D Sample 01",
    src: "/video/1.mp4",
    date: "2026-02-15",
    folderId: "garments",
  },
  {
    id: "clo-2",
    title: "CLO 3D Sample 02",
    src: "/video/1.mp4",
    date: "2026-01-20",
    folderId: "fabric",
  },
];

export const ADDITIONAL_WORK_FOLDERS: VideoFolder[] = [
  { id: "all", name: "All Videos" },
  { id: "misc", name: "Miscellaneous" },
];

// TODO: real additional-work video-gula diye replace koro
export const ADDITIONAL_WORK_VIDEOS: VideoGalleryItem[] = [
  {
    id: "aw-1",
    title: "Additional Work 01",
    src: "/video/1.mp4",
    date: "2026-02-01",
    folderId: "misc",
  },
];
