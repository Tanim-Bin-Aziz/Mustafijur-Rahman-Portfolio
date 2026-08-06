"use client";

import { useState, useMemo, useRef, MouseEvent, WheelEvent } from "react";
import Image from "next/image";
import {
  Search,
  Folder as FolderIcon,
  FolderOpen,
  ArrowUpDown,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Calendar,
  Menu,
  ImageIcon,
} from "lucide-react";
import { GALLERY_FOLDERS, GALLERY_IMAGES, GalleryImage } from "@/data/gallery";

export default function ImageGallerySystem() {
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Zoom & Pan Dynamic States ---
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset Zoom function
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleOpenModal = (img: GalleryImage) => {
    setActiveImage(img);
    handleResetZoom();
  };

  const handleCloseModal = () => {
    setActiveImage(null);
    handleResetZoom();
  };

  // Zoom In / Zoom Out Handlers
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
      return newScale;
    });
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Drag / Pan Handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Global Filter & Search Logic
  const filteredImages = useMemo(() => {
    return GALLERY_IMAGES.filter((img) => {
      const matchesFolder =
        searchQuery.trim() !== "" ||
        selectedFolder === "all" ||
        img.folderId === selectedFolder;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        img.title.toLowerCase().includes(query) || img.date.includes(query);

      return matchesFolder && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest")
        return new Date(a.date).getTime() - new Date(a.date).getTime();
      return a.title.localeCompare(b.title);
    });
  }, [selectedFolder, searchQuery, sortBy]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-start relative min-h-[600px]">
      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Glassmorphism UI */}
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
            <span className="text-[#8db355]">{GALLERY_FOLDERS.length}</span>
          </div>

          <nav className="flex flex-col gap-1 mt-2 overflow-y-auto">
            {GALLERY_FOLDERS.map((folder) => {
              const isActive = selectedFolder === folder.id;
              const count =
                folder.id === "all"
                  ? GALLERY_IMAGES.length
                  : GALLERY_IMAGES.filter((i) => i.folderId === folder.id)
                      .length;

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

      {/* Main Content Area */}
      <div className="flex-1 w-full space-y-6">
        {/* Search & Sort Header Bar */}
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

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                onClick={() => handleOpenModal(img)}
                className="group relative aspect-square bg-black/40 border border-white/10 rounded-2xl overflow-hidden cursor-pointer backdrop-blur-sm transition-all duration-300 hover:border-[#8db355]/50 hover:shadow-xl hover:shadow-[#8db355]/10"
              >
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex items-center justify-between text-xs text-[#8db355] mb-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {img.date}
                    </span>
                    <ZoomIn className="w-4 h-4 text-white/80" />
                  </div>
                  <h3 className="text-white font-medium text-base truncate">
                    {img.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 rounded-2xl text-center">
            <ImageIcon className="w-12 h-12 text-[#F4EEE3]/20 mb-3" />
            <p className="text-[#F4EEE3]/60 text-sm">No images found</p>
          </div>
        )}
      </div>

      {/* --- ADVANCED FREE ZOOM LIGHTBOX MODAL --- */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6">
          <div className="relative max-w-5xl w-full h-[85vh] bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Control Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/60 z-10 backdrop-blur-md">
              <div>
                <h3 className="text-[#F4EEE3] font-medium text-sm sm:text-base">
                  {activeImage.title}
                </h3>
                <p className="text-xs text-[#8db355] font-mono">
                  {activeImage.date}
                </p>
              </div>

              {/* Interactive Zoom Toolbar */}
              <div className="flex items-center gap-1 sm:gap-2 bg-white/10 border border-white/10 rounded-xl p-1">
                <button
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-[#8db355] px-1 min-w-[45px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  title="Reset Zoom"
                  className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition border-l border-white/10 ml-1 pl-2"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Image Display Container (Wheel & Drag Enabled) */}
            <div
              className={`relative flex-1 w-full h-full overflow-hidden bg-black flex items-center justify-center select-none ${
                scale > 1
                  ? isDragging
                    ? "cursor-grabbing"
                    : "cursor-grab"
                  : "cursor-default"
              }`}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                className="relative w-full h-full transition-transform duration-75 ease-out"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                }}
              >
                <Image
                  src={activeImage.src}
                  alt={activeImage.title}
                  fill
                  quality={95}
                  priority
                  draggable={false}
                  className="object-contain pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
