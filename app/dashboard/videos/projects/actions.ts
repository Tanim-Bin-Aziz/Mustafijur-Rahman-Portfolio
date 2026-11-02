"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createVideoProject,
  deleteVideoProject,
  updateVideoProjectCover,
  addVideoProjectVideo,
  updateVideoProjectVideo,
  deleteVideoProjectVideo,
} from "@/lib/video-projects";

function readVideoUrl(formData: FormData, fallbackKey?: string) {
  const direct = String(formData.get("videoUrl") || "").trim();
  if (direct) return direct;
  return fallbackKey ? String(formData.get(fallbackKey) || "").trim() : "";
}

export async function createVideoProjectAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") || "").trim();
  const coverUrl = String(formData.get("coverUrl") || "").trim();
  if (!title) redirect("/dashboard/videos/projects/new?error=" + encodeURIComponent("Title is required."));

  const { slug, error } = await createVideoProject(title, coverUrl);
  if (error || !slug)
    redirect("/dashboard/videos/projects/new?error=" + encodeURIComponent(error ?? "Could not create project."));

  revalidatePath("/dashboard/videos");
  redirect(`/dashboard/videos/projects/${slug}`);
}

export async function deleteVideoProjectAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const slug = String(formData.get("slug") || "");
  if (!slug) redirect("/dashboard/videos?tab=video-projects");

  await deleteVideoProject(slug);

  revalidatePath("/dashboard/videos");
  revalidatePath(`/video/${slug}`);
  redirect("/dashboard/videos?tab=video-projects");
}

export async function addVideoProjectVideoAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const projectSlug = String(formData.get("projectSlug") || "");
  const title = String(formData.get("title") || "").trim();
  const videoDate = String(formData.get("videoDate") || "").trim();

  const videoUrl = readVideoUrl(formData);
  if (!videoUrl)
    redirect(`/dashboard/videos/projects/${projectSlug}?error=` + encodeURIComponent("Upload a video or provide a URL."));

  const { error } = await addVideoProjectVideo(projectSlug, {
    title: title || "Untitled",
    videoUrl,
    videoDate,
  });

  if (error)
    redirect(`/dashboard/videos/projects/${projectSlug}?error=` + encodeURIComponent(error));

  revalidatePath(`/dashboard/videos/projects/${projectSlug}`);
  revalidatePath(`/video/${projectSlug}`);
  revalidatePath("/dashboard/videos");
  redirect(`/dashboard/videos/projects/${projectSlug}?saved=1`);
}

export async function updateVideoProjectVideoAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = String(formData.get("id") || "");
  const projectSlug = String(formData.get("projectSlug") || "");
  const title = String(formData.get("title") || "").trim();
  const videoDate = String(formData.get("videoDate") || "").trim();

  if (!id) redirect(`/dashboard/videos/projects/${projectSlug}`);

  const videoUrl = readVideoUrl(formData, "currentVideoUrl");
  if (!videoUrl)
    redirect(`/dashboard/videos/projects/${projectSlug}?error=` + encodeURIComponent("Upload a video or provide a URL."));

  const { error } = await updateVideoProjectVideo(id, {
    title: title || "Untitled",
    videoUrl,
    videoDate,
  });

  if (error)
    redirect(`/dashboard/videos/projects/${projectSlug}?error=` + encodeURIComponent(error));

  revalidatePath(`/dashboard/videos/projects/${projectSlug}`);
  revalidatePath(`/video/${projectSlug}`);
  redirect(`/dashboard/videos/projects/${projectSlug}?saved=1`);
}

export async function deleteVideoProjectVideoAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = String(formData.get("id") || "");
  const projectSlug = String(formData.get("projectSlug") || "");
  if (!id) redirect(`/dashboard/videos/projects/${projectSlug}`);

  await deleteVideoProjectVideo(id);

  revalidatePath(`/dashboard/videos/projects/${projectSlug}`);
  revalidatePath(`/video/${projectSlug}`);
  revalidatePath("/dashboard/videos");
  redirect(`/dashboard/videos/projects/${projectSlug}?saved=1`);
}

export async function updateVideoProjectCoverAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const projectSlug = String(formData.get("projectSlug") || "");
  const coverUrl = String(formData.get("coverUrl") || "").trim();
  if (!projectSlug) redirect("/dashboard/videos?tab=video-projects");

  await updateVideoProjectCover(projectSlug, coverUrl);

  revalidatePath(`/dashboard/videos/projects/${projectSlug}`);
  revalidatePath(`/video/${projectSlug}`);
  revalidatePath("/dashboard/videos");
  redirect(`/dashboard/videos/projects/${projectSlug}?saved=1`);
}