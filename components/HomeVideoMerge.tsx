"use client";

import { useState } from "react";
import VideoLightbox from "@/components/VideoLightbox";
import type { HomeVideoSection } from "@/components/HomeVideoSections";

export default function HomeVideoMerge({
  sections,
}: {
  sections: HomeVideoSection[];
}) {
  const visible = sections.filter((section) => section.videos.length > 0);
  const [active, setActive] = useState<{ src: string; label: string } | null>(
    null,
  );

  if (visible.length === 0) return null;

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
            {visible.map((section) => {
              const video = section.videos[0];
              if (!video) return null;
              return (
                <button
                  key={section.slug}
                  type="button"
                  onClick={() =>
                    setActive({ src: video.src, label: section.label })
                  }
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
                  <div className="mt-4 text-center font-serif italic text-xl text-[#F4EEE3]">
                    {section.label}
                  </div>
                </button>
              );
            })}
          </div>
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
