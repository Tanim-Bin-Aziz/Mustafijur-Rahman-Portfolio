"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isUploadedFile, uploadProjectImage } from "@/lib/storage";
import {
  createShowcaseImage,
  updateShowcaseImage,
  deleteShowcaseImage,
  friendlyShowcaseError,
} from "@/lib/showcase";

export type ShowcaseFormState = {
  error: string | null;
};

function readValues(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const sortOrder = Number.parseInt(
    String(formData.get("sortOrder") || "0"),
    10,
  );

  return {
    title,
    category,
    location,
    sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
  };
}

export async function addShowcaseImage(
  _prevState: ShowcaseFormState,
  formData: FormData,
): Promise<ShowcaseFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const values = readValues(formData);

  if (!values.title) return { error: "Title is required." };

  const imageFile = formData.get("image");
  let imageUrl = String(formData.get("imageUrl") || "").trim();

  const thumbnailFile = formData.get("thumbnail");
  let thumbnailUrl = String(formData.get("thumbnailUrl") || "").trim();

  try {
    if (isUploadedFile(imageFile) && imageFile.size > 0) {
      imageUrl = await uploadProjectImage(imageFile, "showcase");
    }

    if (isUploadedFile(thumbnailFile) && thumbnailFile.size > 0) {
      thumbnailUrl = await uploadProjectImage(thumbnailFile, "showcase");
    }

    if (!imageUrl) {
      return { error: "Please upload an image or provide an image URL." };
    }

    const cardOffsetX = Number.parseFloat(
      String(formData.get("cardOffsetX") || "50"),
    );
    const cardOffsetY = Number.parseFloat(
      String(formData.get("cardOffsetY") || "50"),
    );
    const cardScale = Number.parseFloat(
      String(formData.get("cardScale") || "1"),
    );

    const { id, error } = await createShowcaseImage({
      ...values,
      imageUrl,
      thumbnailUrl,
      cardOffsetX: Number.isNaN(cardOffsetX) ? 50 : cardOffsetX,
      cardOffsetY: Number.isNaN(cardOffsetY) ? 50 : cardOffsetY,
      cardScale: Number.isNaN(cardScale) ? 1 : cardScale,
    });

    if (!id) return { error: error ?? "Could not save the image." };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? friendlyShowcaseError(error.message)
          : "Upload failed.",
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/showcase");
  redirect("/dashboard/showcase");
}

export async function editShowcaseImage(
  _prevState: ShowcaseFormState,
  formData: FormData,
): Promise<ShowcaseFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const imageId = String(formData.get("imageId") || "");
  if (!imageId) return { error: "Missing image id." };

  const values = readValues(formData);
  if (!values.title) return { error: "Title is required." };

  const imageFile = formData.get("image");
  let imageUrl = String(formData.get("imageUrl") || "").trim();

  const thumbnailFile = formData.get("thumbnail");
  let thumbnailUrl = String(formData.get("thumbnailUrl") || "").trim();

  try {
    if (isUploadedFile(imageFile) && imageFile.size > 0) {
      imageUrl = await uploadProjectImage(imageFile, "showcase");
    }

    if (isUploadedFile(thumbnailFile) && thumbnailFile.size > 0) {
      thumbnailUrl = await uploadProjectImage(thumbnailFile, "showcase");
    }

    if (!imageUrl) {
      return { error: "Please upload an image or provide an image URL." };
    }

    const cardOffsetX = Number.parseFloat(
      String(formData.get("cardOffsetX") || "50"),
    );
    const cardOffsetY = Number.parseFloat(
      String(formData.get("cardOffsetY") || "50"),
    );
    const cardScale = Number.parseFloat(
      String(formData.get("cardScale") || "1"),
    );

    const { ok, error } = await updateShowcaseImage(imageId, {
      ...values,
      imageUrl,
      thumbnailUrl: thumbnailUrl || undefined,
      cardOffsetX: Number.isNaN(cardOffsetX) ? 50 : cardOffsetX,
      cardOffsetY: Number.isNaN(cardOffsetY) ? 50 : cardOffsetY,
      cardScale: Number.isNaN(cardScale) ? 1 : cardScale,
    });

    if (!ok) return { error: error ?? "Could not update the image." };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? friendlyShowcaseError(error.message)
          : "Upload failed.",
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/showcase");
  redirect("/dashboard/showcase");
}

export async function removeShowcaseImage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const imageId = String(formData.get("imageId") || "");
  if (!imageId) return;

  await deleteShowcaseImage(imageId);

  revalidatePath("/");
  revalidatePath("/dashboard/showcase");
}
