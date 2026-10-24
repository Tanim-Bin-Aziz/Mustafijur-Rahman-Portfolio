"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createShowcaseVideoCard,
  updateShowcaseVideoCard,
  deleteShowcaseVideoCard,
  getShowcaseVideoCards,
  saveShowcaseVideoCardOrder,
} from "@/lib/showcase";
import {
  updatePageVideo,
  createAdditionalWorkVideo,
  updateAdditionalWorkVideo,
  deleteAdditionalWorkVideo,
} from "@/lib/video";

function errorUrl(tab: string, message: string) {
  return `/dashboard/videos?tab=${tab}&error=${encodeURIComponent(message)}`;
}

function readVideoUrl(formData: FormData, fallbackKey?: string) {
  const direct = String(formData.get("videoUrl") || "").trim();

  if (direct) return direct;

  return fallbackKey ? String(formData.get(fallbackKey) || "").trim() : "";
}

/* ---------------------------------------------------------
   Home "Showcase" section — looping video cards
--------------------------------------------------------- */
export async function addShowcaseVideoCard(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const label = String(formData.get("label") || "").trim();
  const videoUrl = readVideoUrl(formData);

  if (!videoUrl)
    redirect(errorUrl("showcase", "Upload a video or provide a URL."));

  const existing = await getShowcaseVideoCards();
  if (existing.length >= 7)
    redirect(errorUrl("showcase", "Maximum 7 showcase videos allowed."));

  const { id, error } = await createShowcaseVideoCard({ label, videoUrl });

  if (!id)
    redirect(errorUrl("showcase", error ?? "Could not save the video."));

  revalidatePath("/");
  revalidatePath("/dashboard/videos");
  redirect("/dashboard/videos?tab=showcase&saved=1");
}

export async function updateShowcaseVideoCardAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const id = String(formData.get("id") || "");
  const label = String(formData.get("label") || "").trim();

  if (!id) redirect(errorUrl("showcase", "Missing showcase video id."));

  const videoUrl = readVideoUrl(formData, "currentVideoUrl");

  if (!videoUrl)
    redirect(errorUrl("showcase", "Upload a video or provide a URL."));

  const { error } = await updateShowcaseVideoCard(id, { label, videoUrl });

  if (error) redirect(errorUrl("showcase", error));

  revalidatePath("/");
  revalidatePath("/dashboard/videos");
  redirect("/dashboard/videos?tab=showcase&saved=1");
}

export async function reorderShowcaseVideoCards(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const ids = formData
    .getAll("ids")
    .map((v) => String(v).trim())
    .filter(Boolean);

  if (ids.length === 0)
    redirect(errorUrl("showcase", "Nothing to reorder."));

  const { ok, error } = await saveShowcaseVideoCardOrder(ids);
  if (!ok) redirect(errorUrl("showcase", error ?? "Could not reorder."));

  revalidatePath("/");
  revalidatePath("/dashboard/videos");
  redirect("/dashboard/videos?tab=showcase&saved=1");
}

export async function removeShowcaseVideoCard(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const id = String(formData.get("id") || "");
  if (!id) redirect(errorUrl("showcase", "Missing showcase video id."));

  await deleteShowcaseVideoCard(id);

  revalidatePath("/");
  revalidatePath("/dashboard/videos");
  redirect("/dashboard/videos?tab=showcase&saved=1");
}

/* ---------------------------------------------------------
   /video page cards (Final Collection, Drapping, Studio)
--------------------------------------------------------- */
export async function savePageVideo(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const slug = String(formData.get("slug") || "");
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const modeValue = String(formData.get("mode") || "autoplay");
  const mode = modeValue === "click-fullscreen" ? "click-fullscreen" : "autoplay";

  if (!slug) redirect(errorUrl("final-collection", "Missing video id."));
  if (!title) redirect(errorUrl(slug, "Title is required."));

  const videoUrl = readVideoUrl(formData, "currentVideoUrl");
  const cover = String(formData.get("coverUrl") || "").trim() || undefined;

  if (!videoUrl) redirect(errorUrl(slug, "Upload a video or provide a URL."));

  const { ok, error } = await updatePageVideo(slug, {
    title,
    cover,
    videoUrl,
    description,
    mode,
  });

  if (error) redirect(errorUrl(slug, error));

  revalidatePath("/video");
  revalidatePath(`/video/${slug}`);
  revalidatePath("/");
  revalidatePath("/dashboard/videos");
  redirect(`/dashboard/videos?tab=${slug}&saved=1`);
}

/* ---------------------------------------------------------
   Additional Work videos
--------------------------------------------------------- */
export async function addAdditionalWorkVideo(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const title = String(formData.get("title") || "").trim();
  const videoDate = String(formData.get("videoDate") || "").trim();

  if (!title) redirect(errorUrl("additional-work", "Title is required."));

  const videoUrl = readVideoUrl(formData);

  if (!videoUrl)
    redirect(errorUrl("additional-work", "Upload a video or provide a URL."));

  const { id, error } = await createAdditionalWorkVideo({
    title,
    videoUrl,
    videoDate,
  });

  if (!id) redirect(errorUrl("additional-work", error ?? "Could not save the video."));

  revalidatePath("/video/additional-work");
  revalidatePath("/dashboard/videos");
  redirect("/dashboard/videos?tab=additional-work&saved=1");
}

export async function updateAdditionalWorkVideoAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const videoDate = String(formData.get("videoDate") || "").trim();

  if (!id) redirect(errorUrl("additional-work", "Missing video id."));
  if (!title) redirect(errorUrl("additional-work", "Title is required."));

  const videoUrl = readVideoUrl(formData, "currentVideoUrl");

  if (!videoUrl)
    redirect(errorUrl("additional-work", "Upload a video or provide a URL."));

  const { ok, error } = await updateAdditionalWorkVideo(id, {
    title,
    videoUrl,
    videoDate,
  });

  if (error) redirect(errorUrl("additional-work", error));

  revalidatePath("/video/additional-work");
  revalidatePath("/dashboard/videos");
  redirect("/dashboard/videos?tab=additional-work&saved=1");
}

export async function removeAdditionalWorkVideo(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const id = String(formData.get("id") || "");
  if (!id) redirect(errorUrl("additional-work", "Missing video id."));

  await deleteAdditionalWorkVideo(id);

  revalidatePath("/video/additional-work");
  revalidatePath("/dashboard/videos");
  redirect("/dashboard/videos?tab=additional-work&saved=1");
}
