"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadProjectImage } from "@/lib/supabase/storage";
import {
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "@/lib/gallery";

export type PictureFormState = {
  error: string | null;
};

function requireAuth() {
  // createClient reads cookies; we verify the user via a getUser call inside actions
}

export async function addGalleryImage(
  _prevState: PictureFormState,
  formData: FormData,
): Promise<PictureFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const folderId = String(formData.get("folderId") || "");
  const title = String(formData.get("title") || "").trim();
  const date = String(formData.get("date") || "").trim();

  if (!folderId) return { error: "Please select a folder." };
  if (!title) return { error: "Title is required." };

  const imageFile = formData.get("image");
  let imageUrl = String(formData.get("imageUrl") || "").trim();

  try {
    if (imageFile instanceof File && imageFile.size > 0) {
      const folderSlug = String(formData.get("folderSlug") || "gallery");
      imageUrl = await uploadProjectImage(imageFile, folderSlug);
    }

    if (!imageUrl) {
      return { error: "Please upload an image or provide an image URL." };
    }

    const id = await createGalleryImage({
      folderId,
      title,
      imageUrl,
      date: date || null,
    });

    if (!id) return { error: "Could not save the image." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Upload failed.",
    };
  }

  revalidatePath("/dashboard/pictures");
  revalidatePath("/image/gallery");
  redirect("/dashboard/pictures");
}

export async function editGalleryImage(
  _prevState: PictureFormState,
  formData: FormData,
): Promise<PictureFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const imageId = String(formData.get("imageId") || "");
  const folderId = String(formData.get("folderId") || "");
  const title = String(formData.get("title") || "").trim();
  const date = String(formData.get("date") || "").trim();

  if (!imageId) return { error: "Missing image id." };
  if (!folderId) return { error: "Please select a folder." };
  if (!title) return { error: "Title is required." };

  const imageFile = formData.get("image");
  let imageUrl = String(formData.get("imageUrl") || "").trim();

  try {
    if (imageFile instanceof File && imageFile.size > 0) {
      const folderSlug = String(formData.get("folderSlug") || "gallery");
      imageUrl = await uploadProjectImage(imageFile, folderSlug);
    }

    if (!imageUrl) {
      return { error: "Please upload an image or provide an image URL." };
    }

    const ok = await updateGalleryImage(imageId, {
      folderId,
      title,
      imageUrl,
      date: date || null,
    });

    if (!ok) return { error: "Could not update the image." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Upload failed.",
    };
  }

  revalidatePath("/dashboard/pictures");
  revalidatePath("/image/gallery");
  redirect("/dashboard/pictures");
}

export async function removeGalleryImage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const imageId = String(formData.get("imageId") || "");
  if (!imageId) return;

  await deleteGalleryImage(imageId);

  revalidatePath("/dashboard/pictures");
  revalidatePath("/image/gallery");
}
