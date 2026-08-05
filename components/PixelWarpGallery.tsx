"use client";

import { useRef } from "react";

interface GalleryItem {
  label?: string;
  video: string;
}

interface PixelWarpGalleryProps {
  items?: GalleryItem[];
}

const DEFAULT_ITEMS: GalleryItem[] = [
  {
    label: "Motion 01",
    video: "/video/1.mp4",
  },
  {
    label: "Motion 02",
    video: "/videos/motion-02.mp4",
  },
  {
    label: "Motion 03",
    video: "/videos/motion-03.mp4",
  },
  {
    label: "Motion 04",
    video: "/videos/motion-04.mp4",
  },
  {
    label: "Motion 05",
    video: "/videos/motion-05.mp4",
  },
];

const CARD_LAYOUT = [
  { height: 560, marginBottom: 0 },
  { height: 630, marginBottom: 70 },
  { height: 580, marginBottom: 20 },
  { height: 650, marginBottom: 90 },
  { height: 560, marginBottom: 0 },
];

function WarpCard({ item, index }: { item: GalleryItem; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const layout = CARD_LAYOUT[index % CARD_LAYOUT.length];

  return (
    <div
      className="relative w-[210px] overflow-hidden rounded-3xl border border-[#2a2f3a] bg-[##09090a] cursor-pointer max-[900px]:w-[150px] max-[900px]:!h-[400px] max-[900px]:!mb-0"
      style={{
        height: layout.height,
        marginBottom: layout.marginBottom,
      }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={item.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {item.label && (
        <div className="absolute bottom-[18px] left-0 right-0 z-10 text-center text-[13px] tracking-wide text-white pointer-events-none [text-shadow:0_2px_8px_rgba(0,0,0,.7)]">
          {item.label}
        </div>
      )}
    </div>
  );
}

export default function PixelWarpGallery({
  items = DEFAULT_ITEMS,
}: PixelWarpGalleryProps) {
  return (
    <section className="bg-[#09090a] px-6 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-4xl font-bold text-white">Showcase</h2>

        <p className="mt-4 text-gray-400">
          Each card plays a looping background video.
        </p>
      </div>

      <div className="mx-auto flex max-w-[1300px] flex-wrap items-end justify-center gap-5">
        {items.map((item, idx) => (
          <WarpCard key={item.label ?? idx} item={item} index={idx} />
        ))}
      </div>
    </section>
  );
}
