"use server";

import { R2_PREFIX, friendlyR2Error, type R2Kind } from "@/lib/r2";
import { createPresignedUpload } from "@/lib/storage";

export type UploadTicket =
  | { uploadUrl: string; publicUrl: string }
  | { error: string };

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];

function isImage(name: string, type: string) {
  return (
    type.startsWith("image/") ||
    IMAGE_EXTENSIONS.some((extension) => name.endsWith(extension))
  );
}

function isPdf(name: string, type: string) {
  return type === "application/pdf" || name.endsWith(".pdf");
}

function isVideo(name: string, type: string) {
  return type.startsWith("video/") || name.endsWith(".mp4") || name.endsWith(".webm");
}

function allowedFor(kind: R2Kind, name: string, type: string) {
  switch (kind) {
    case "cover":
    case "image":
      return isImage(name, type);
    case "pdf":
      return isPdf(name, type);
    case "video":
      return isVideo(name, type);
    default:
      return false;
  }
}

/**
 * Mint a short-lived URL the browser PUTs the file to. Only metadata travels
 * through this action, so it stays far below Vercel's 4.5 MB body limit.
 */
export async function createUploadUrl(input: {
  kind: string;
  folder: string;
  name: string;
  type: string;
}): Promise<UploadTicket> {
  const kind = input.kind as R2Kind;

  if (!(kind in R2_PREFIX)) {
    return { error: "Unknown upload type." };
  }

  const name = String(input.name || "").trim();
  const type = String(input.type || "").trim();

  if (!name) return { error: "The selected file has no name." };
  if (!allowedFor(kind, name.toLowerCase(), type)) {
    return { error: `That file type is not allowed for ${kind} uploads.` };
  }

  try {
    return await createPresignedUpload(
      kind,
      String(input.folder || ""),
      name,
      type || "application/octet-stream",
    );
  } catch (error) {
    return { error: friendlyR2Error(error) };
  }
}
