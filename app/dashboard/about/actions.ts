"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isUploadedFile, uploadProjectCover } from "@/lib/storage";
import { updateAboutCard, friendlyAboutError } from "@/lib/about";

function errorUrl(message: string) {
  return `/dashboard/about?error=${encodeURIComponent(message)}`;
}

export async function saveAboutCard(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();

  if (!id) redirect(errorUrl("Missing card id."));
  if (!title) redirect(errorUrl("Title is required."));

  let cover: string | null = null;
  let uploadError: string | null = null;

  const file = formData.get("cover");
  if (isUploadedFile(file) && file.size > 0) {
    try {
      cover = await uploadProjectCover(file, "about");
    } catch (error) {
      uploadError =
        error instanceof Error
          ? friendlyAboutError(error.message)
          : "Image upload failed.";
    }
  }

  if (uploadError) redirect(errorUrl(uploadError));

  const { error, slug } = await updateAboutCard(id, { title, cover });

  if (error) redirect(errorUrl(error));

  revalidatePath("/about");
  if (slug) revalidatePath(`/about/${slug}`);
  revalidatePath("/dashboard/about");

  redirect("/dashboard/about?saved=1");
}
