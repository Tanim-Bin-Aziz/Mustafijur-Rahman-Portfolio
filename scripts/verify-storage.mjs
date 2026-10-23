// Shows where media actually lives right now:
//   1. how many objects are in the Cloudflare R2 bucket, per prefix
//   2. how many objects are still in the Supabase storage buckets
//   3. which host the URLs stored in Postgres point at
//
//   node scripts/verify-storage.mjs

import { createClient } from "@supabase/supabase-js";
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { loadEnvFile } from "./load-env.mjs";

loadEnvFile();

const R2_BUCKET_MAP = {
  "project-covers": "covers",
  "project-images": "images",
  "project-pdfs": "pdfs",
  "project-videos": "videos",
};

const URL_COLUMNS = [
  ["categories", "cover"],
  ["projects", "cover"],
  ["projects", "pdf_url"],
  ["project_images", "image_url"],
  ["gallery_images", "image_url"],
  ["showcase_images", "image_url"],
  ["showcase_images", "thumbnail_url"],
  ["certificates", "file_url"],
  ["cv_documents", "file_url"],
  ["clo3d_videos", "video_url"],
  ["about_cards", "cover"],
  ["page_videos", "cover"],
  ["page_videos", "video_url"],
  ["additional_work_videos", "video_url"],
  ["showcase_videos", "video_url"],
];

function env(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

const supabaseUrl = env("NEXT_PUBLIC_SUPABASE_URL").replace(/\/+$/, "");
const supabase = createClient(supabaseUrl, env("NEXT_PUBLIC_SUPABASE_ANON_KEY"));

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${env("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env("R2_ACCESS_KEY_ID"),
    secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
  },
});

const r2Bucket = process.env.R2_BUCKET || "portfolio-media";
const r2PublicUrl = env("R2_PUBLIC_URL").replace(/\/+$/, "");

async function countR2() {
  const counts = {};
  let token;

  do {
    const response = await r2.send(
      new ListObjectsV2Command({ Bucket: r2Bucket, ContinuationToken: token }),
    );

    for (const object of response.Contents ?? []) {
      const prefix = object.Key.split("/")[0];
      counts[prefix] = (counts[prefix] ?? 0) + 1;
    }

    token = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (token);

  return counts;
}

async function countSupabase(bucket, prefix = "") {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(prefix, { limit: 1000 });

  if (error) throw new Error(`${bucket}: ${error.message}`);

  let count = 0;

  for (const entry of data ?? []) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;

    // Supabase returns folders with a null id.
    if (entry.id === null) {
      count += await countSupabase(bucket, path);
    } else {
      count += 1;
    }
  }

  return count;
}

async function countDbHosts() {
  const tally = { r2: 0, supabase: 0, local: 0, other: 0 };
  const otherHosts = new Map();

  const noteHost = (value) => {
    try {
      const host = new URL(value).host;
      otherHosts.set(host, (otherHosts.get(host) ?? 0) + 1);
    } catch {
      otherHosts.set("(not a url)", (otherHosts.get("(not a url)") ?? 0) + 1);
    }
  };

  for (const [table, column] of URL_COLUMNS) {
    const { data, error } = await supabase
      .from(table)
      .select(column)
      .limit(5000);

    if (error) {
      console.log(`  (skipped ${table}.${column}: ${error.message})`);
      continue;
    }

    for (const row of data ?? []) {
      const value = row[column];
      if (!value) continue;

      if (value.startsWith(r2PublicUrl)) tally.r2 += 1;
      else if (value.includes("supabase.co/storage/")) tally.supabase += 1;
      else if (value.startsWith("/")) tally.local += 1;
      else {
        tally.other += 1;
        noteHost(value);
      }
    }
  }

  // Profile settings keeps its URLs inside a jsonb blob.
  const { data: profile } = await supabase
    .from("profile_settings")
    .select("data")
    .limit(10);

  for (const row of profile ?? []) {
    const text = JSON.stringify(row.data ?? {});
    tally.r2 += (text.match(new RegExp(r2PublicUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length;
    tally.supabase += (text.match(/supabase\.co\/storage\//g) ?? []).length;
  }

  return { tally, otherHosts };
}

async function main() {
  console.log(`R2 bucket     : ${r2Bucket}`);
  console.log(`R2 public URL : ${r2PublicUrl}\n`);

  console.log("Objects in Cloudflare R2");
  const r2Counts = await countR2();
  const r2Total = Object.values(r2Counts).reduce((sum, n) => sum + n, 0);

  if (r2Total === 0) {
    console.log("  (none yet)");
  } else {
    for (const [prefix, count] of Object.entries(r2Counts).sort()) {
      console.log(`  ${prefix.padEnd(10)} ${count}`);
    }
    console.log(`  ${"total".padEnd(10)} ${r2Total}`);
  }

  console.log("\nObjects still in Supabase Storage");
  for (const bucket of Object.keys(R2_BUCKET_MAP)) {
    try {
      const count = await countSupabase(bucket);
      console.log(`  ${bucket.padEnd(16)} ${count}`);
    } catch (error) {
      console.log(`  ${bucket.padEnd(16)} error: ${error.message}`);
    }
  }

  console.log("\nWhere the URLs stored in Postgres point");
  const { tally, otherHosts } = await countDbHosts();
  console.log(`  Cloudflare R2 (${r2PublicUrl.replace(/^https?:\/\//, "")}) : ${tally.r2}`);
  console.log(`  Supabase Storage                                     : ${tally.supabase}`);
  console.log(`  Local files (/images/...)                            : ${tally.local}`);
  console.log(`  Other / hand-typed URLs                              : ${tally.other}`);

  if (otherHosts.size > 0) {
    console.log("    other hosts:");
    for (const [host, count] of [...otherHosts].sort((a, b) => b[1] - a[1])) {
      console.log(`      ${host.padEnd(40)} ${count}`);
    }
  }

  if (tally.supabase > 0) {
    console.log(
      "\n  Supabase URLs are still in the database — run scripts/migrate-to-r2.mjs --apply",
    );
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
