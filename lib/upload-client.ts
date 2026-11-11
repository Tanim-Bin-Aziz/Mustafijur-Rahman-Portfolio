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
  onProgress?: (percent: number) => void,
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

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", ticket.uploadUrl);
    // Must match the ContentType the URL was signed with.
    xhr.setRequestHeader("Content-Type", contentType);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve();
        return;
      }
      reject(
        new Error(
          `R2 rejected the upload (${xhr.status}). Check the bucket's CORS policy and API token permissions.`,
        ),
      );
    };

    xhr.onerror = () =>
      reject(
        new Error(
          "The browser blocked this upload. Check the R2 bucket CORS policy allows PUT from this site.",
        ),
      );

    xhr.onabort = () => reject(new Error("Upload cancelled."));

    xhr.send(file);
  });

  return ticket.publicUrl;
}
