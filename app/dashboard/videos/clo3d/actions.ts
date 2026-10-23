"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isUploadedFile, uploadProjectVideo } from "@/lib/storage";
import {
  createClo3dVideo,
  updateClo3dVideo,
  deleteClo3dVideo,
  createClo3dFolder,
  deleteClo3dFolder,
  friendlyClo3dError,
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

async function resolveVideoUrl(formData: FormData): Promise<string> {
  const file = formData.get("video");

  if (isUploadedFile(file) && file.size > 0) {
    return await uploadProjectVideo(file, "clo3d");
  }

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

  if (!values.title) return { error: "Title is required." };

  let videoUrl = "";

  try {
    videoUrl = await resolveVideoUrl(formData);

    if (!videoUrl) {
      return { error: "Please upload a video or provide a URL." };
    }

    const { id, error } = await createClo3dVideo({
      ...values,
      videoUrl,
    });

    if (!id) return { error: error ?? "Could not save the video." };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? friendlyClo3dError(error.message)
          : "Upload failed.",
    };
  }

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
  if (!values.title) return { error: "Title is required." };

  let videoUrl = "";

  try {
    videoUrl = await resolveVideoUrl(formData);

    if (!videoUrl) {
      return { error: "Please upload a video or provide a URL." };
    }

    const { ok, error } = await updateClo3dVideo(videoId, {
      ...values,
      videoUrl,
    });

    if (!ok) return { error: error ?? "Could not update the video." };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? friendlyClo3dError(error.message)
          : "Upload failed.",
    };
  }

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
