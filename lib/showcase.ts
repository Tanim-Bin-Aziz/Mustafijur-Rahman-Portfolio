import { createClient } from "./supabase/server";
import { SHOWCASE_RING, type ShowcaseRingItem } from "@/data/showcase";

export const SHOWCASE_MIGRATION = "lib/supabase/migrations/003_showcase.sql";

export interface ShowcaseImage {
  id: string;
  title: string;
  category: string;
  location: string;
  imageUrl: string;
  videoUrl: string;
  sortOrder: number;
}

interface ShowcaseImageRow {
  id: string;
  title: string;
  category: string;
  location: string;
  image_url: string;
  video_url: string | null;
  sort_order: number;
}

const IMAGE_SELECT =
  "id, title, category, location, image_url, video_url, sort_order";

function toImage(row: ShowcaseImageRow): ShowcaseImage {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    location: row.location,
    imageUrl: row.image_url,
    videoUrl: row.video_url ?? "",
    sortOrder: row.sort_order,
  };
}

function isMissingTable(message: string) {
  return (
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("42P01")
  );
}

export function friendlyShowcaseError(message: string): string {
  if (isMissingTable(message)) {
    return `Showcase table not found. Run the SQL in ${SHOWCASE_MIGRATION} in your Supabase project first.`;
  }
  if (message.includes("video_url")) {
    return `video_url column not found. Run the SQL in lib/supabase/migrations/009_showcase_video.sql in your Supabase project first.`;
  }
  return message;
}

export async function getShowcaseImages(): Promise<ShowcaseImage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("showcase_images")
    .select(IMAGE_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (!isMissingTable(error.message)) {
      console.error("getShowcaseImages failed:", error.message);
    }
    return [];
  }

  return ((data ?? []) as unknown as ShowcaseImageRow[]).map(toImage);
}

export async function getShowcaseImage(
  id: string,
): Promise<ShowcaseImage | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("showcase_images")
    .select(IMAGE_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getShowcaseImage failed:", error.message);
    return null;
  }

  return data ? toImage(data as unknown as ShowcaseImageRow) : null;
}

export async function getShowcaseItems(): Promise<ShowcaseRingItem[]> {
  const images = await getShowcaseImages();

  if (images.length === 0) return SHOWCASE_RING;

  return images.map((image) => ({
    src: image.imageUrl,
    title: image.title,
    category: image.category,
    location: image.location,
    videoUrl: image.videoUrl || undefined,
  }));
}

export async function createShowcaseImage(values: {
  title: string;
  category: string;
  location: string;
  imageUrl: string;
  sortOrder: number;
}): Promise<{ id: string | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("showcase_images")
    .insert({
      title: values.title,
      category: values.category,
      location: values.location,
      image_url: values.imageUrl,
      sort_order: values.sortOrder,
    })
    .select("id")
    .single();

  if (error) {
    console.error("createShowcaseImage failed:", error.message);
    return { id: null, error: friendlyShowcaseError(error.message) };
  }

  return { id: data.id, error: null };
}

export async function updateShowcaseImage(
  id: string,
  values: {
    title: string;
    category: string;
    location: string;
    imageUrl: string;
    sortOrder: number;
  },
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("showcase_images")
    .update({
      title: values.title,
      category: values.category,
      location: values.location,
      image_url: values.imageUrl,
      sort_order: values.sortOrder,
    })
    .eq("id", id);

  if (error) {
    console.error("updateShowcaseImage failed:", error.message);
    return { ok: false, error: friendlyShowcaseError(error.message) };
  }

  return { ok: true, error: null };
}

export async function deleteShowcaseImage(id: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("showcase_images")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteShowcaseImage failed:", error.message);
    return false;
  }

  return true;
}

// Showcase card-er looping background video — Video Management theke hoy
export async function updateShowcaseVideo(
  id: string,
  videoUrl: string,
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("showcase_images")
    .update({ video_url: videoUrl })
    .eq("id", id);

  if (error) {
    console.error("updateShowcaseVideo failed:", error.message);
    return { ok: false, error: friendlyShowcaseError(error.message) };
  }

  return { ok: true, error: null };
}

/* ---------------------------------------------------------
   Home page "Showcase" section — looping video cards
   (PixelWarpGallery), managed in Video Management
--------------------------------------------------------- */
export const SHOWCASE_VIDEOS_MIGRATION =
  "lib/supabase/migrations/011_showcase_videos.sql";

export interface ShowcaseVideoCard {
  id: string;
  label: string;
  videoUrl: string;
  sortOrder: number;
}

interface ShowcaseVideoCardRow {
  id: string;
  label: string;
  video_url: string;
  sort_order: number;
}

const SHOWCASE_VIDEO_CARD_SELECT = "id, label, video_url, sort_order";

function toShowcaseVideoCard(row: ShowcaseVideoCardRow): ShowcaseVideoCard {
  return {
    id: row.id,
    label: row.label,
    videoUrl: row.video_url,
    sortOrder: row.sort_order,
  };
}

export function friendlyShowcaseVideosError(message: string): string {
  if (isMissingTable(message)) {
    return `Showcase videos table not found. Run the SQL in ${SHOWCASE_VIDEOS_MIGRATION} in your Supabase project first.`;
  }
  return message;
}

export async function getShowcaseVideoCards(): Promise<ShowcaseVideoCard[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("showcase_videos")
    .select(SHOWCASE_VIDEO_CARD_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (!isMissingTable(error.message)) {
      console.error("getShowcaseVideoCards failed:", error.message);
    }
    // Table na thakle site same dekhay — default card
    return [
      { id: "default", label: "Motion 01", videoUrl: "/video/1.mp4", sortOrder: 1 },
    ];
  }

  return ((data ?? []) as unknown as ShowcaseVideoCardRow[]).map(
    toShowcaseVideoCard,
  );
}

export async function createShowcaseVideoCard(values: {
  label: string;
  videoUrl: string;
}): Promise<{ id: string | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("showcase_videos")
    .insert({ label: values.label, video_url: values.videoUrl })
    .select("id")
    .single();

  if (error) {
    console.error("createShowcaseVideoCard failed:", error.message);
    return { id: null, error: friendlyShowcaseVideosError(error.message) };
  }

  return { id: data.id, error: null };
}

export async function updateShowcaseVideoCard(
  id: string,
  values: { label: string; videoUrl: string },
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("showcase_videos")
    .update({ label: values.label, video_url: values.videoUrl })
    .eq("id", id);

  if (error) {
    console.error("updateShowcaseVideoCard failed:", error.message);
    return { ok: false, error: friendlyShowcaseVideosError(error.message) };
  }

  return { ok: true, error: null };
}

export async function deleteShowcaseVideoCard(id: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("showcase_videos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteShowcaseVideoCard failed:", error.message);
    return false;
  }

  return true;
}
