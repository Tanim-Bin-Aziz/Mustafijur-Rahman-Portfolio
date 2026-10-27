"use client";

import { useState, useEffect, useRef } from "react";
import { X, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { VideoItem } from "@/data/video";

export default function SingleVideoPage({ item }: { item: VideoItem }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isClickMode = item.mode === "click-fullscreen";

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAdmin(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !fullscreen) return;
    const onTime = () => {
      setProgress(v.currentTime);
      setDuration(v.duration || 0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [fullscreen]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Number(e.target.value);
    setProgress(v.currentTime);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <main className="bg-[#09090a] min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight mb-10 text-[#F4EEE3]">
          {item.title}
        </h1>

        <div
          className={`group relative w-full flex items-center justify-center rounded-2xl overflow-hidden border border-white/10 bg-black ${
            isClickMode ? "cursor-pointer" : ""
          }`}
          onClick={() => isClickMode && setFullscreen(true)}
        >
          <video
            src={item.videoSrc}
            className="w-full h-auto max-h-[85vh] object-contain"
            controls
            controlsList={isAdmin ? "nofullscreen" : "nodownload nofullscreen"}
            disablePictureInPicture={!isAdmin}
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

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreen(true);
            }}
            aria-label="Fullscreen"
            className="absolute top-3 right-3 z-10 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-[#8db355] hover:text-black"
          >
            Fullscreen
          </button>
        </div>

        <p className="mt-6 text-[#F4EEE3]/60 max-w-2xl">{item.description}</p>
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-[9999] bg-black flex flex-col"
          onClick={() => setFullscreen(false)}
        >
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0 bg-black/80"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-serif italic text-[#F4EEE3] text-lg">
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

          <div
            className="relative flex-1 overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              src={item.videoSrc}
              className="absolute inset-0 h-full w-full"
              style={{ objectFit: "contain" }}
              autoPlay
              muted={muted}
              playsInline
              onLoadedMetadata={() => {
                if (videoRef.current) setDuration(videoRef.current.duration || 0);
              }}
            />
          </div>

          {/* Always-visible control bar */}
          <div
            className="flex items-center gap-3 px-4 py-3 bg-black/80 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={togglePlay}
              className="p-2 text-white hover:text-[#8db355]"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause size={20} /> : <Play size={20} fill="white" />}
            </button>

            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={progress}
              onChange={seek}
              className="flex-1 accent-[#8db355]"
            />

            <span className="font-mono text-xs text-white/70 min-w-[80px] text-right">
              {formatTime(progress)} / {formatTime(duration)}
            </span>

            <button
              type="button"
              onClick={toggleMute}
              className="p-2 text-white hover:text-[#8db355]"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function formatTime(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
