"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  WheelEvent,
  MouseEvent,
  KeyboardEvent,
} from "react";
import Image from "next/image";
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ArrowRight,
  Plus,
  Heart,
} from "lucide-react";
import type { Project } from "@/lib/projects";
import type { ProjectReview } from "@/lib/reviews";
import { likeProjectImage } from "@/app/portfolio/actions";
import StarRating from "@/components/project/StarRating";
import ReviewForm from "@/components/project/ReviewForm";
import ReviewList from "@/components/project/ReviewList";
import PDFViewerModal from "@/components/PDFViewerModal";
import Nav from "@/components/Nav";

// Public reviews list is hidden for now; flip to true to display it.
const SHOW_PUBLIC_REVIEWS = false;

export default function ProjectDetailClient({
  project,
  nextProject,
  categorySlug,
  isAdmin,
  likeCounts,
  reviews,
}: {
  project: Project;
  nextProject: Project;
  categorySlug: string;
  isAdmin: boolean;
  likeCounts: Record<string, number>;
  reviews: ProjectReview[];
}) {
  const [showFullPdf, setShowFullPdf] = useState(false);

  const openFullPdf = () => setShowFullPdf(true);

  // shei e category-r moddhe next project-e jabe
  const goToNextProject = () => {
    window.location.href = `/portfolio/${categorySlug}/${nextProject.slug}`;
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <>
      {/* View Full PDF e click korle showFullPdf true hoy — tokhon Nav hide hoye jay */}
      {!showFullPdf && <Nav />}

      <main className="bg-[#0B0908] text-[#F4EEE3] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          {/* Hero */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-16">
            <div className="flex-1">
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#C89B6A] mb-6">
                {project.projectType}
              </p>
              <h1 className="font-serif italic text-6xl md:text-6xl leading-none text-[#F4EEE3]">
                {project.title}
              </h1>
            </div>

            <div className="flex-1 max-w-xl lg:pt-8">
              <p className="text-lg leading-9 text-[#F4EEE3]/70 font-light">
                {project.description}
              </p>
            </div>
          </div>

          {/* Project Info */}
          <div className="flex flex-wrap gap-16 mb-16 border-t border-white/10 pt-10">
            <div>
              <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#F4EEE3]/40 mb-2">
                Project Type
              </dt>
              <dd className="text-lg text-[#F4EEE3]/80">
                {project.projectType}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#F4EEE3]/40 mb-2">
                Date
              </dt>
              <dd className="text-lg text-[#F4EEE3]/80">{project.date}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#F4EEE3]/40 mb-2">
                Location
              </dt>
              <dd className="text-lg text-[#F4EEE3]/80">{project.location}</dd>
            </div>
          </div>

          {/* Gallery header: View Full PDF (right side) */}
          <div className="flex items-center justify-between mb-6 border-t border-white/10 pt-8">
            <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#F4EEE3]/40">
              Featured Images
            </h2>
            <button
              onClick={openFullPdf}
              className="inline-flex items-center gap-2 rounded-full border border-[#C89B6A]/40 bg-[#C89B6A]/10 px-4 md:px-5 py-2.5 text-sm font-medium text-[#C89B6A] hover:bg-[#C89B6A]/20 transition-colors"
            >
              <Maximize2 size={15} />
              <span>View Full PDF</span>
            </button>
          </div>

          {/* Image gallery — grid, click korle zoom view */}
          <ImageGallery
            images={project.previewImages}
            imageIds={project.imageRecords.map((record) => record.id)}
            title={project.title}
            onOpenPdf={openFullPdf}
            isAdmin={isAdmin}
            likeCounts={likeCounts}
          />

          {/* Reviews */}
          <div className="mt-16 border-t border-white/10 pt-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#F4EEE3]/40">
                Reviews
              </h2>
              {reviews.length > 0 && (
                <div className="flex items-center gap-3">
                  <StarRating value={Math.round(averageRating)} size={14} />
                  <span className="font-mono text-xs text-[#F4EEE3]/50">
                    {averageRating.toFixed(1)} &middot; {reviews.length} review
                    {reviews.length === 1 ? "" : "s"}
                  </span>
                </div>
              )}
            </div>

            {SHOW_PUBLIC_REVIEWS && (
              <div className="mt-8">
                <ReviewList reviews={reviews} />
              </div>
            )}

            <ReviewForm
              projectId={project.id}
              categorySlug={categorySlug}
              slug={project.slug}
            />
          </div>

          {/* Next project */}
          <div className="flex items-center justify-end mt-16 pt-8 border-t border-white/10">
            <button
              onClick={goToNextProject}
              className="inline-flex items-center gap-1.5 text-lg text-[#F4EEE3]/70 hover:text-[#C89B6A] transition-colors font-serif italic"
            >
              Next project: {nextProject.title} <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {showFullPdf && (
          <PDFViewerModal
            project={project}
            nextProject={nextProject}
            onClose={() => setShowFullPdf(false)}
            onNextProject={goToNextProject}
            initialMode="full"
          />
        )}
      </main>
    </>
  );
}

