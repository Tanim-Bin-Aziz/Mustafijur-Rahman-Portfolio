"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createClo3dVideo,
  updateClo3dVideo,
  deleteClo3dVideo,
  createClo3dFolder,
  deleteClo3dFolder,
} from "@/lib/clo3d";

export type Clo3dFormState = {
  error: string | null;
};

function readValues(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const folderId = String(formData.get("folderId") || "").trim();
  const videoDate = String(formData.get("videoDate") || "").trim();

  return {
    title,
    folderId: folderId ? folderId : null,
    videoDate,
  };
}

function readVideoUrl(formData: FormData) {
  return String(formData.get("videoUrl") || "").trim();
}

export async function addClo3dVideo(
  _prevState: Clo3dFormState,
  formData: FormData,
): Promise<Clo3dFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const values = readValues(formData);
  const videoUrl = readVideoUrl(formData);

  if (!values.title) return { error: "Title is required." };

  if (!videoUrl) {
    return { error: "Please upload a video or provide a URL." };
  }

  const { id, error } = await createClo3dVideo({
    ...values,
    videoUrl,
  });

  if (!id) return { error: error ?? "Could not save the video." };

  revalidatePath("/video/clo-3d");
  revalidatePath("/dashboard/videos");
  redirect("/dashboard/videos");
}

export async function editClo3dVideo(
  _prevState: Clo3dFormState,
  formData: FormData,
): Promise<Clo3dFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const videoId = String(formData.get("videoId") || "");
  if (!videoId) return { error: "Missing video id." };

  const values = readValues(formData);
  const videoUrl = readVideoUrl(formData);
  if (!values.title) return { error: "Title is required." };

  if (!videoUrl) {
    return { error: "Please upload a video or provide a URL." };
  }

  const { ok, error } = await updateClo3dVideo(videoId, {
    ...values,
    videoUrl,
  });

  if (!ok) return { error: error ?? "Could not update the video." };

  revalidatePath("/video/clo-3d");
  revalidatePath("/dashboard/videos");
  redirect("/dashboard/videos");
}

export async function removeClo3dVideo(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const videoId = String(formData.get("videoId") || "");
  if (!videoId) return;

  await deleteClo3dVideo(videoId);

  revalidatePath("/video/clo-3d");
  revalidatePath("/dashboard/videos");
}

export async function addClo3dFolder(
  _prevState: Clo3dFormState,
  formData: FormData,
): Promise<Clo3dFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "Folder name is required." };

  const { id, error } = await createClo3dFolder(name);

  if (!id) return { error: error ?? "Could not create the folder." };

  revalidatePath("/video/clo-3d");
  revalidatePath("/dashboard/videos");
  return { error: null };
}

export async function removeClo3dFolder(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const folderId = String(formData.get("folderId") || "");
  if (!folderId) return;

  await deleteClo3dFolder(folderId);

  revalidatePath("/video/clo-3d");
  revalidatePath("/dashboard/videos");
}
