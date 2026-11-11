import { createClient } from "./supabase/server";

export interface VideoProject {
  id: string;
  slug: string;
  title: string;
  cover: string;
  videoCount: number;
}

export interface VideoProjectVideo {
  id: string;
  projectId: string;
  title: string;
  videoUrl: string;
  videoDate: string;
  sortOrder: number;
}

interface VideoProjectRow {
  id: string;
  slug: string;
  title: string;
  cover: string | null;
}

interface VideoProjectVideoRow {
  id: string;
  project_id: string;
  title: string;
  video_url: string;
  video_date: string;
  sort_order: number | null;
}

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "video-project"
  );
}

export async function getVideoProjects(): Promise<VideoProject[]> {
  const supabase = await createClient();

  let { data: projects, error } = await supabase
    .from("video_projects")
    .select("id, slug, title, cover")
    .order("created_at", { ascending: false });

  if (error && /cover/i.test(error.message)) {
    const fallback = await supabase
      .from("video_projects")
      .select("id, slug, title")
      .order("created_at", { ascending: false });
    projects = fallback.data as any;
    error = fallback.error;
  }

  if (error) {
    console.error("getVideoProjects failed:", error.message);
    return [];
  }

  const rows = (projects ?? []) as VideoProjectRow[];
  if (rows.length === 0) return [];

  const { data: counts } = await supabase
    .from("video_project_videos")
    .select("project_id");

  const countMap: Record<string, number> = {};
  for (const row of (counts ?? []) as { project_id: string }[]) {
    countMap[row.project_id] = (countMap[row.project_id] ?? 0) + 1;
  }

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    cover: row.cover || "",
    videoCount: countMap[row.id] ?? 0,
  }));
}

export async function getVideoProject(slug: string): Promise<VideoProject | null> {
  const supabase = await createClient();

  let { data, error } = await supabase
    .from("video_projects")
    .select("id, slug, title, cover")
    .eq("slug", slug)
    .maybeSingle();

  if (error && /cover/i.test(error.message)) {
    const fallback = await supabase
      .from("video_projects")
      .select("id, slug, title")
      .eq("slug", slug)
      .maybeSingle();
    data = fallback.data as any;
    error = fallback.error;
  }

  if (error || !data) return null;

  const row = data as VideoProjectRow;

  const { count } = await supabase
    .from("video_project_videos")
    .select("id", { count: "exact", head: true })
    .eq("project_id", row.id);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    cover: row.cover || "",
    videoCount: count ?? 0,
  };
}

export async function getVideoProjectVideos(
  slug: string,
): Promise<VideoProjectVideo[]> {
  const project = await getVideoProject(slug);
  if (!project) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("video_project_videos")
    .select("id, project_id, title, video_url, video_date, sort_order")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getVideoProjectVideos failed:", error.message);
    return [];
  }

  return ((data ?? []) as VideoProjectVideoRow[]).map((row) => ({
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    videoUrl: row.video_url,
    videoDate: row.video_date,
    sortOrder: row.sort_order ?? 0,
  }));
}

export async function getAllVideoProjectVideos(): Promise<
  VideoProjectVideo[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("video_project_videos")
    .select("id, project_id, title, video_url, video_date, sort_order")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllVideoProjectVideos failed:", error.message);
    return [];
  }

  return ((data ?? []) as VideoProjectVideoRow[]).map((row) => ({
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    videoUrl: row.video_url,
    videoDate: row.video_date,
    sortOrder: row.sort_order ?? 0,
  }));
}

async function buildUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  input: string,
): Promise<string> {
  const base = slugify(input);
  let candidate = base;
  let counter = 2;

  for (;;) {
    const { data } = await supabase
      .from("video_projects")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${counter}`;
    counter += 1;
  }
}

export async function createVideoProject(
  title: string,
  cover: string = "",
): Promise<{ slug: string | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { slug: null, error: "You are not signed in." };

  const trimmed = title.trim();
  if (!trimmed) return { slug: null, error: "Title is required." };

  const slug = await buildUniqueSlug(supabase, trimmed);

  let { error } = await supabase
    .from("video_projects")
    .insert({ slug, title: trimmed, cover: cover.trim() });

  if (error && /cover/i.test(error.message)) {
    const retry = await supabase
      .from("video_projects")
      .insert({ slug, title: trimmed });
    error = retry.error;
  }

  if (error) {
    console.error("createVideoProject failed:", error.message);
    return { slug: null, error: error.message };
  }

  return { slug, error: null };
}

export async function deleteVideoProject(slug: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("video_projects")
    .delete()
    .eq("slug", slug);

  if (error) {
    console.error("deleteVideoProject failed:", error.message);
    return false;
  }
  return true;
}

export async function updateVideoProjectCover(
  slug: string,
  cover: string,
): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("video_projects")
    .update({ cover: cover.trim() })
    .eq("slug", slug);

  if (error) {
    if (/cover/i.test(error.message)) return true;
    console.error("updateVideoProjectCover failed:", error.message);
    return false;
  }
  return true;
}

export async function addVideoProjectVideo(
  projectSlug: string,
  values: { title: string; videoUrl: string; videoDate: string },
): Promise<{ error: string | null }> {
  const project = await getVideoProject(projectSlug);
  if (!project) return { error: "Project not found." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You are not signed in." };

  const { data: last } = await supabase
    .from("video_project_videos")
    .select("sort_order")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSort = (last?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("video_project_videos").insert({
    project_id: project.id,
    title: values.title.trim() || "Untitled",
    video_url: values.videoUrl.trim(),
    video_date: values.videoDate || new Date().toISOString().slice(0, 10),
    sort_order: nextSort,
  });

  if (error) {
    console.error("addVideoProjectVideo failed:", error.message);
    return { error: error.message };
  }
  return { error: null };
}

export async function updateVideoProjectVideo(
  id: string,
  values: { title: string; videoUrl: string; videoDate: string },
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You are not signed in." };

  const { error } = await supabase
    .from("video_project_videos")
    .update({
      title: values.title.trim() || "Untitled",
      video_url: values.videoUrl.trim(),
      video_date: values.videoDate,
    })
    .eq("id", id);

  if (error) {
    console.error("updateVideoProjectVideo failed:", error.message);
    return { error: error.message };
  }
  return { error: null };
}

export async function deleteVideoProjectVideo(id: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("video_project_videos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteVideoProjectVideo failed:", error.message);
    return false;
  }
  return true;
}