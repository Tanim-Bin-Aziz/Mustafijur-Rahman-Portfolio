"use client";

import { useActionState, useState, useRef, useEffect, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, ImagePlus, Loader2 } from "lucide-react";
import {
  addShowcaseImage,
  editShowcaseImage,
  type ShowcaseFormState,
} from "@/app/dashboard/showcase/actions";
import DirectFileInput from "@/components/dashboard/DirectFileInput";
import { uploadFileDirect } from "@/lib/upload-client";
import type { ShowcaseImage } from "@/lib/showcase";

const fieldClass =
  "w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-[#8DB355]";

const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45";

export default function ShowcaseImageForm({
  image,
}: {
  image?: ShowcaseImage;
}) {
  const isEdit = Boolean(image);

  const [state, formAction, isPending] = useActionState<
    ShowcaseFormState,
    FormData
  >(isEdit ? editShowcaseImage : addShowcaseImage, { error: null });

  const [previewUrl, setPreviewUrl] = useState(image?.imageUrl ?? "");

  const [thumbUrl, setThumbUrl] = useState(image?.thumbnailUrl ?? "");
  const [thumbPreviewUrl, setThumbPreviewUrl] = useState(
    image?.thumbnailUrl ?? "",
  );
  const [thumbUploading, setThumbUploading] = useState(false);
  const [thumbError, setThumbError] = useState<string | null>(null);
  const thumbUrlRef = useRef<HTMLInputElement>(null);

  const [offsetX, setOffsetX] = useState(image?.cardOffsetX ?? 50);
  const [offsetY, setOffsetY] = useState(image?.cardOffsetY ?? 50);
  const [scale, setScale] = useState(image?.cardScale ?? 1);
  const cropRef = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const CROP_W = 120;
  const CROP_H = 173;

  const generateCropFile = async (): Promise<File | null> => {
    const imgEl = previewImgRef.current;
    if (!imgEl || !previewUrl) return null;
    const displayW = imgEl.clientWidth;
    const displayH = imgEl.clientHeight;
    if (!displayW || !displayH) return null;

    const cropW = CROP_W / scale;
    const cropH = CROP_H / scale;
    let left = (offsetX / 100) * displayW - cropW / 2;
    let top = (offsetY / 100) * displayH - cropH / 2;
    left = Math.max(0, Math.min(displayW - cropW, left));
    top = Math.max(0, Math.min(displayH - cropH, top));

    const source = new window.Image();
    source.crossOrigin = "anonymous";
    source.src = previewUrl;
    try {
      await source.decode();
      const scaleX = source.naturalWidth / displayW;
      const scaleY = source.naturalHeight / displayH;
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 368;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(
        source,
        left * scaleX,
        top * scaleY,
        cropW * scaleX,
        cropH * scaleY,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) return null;
      return new File([blob], "card-crop.png", { type: "image/png" });
    } catch {
      return null;
    }
  };

  const applyThumbUrl = (url: string) => {
    setThumbUrl(url);
    setThumbPreviewUrl(url);
    if (thumbUrlRef.current) thumbUrlRef.current.value = url;
  };

  const handleThumbFile = async (file: File) => {
    setThumbUploading(true);
    setThumbError(null);

    try {
      applyThumbUrl(await uploadFileDirect(file, "image", "showcase"));
    } catch (error) {
      setThumbError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setThumbUploading(false);
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    if (submittingRef.current) return;
    e.preventDefault();

    // No explicit thumbnail? Derive one from the card crop so the ring card
    // still shows the chosen area. An uploaded thumbnail always wins.
    if (previewUrl && !thumbUrl) {
      const file = await generateCropFile();
      if (file) {
        try {
          applyThumbUrl(await uploadFileDirect(file, "image", "showcase"));
        } catch (error) {
          setThumbError(
            error instanceof Error ? error.message : "Upload failed.",
          );
          return;
        }
      }
    }

    submittingRef.current = true;
    formRef.current?.requestSubmit();
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      const frame = cropRef.current;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      const cropW = CROP_W / scale;
      const cropH = CROP_H / scale;
      const minX = (cropW / 2 / rect.width) * 100;
      const maxX = 100 - minX;
      const minY = (cropH / 2 / rect.height) * 100;
      const maxY = 100 - minY;
      setOffsetX((prev) =>
        Math.max(minX, Math.min(maxX, prev + (dx / rect.width) * 100)),
      );
      setOffsetY((prev) =>
        Math.max(minY, Math.min(maxY, prev + (dy / rect.height) * 100)),
      );
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [scale]);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/showcase"
        className="mb-6 inline-flex items-center gap-2 text-sm text-cream/50 transition-colors hover:text-[#8DB355]"
      >
        <ArrowLeft size={15} />
        Back to showcase
      </Link>

      <h1 className="font-serif text-2xl font-semibold text-cream">
        {isEdit ? "Edit showcase image" : "Add showcase image"}
      </h1>
      <p className="mt-1.5 text-sm text-cream/45">
        {isEdit
          ? "Update the image, title or details."
          : "Upload an image for the Showcase Gallery on the homepage."}
      </p>

      {state.error && (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <form
        ref={formRef}
        action={formAction}
        onSubmit={handleFormSubmit}
        className="mt-8 space-y-6"
      >
        {isEdit && <input type="hidden" name="imageId" value={image?.id} />}

        <div>
          <label className={labelClass} htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={image?.title ?? ""}
            placeholder="The Palm Court Residences"
            className={fieldClass}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="category">
              Category
            </label>
            <input
              id="category"
              name="category"
              defaultValue={image?.category ?? ""}
              placeholder="VILLAS"
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
              defaultValue={image?.location ?? ""}
              placeholder="DUBAI"
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="sortOrder">
            Sort order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={image?.sortOrder ?? 0}
            className={fieldClass}
          />
          <p className="mt-1.5 text-xs text-cream/30">
            Lower numbers appear first in the gallery ring.
          </p>
        </div>

        <div>
          <span className={labelClass}>Image</span>

          {previewUrl && (
            <div className="mb-4 flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-cream/10">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-cream/40">
                {isEdit ? "Current image" : "Selected image"}
              </span>
            </div>
          )}

          <DirectFileInput
            urlName="imageUrl"
            accept="image/*"
            kind="image"
            folder="showcase"
            existingUrl={image?.imageUrl ?? ""}
            label="Choose image file"
            icon={<ImagePlus size={16} />}
            onUrlChange={setPreviewUrl}
          />
        </div>

        <div>
          <span className={labelClass}>Thumbnail (ring card crop)</span>
          <p className="mb-3 text-xs text-cream/30">
            Optional. Used for the fixed-size card in the Showcase Gallery ring.
            Upload a cropped version of the image to control which area is shown.
          </p>

          {thumbPreviewUrl && (
            <div className="mb-4 flex items-center gap-4">
              <div
                className="relative shrink-0 overflow-hidden rounded-lg border border-cream/10"
                style={{ width: 64, height: 92 }}
              >
                <Image
                  src={thumbPreviewUrl}
                  alt="Thumbnail preview"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-cream/40">
                {isEdit ? "Current thumbnail" : "Selected thumbnail"} — fixed
                card preview
              </span>
            </div>
          )}

          <label
            htmlFor="thumbnail"
            className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-dashed border-cream/15 px-4 py-3 text-sm text-cream/50 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
          >
            {thumbUploading ? (
              <>
                <Loader2 size={16} className="animate-spin text-[#8DB355]" />
                <span className="truncate text-cream/70">Uploading…</span>
              </>
            ) : thumbUrl ? (
              <>
                <Check size={16} className="text-[#8DB355]" />
                <span className="truncate text-cream/70">Thumbnail ready</span>
              </>
            ) : (
              <>
                <ImagePlus size={16} />
                Choose thumbnail file
              </>
            )}
          </label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleThumbFile(file);
            }}
          />

          {thumbError && (
            <p className="mt-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {thumbError}
            </p>
          )}

          <p className="mt-3 text-xs text-cream/30">
            Or paste a URL below (used when no file is chosen):
          </p>
          <input
            ref={thumbUrlRef}
            name="thumbnailUrl"
            value={thumbUrl}
            placeholder="https://..."
            className={`${fieldClass} mt-2`}
            onChange={(e) => {
              setThumbUrl(e.target.value);
              setThumbPreviewUrl(e.target.value);
            }}
          />
        </div>

        <div>
          <span className={labelClass}>Card crop (drag to set view angle)</span>
          <p className="mb-3 text-xs text-cream/30">
            Drag the image inside the frame to choose which area shows on the
            fixed-size ring card. Scroll to zoom.
          </p>

          <input type="hidden" name="cardOffsetX" value={offsetX} />
          <input type="hidden" name="cardOffsetY" value={offsetY} />
          <input type="hidden" name="cardScale" value={scale} />

          <div
            ref={cropRef}
            className="relative mx-auto overflow-hidden rounded-lg border border-cream/10 bg-black/40"
            style={{ width: 320 }}
            onWheel={(e) => {
              e.preventDefault();
              setScale((s) => {
                const next = s - e.deltaY * 0.001;
                return Math.min(3, Math.max(1, next));
              });
            }}
          >
            {previewUrl && (
              <img
                ref={previewImgRef}
                src={previewUrl}
                alt="Crop preview"
                className="block h-auto w-full"
                draggable={false}
              />
            )}
            {previewUrl && (
              <div
                className="absolute cursor-grab border-2 border-[#8DB355] bg-[#8DB355]/10 active:cursor-grabbing"
                style={{
                  left: `${offsetX}%`,
                  top: `${offsetY}%`,
                  width: CROP_W / scale,
                  height: CROP_H / scale,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  dragging.current = true;
                  lastPos.current = { x: e.clientX, y: e.clientY };
                }}
              >
                <span className="absolute -top-6 left-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-[#8DB355]">
                  Card view
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-cream/40">
            <button
              type="button"
              onClick={() =>
                setScale((s) => Math.max(1, +(s - 0.1).toFixed(2)))
              }
              className="rounded-full border border-cream/10 px-3 py-1 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
            >
              Zoom out
            </button>
            <button
              type="button"
              onClick={() =>
                setScale((s) => Math.min(3, +(s + 0.1).toFixed(2)))
              }
              className="rounded-full border border-cream/10 px-3 py-1 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
            >
              Zoom in
            </button>
            <button
              type="button"
              onClick={() => {
                setOffsetX(50);
                setOffsetY(50);
                setScale(1);
              }}
              className="rounded-full border border-cream/10 px-3 py-1 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
            >
              Reset
            </button>
            <span>
              X: {offsetX.toFixed(0)}% · Y: {offsetY.toFixed(0)}% · Zoom:{" "}
              {scale.toFixed(2)}x
            </span>
          </div>
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
            href="/dashboard/showcase"
            className="rounded-full border border-cream/10 px-6 py-2.5 text-sm text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
