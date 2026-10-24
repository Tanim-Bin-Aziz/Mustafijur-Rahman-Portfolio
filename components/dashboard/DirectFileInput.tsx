"use client";

import { useRef, useState, type ReactNode } from "react";
import { Check, Loader2 } from "lucide-react";
import { uploadFileDirect } from "@/lib/upload-client";
import type { R2Kind } from "@/lib/r2";

const fieldClass =
  "w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-[#8DB355]";

/**
 * File picker that uploads straight to R2 and posts only the resulting URL.
 * The bytes never reach a Server Action, so Vercel's 4.5 MB request limit
 * (FUNCTION_PAYLOAD_TOO_LARGE) no longer applies to uploads.
 */
export default function DirectFileInput({
  urlName,
  accept,
  kind,
  folder,
  existingUrl = "",
  label,
  icon,
  maxBytes,
  maxLabel,
  placeholder = "https://...",
  hint,
  onUrlChange,
}: {
  urlName: string;
  accept: string;
  /**
   * Upload kind, or a resolver when one field accepts several types
   * (certificates take either an image or a PDF).
   */
  kind: R2Kind | ((file: File) => R2Kind);
  folder: string;
  existingUrl?: string;
  label: string;
  icon: ReactNode;
  maxBytes?: number;
  maxLabel?: string;
  placeholder?: string;
  hint?: ReactNode;
  onUrlChange?: (url: string) => void;
}) {
  const inputId = `${urlName}-file`;
  const inputRef = useRef<HTMLInputElement>(null);

  const [url, setUrl] = useState(existingUrl);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function applyUrl(next: string) {
    setUrl(next);
    onUrlChange?.(next);
  }

  async function handleFile(file: File) {
    if (maxBytes && file.size > maxBytes) {
      if (inputRef.current) inputRef.current.value = "";
      setFileName("");
      setError(
        `That file is ${(file.size / 1024 / 1024).toFixed(0)} MB. Maximum is ${maxLabel}.`,
      );
      return;
    }

    setError(null);
    setUploading(true);

    try {
      applyUrl(
        await uploadFileDirect(
          file,
          typeof kind === "function" ? kind(file) : kind,
          folder,
        ),
      );
      setFileName(file.name);
    } catch (uploadError) {
      if (inputRef.current) inputRef.current.value = "";
      setFileName("");
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <label
        htmlFor={inputId}
        className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-dashed border-cream/15 px-4 py-3 text-sm text-cream/50 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
      >
        {uploading ? (
          <>
            <Loader2 size={16} className="animate-spin text-[#8DB355]" />
            <span className="truncate text-cream/70">Uploading…</span>
          </>
        ) : fileName ? (
          <>
            <Check size={16} className="text-[#8DB355]" />
            <span className="truncate text-cream/70">{fileName}</span>
          </>
        ) : (
          <>
            {icon}
            {label}
          </>
        )}
      </label>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {error && (
        <p className="mt-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <p className="mt-3 text-xs text-cream/30">
        {uploading
          ? "Uploading straight to R2 — this can take a moment for large files."
          : "Or paste a URL below (used when no file is chosen):"}
      </p>
      <input
        name={urlName}
        value={url}
        placeholder={placeholder}
        className={`${fieldClass} mt-2`}
        onChange={(event) => applyUrl(event.target.value)}
      />

      {hint}
    </>
  );
}