/* ------------------ Gallery: grid + zoom/slider view ------------------ */
function ImageGallery({
  images,
  imageIds,
  title,
  onOpenPdf,
  isAdmin,
  likeCounts,
}: {
  images: string[];
  imageIds: string[];
  title: string;
  onOpenPdf: () => void;
  isAdmin: boolean;
  likeCounts: Record<string, number>;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const open = (index: number) => {
    if (index === images.length - 1) onOpenPdf();
    else setOpenIndex(index);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((src, i) => {
          const isLast = i === images.length - 1;
          const imageId = imageIds[i];
          return (
            <div
              key={i}
              role="button"
              tabIndex={0}
              onClick={() => open(i)}
              onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  open(i);
                }
              }}
              aria-label={
                isLast ? "View the full PDF" : `${title} image ${i + 1}`
              }
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#151311] hover:border-[#C89B6A]/50 transition-all duration-300"
            >
              <Image
                src={src}
                alt={`${title} image ${i + 1}`}
                fill
                loading="lazy"
                decoding="async"
                sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {isLast ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 group-hover:bg-black/75 transition-colors">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C89B6A]/70 bg-black/40 text-[#C89B6A]">
                    <Plus size={22} />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F4EEE3]">
                    View More
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#F4EEE3]/50">
                    Full PDF
                  </span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              )}

              {!isLast && imageId && (
                <LikeButton
                  imageId={imageId}
                  isAdmin={isAdmin}
                  initialCount={likeCounts[imageId] ?? 0}
                />
              )}

              <span className="absolute bottom-2 right-2 font-mono text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-[#F4EEE3]/70">
                {i + 1}
              </span>
            </div>
          );
        })}
      </div>

      {openIndex !== null && (
        <ZoomedImageOverlay
          images={images}
          title={title}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}

/* ------------------ Like button (count visible to admin only) ------------------ */
function LikeButton({
  imageId,
  isAdmin,
  initialCount,
}: {
  imageId: string;
  isAdmin: boolean;
  initialCount: number;
}) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);
  const storageKey = `portfolio:liked:${imageId}`;

  useEffect(() => {
    if (window.localStorage.getItem(storageKey) === "1") setLiked(true);
  }, [storageKey]);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const handleLike = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (liked || pending) return;

    setLiked(true);
    setPending(true);
    setCount((current) => current + 1);
    window.localStorage.setItem(storageKey, "1");

    const { error } = await likeProjectImage(imageId);
    setPending(false);

    if (error) {
      setLiked(false);
      setCount((current) => Math.max(0, current - 1));
      window.localStorage.removeItem(storageKey);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      aria-pressed={liked}
      aria-label={liked ? "Liked" : "Like this image"}
      title={liked ? "Liked" : "Like this image"}
      className="absolute right-2 top-2 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1.5 text-[#F4EEE3] backdrop-blur transition-colors hover:bg-black/75"
    >
      <Heart
        size={15}
        className={liked ? "text-[#C89B6A]" : ""}
        fill={liked ? "#C89B6A" : "none"}
      />
      {isAdmin && (
        <span className="font-mono text-[10px] tabular-nums">{count}</span>
      )}
    </button>
  );
}

/* ------------------ Fullscreen zoom + pan + slider overlay ------------------ */
function ZoomedImageOverlay({
  images,
  title,
  index,
  onIndexChange,
  onClose,
}: {
  images: string[];
  title: string;
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const clampScale = (s: number) => Math.min(4, Math.max(1, s));

  const handleWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale((prev) => {
      const next = clampScale(+(prev + delta).toFixed(2));
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleZoomIn = () =>
    setScale((s) => clampScale(+(s + 0.25).toFixed(2)));
  const handleZoomOut = () =>
    setScale((s) => {
      const next = clampScale(+(s - 0.25).toFixed(2));
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (scale <= 1) return;
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  const goToImage = (i: number) => {
    onIndexChange(i);
    handleReset();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#0B0908]/95 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} image viewer`}
    >
      <div className="flex items-center justify-between px-5 md:px-8 py-4 shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[#F4EEE3]/60 hover:text-[#C89B6A] text-sm font-mono uppercase tracking-[0.15em]"
        >
          <ChevronLeft size={16} /> All images
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="p-2 text-[#F4EEE3]/60 hover:text-[#C89B6A] rounded-full hover:bg-white/5"
          >
            <ZoomOut size={18} />
          </button>
          <span className="font-mono text-xs text-[#F4EEE3]/50 w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="p-2 text-[#F4EEE3]/60 hover:text-[#C89B6A] rounded-full hover:bg-white/5"
          >
            <ZoomIn size={18} />
          </button>
        </div>
      </div>

      <div
        className="relative flex-1 overflow-hidden flex items-center justify-center px-4"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        style={{
          cursor:
            scale > 1 ? (isDragging.current ? "grabbing" : "grab") : "default",
        }}
      >
        {images.length > 1 && (
          <button
            onClick={() => goToImage(Math.max(index - 1, 0))}
            disabled={index <= 0}
            aria-label="Previous image"
            className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 p-2 text-[#F4EEE3]/50 hover:text-[#C89B6A] disabled:opacity-20 disabled:pointer-events-none bg-black/20 rounded-full backdrop-blur-sm"
          >
            <ChevronLeft size={26} />
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={`${title} image ${index + 1}`}
          draggable={false}
          className="max-h-full max-w-full select-none shadow-2xl rounded-md"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: isDragging.current
              ? "none"
              : "transform 0.15s ease-out",
          }}
        />

        {images.length > 1 && (
          <button
            onClick={() => goToImage(Math.min(index + 1, images.length - 1))}
            disabled={index >= images.length - 1}
            aria-label="Next image"
            className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 p-2 text-[#F4EEE3]/50 hover:text-[#C89B6A] disabled:opacity-20 disabled:pointer-events-none bg-black/20 rounded-full backdrop-blur-sm"
          >
            <ChevronRight size={26} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-center px-5 md:px-8 py-4 shrink-0 border-t border-white/5">
        <span className="font-mono text-xs text-[#F4EEE3]/50">
          Image {index + 1} / {images.length}
        </span>
      </div>
    </div>
  );
}
