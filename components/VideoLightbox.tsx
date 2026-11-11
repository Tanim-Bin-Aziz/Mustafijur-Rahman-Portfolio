"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";

export default function VideoLightbox({
  src,
  label,
  onClose,
}: {
  src: string;
  label?: string;
  onClose: () => void;
}) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
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
  }, [src]);

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
    <div
      className="fixed inset-0 z-[9999] bg-black flex flex-col"
      onClick={onClose}
    >
      <div
        className="flex shrink-0 items-center justify-between bg-black/80 px-4 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-lg text-white">{label}</span>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="rounded-full p-2 text-white/70 hover:bg-white/5 hover:text-[#8db355]"
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
          key={src}
          src={src}
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
        className="flex shrink-0 items-center gap-3 bg-black/80 px-4 py-3"
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

        <span className="min-w-[80px] text-right font-mono text-xs text-white/70">
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
  );
}
