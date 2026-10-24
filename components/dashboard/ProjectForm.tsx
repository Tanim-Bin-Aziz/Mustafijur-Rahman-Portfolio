"use client";

import { useActionState, useState, useRef, startTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  FileText,
  GripVertical,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import {
  createProject,
  updateProject,
  deleteProjectImage,
  type ProjectFormState,
} from "@/app/dashboard/projects/actions";
import DirectFileInput from "@/components/dashboard/DirectFileInput";
import { uploadFileDirect } from "@/lib/upload-client";
import type { ProjectWithImages } from "@/lib/projects";
import ConfirmSubmit from "./ConfirmSubmit";

const fieldClass =
  "w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-[#8DB355]";

const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45";

type GalleryFile = { key: string; name: string; url: string; uploading: boolean };

export default function ProjectForm({
  categorySlug,
  project,
}: {
  categorySlug: string;
  project?: ProjectWithImages;
}) {
  const isEdit = Boolean(project);
  const uploadFolder = project?.slug || categorySlug;

  const [state, formAction, isPending] = useActionState<ProjectFormState, FormData>(
    isEdit ? updateProject : createProject,
    { error: null },
  );

  const [coverUrl, setCoverUrl] = useState(project?.cover ?? "");
  const [pdfUrl, setPdfUrl] = useState(project?.pdfSrc ?? "");
  const [galleryFiles, setGalleryFiles] = useState<GalleryFile[]>([]);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState(
    project?.imageRecords ?? [],
  );
  const [draggedFileIndex, setDraggedFileIndex] = useState<number | null>(null);
  const [overFileIndex, setOverFileIndex] = useState<number | null>(null);
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
  const [overImageId, setOverImageId] = useState<string | null>(null);

  const imagesRef = useRef<HTMLInputElement>(null);

  function moveFile(from: number, to: number) {
    if (from === to || from < 0 || to < 0) return;
    setGalleryFiles((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
  }

  function moveExistingImage(dragged: string, target: string) {
    if (dragged === target) return;
    setExistingImages((prev) => {
      const arr = [...prev];
      const from = arr.findIndex((img) => img.id === dragged);
      const to = arr.findIndex((img) => img.id === target);
      if (from < 0 || to < 0) return prev;
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
  }

  async function handleImagesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (imagesRef.current) imagesRef.current.value = "";

    const pending = files.map((file) => ({
      file,
      key: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
    }));

    setGalleryError(null);
    setGalleryFiles((prev) => [
      ...prev,
      ...pending.map(({ file, key }) => ({
        key,
        name: file.name,
        url: "",
        uploading: true,
      })),
    ]);

    await Promise.all(
      pending.map(async ({ file, key }) => {
        try {
          const url = await uploadFileDirect(file, "image", uploadFolder);
          setGalleryFiles((prev) =>
            prev.map((item) =>
              item.key === key ? { ...item, url, uploading: false } : item,
            ),
          );
        } catch (error) {
          setGalleryFiles((prev) => prev.filter((item) => item.key !== key));
          setGalleryError(
            error instanceof Error ? error.message : "Image upload failed.",
          );
        }
      }),
    );
  }

  function removeGalleryFile(index: number) {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function removeExistingImage(id: string) {
    const fd = new FormData();
    fd.set("imageId", id);
    await deleteProjectImage(fd);
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (galleryFiles.some((item) => item.uploading)) {
      setGalleryError("Wait for the gallery images to finish uploading.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set(
      "newImages",
      JSON.stringify(galleryFiles.map((item) => item.url).filter(Boolean)),
    );
    startTransition(() => {
      formAction(formData);
    });
  }

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

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <input type="hidden" name="categorySlug" value={categorySlug} />
        {isEdit && <input type="hidden" name="projectId" value={project?.id} />}
        {isEdit && (
          <input
            type="hidden"
            name="imageOrder"
            value={JSON.stringify(existingImages.map((img) => img.id))}
          />
        )}

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
            {coverUrl && (
              <div className="mb-3 flex items-center gap-3">
                <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-cream/10">
                  <Image
                    src={coverUrl}
                    alt="Current cover"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <span className="text-xs text-cream/40">
                  {isEdit ? "Current cover" : "Selected cover"}
                </span>
              </div>
            )}
            <DirectFileInput
              urlName="coverUrl"
              accept="image/*"
              kind="cover"
              folder={uploadFolder}
              existingUrl={project?.cover ?? ""}
              label="Choose cover image"
              icon={<ImagePlus size={16} />}
              onUrlChange={setCoverUrl}
            />
          </div>

          <div>
            <span className={labelClass}>PDF file</span>
            {pdfUrl && (
              <div className="mb-3 flex items-center gap-3">
                <FileText size={20} className="text-[#8DB355]" />
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-xs text-cream/50 underline decoration-cream/20 hover:text-[#8DB355]"
                >
                  View current PDF
                </a>
              </div>
            )}
            <DirectFileInput
              urlName="pdfUrl"
              accept="application/pdf"
              kind="pdf"
              folder={uploadFolder}
              existingUrl={project?.pdfSrc ?? ""}
              label="Choose PDF"
              icon={<FileText size={16} />}
              onUrlChange={setPdfUrl}
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
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImagesChange}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => imagesRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 px-3.5 py-1.5 text-xs font-medium text-cream/60 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
            >
              <Upload size={13} />
              Add more images
            </button>
            <p className="text-xs text-cream/30">
              Select images multiple times; new selections are added. Drag
              thumbnails to reorder before saving.
            </p>
          </div>

          {galleryError && (
            <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {galleryError}
            </p>
          )}

          {galleryFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {galleryFiles.map((file, index) => (
                <div
                  key={file.key}
                  draggable
                  onDragStart={() => setDraggedFileIndex(index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (index !== draggedFileIndex) setOverFileIndex(index);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedFileIndex !== null && draggedFileIndex !== index) {
                      moveFile(draggedFileIndex, index);
                    }
                    setDraggedFileIndex(null);
                    setOverFileIndex(null);
                  }}
                  onDragEnd={() => {
                    setDraggedFileIndex(null);
                    setOverFileIndex(null);
                  }}
                  className={`relative overflow-hidden rounded-lg border transition-all ${
                    draggedFileIndex === index
                      ? "opacity-40"
                      : overFileIndex === index
                        ? "border-[#8DB355] ring-2 ring-[#8DB355]/40"
                        : "border-cream/10"
                  }`}
                >
                  {file.uploading ? (
                    <div className="flex aspect-[4/3] w-full items-center justify-center bg-black/30">
                      <Loader2
                        size={16}
                        className="animate-spin text-[#8DB355]"
                      />
                    </div>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={file.url}
                      alt={file.name}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeGalleryFile(index)}
                    className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-cream/70 transition-colors hover:text-red-400"
                    title="Remove"
                  >
                    <Trash2 size={12} />
                  </button>
                  <div className="flex items-center gap-1.5 px-2 py-1.5">
                    <GripVertical size={11} className="shrink-0 text-cream/40" />
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

      {isEdit && existingImages.length > 0 && (
        <section className="mt-10 border-t border-cream/10 pt-6">
          <h2 className={labelClass}>
            Current gallery images (drag to reorder, saved with Save changes)
          </h2>

          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {existingImages.map((image) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => setDraggedImageId(image.id)}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (image.id !== draggedImageId) setOverImageId(image.id);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedImageId && draggedImageId !== image.id) {
                    moveExistingImage(draggedImageId, image.id);
                  }
                  setDraggedImageId(null);
                  setOverImageId(null);
                }}
                onDragEnd={() => {
                  setDraggedImageId(null);
                  setOverImageId(null);
                }}
                className={`group relative overflow-hidden rounded-lg border transition-all ${
                  draggedImageId === image.id
                    ? "opacity-40"
                    : overImageId === image.id
                      ? "border-[#8DB355] ring-2 ring-[#8DB355]/40"
                      : "border-cream/10"
                }`}
              >
                <Image
                  src={image.imageUrl}
                  alt="Gallery image"
                  width={320}
                  height={240}
                  sizes="(max-width:640px) 33vw, 200px"
                  className="aspect-[4/3] w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(image.id)}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-cream/70 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                  title="Delete image"
                >
                  <Trash2 size={14} />
                </button>
                <div className="absolute bottom-1 left-1 rounded-full bg-black/60 p-1 text-cream/60">
                  <GripVertical size={12} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}