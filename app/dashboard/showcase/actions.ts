"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createShowcaseImage,
  updateShowcaseImage,
  deleteShowcaseImage,
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

  const imageUrl = String(formData.get("imageUrl") || "").trim();

  if (!imageUrl) {
    return { error: "Please upload an image or provide an image URL." };
  }

  const { id, error } = await createShowcaseImage({
    ...values,
    imageUrl,
  });

  if (!id) return { error: error ?? "Could not save the image." };

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

  const imageUrl = String(formData.get("imageUrl") || "").trim();

  if (!imageUrl) {
    return { error: "Please upload an image or provide an image URL." };
  }

  const { ok, error } = await updateShowcaseImage(imageId, {
    ...values,
    imageUrl,
    thumbnailUrl: "",
  });

  if (!ok) return { error: error ?? "Could not update the image." };

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
