"use client";

import { useActionState, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Loader2,
} from "lucide-react";
import {
  addGalleryImage,
  editGalleryImage,
  type PictureFormState,
} from "@/app/dashboard/pictures/actions";
import type { GalleryFolder, GalleryImage } from "@/lib/gallery";

const fieldClass =
  "w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-[#8DB355]";

const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45";

export default function ImageForm({
  folders,
  image,
}: {
  folders: GalleryFolder[];
  image?: GalleryImage & { folder?: GalleryFolder | null };
}) {
  const isEdit = Boolean(image);

  const [state, formAction, isPending] = useActionState<PictureFormState, FormData>(
    isEdit ? editGalleryImage : addGalleryImage,
    { error: null },
  );

  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(image?.imageUrl ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  const activeFolderSlug =
    folders.find((f) => f.id === (image?.folderId ?? folders[0]?.id))?.slug ??
    "gallery";

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/pictures"
        className="mb-6 inline-flex items-center gap-2 text-sm text-cream/50 transition-colors hover:text-[#8DB355]"
      >
        <ArrowLeft size={15} />
        Back to pictures
      </Link>

      <h1 className="font-serif text-2xl font-semibold text-cream">
        {isEdit ? "Edit image" : "Add image"}
      </h1>
      <p className="mt-1.5 text-sm text-cream/45">
        {isEdit
          ? "Update the image details, title or date."
          : "Upload an image and add it to a folder."}
      </p>

      {state.error && (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <form action={formAction} className="mt-8 space-y-6">
        {isEdit && <input type="hidden" name="imageId" value={image?.id} />}
        <input type="hidden" name="folderSlug" value={activeFolderSlug} />

        <div>
          <label className={labelClass} htmlFor="folderId">
            Folder
          </label>
          <select
            id="folderId"
            name="folderId"
            defaultValue={image?.folderId ?? folders[0]?.id ?? ""}
            className={fieldClass}
          >
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={image?.title ?? ""}
            placeholder="Editorial Shot 01"
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
            type="date"
            defaultValue={image?.date ?? ""}
            className={fieldClass}
          />
        </div>

        <div>
          <span className={labelClass}>Image</span>

          {(previewUrl || image?.imageUrl) && (
            <div className="mb-4 flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-cream/10">
                <Image
                  src={previewUrl || image?.imageUrl || ""}
                  alt="Preview"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-cream/40">
                {isEdit ? "Current image" : "Existing image"}
              </span>
            </div>
          )}

          <label
            htmlFor="image"
            className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-dashed border-cream/15 px-4 py-3 text-sm text-cream/50 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
          >
            {fileName ? (
              <>
                <Check size={16} className="text-[#8DB355]" />
                <span className="truncate text-cream/70">{fileName}</span>
              </>
            ) : (
              <>
                <ImagePlus size={16} />
                Choose image file
              </>
            )}
          </label>
          <input
            ref={fileRef}
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setFileName(file?.name || "");
              if (file) {
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
          />

          <p className="mt-3 text-xs text-cream/30">
            Or paste a URL below (used when no file is chosen):
          </p>
          <input
            name="imageUrl"
            defaultValue={image?.imageUrl ?? ""}
            placeholder="https://..."
            className={`${fieldClass} mt-2`}
            onChange={(e) => setPreviewUrl(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 border-t border-cream/10 pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-6 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending && <Loader2 size={15} className="animate-spin" />}
            {isEdit ? "Save changes" : "Add image"}
          </button>

          <Link
            href="/dashboard/pictures"
            className="rounded-full border border-cream/10 px-6 py-2.5 text-sm text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
