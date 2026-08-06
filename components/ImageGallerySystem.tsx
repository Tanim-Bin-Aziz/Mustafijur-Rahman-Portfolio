"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Folder as FolderIcon,
  FolderOpen,
  ArrowUpDown,
  ZoomIn,
  X,
  Calendar,
  Menu,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import { GALLERY_FOLDERS, GALLERY_IMAGES, GalleryImage } from "@/data/gallery";

export default function ImageGallerySystem() {
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global Filter & Search Logic
  const filteredImages = useMemo(() => {
    return GALLERY_IMAGES.filter((img) => {
      // Folder check: Search query থাকলে সব ফোল্ডারের এক্সেস পাবে
      const matchesFolder =
        searchQuery.trim() !== "" ||
        selectedFolder === "all" ||
        img.folderId === selectedFolder;

      // Title & Date Search check
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        img.title.toLowerCase().includes(query) || img.date.includes(query);

      return matchesFolder && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
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
        {/* Search, Sort & Mobile Sidebar Toggle Bar */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xl">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[#F4EEE3] transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4EEE3]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or date (YYYY-MM-DD)..."
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

          {/* Sort Selector */}
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

        {/* Global Search Hint Tag */}
        {searchQuery.trim() !== "" && (
          <div className="flex items-center justify-between text-xs text-[#8db355] bg-[#8db355]/10 border border-[#8db355]/20 px-4 py-2 rounded-xl">
            <span>Searching across all folders for "{searchQuery}"</span>
            <span>{filteredImages.length} results</span>
          </div>
        )}

        {/* Image Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setActiveImage(img)}
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

                {/* Hover Glass Overlay */}
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

      {/* Lightbox / Image Zoom Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
              <div>
                <h3 className="text-[#F4EEE3] font-medium">
                  {activeImage.title}
                </h3>
                <p className="text-xs text-[#8db355] font-mono">
                  {activeImage.date}
                </p>
              </div>
              <button
                onClick={() => setActiveImage(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="relative w-full h-[60vh] sm:h-[70vh] bg-black">
              <Image
                src={activeImage.src}
                alt={activeImage.title}
                fill
                quality={95}
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
