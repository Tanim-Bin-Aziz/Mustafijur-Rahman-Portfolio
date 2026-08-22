"use client";

import { useState } from "react";
import { X, Play } from "lucide-react";
import type { VideoItem } from "@/data/video";

export default function SingleVideoPage({ item }: { item: VideoItem }) {
  const [fullscreen, setFullscreen] = useState(false);
  const isClickMode = item.mode === "click-fullscreen";

  return (
    <main className="bg-[#09090a] min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight mb-10 text-[#F4EEE3]">
          {item.title}
        </h1>

        <div
          className={`group relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black ${
            isClickMode ? "cursor-pointer" : ""
          }`}
          onClick={() => isClickMode && setFullscreen(true)}
        >
          <video
            src={item.videoSrc}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />

          {isClickMode && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 rounded-full bg-[#8db355]/90 flex items-center justify-center shadow-xl">
                <Play className="w-7 h-7 text-black ml-1" fill="black" />
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-[#F4EEE3]/60 max-w-2xl">{item.description}</p>
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title} player`}
        >
          <div className="flex items-center justify-between px-6 py-4 shrink-0">
            <span className="font-serif italic text-[#F4EEE3] text-xl">
              {item.title}
            </span>
            <button
              onClick={() => setFullscreen(false)}
              aria-label="Close"
              className="p-2 text-[#F4EEE3]/70 hover:text-[#8db355] rounded-full hover:bg-white/5"
            >
              <X size={22} />
            </button>
          </div>
          <div className="relative flex-1 flex items-center justify-center px-4 pb-6">
            <video
              src={item.videoSrc}
              className="max-w-full max-h-full rounded-md"
              controls
              autoPlay
            />
          </div>
        </div>
      )}
    </main>
  );
}
