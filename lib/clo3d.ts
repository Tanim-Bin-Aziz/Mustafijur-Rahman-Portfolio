import { createClient } from "./supabase/server";
import {
  CLO3D_FOLDERS,
  CLO3D_VIDEOS,
  type VideoFolder,
  type VideoGalleryItem,
} from "@/data/video";

export const CLO3D_MIGRATION = "lib/supabase/migrations/007_clo3d.sql";

export interface Clo3dFolder {
  id: string;
  name: string;
  sortOrder: number;
}

export interface Clo3dVideo {
  id: string;
  title: string;
  videoUrl: string;
  folderId: string | null;
  videoDate: string; // YYYY-MM-DD
  sortOrder: number;
}

interface Clo3dFolderRow {
  id: string;
  name: string;
  sort_order: number;
}

interface Clo3dVideoRow {
  id: string;
  title: string;
  video_url: string;
  folder_id: string | null;
  video_date: string;
  sort_order: number;
}

function isMissingTable(message: string) {
  return (
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("42P01")
  );
}

export function friendlyClo3dError(message: string): string {
  if (isMissingTable(message)) {
    return `CLO 3D tables not found. Run the SQL in ${CLO3D_MIGRATION} in your Supabase project first.`;
  }
  return message;
}

function toFolder(row: Clo3dFolderRow): Clo3dFolder {
  return { id: row.id, name: row.name, sortOrder: row.sort_order };
}

function toVideo(row: Clo3dVideoRow): Clo3dVideo {
  return {
    id: row.id,
    title: row.title,
    videoUrl: row.video_url,
    folderId: row.folder_id,
    videoDate: row.video_date,
    sortOrder: row.sort_order,
  };
}

export async function getClo3dFolders(): Promise<Clo3dFolder[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clo3d_folders")
    .select("id, name, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (!isMissingTable(error.message)) {
      console.error("getClo3dFolders failed:", error.message);
    }
    return [];
  }

  return ((data ?? []) as unknown as Clo3dFolderRow[]).map(toFolder);
}

export async function getClo3dVideos(): Promise<Clo3dVideo[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clo3d_videos")
    .select("id, title, video_url, folder_id, video_date, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (!isMissingTable(error.message)) {
      console.error("getClo3dVideos failed:", error.message);
    }
    return [];
  }

  return ((data ?? []) as unknown as Clo3dVideoRow[]).map(toVideo);
}

export async function getClo3dVideo(id: string): Promise<Clo3dVideo | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clo3d_videos")
    .select("id, title, video_url, folder_id, video_date, sort_order")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getClo3dVideo failed:", error.message);
    return null;
  }

  return data ? toVideo(data as unknown as Clo3dVideoRow) : null;
}

// Public /video/clo-3d page — DB theke nao, empty hole static fallback
export async function getClo3dGallery(): Promise<{
  items: VideoGalleryItem[];
  folders: VideoFolder[];
}> {
  const [videos, folders] = await Promise.all([
    getClo3dVideos(),
    getClo3dFolders(),
  ]);

  if (videos.length === 0 && folders.length === 0) {
    return { items: CLO3D_VIDEOS, folders: CLO3D_FOLDERS };
  }

  return {
    items: videos.map((video) => ({
      id: video.id,
      title: video.title,
      src: video.videoUrl,
      date: video.videoDate,
      folderId: video.folderId ?? "misc",
    })),
    folders: [
      { id: "all", name: "All Videos" },
      ...folders.map((folder) => ({ id: folder.id, name: folder.name })),
    ],
  };
}

export async function createClo3dVideo(values: {
  title: string;
  videoUrl: string;
  folderId: string | null;
  videoDate: string;
}): Promise<{ id: string | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clo3d_videos")
    .insert({
      title: values.title,
      video_url: values.videoUrl,
      folder_id: values.folderId,
      video_date: values.videoDate || new Date().toISOString().slice(0, 10),
    })
    .select("id")
    .single();

  if (error) {
    console.error("createClo3dVideo failed:", error.message);
    return { id: null, error: friendlyClo3dError(error.message) };
  }

  return { id: data.id, error: null };
}

export async function updateClo3dVideo(
  id: string,
  values: {
    title: string;
    videoUrl: string;
    folderId: string | null;
    videoDate: string;
  },
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("clo3d_videos")
    .update({
      title: values.title,
      video_url: values.videoUrl,
      folder_id: values.folderId,
      video_date: values.videoDate || new Date().toISOString().slice(0, 10),
    })
    .eq("id", id);

  if (error) {
    console.error("updateClo3dVideo failed:", error.message);
    return { ok: false, error: friendlyClo3dError(error.message) };
  }

  return { ok: true, error: null };
}

export async function deleteClo3dVideo(id: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.from("clo3d_videos").delete().eq("id", id);

  if (error) {
    console.error("deleteClo3dVideo failed:", error.message);
    return false;
  }

  return true;
}

export async function createClo3dFolder(
  name: string,
): Promise<{ id: string | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clo3d_folders")
    .insert({ name })
    .select("id")
    .single();

  if (error) {
    console.error("createClo3dFolder failed:", error.message);
    return { id: null, error: friendlyClo3dError(error.message) };
  }

  return { id: data.id, error: null };
}

export async function deleteClo3dFolder(id: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.from("clo3d_folders").delete().eq("id", id);

  if (error) {
    console.error("deleteClo3dFolder failed:", error.message);
    return false;
  }

  return true;
}
