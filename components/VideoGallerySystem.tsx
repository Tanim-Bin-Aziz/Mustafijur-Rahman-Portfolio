"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Folder as FolderIcon,
  FolderOpen,
  ArrowUpDown,
  X,
  Calendar,
  Menu,
  Film,
  Play,
} from "lucide-react";
import type { VideoGalleryItem, VideoFolder } from "@/data/video";

interface Props {
  title: string;
  items: VideoGalleryItem[];
  folders: VideoFolder[];
}

export default function VideoGallerySystem({ items, folders }: Props) {
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [activeVideo, setActiveVideo] = useState<VideoGalleryItem | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredVideos = useMemo(() => {
    return items
      .filter((v) => {
        const matchesFolder =
          searchQuery.trim() !== "" ||
          selectedFolder === "all" ||
          v.folderId === selectedFolder;

        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          v.title.toLowerCase().includes(query) || v.date.includes(query);

        return matchesFolder && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === "oldest")
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        return a.title.localeCompare(b.title);
      });
  }, [items, selectedFolder, searchQuery, sortBy]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-start relative min-h-[600px]">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar — Folders */}
      <aside
        className={`fixed md:sticky top-28 left-0 z-40 w-72 h-[calc(100vh-140px)] transition-transform duration-300 ease-in-out ${
          isSidebarOpen
            ? "translate-x-0 px-4"
            : "-translate-x-full md:translate-x-0"
        } md:block flex-shrink-0`}
      >
        <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shadow-2xl">
          <div className="flex items-center justify-between px-3 py-2 text-[#F4EEE3]/50 text-xs font-mono uppercase tracking-widest border-b border-white/5 pb-3">
            <span>Folders</span>
            <span className="text-[#8db355]">{folders.length}</span>
          </div>

          <nav className="flex flex-col gap-1 mt-2 overflow-y-auto">
            {folders.map((folder) => {
              const isActive = selectedFolder === folder.id;
              const count =
                folder.id === "all"
                  ? items.length
                  : items.filter((v) => v.folderId === folder.id).length;

              return (
                <button
                  key={folder.id}
                  onClick={() => {
                    setSelectedFolder(folder.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                    isActive
                      ? "bg-[#8db355]/20 border border-[#8db355]/40 text-[#F4EEE3] font-medium shadow-lg shadow-[#8db355]/5"
                      : "text-[#F4EEE3]/70 hover:bg-white/5 hover:text-[#F4EEE3]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isActive ? (
                      <FolderOpen className="w-4 h-4 text-[#8db355]" />
                    ) : (
                      <FolderIcon className="w-4 h-4 text-[#F4EEE3]/40 group-hover:text-[#F4EEE3]/80" />
                    )}
                    <span>{folder.name}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-[#8db355]/30 text-[#8db355]"
                        : "bg-white/5 text-[#F4EEE3]/40"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 w-full space-y-6">
        {/* Search & Sort */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xl">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[#F4EEE3] transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4EEE3]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or date..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-[#F4EEE3] placeholder:text-[#F4EEE3]/30 focus:outline-none focus:border-[#8db355]/60 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F4EEE3]/40 hover:text-[#F4EEE3]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <ArrowUpDown className="w-4 h-4 text-[#8db355]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F4EEE3] focus:outline-none focus:border-[#8db355]/60 cursor-pointer"
            >
              <option value="newest" className="bg-[#09090a]">
                Newest First
              </option>
              <option value="oldest" className="bg-[#09090a]">
                Oldest First
              </option>
              <option value="title" className="bg-[#09090a]">
                By Name
              </option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((v) => (
              <VideoTile key={v.id} item={v} onOpen={() => setActiveVideo(v)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 rounded-2xl text-center">
            <Film className="w-12 h-12 text-[#F4EEE3]/20 mb-3" />
            <p className="text-[#F4EEE3]/60 text-sm">No videos found</p>
          </div>
        )}
      </div>

      {/* Fullscreen player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6">
          <div className="relative max-w-5xl w-full h-[85vh] bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/60 z-10 backdrop-blur-md">
              <div>
                <h3 className="text-[#F4EEE3] font-medium text-sm sm:text-base">
                  {activeVideo.title}
                </h3>
                <p className="text-xs text-[#8db355] font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {activeVideo.date}
                </p>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                aria-label="Close"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 w-full h-full bg-black flex items-center justify-center">
              <video
                src={activeVideo.src}
                className="max-w-full max-h-full"
                controls
                autoPlay
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------ Grid tile — hover korle preview autoplay ------------------ */
function VideoTile({
  item,
  onOpen,
}: {
  item: VideoGalleryItem;
  onOpen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering] = useState(false);

  // Hover korle preview play hoy, sorai nile pause + reset — CPU/GPU-light rakhe
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (hovering) {
      el.play().catch(() => {});
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [hovering]);

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="group relative aspect-square bg-black/40 border border-white/10 rounded-2xl overflow-hidden cursor-pointer backdrop-blur-sm transition-all duration-300 hover:border-[#8db355]/50 hover:shadow-xl hover:shadow-[#8db355]/10"
    >
      <video
        ref={videoRef}
        src={item.src}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />

      {!hovering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
            <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="flex items-center justify-between text-xs text-[#8db355] mb-1 font-mono">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {item.date}
          </span>
          <Play className="w-4 h-4 text-white/80" />
        </div>
        <h3 className="text-white font-medium text-base truncate">
          {item.title}
        </h3>
      </div>
    </div>
  );
}
