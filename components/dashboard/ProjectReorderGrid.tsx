"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  GripVertical,
  Loader2,
  Pencil,
  Save,
  Trash2,
} from "lucide-react";
import { deleteProject, reorderProjects } from "@/app/dashboard/projects/actions";
import ConfirmSubmit from "@/components/dashboard/ConfirmSubmit";
import type { Project } from "@/lib/projects";

export default function ProjectReorderGrid({
  projects,
  categorySlug,
}: {
  projects: Project[];
  categorySlug: string;
}) {
  const [items, setItems] = useState<Project[]>(projects);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const dirty =
    items.map((p) => p.id).join("|") !==
    projects.map((p) => p.id).join("|");

  function move(dragged: string, target: string) {
    if (dragged === target) return;
    setItems((prev) => {
      const arr = [...prev];
      const from = arr.findIndex((p) => p.id === dragged);
      const to = arr.findIndex((p) => p.id === target);
      if (from < 0 || to < 0) return prev;
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
  }

  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    const card = cardRefs.current.get(id);
    if (card) e.dataTransfer.setDragImage(card, 24, 24);
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (id !== draggedId) setOverId(id);
  }

  function handleDrop(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (draggedId && draggedId !== id) move(draggedId, id);
    setDraggedId(null);
    setOverId(null);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setOverId(null);
  }

  function handleSave() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await reorderProjects(
        categorySlug,
        items.map((p) => p.id),
      );
      if (result?.error) {
        setError(result.error);
      } else {
        setMessage("Saved");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-20 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cream/10 bg-[#0d0d0cf2] px-4 py-3 backdrop-blur-xl">
        <p className="text-xs text-cream/45">
          Drag cards by the grip handle to reorder. Click Save to persist.
        </p>
        <div className="flex items-center gap-2">
          {error && <span className="max-w-[16rem] text-xs text-red-300">{error}</span>}
          {message && !error && (
            <span className="text-xs text-[#8DB355]">{message}</span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || isPending}
            className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-5 py-2 text-xs font-semibold text-bg transition-colors hover:bg-[#9cc163] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            Save order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((project) => (
          <div
            key={project.id}
            ref={(el) => {
              if (el) cardRefs.current.set(project.id, el);
            }}
            onDragOver={(e) => handleDragOver(e, project.id)}
            onDrop={(e) => handleDrop(e, project.id)}
            className={`group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all ${
              draggedId === project.id
                ? "opacity-40"
                : overId === project.id
                  ? "border-[#8DB355] ring-2 ring-[#8DB355]/40"
                  : "border-cream/10"
            }`}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              {project.cover ? (
                <Image
                  src={project.cover}
                  alt={project.title}
                  fill
                  sizes="(max-width:640px) 100vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-bg" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908] via-transparent to-transparent" />
              <span
                draggable
                onDragStart={(e) => handleDragStart(e, project.id)}
                onDragEnd={handleDragEnd}
                className="absolute left-2 top-2 cursor-grab rounded-full border border-cream/10 bg-black/60 p-1.5 text-cream/60 transition-colors hover:text-[#8DB355] active:cursor-grabbing"
                title="Drag to reorder"
              >
                <GripVertical size={14} />
              </span>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <h2 className="font-serif text-base leading-snug text-cream">
                {project.title}
              </h2>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-cream/35">
                {project.projectType || "—"}
              </p>

              <div className="mt-4 flex items-center gap-2 border-t border-cream/10 pt-4">
                <Link
                  href={`/dashboard/projects/${categorySlug}/${project.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-cream/10 px-3 py-1.5 text-xs text-cream/60 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
                >
                  <Pencil size={13} />
                  Edit
                </Link>

                {project.pdfSrc && (
                  <a
                    href={project.pdfSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View PDF"
                    className="inline-flex items-center rounded-full border border-cream/10 p-1.5 text-cream/50 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
                  >
                    <FileText size={13} />
                  </a>
                )}

                <form action={deleteProject} className="ml-auto">
                  <input type="hidden" name="projectId" value={project.id} />
                  <input
                    type="hidden"
                    name="categorySlug"
                    value={categorySlug}
                  />
                  <ConfirmSubmit
                    message={`Delete “${project.title}”? This cannot be undone.`}
                    title="Delete project"
                    className="inline-flex items-center rounded-full border border-cream/10 p-1.5 text-cream/50 transition-colors hover:border-red-500 hover:text-red-400"
                  >
                    <Trash2 size={13} />
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
