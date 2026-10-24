import { createClient } from "./supabase/server";
import {
  VIDEO_ITEMS,
  ADDITIONAL_WORK_VIDEOS,
  type VideoItem,
} from "@/data/video";

export const VIDEO_MIGRATION = "lib/supabase/migrations/010_video_management.sql";

/* ---------------------------------------------------------
   Home page hero video (Hero section background)
--------------------------------------------------------- */
export const HOME_VIDEO_SLUG = "home-page-video";
export const DEFAULT_HERO_VIDEO = "/video/Background.webm";

export async function getHomePageVideoUrl(): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("page_videos")
    .select("video_url")
    .eq("slug", HOME_VIDEO_SLUG)
    .maybeSingle();

  if (error) {
    if (!isMissingTable(error.message)) {
      console.error("getHomePageVideoUrl failed:", error.message);
    }
    return DEFAULT_HERO_VIDEO;
  }

  return data?.video_url || DEFAULT_HERO_VIDEO;
}

export async function saveHomePageVideo(
  videoUrl: string,
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase.from("page_videos").upsert(
    {
      id: HOME_VIDEO_SLUG,
      slug: HOME_VIDEO_SLUG,
      title: "Home Page Video",
      video_url: videoUrl,
      description: "",
      mode: "autoplay",
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("saveHomePageVideo failed:", error.message);
    return { ok: false, error: friendlyVideoError(error.message) };
  }

  return { ok: true, error: null };
}

/* ---------------------------------------------------------
   /video page-er cards (Final Collection, Drapping, Studio)
--------------------------------------------------------- */
export interface PageVideo {
  id: string;
  slug: string;
  title: string;
  cover: string;
  videoUrl: string;
  description: string;
  mode: "autoplay" | "click-fullscreen";
}

interface PageVideoRow {
  id: string;
  slug: string;
  title: string;
  cover: string;
  video_url: string;
  description: string;
  mode: string;
}

const PAGE_VIDEO_SELECT =
  "id, slug, title, cover, video_url, description, mode";

function toPageVideo(row: PageVideoRow): PageVideo {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    cover: row.cover,
    videoUrl: row.video_url,
    description: row.description,
    mode: row.mode === "click-fullscreen" ? "click-fullscreen" : "autoplay",
  };
}

function isMissingTable(message: string) {
  return (
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("42P01")
  );
}

function staticPageVideos(): PageVideo[] {
  return VIDEO_ITEMS.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    cover: item.cover,
    videoUrl: item.videoSrc,
    description: item.description,
    mode: item.mode,
  }));
}

export function friendlyVideoError(message: string): string {
  if (isMissingTable(message)) {
    return `Video tables not found. Run the SQL in ${VIDEO_MIGRATION} in your Supabase project first.`;
  }
  return message;
}

export async function getPageVideos(): Promise<PageVideo[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("page_videos")
    .select(PAGE_VIDEO_SELECT)
    .order("created_at", { ascending: true });

  if (error) {
    if (!isMissingTable(error.message)) {
      console.error("getPageVideos failed:", error.message);
    }
    return staticPageVideos();
  }

  if (!data || data.length === 0) return staticPageVideos();

  return (data as unknown as PageVideoRow[]).map(toPageVideo);
}

export async function getPageVideo(slug: string): Promise<PageVideo | null> {
  const videos = await getPageVideos();
  return videos.find((video) => video.slug === slug) ?? null;
}

export async function updatePageVideo(
  slug: string,
  values: {
    title: string;
    cover?: string;
    videoUrl: string;
    description: string;
    mode: "autoplay" | "click-fullscreen";
  },
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();

  const patch: Record<string, string> = {
    title: values.title,
    video_url: values.videoUrl,
    description: values.description,
    mode: values.mode,
  };
  if (values.cover) patch.cover = values.cover;

  const { error } = await supabase
    .from("page_videos")
    .update(patch)
    .eq("slug", slug);

  if (error) {
    console.error("updatePageVideo failed:", error.message);
    return { ok: false, error: friendlyVideoError(error.message) };
  }

  return { ok: true, error: null };
}

/* ---------------------------------------------------------
   Additional Work gallery
--------------------------------------------------------- */
export interface AdditionalWorkVideo {
  id: string;
  title: string;
  videoUrl: string;
  videoDate: string;
  sortOrder: number;
}

interface AdditionalWorkVideoRow {
  id: string;
  title: string;
  video_url: string;
  video_date: string;
  sort_order: number;
}

const AW_SELECT = "id, title, video_url, video_date, sort_order";

function toAdditionalWorkVideo(row: AdditionalWorkVideoRow): AdditionalWorkVideo {
  return {
    id: row.id,
    title: row.title,
    videoUrl: row.video_url,
    videoDate: row.video_date,
    sortOrder: row.sort_order,
  };
}

export async function getAdditionalWorkVideos(): Promise<
  AdditionalWorkVideo[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("additional_work_videos")
    .select(AW_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (!isMissingTable(error.message)) {
      console.error("getAdditionalWorkVideos failed:", error.message);
    }
    return ADDITIONAL_WORK_VIDEOS.map((video) => ({
      id: video.id,
      title: video.title,
      videoUrl: video.src,
      videoDate: video.date,
      sortOrder: 0,
    }));
  }

  return ((data ?? []) as unknown as AdditionalWorkVideoRow[]).map(
    toAdditionalWorkVideo,
  );
}

export async function createAdditionalWorkVideo(values: {
  title: string;
  videoUrl: string;
  videoDate: string;
}): Promise<{ id: string | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("additional_work_videos")
    .insert({
      title: values.title,
      video_url: values.videoUrl,
      video_date: values.videoDate || new Date().toISOString().slice(0, 10),
    })
    .select("id")
    .single();

  if (error) {
    console.error("createAdditionalWorkVideo failed:", error.message);
    return { id: null, error: friendlyVideoError(error.message) };
  }

  return { id: data.id, error: null };
}

export async function updateAdditionalWorkVideo(
  id: string,
  values: {
    title: string;
    videoUrl: string;
    videoDate: string;
  },
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("additional_work_videos")
    .update({
      title: values.title,
      video_url: values.videoUrl,
      video_date: values.videoDate,
    })
    .eq("id", id);

  if (error) {
    console.error("updateAdditionalWorkVideo failed:", error.message);
    return { ok: false, error: friendlyVideoError(error.message) };
  }

  return { ok: true, error: null };
}

export async function deleteAdditionalWorkVideo(id: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("additional_work_videos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteAdditionalWorkVideo failed:", error.message);
    return false;
  }

  return true;
}

// VideoItem shape (public /video pages-er jonno compatibility)
export function toVideoItem(video: PageVideo): VideoItem {
  return {
    id: video.id,
    slug: video.slug,
    title: video.title,
    cover: video.cover,
    videoSrc: video.videoUrl,
    description: video.description,
    mode: video.mode,
  };
}
