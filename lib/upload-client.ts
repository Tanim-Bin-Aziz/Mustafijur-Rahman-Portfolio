"use client";

import { createUploadUrl } from "@/app/dashboard/upload/actions";
import type { R2Kind } from "@/lib/r2";

/**
 * Sends one file from the browser straight to R2 and returns its public URL.
 * Files never pass through a Server Action, which is what keeps uploads of any
 * size working on Vercel (its Function body limit is 4.5 MB).
 */
export async function uploadFileDirect(
  file: File,
  kind: R2Kind,
  folder: string,
): Promise<string> {
  const ticket = await createUploadUrl({
    kind,
    folder,
    name: file.name,
    type: file.type,
  });

  if ("error" in ticket) {
    throw new Error(ticket.error);
  }

  const contentType = file.type || "application/octet-stream";

  let response: Response;

  try {
    response = await fetch(ticket.uploadUrl, {
      method: "PUT",
      // Must match the ContentType the URL was signed with.
      headers: { "Content-Type": contentType },
      body: file,
    });
  } catch {
    throw new Error(
      "The browser blocked this upload. Check the R2 bucket CORS policy allows PUT from this site.",
    );
  }

  if (!response.ok) {
    throw new Error(
      `R2 rejected the upload (${response.status}). Check the bucket's CORS policy and API token permissions.`,
    );
  }

  return ticket.publicUrl;
}
