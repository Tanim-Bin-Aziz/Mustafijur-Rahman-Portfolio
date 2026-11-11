"use client";

import { useState } from "react";
import VideoLightbox from "@/components/VideoLightbox";

export interface VideoCardItem {
  id: string;
  src: string;
  title: string;
  caption?: string;
}

const PAGE_SIZE = 8;

export default function HomeVideoMerge({ videos }: { videos: VideoCardItem[] }) {
  const [active, setActive] = useState<{ src: string; label: string } | null>(
    null,
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (videos.length === 0) return null;

  const shown = videos.slice(0, visibleCount);
  const hasMore = visibleCount < videos.length;

  return (
    <>
      <section className="relative py-20 px-6 md:px-10 bg-[#0d0d0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight text-[#F4EEE3]">
              Videos
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6 px-2">
            {shown.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => setActive({ src: video.src, label: video.title })}
                className="w-full text-left sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                  <video
                    src={video.src}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                </div>
                {video.caption && (
                  <div className="mt-4 text-center font-serif italic text-xl text-[#F4EEE3]">
                    {video.caption}
                  </div>
                )}
              </button>
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm text-[#F4EEE3]/70 hover:text-[#8db355] hover:border-[#8db355]/50 transition-colors"
              >
                View more →
              </button>
            </div>
          )}
        </div>
      </section>

      {active && (
        <VideoLightbox
          src={active.src}
          label={active.label}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
