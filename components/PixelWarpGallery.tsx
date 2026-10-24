"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
];

const CARD_LAYOUT = [
  { height: 560, marginBottom: 0 },
  { height: 620, marginBottom: 70 },
  { height: 560, marginBottom: 0 },
  { height: 620, marginBottom: 70 },
  { height: 560, marginBottom: 0 },
  { height: 620, marginBottom: 70 },
  { height: 560, marginBottom: 0 },
];

function WarpCard({
  item,
  index,
  onSelect,
}: {
  item: GalleryItem;
  index: number;
  onSelect: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const layout = CARD_LAYOUT[index % CARD_LAYOUT.length];

  return (
    <div
      onClick={onSelect}
      className="relative w-[210px] flex-shrink-0 overflow-hidden rounded-3xl border border-[#2a2f3a] bg-[##09090a] cursor-pointer max-[900px]:w-[150px] max-[900px]:!h-[400px] max-[900px]:!mb-0"
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
        preload="metadata"
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
  const [active, setActive] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    if (active !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || active === null) return;
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
  }, [active]);

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

  const formatTime = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <section className="bg-[#09090a] px-6 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-4xl font-bold text-white">Showcase</h2>

        <p className="mt-4 text-gray-400">
          Each card plays a looping background video.
        </p>
      </div>

      <div className="mx-auto flex max-w-full flex-nowrap items-end justify-center gap-5 overflow-x-auto px-2 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, idx) => (
          <WarpCard
            key={item.label ?? idx}
            item={item}
            index={idx}
            onSelect={() => setActive(idx)}
          />
        ))}
      </div>

      {active !== null && items[active] && (
        <div
          className="fixed inset-0 z-[9999] bg-black flex flex-col"
          onClick={() => setActive(null)}
        >
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0 bg-black/80"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-white text-lg">
              {items[active].label}
            </span>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setActive(null)}
              className="p-2 text-white/70 hover:text-[#8db355] rounded-full hover:bg-white/5"
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
              src={items[active].video}
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
    </section>
  );
}
