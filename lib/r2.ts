import { S3Client } from "@aws-sdk/client-s3";

export const R2_PREFIX = {
  cover: "covers",
  image: "images",
  pdf: "pdfs",
  video: "videos",
} as const;

export type R2Kind = keyof typeof R2_PREFIX;

export function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `R2 storage is not configured: missing ${name}. Add it to .env and restart the server.`,
    );
  }

  return value;
}

export function r2Bucket(): string {
  return process.env.R2_BUCKET || "portfolio-media";
}

export function r2PublicUrl(): string {
  // The r2.dev hostname is a separate random id (pub-<hash>.r2.dev), not the
  // account id, so it cannot be derived — it has to be configured.
  return requiredEnv("R2_PUBLIC_URL").replace(/\/+$/, "");
}

let client: S3Client | null = null;

/**
 * Buckets created in a jurisdiction are only reachable through that
 * jurisdiction's endpoint. Defaults to the standard one.
 */
function r2Endpoint(accountId: string): string {
  const jurisdiction = (process.env.R2_JURISDICTION || "").trim().toLowerCase();
  const prefix =
    jurisdiction && jurisdiction !== "default" ? `${jurisdiction}.` : "";

  return `https://${accountId}.${prefix}r2.cloudflarestorage.com`;
}

export function getR2Client(): S3Client {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: r2Endpoint(requiredEnv("R2_ACCOUNT_ID")),
      credentials: {
        accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
        secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
      },
    });
  }

  return client;
}

export function friendlyR2Error(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("R2 storage is not configured")) {
      return error.message;
    }

    const name = (error as { name?: string }).name ?? "";

    if (name === "NoSuchBucket") {
      return `R2 bucket "${r2Bucket()}" does not exist. Create it in the Cloudflare R2 dashboard.`;
    }

    if (name === "AccessDenied" || error.message.includes("Access Denied")) {
      return "R2 access denied. Check the R2 API token has Object Read & Write for this bucket.";
    }

    if (name === "SignatureDoesNotMatch" || error.message.includes("SignatureDoesNotMatch")) {
      return "R2 credentials are wrong. Check R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY.";
    }

    if (name === "EntityTooLarge" || error.message.includes("EntityTooLarge")) {
      return "That file is too large for R2. Maximum single upload is 5 GB.";
    }

    return `R2 upload failed: ${error.message}`;
  }

  return "R2 upload failed.";
}
