import { createClient } from "./supabase/server";

export interface Category {
  id: string;
  slug: string;
  title: string;
  cover: string;
  description: string;
}

export interface Project {
  id: string;
  slug: string;
  categorySlug: string;
  title: string;
  cover: string;
  projectType: string;
  date: string;
  location: string;
  description: string;
  pdfSrc: string;
  previewImages: string[];
}

export interface ProjectImageRecord {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export interface ProjectWithImages extends Project {
  imageRecords: ProjectImageRecord[];
}

interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  cover: string;
  project_type: string;
  date: string;
  location: string;
  description: string;
  pdf_url: string;
  categories: { slug: string } | { slug: string }[] | null;
  project_images:
    | { id: string; image_url: string; sort_order: number }[]
    | null;
}

const PROJECT_SELECT = `
  id,
  slug,
  title,
  cover,
  project_type,
  date,
  location,
  description,
  pdf_url,
  categories ( slug ),
  project_images ( id, image_url, sort_order )
`;

function readCategorySlug(row: ProjectRow): string {
  const joined = row.categories;
  if (!joined) return "";
  return Array.isArray(joined) ? (joined[0]?.slug ?? "") : joined.slug;
}

function toProject(row: ProjectRow): Project {
  const images = [...(row.project_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return {
    id: row.id,
    slug: row.slug,
    categorySlug: readCategorySlug(row),
    title: row.title,
    cover: row.cover,
    projectType: row.project_type,
    date: row.date,
    location: row.location,
    description: row.description,
    pdfSrc: row.pdf_url,
    previewImages: images.map((image) => image.image_url),
  };
}

function toProjectWithImages(row: ProjectRow): ProjectWithImages {
  const images = [...(row.project_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return {
    ...toProject(row),
    imageRecords: images.map((image) => ({
      id: image.id,
      imageUrl: image.image_url,
      sortOrder: image.sort_order,
    })),
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, title, cover, description")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getCategories failed:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getCategory(slug: string): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, title, cover, description")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getCategory failed:", error.message);
    return null;
  }

  return data;
}

export async function getProjectsByCategory(
  categorySlug: string,
): Promise<Project[]> {
  const category = await getCategory(categorySlug);
  if (!category) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("category_id", category.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getProjectsByCategory failed:", error.message);
    return [];
  }

  return ((data ?? []) as unknown as ProjectRow[]).map(toProject);
}

export async function getAllProjects(): Promise<Project[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getAllProjects failed:", error.message);
    return [];
  }

  return ((data ?? []) as unknown as ProjectRow[]).map(toProject);
}

async function fetchProjectRow(
  categorySlug: string,
  slug: string,
): Promise<ProjectRow | null> {
  const category = await getCategory(categorySlug);
  if (!category) return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("category_id", category.id)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("fetchProjectRow failed:", error.message);
    return null;
  }

  return (data as unknown as ProjectRow) ?? null;
}

export async function getProject(
  categorySlug: string,
  slug: string,
): Promise<Project | null> {
  const row = await fetchProjectRow(categorySlug, slug);
  return row ? toProject(row) : null;
}

export async function getProjectWithImages(
  categorySlug: string,
  slug: string,
): Promise<ProjectWithImages | null> {
  const row = await fetchProjectRow(categorySlug, slug);
  return row ? toProjectWithImages(row) : null;
}

export async function getCategoryProjectCounts(): Promise<
  Record<string, number>
> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("projects").select("category_id");

  if (error) {
    console.error("getCategoryProjectCounts failed:", error.message);
    return {};
  }

  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { category_id: string }[]) {
    counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
  }

  return counts;
}
