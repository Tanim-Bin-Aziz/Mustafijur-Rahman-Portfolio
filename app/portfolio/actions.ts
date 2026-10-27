"use server";

import { revalidatePath } from "next/cache";
import { addProjectReview, incrementImageLike } from "@/lib/reviews";

export type ReviewFormState = {
  error: string | null;
  success: boolean;
};

export async function likeProjectImage(
  imageId: string,
): Promise<{ error: string | null }> {
  const id = String(imageId || "").trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return { error: "Invalid image." };
  }

  return incrementImageLike(id);
}

export async function submitProjectReview(
  _prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const projectId = String(formData.get("projectId") || "").trim();
  const categorySlug = String(formData.get("categorySlug") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const comment = String(formData.get("comment") || "").trim();
  const rating = Number.parseInt(String(formData.get("rating") || "0"), 10);

  if (!projectId) return { error: "Missing project.", success: false };
  if (!name) return { error: "Please add your name.", success: false };
  if (name.length > 80) {
    return { error: "Name must be 80 characters or fewer.", success: false };
  }
  if (!comment) {
    return { error: "Please write a note before submitting.", success: false };
  }
  if (comment.length > 2000) {
    return {
      error: "Note must be 2000 characters or fewer.",
      success: false,
    };
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { error: "Please pick a star rating.", success: false };
  }

  const { id, error } = await addProjectReview({
    projectId,
    name,
    rating,
    comment,
  });

  if (!id) {
    return { error: error ?? "Could not save your review.", success: false };
  }

  if (categorySlug && slug) {
    revalidatePath(`/portfolio/${categorySlug}/${slug}`);
  }
  revalidatePath("/dashboard/reviews");

  return { error: null, success: true };
}
