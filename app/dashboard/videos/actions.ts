"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isUploadedFile, uploadProjectCover, uploadProjectVideo } from "@/lib/storage";
import {
  createShowcaseVideoCard,
  updateShowcaseVideoCard,
  deleteShowcaseVideoCard,
  friendlyShowcaseVideosError,
} from "@/lib/showcase";
import {
  updatePageVideo,
  createAdditionalWorkVideo,
  updateAdditionalWorkVideo,
  deleteAdditionalWorkVideo,
  friendlyVideoError,
} from "@/lib/video";

function errorUrl(tab: string, message: string) {
  return `/dashboard/videos?tab=${tab}&error=${encodeURIComponent(message)}`;
}

async function resolveUploadedVideo(formData: FormData, folder: string) {
  const file = formData.get("video");

  if (isUploadedFile(file) && file.size > 0) {
    return await uploadProjectVideo(file, folder);
  }

  return String(formData.get("videoUrl") || "").trim();
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

  let videoUrl = "";
  let uploadError: string | null = null;

  try {
    videoUrl = await resolveUploadedVideo(formData, "showcase");
  } catch (error) {
    uploadError =
      error instanceof Error
        ? friendlyShowcaseVideosError(error.message)
        : "Upload failed.";
  }

  if (uploadError) redirect(errorUrl("showcase", uploadError));
  if (!videoUrl)
    redirect(errorUrl("showcase", "Upload a video or provide a URL."));

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

  let videoUrl = String(formData.get("currentVideoUrl") || "").trim();
  let uploadError: string | null = null;

  try {
    const uploaded = await resolveUploadedVideo(formData, "showcase");
    if (uploaded) videoUrl = uploaded;
  } catch (error) {
    uploadError =
      error instanceof Error
        ? friendlyShowcaseVideosError(error.message)
        : "Upload failed.";
  }

  if (uploadError) redirect(errorUrl("showcase", uploadError));
  if (!videoUrl)
    redirect(errorUrl("showcase", "Upload a video or provide a URL."));

  const { error } = await updateShowcaseVideoCard(id, { label, videoUrl });

  if (error) redirect(errorUrl("showcase", error));

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

  let videoUrl = String(formData.get("currentVideoUrl") || "").trim();
  let cover: string | undefined;
  let uploadError: string | null = null;

  try {
    const uploaded = await resolveUploadedVideo(formData, "page-videos");
    if (uploaded) videoUrl = uploaded;

    const coverFile = formData.get("cover");
    if (isUploadedFile(coverFile) && coverFile.size > 0) {
      cover = await uploadProjectCover(coverFile, "page-videos");
    }
  } catch (error) {
    uploadError =
      error instanceof Error
        ? friendlyVideoError(error.message)
        : "Upload failed.";
  }

  if (uploadError) redirect(errorUrl(slug, uploadError));
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

  let videoUrl = "";
  let uploadError: string | null = null;

  try {
    videoUrl = await resolveUploadedVideo(formData, "additional-work");
  } catch (error) {
    uploadError =
      error instanceof Error
        ? friendlyVideoError(error.message)
        : "Upload failed.";
  }

  if (uploadError) redirect(errorUrl("additional-work", uploadError));
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

  let videoUrl = String(formData.get("currentVideoUrl") || "").trim();
  let uploadError: string | null = null;

  try {
    const uploaded = await resolveUploadedVideo(formData, "additional-work");
    if (uploaded) videoUrl = uploaded;
  } catch (error) {
    uploadError =
      error instanceof Error
        ? friendlyVideoError(error.message)
        : "Upload failed.";
  }

  if (uploadError) redirect(errorUrl("additional-work", uploadError));
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
