import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@/lib/supabase/server";
import {
  getR2Client,
  r2Bucket,
  r2PublicUrl,
  R2_PREFIX,
  type R2Kind,
} from "@/lib/r2";

/**
 * Uploads go straight from the browser to R2. Vercel caps a Function's request
 * body at 4.5 MB, so a file can never travel through a Server Action — the
 * action only hands out a presigned PUT URL and the browser does the transfer.
 */
const UPLOAD_URL_TTL_SECONDS = 600;

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

export function buildKey(kind: R2Kind, folder: string, fileName: string) {
  return `${R2_PREFIX[kind]}/${safeFolder(folder)}/${Date.now()}-${safeFileName(fileName)}`;
}

/**
 * Supabase RLS used to gate uploads to signed-in users. R2 credentials live on
 * the server, so the check has to happen here — this is the only place that
 * mints upload URLs.
 */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You are not signed in.");
  }
}

export async function createPresignedUpload(
  kind: R2Kind,
  folder: string,
  fileName: string,
  contentType: string,
): Promise<{ uploadUrl: string; publicUrl: string }> {
  await requireUser();

  const key = buildKey(kind, folder, fileName);

  // ContentType is part of the signature, so the browser has to send back the
  // exact same header on the PUT or R2 answers SignatureDoesNotMatch.
  const uploadUrl = await getSignedUrl(
    getR2Client(),
    new PutObjectCommand({
      Bucket: r2Bucket(),
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: UPLOAD_URL_TTL_SECONDS },
  );

  return { uploadUrl, publicUrl: `${r2PublicUrl()}/${key}` };
}
