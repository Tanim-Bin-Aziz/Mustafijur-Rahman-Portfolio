"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  deleteProjectReview,
  updateProjectReview,
} from "@/lib/reviews";

export type AdminReviewState = {
  error: string | null;
  saved: boolean;
};

function readReviewFields(formData: FormData) {
  return {
    name: String(formData.get("name") || "").trim(),
    comment: String(formData.get("comment") || "").trim(),
    rating: Number.parseInt(String(formData.get("rating") || "0"), 10),
  };
}

function validateReviewFields(fields: {
  name: string;
  comment: string;
  rating: number;
}): string | null {
  if (!fields.name) return "Name is required.";
  if (fields.name.length > 80) {
    return "Name must be 80 characters or fewer.";
  }
  if (fields.comment.length > 2000) {
    return "Comment must be 2000 characters or fewer.";
  }
  if (!Number.isFinite(fields.rating) || fields.rating < 1 || fields.rating > 5) {
    return "Pick a rating between 1 and 5 stars.";
  }
  return null;
}

async function revalidateProjectPage(projectId: string) {
  if (!projectId) return;

  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("slug, categories ( slug )")
    .eq("id", projectId)
    .maybeSingle();

  const row = data as
    | {
        slug: string;
        categories: { slug: string } | { slug: string }[] | null;
      }
    | null;

  const category = row?.categories;
  const categorySlug = Array.isArray(category)
    ? category[0]?.slug
    : category?.slug;

  if (row?.slug && categorySlug) {
    revalidatePath(`/portfolio/${categorySlug}/${row.slug}`);
  }
}

export async function updateReview(
  _prevState: AdminReviewState,
  formData: FormData,
): Promise<AdminReviewState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in.", saved: false };

  const reviewId = String(formData.get("reviewId") || "").trim();
  const projectId = String(formData.get("projectId") || "").trim();
  if (!reviewId) return { error: "Missing review id.", saved: false };

  const fields = readReviewFields(formData);
  const validationError = validateReviewFields(fields);
  if (validationError) return { error: validationError, saved: false };

  const { ok, error } = await updateProjectReview(reviewId, fields);
  if (!ok) {
    return { error: error ?? "Could not update the review.", saved: false };
  }

  await revalidateProjectPage(projectId);
  revalidatePath("/dashboard/reviews");
  revalidatePath("/");
  return { error: null, saved: true };
}

export async function deleteReview(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const reviewId = String(formData.get("reviewId") || "").trim();
  const projectId = String(formData.get("projectId") || "").trim();
  if (!reviewId) return;

  await deleteProjectReview(reviewId);

  await revalidateProjectPage(projectId);
  revalidatePath("/dashboard/reviews");
  revalidatePath("/");
  redirect("/dashboard/reviews");
}
