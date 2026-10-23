"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  isUploadedFile,
  uploadProjectCover,
  uploadProjectImage,
  uploadProjectPdf,
} from "@/lib/storage";

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
    .filter((value): value is File => isUploadedFile(value) && value.size > 0);
}

function isMissingSortColumn(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("sort_order") &&
    (lower.includes("does not exist") ||
      lower.includes("schema cache") ||
      lower.includes("column"))
  );
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

    const { data: lastProject } = await supabase
      .from("projects")
      .select("sort_order")
      .eq("category_id", category.id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextSortOrder = (lastProject?.sort_order ?? -1) + 1;

    const insertPayload = {
      slug,
      category_id: category.id,
      title,
      cover: coverUrl,
      project_type: projectType,
      date,
      location,
      description,
      pdf_url: pdfUrl,
    };

    let inserted: { id: string } | null = null;
    let insertError: { message: string } | null = null;

    const first = await supabase
      .from("projects")
      .insert({ ...insertPayload, sort_order: nextSortOrder })
      .select("id")
      .single();
    inserted = first.data;
    insertError = first.error;

    if (insertError && isMissingSortColumn(insertError.message)) {
      const second = await supabase
        .from("projects")
        .insert(insertPayload)
        .select("id")
        .single();
      inserted = second.data;
      insertError = second.error;
    }

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

    const imageOrderRaw = String(formData.get("imageOrder") || "");
    let imageOrder: string[] = [];
    try {
      const parsed = JSON.parse(imageOrderRaw);
      if (Array.isArray(parsed)) imageOrder = parsed.map(String);
    } catch {
      imageOrder = [];
    }

    if (imageOrder.length > 0) {
      for (let i = 0; i < imageOrder.length; i += 1) {
        await supabase
          .from("project_images")
          .update({ sort_order: i })
          .eq("id", imageOrder[i])
          .eq("project_id", projectId);
      }
    }

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

export async function reorderProjects(
  categorySlug: string,
  orderedIds: string[],
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You are not signed in." };

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();
  if (!category) return { error: "Category not found." };

  for (let i = 0; i < orderedIds.length; i += 1) {
    const { error } = await supabase
      .from("projects")
      .update({ sort_order: i })
      .eq("id", orderedIds[i])
      .eq("category_id", category.id);

    if (error) {
      if (isMissingSortColumn(error.message)) {
        return {
          error:
            "Projects sort_order column is missing. Run lib/supabase/migrations/014_projects_sort_order.sql first.",
        };
      }
      return { error: error.message };
    }
  }

  refreshPublicPages();
  revalidatePath(`/dashboard/projects/${categorySlug}`);
  return { error: null };
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
