"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  uploadProjectCover,
  uploadProjectImage,
  uploadProjectPdf,
} from "@/lib/supabase/storage";

export type ProjectFormState = {
  error: string | null;
};

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "project"
  );
}

async function buildUniqueSlug(
  supabase: SupabaseServerClient,
  input: string,
  excludeId?: string,
) {
  const base = slugify(input);
  let candidate = base;
  let counter = 2;

  for (;;) {
    let query = supabase.from("projects").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);

    const { data } = await query.maybeSingle();
    if (!data) return candidate;

    candidate = `${base}-${counter}`;
    counter += 1;
  }
}

function readFiles(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function refreshPublicPages() {
  revalidatePath("/dashboard/projects");
  revalidatePath("/portfolio");
}

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const categorySlug = String(formData.get("categorySlug") || "");
  const title = String(formData.get("title") || "").trim();
  const projectType = String(formData.get("projectType") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!title) return { error: "Title is required." };

  const { data: category } = await supabase
    .from("categories")
    .select("id, slug")
    .eq("slug", categorySlug)
    .maybeSingle();

  if (!category) return { error: "Category not found." };

  const slug = await buildUniqueSlug(
    supabase,
    String(formData.get("slug") || "") || title,
  );

  try {
    const coverFile = readFiles(formData, "cover")[0];
    const pdfFile = readFiles(formData, "pdf")[0];

    const coverUrl = coverFile
      ? await uploadProjectCover(coverFile, slug)
      : "";
    const pdfUrl = pdfFile ? await uploadProjectPdf(pdfFile, slug) : "";

    const { data: inserted, error: insertError } = await supabase
      .from("projects")
      .insert({
        slug,
        category_id: category.id,
        title,
        cover: coverUrl,
        project_type: projectType,
        date,
        location,
        description,
        pdf_url: pdfUrl,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      return { error: insertError?.message ?? "Could not create project." };
    }

    const imageFiles = readFiles(formData, "images");
    if (imageFiles.length > 0) {
      const rows = [];
      for (let i = 0; i < imageFiles.length; i += 1) {
        const url = await uploadProjectImage(imageFiles[i], slug);
        rows.push({
          project_id: inserted.id,
          image_url: url,
          sort_order: i,
        });
      }

      const { error: imageError } = await supabase
        .from("project_images")
        .insert(rows);

      if (imageError) {
        return { error: `Project saved, but images failed: ${imageError.message}` };
      }
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Upload failed.",
    };
  }

  refreshPublicPages();
  redirect(`/dashboard/projects/${category.slug}`);
}

export async function updateProject(
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const projectId = String(formData.get("projectId") || "");
  const categorySlug = String(formData.get("categorySlug") || "");
  const title = String(formData.get("title") || "").trim();
  const projectType = String(formData.get("projectType") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!projectId) return { error: "Missing project id." };
  if (!title) return { error: "Title is required." };

  const { data: existing } = await supabase
    .from("projects")
    .select("id, slug, cover, pdf_url, category_id")
    .eq("id", projectId)
    .maybeSingle();

  if (!existing) return { error: "Project not found." };

  const slug = await buildUniqueSlug(
    supabase,
    String(formData.get("slug") || "") || title,
    projectId,
  );

  try {
    const coverFile = readFiles(formData, "cover")[0];
    const pdfFile = readFiles(formData, "pdf")[0];

    const coverUrl = coverFile
      ? await uploadProjectCover(coverFile, slug)
      : existing.cover;
    const pdfUrl = pdfFile
      ? await uploadProjectPdf(pdfFile, slug)
      : existing.pdf_url;

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        slug,
        title,
        cover: coverUrl,
        project_type: projectType,
        date,
        location,
        description,
        pdf_url: pdfUrl,
      })
      .eq("id", projectId);

    if (updateError) return { error: updateError.message };

    const imageFiles = readFiles(formData, "images");
    if (imageFiles.length > 0) {
      const { data: lastImage } = await supabase
        .from("project_images")
        .select("sort_order")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();

      const startOrder = (lastImage?.sort_order ?? -1) + 1;

      const rows = [];
      for (let i = 0; i < imageFiles.length; i += 1) {
        const url = await uploadProjectImage(imageFiles[i], slug);
        rows.push({
          project_id: projectId,
          image_url: url,
          sort_order: startOrder + i,
        });
      }

      const { error: imageError } = await supabase
        .from("project_images")
        .insert(rows);

      if (imageError) {
        return {
          error: `Project saved, but images failed: ${imageError.message}`,
        };
      }
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Upload failed.",
    };
  }

  refreshPublicPages();
  redirect(`/dashboard/projects/${categorySlug}`);
}

export async function deleteProject(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const projectId = String(formData.get("projectId") || "");
  const categorySlug = String(formData.get("categorySlug") || "");

  if (!projectId) return;

  await supabase.from("projects").delete().eq("id", projectId);

  refreshPublicPages();
  redirect(`/dashboard/projects/${categorySlug}`);
}

export async function deleteProjectImage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const imageId = String(formData.get("imageId") || "");
  if (!imageId) return;

  await supabase.from("project_images").delete().eq("id", imageId);

  refreshPublicPages();
}
