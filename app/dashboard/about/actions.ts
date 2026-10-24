"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateAboutCard } from "@/lib/about";

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

  const cover = String(formData.get("coverUrl") || "").trim() || null;

  const { error, slug } = await updateAboutCard(id, { title, cover });

  if (error) redirect(errorUrl(error));

  revalidatePath("/about");
  if (slug) revalidatePath(`/about/${slug}`);
  revalidatePath("/dashboard/about");

  redirect("/dashboard/about?saved=1");
}
