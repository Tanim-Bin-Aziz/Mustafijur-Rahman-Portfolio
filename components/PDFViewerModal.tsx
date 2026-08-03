"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  WheelEvent,
  MouseEvent,
} from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ArrowRight,
} from "lucide-react";
import type { Project } from "@/data/projects";

interface Props {
  project: Project;
  nextProject?: Project;
  onClose: () => void;
  onNextProject?: () => void;
  // "full" dile shorashori pdf.js full viewer khulbe, preview grid skip hoye jabe
  initialMode?: Mode;
}

type Mode = "preview" | "full";

export default function PDFViewerModal({
  project,
  nextProject,
  onClose,
  onNextProject,
  initialMode = "preview",
}: Props) {
  const [mode, setMode] = useState<Mode>(initialMode);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#0B0908]/95 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} viewer`}
    >
      {mode === "preview" ? (
        <PreviewMode
          project={project}
          onClose={onClose}
          onViewFullPdf={() => setMode("full")}
        />
      ) : (
        <FullPdfMode
          project={project}
          nextProject={nextProject}
          onClose={onClose}
          onBackToPreview={() => setMode("preview")}
          onNextProject={onNextProject}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   PREVIEW MODE — grid e image cards, card click korle
   shei image zoom view e open hoy (free zoom + pan)
--------------------------------------------------------- */
function PreviewMode({
  project,
  onClose,
  onViewFullPdf,
}: {
  project: Project;
  onClose: () => void;
  onViewFullPdf: () => void;
}) {
  // null hole grid dekhabe, number hole shei index-er image zoom view e dekhabe
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // fallback: previewImages na thakle ba empty hole cover-ke e image hisebe use koro
  const images =
    project.previewImages && project.previewImages.length > 0
      ? project.previewImages
      : [project.cover];

  return (
    <>
      {/* Header — "View Full PDF" button shobshomoy upore thakbe */}
      <div className="flex items-center justify-between px-5 md:px-8 py-4 shrink-0">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#C89B6A] uppercase">
            {project.projectType}
          </p>
          <h3 className="font-serif italic text-[#F4EEE3] text-xl md:text-2xl">
            {project.title}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewFullPdf}
            className="inline-flex items-center gap-2 rounded-full border border-[#C89B6A]/40 bg-[#C89B6A]/10 px-4 md:px-5 py-2.5 text-sm font-medium text-[#C89B6A] hover:bg-[#C89B6A]/20 transition-colors"
          >
            <Maximize2 size={15} />
            <span className="hidden sm:inline">View Full PDF</span>
          </button>
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="p-2 text-[#F4EEE3]/60 hover:text-[#C89B6A] rounded-full hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Body: grid view OR zoomed single-image view */}
      {openIndex === null ? (
        <ImageGrid
          images={images}
          title={project.title}
          onSelect={setOpenIndex}
        />
      ) : (
        <ZoomedImageView
          images={images}
          title={project.title}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onBackToGrid={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}

/* ------------------ Grid of image cards ------------------ */
function ImageGrid({
  images,
  title,
  onSelect,
}: {
  images: string[];
  title: string;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-[#151311] hover:border-[#C89B6A]/50 transition-all duration-300"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${title} image ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <span className="absolute bottom-2 right-2 font-mono text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-[#F4EEE3]/70">
              {i + 1}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------ Zoomed single-image view ------------------ */
function ZoomedImageView({
  images,
  title,
  index,
  onIndexChange,
  onBackToGrid,
}: {
  images: string[];
  title: string;
  index: number;
  onIndexChange: (i: number) => void;
  onBackToGrid: () => void;
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
    <>
      {/* Sub-header: back-to-grid + zoom controls */}
      <div className="flex items-center justify-between px-5 md:px-8 pb-3 shrink-0">
        <button
          onClick={onBackToGrid}
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

      {/* Image area */}
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

      {/* Footer */}
      <div className="flex items-center justify-center px-5 md:px-8 py-4 shrink-0 border-t border-white/5">
        <span className="font-mono text-xs text-[#F4EEE3]/50">
          Image {index + 1} / {images.length}
        </span>
      </div>
    </>
  );
}

/* ---------------------------------------------------------
   FULL PDF MODE — pdf.js diye actual page-by-page render
--------------------------------------------------------- */
function FullPdfMode({
  project,
  nextProject,
  onClose,
  onBackToPreview,
  onNextProject,
}: {
  project: Project;
  nextProject?: Project;
  onClose: () => void;
  onBackToPreview: () => void;
  onNextProject?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(0.75);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.min.mjs";
      const pdf = await pdfjsLib.getDocument({ url: project.pdfSrc }).promise;
      if (cancelled) return;
      pdfRef.current = pdf;
      setNumPages(pdf.numPages);
      setPage(1);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
      pdfRef.current?.destroy?.();
    };
  }, [project.pdfSrc]);

  const renderPage = useCallback(async (pageNum: number, zoom: number) => {
    const pdf = pdfRef.current;
    const canvas = canvasRef.current;
    if (!pdf || !canvas) return;
    renderTaskRef.current?.cancel();
    setLoading(true);
    const pageObj = await pdf.getPage(pageNum);
    const dpr =
      typeof window !== "undefined" && window.devicePixelRatio > 1 ? 1.5 : 1;
    const viewport = pageObj.getViewport({ scale: zoom * dpr });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    const task = pageObj.render({ canvasContext: ctx, viewport });
    renderTaskRef.current = task;
    try {
      await task.promise;
    } catch {
      // purono render cancel howa normal, ignore
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (numPages) renderPage(page, scale);
  }, [page, scale, numPages, renderPage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setPage((p) => Math.min(p + 1, numPages));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(p - 1, 1));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, numPages]);

  return (
    <>
      <div className="flex items-center justify-between px-5 md:px-8 py-4 shrink-0">
        <button
          onClick={onBackToPreview}
          aria-label="Back to preview"
          className="flex items-center gap-2 text-[#F4EEE3]/60 hover:text-[#C89B6A] text-sm font-mono uppercase tracking-[0.15em]"
        >
          <ChevronLeft size={16} /> Preview
        </button>

        <div className="text-center">
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#C89B6A] uppercase">
            {project.projectType}
          </p>
          <h3 className="font-serif italic text-[#F4EEE3] text-xl md:text-2xl">
            {project.title}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setScale((s) => Math.max(0.6, +(s - 0.25).toFixed(2)))
            }
            aria-label="Zoom out"
            className="p-2 text-[#F4EEE3]/60 hover:text-[#C89B6A] rounded-full hover:bg-white/5"
          >
            <ZoomOut size={18} />
          </button>
          <span className="font-mono text-xs text-[#F4EEE3]/50 w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(3, +(s + 0.25).toFixed(2)))}
            aria-label="Zoom in"
            className="p-2 text-[#F4EEE3]/60 hover:text-[#C89B6A] rounded-full hover:bg-white/5"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={onClose}
            aria-label="Close viewer"
            className="ml-2 p-2 text-[#F4EEE3]/60 hover:text-[#C89B6A] rounded-full hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-auto flex items-center justify-center px-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page <= 1}
          aria-label="Previous page"
          className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 p-2 text-[#F4EEE3]/50 hover:text-[#C89B6A] disabled:opacity-20 disabled:pointer-events-none bg-black/20 rounded-full backdrop-blur-sm"
        >
          <ChevronLeft size={26} />
        </button>

        <div className="relative shadow-2xl">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1A1613]/60 min-w-[200px] min-h-[280px]">
              <div className="w-6 h-6 border-2 border-[#C89B6A]/30 border-t-[#C89B6A] rounded-full animate-spin" />
            </div>
          )}
          <canvas ref={canvasRef} className="max-w-full" />
        </div>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, numPages))}
          disabled={page >= numPages}
          aria-label="Next page"
          className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 p-2 text-[#F4EEE3]/50 hover:text-[#C89B6A] disabled:opacity-20 disabled:pointer-events-none bg-black/20 rounded-full backdrop-blur-sm"
        >
          <ChevronRight size={26} />
        </button>
      </div>

      <div className="flex items-center justify-between px-5 md:px-8 py-4 shrink-0 border-t border-white/5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#F4EEE3]/50">
            Page {page} / {numPages || "…"}
          </span>
          <input
            type="range"
            min={1}
            max={numPages || 1}
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
            className="w-32 md:w-56 accent-[#C89B6A]"
            aria-label="Jump to page"
          />
        </div>
        {nextProject && onNextProject && (
          <button
            onClick={onNextProject}
            className="inline-flex items-center gap-1.5 text-sm text-[#F4EEE3]/70 hover:text-[#C89B6A] transition-colors font-serif italic"
          >
            Next project: {nextProject.title} <ArrowRight size={15} />
          </button>
        )}
      </div>
    </>
  );
}
