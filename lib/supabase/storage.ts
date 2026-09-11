import { createClient } from "./server";

export const STORAGE_BUCKETS = {
  cover: "project-covers",
  image: "project-images",
  pdf: "project-pdfs",
} as const;

function safeFileName(name: string) {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned || "file";
}

async function uploadToBucket(
  bucket: string,
  file: File,
  folder: string,
): Promise<string> {
  const supabase = await createClient();

  const path = `${folder}/${Date.now()}-${safeFileName(file.name)}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed (${bucket}): ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
}

export function uploadProjectCover(file: File, folder: string) {
  return uploadToBucket(STORAGE_BUCKETS.cover, file, folder);
}

export function uploadProjectImage(file: File, folder: string) {
  return uploadToBucket(STORAGE_BUCKETS.image, file, folder);
}

export function uploadProjectPdf(file: File, folder: string) {
  return uploadToBucket(STORAGE_BUCKETS.pdf, file, folder);
}
