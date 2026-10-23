import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "node:stream";
import { createClient } from "@/lib/supabase/server";
import {
  friendlyR2Error,
  getR2Client,
  r2Bucket,
  r2PublicUrl,
  R2_PREFIX,
  type R2Kind,
} from "@/lib/r2";

/** Under this size a single PutObject is used — one API call, no multipart overhead. */
const SINGLE_PUT_LIMIT = 50 * 1024 * 1024;

/** R2/S3 require at least 5 MB per part (except the last one). */
const MULTIPART_PART_SIZE = 8 * 1024 * 1024;

function safeFileName(name: string) {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned || "file";
}

function safeFolder(folder: string) {
  const cleaned = folder
    .toLowerCase()
    .replace(/[^a-z0-9\-_/]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\/+|\/+$/g, "");

  return cleaned || "misc";
}

function buildKey(kind: R2Kind, folder: string, fileName: string) {
  return `${R2_PREFIX[kind]}/${safeFolder(folder)}/${Date.now()}-${safeFileName(fileName)}`;
}

/**
 * Supabase RLS used to gate uploads to signed-in users. R2 credentials live on
 * the server and bypass RLS entirely, so the check has to happen here — this is
 * the only place that touches the bucket credentials.
 */
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You are not signed in.");
  }
}

async function uploadToR2(
  kind: R2Kind,
  file: File,
  folder: string,
): Promise<string> {
  await requireUser();

  const bucket = r2Bucket();
  const key = buildKey(kind, folder, file.name);
  const client = getR2Client();
  const contentType = file.type || "application/octet-stream";

  try {
    if (file.size <= SINGLE_PUT_LIMIT) {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: new Uint8Array(await file.arrayBuffer()),
          ContentType: contentType,
          CacheControl: "3600",
        }),
      );
    } else {
      await new Upload({
        client,
        params: {
          Bucket: bucket,
          Key: key,
          Body: Readable.fromWeb(
            file.stream() as unknown as import("node:stream/web").ReadableStream,
          ),
          ContentType: contentType,
          CacheControl: "3600",
        },
        partSize: MULTIPART_PART_SIZE,
        queueSize: 4,
      }).done();
    }
  } catch (error) {
    throw new Error(friendlyR2Error(error));
  }

  return `${r2PublicUrl()}/${key}`;
}

export function uploadProjectCover(file: File, folder: string) {
  return uploadToR2("cover", file, folder);
}

export function uploadProjectImage(file: File, folder: string) {
  return uploadToR2("image", file, folder);
}

export function uploadProjectPdf(file: File, folder: string) {
  return uploadToR2("pdf", file, folder);
}

export function uploadProjectVideo(file: File, folder: string) {
  return uploadToR2("video", file, folder);
}

/**
 * `instanceof File` is not reliable for entries read out of a server action's
 * FormData: the action bundle and the FormData implementation can expose
 * different `File` classes, so a genuinely uploaded file fails the check and
 * the form reports "no image selected". Duck-typing holds either way.
 */
export function isUploadedFile(value: unknown): value is File {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as File;

  return (
    typeof candidate.size === "number" &&
    typeof candidate.name === "string" &&
    (typeof candidate.arrayBuffer === "function" ||
      typeof candidate.stream === "function")
  );
}
