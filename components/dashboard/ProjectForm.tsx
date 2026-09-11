"use client";

import { useActionState, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  FileText,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
  Check,
} from "lucide-react";
import {
  createProject,
  updateProject,
  deleteProjectImage,
  type ProjectFormState,
} from "@/app/dashboard/projects/actions";
import type { ProjectWithImages } from "@/lib/projects";
import ConfirmSubmit from "./ConfirmSubmit";

const fieldClass =
  "w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-[#8DB355]";

const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45";

export default function ProjectForm({
  categorySlug,
  project,
}: {
  categorySlug: string;
  project?: ProjectWithImages;
}) {
  const isEdit = Boolean(project);

  const [state, formAction, isPending] = useActionState<ProjectFormState, FormData>(
    isEdit ? updateProject : createProject,
    { error: null },
  );

  const [coverName, setCoverName] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [galleryFiles, setGalleryFiles] = useState<{ name: string; url: string }[]>([]);
  const coverRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/dashboard/projects/${categorySlug}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-cream/50 transition-colors hover:text-[#8DB355]"
      >
        <ArrowLeft size={15} />
        Back
      </Link>

      <h1 className="font-serif text-2xl font-semibold text-cream">
        {isEdit ? `Edit “${project?.title}”` : "New Project"}
      </h1>
      <p className="mt-1.5 text-sm text-cream/45">
        {isEdit
          ? "Update the details, or upload new cover, images and PDF."
          : "Fill in the details and upload the cover image, gallery images and PDF."}
      </p>

      {state.error && (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <form action={formAction} className="mt-8 space-y-6">
        <input type="hidden" name="categorySlug" value={categorySlug} />
        {isEdit && <input type="hidden" name="projectId" value={project?.id} />}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              defaultValue={project?.title ?? ""}
              placeholder="Holiday Vibes"
              className={fieldClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="slug">
              URL slug <span className="normal-case">(optional)</span>
            </label>
            <input
              id="slug"
              name="slug"
              defaultValue={project?.slug ?? ""}
              placeholder="holiday-vibes"
              className={fieldClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="projectType">
              Project type
            </label>
            <input
              id="projectType"
              name="projectType"
              defaultValue={project?.projectType ?? ""}
              placeholder="Illustrations, Flats, and Print work"
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="date">
              Date
            </label>
            <input
              id="date"
              name="date"
              defaultValue={project?.date ?? ""}
              placeholder="September 2025"
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              defaultValue={project?.location ?? ""}
              placeholder="Fleetwood, BD"
              className={fieldClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={project?.description ?? ""}
              placeholder="Describe the project…"
              className={`${fieldClass} resize-y`}
            />
          </div>
        </div>

        <div className="grid gap-5 border-t border-cream/10 pt-6 sm:grid-cols-2">
          <div>
            <span className={labelClass}>Cover image</span>
            {project?.cover && (
              <div className="mb-3 flex items-center gap-3">
                <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-cream/10">
                  <Image
                    src={project.cover}
                    alt="Current cover"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <span className="text-xs text-cream/40">Current cover</span>
              </div>
            )}
            <label
              htmlFor="cover"
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-dashed border-cream/15 px-4 py-3 text-sm text-cream/50 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
            >
              <ImagePlus size={16} />
              {coverName || "Choose cover image"}
            </label>
            <input
              ref={coverRef}
              id="cover"
              name="cover"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setCoverName(file?.name || "");
              }}
            />
          </div>

          <div>
            <span className={labelClass}>PDF file</span>
            {project?.pdfSrc && (
              <div className="mb-3 flex items-center gap-3">
                <FileText size={20} className="text-[#8DB355]" />
                <a
                  href={project.pdfSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-xs text-cream/50 underline decoration-cream/20 hover:text-[#8DB355]"
                >
                  View current PDF
                </a>
              </div>
            )}
            <label
              htmlFor="pdf"
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-dashed border-cream/15 px-4 py-3 text-sm text-cream/50 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
            >
              <FileText size={16} />
              {pdfName || "Choose PDF"}
            </label>
            <input
              ref={pdfRef}
              id="pdf"
              name="pdf"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setPdfName(file?.name || "");
              }}
            />
          </div>
        </div>

        <div className="border-t border-cream/10 pt-6">
          <span className={labelClass}>
            Gallery images <span className="normal-case">(multiple)</span>
          </span>

          <label
            htmlFor="images"
            className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-dashed border-cream/15 px-4 py-3 text-sm text-cream/50 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
          >
            <Upload size={16} />
            {galleryFiles.length > 0
              ? `${galleryFiles.length} image${galleryFiles.length === 1 ? "" : "s"} selected`
              : "Choose gallery images"}
          </label>
          <input
            ref={imagesRef}
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              setGalleryFiles(
                files.map((file) => ({
                  name: file.name,
                  url: URL.createObjectURL(file),
                })),
              );
            }}
          />

          {galleryFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {galleryFiles.map((file, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg border border-cream/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.url}
                    alt={file.name}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="flex items-center gap-1.5 px-2 py-1.5">
                    <Check size={11} className="shrink-0 text-[#8DB355]" />
                    <span
                      className="truncate text-[10px] text-cream/50"
                      title={file.name}
                    >
                      {file.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-cream/10 pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-6 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending && <Loader2 size={15} className="animate-spin" />}
            {isEdit ? "Save changes" : "Publish project"}
          </button>

          <Link
            href={`/dashboard/projects/${categorySlug}`}
            className="rounded-full border border-cream/10 px-6 py-2.5 text-sm text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
          >
            Cancel
          </Link>
        </div>
      </form>

      {isEdit && project && project.imageRecords.length > 0 && (
        <section className="mt-10 border-t border-cream/10 pt-6">
          <h2 className={labelClass}>Current gallery images</h2>

          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {project.imageRecords.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg border border-cream/10"
              >
                <Image
                  src={image.imageUrl}
                  alt="Gallery image"
                  width={320}
                  height={240}
                  sizes="(max-width:640px) 33vw, 200px"
                  className="aspect-[4/3] w-full object-cover"
                />
                <form action={deleteProjectImage}>
                  <input type="hidden" name="imageId" value={image.id} />
                  <ConfirmSubmit
                    message="Delete this image?"
                    title="Delete image"
                    className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-cream/70 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </ConfirmSubmit>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
