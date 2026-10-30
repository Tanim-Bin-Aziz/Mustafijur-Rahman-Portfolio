import { createClient } from "./supabase/server";

export const REVIEWS_MIGRATION = "lib/supabase/migrations/015_likes_reviews.sql";
export const STANDALONE_REVIEWS_MIGRATION =
  "lib/supabase/migrations/016_standalone_reviews.sql";

export interface SiteReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProjectReview {
  id: string;
  projectId: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewWithProject extends ProjectReview {
  projectTitle: string;
  projectSlug: string;
  categorySlug: string;
}

export interface ProjectLikeImage {
  imageId: string;
  imageUrl: string;
  likeCount: number;
}

export interface ProjectLikeSummary {
  projectId: string;
  title: string;
  slug: string;
  categorySlug: string;
  cover: string;
  totalLikes: number;
  lastLikedAt: string;
  images: ProjectLikeImage[];
}

interface ProjectRef {
  id: string;
  title: string;
  slug: string;
  cover?: string;
  categories: { slug: string } | { slug: string }[] | null;
}

interface ReviewRow {
  id: string;
  project_id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
  projects?: ProjectRef | ProjectRef[] | null;
}

interface SiteReviewRow {
  id: string;
  name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface LikeRow {
  image_id: string;
  like_count: number;
  updated_at: string;
  project_images:
    | {
        image_url: string;
        project_id: string;
        projects: ProjectRef | ProjectRef[] | null;
      }
    | {
        image_url: string;
        project_id: string;
        projects: ProjectRef | ProjectRef[] | null;
      }[]
    | null;
}

const REVIEW_SELECT = `
  id,
  project_id,
  name,
  rating,
  comment,
  created_at
`;

const REVIEW_WITH_PROJECT_SELECT = `
  id,
  project_id,
  name,
  rating,
  comment,
  created_at,
  projects ( id, title, slug, categories ( slug ) )
`;

const LIKE_SELECT = `
  image_id,
  like_count,
  updated_at,
  project_images!inner (
    image_url,
    project_id,
    projects!inner ( id, title, slug, cover, categories ( slug ) )
  )
`;

function unwrap<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function readCategorySlug(project: ProjectRef): string {
  const joined = project.categories;
  if (!joined) return "";
  return Array.isArray(joined) ? (joined[0]?.slug ?? "") : joined.slug;
}

function toReview(row: ReviewRow): ProjectReview {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  };
}

function toSiteReview(row: SiteReviewRow): SiteReview {
  return {
    id: row.id,
    name: row.name,
    rating: row.rating,
    comment: row.comment ?? "",
    createdAt: row.created_at,
  };
}

export function isMissingReviewSchema(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("does not exist") ||
    lower.includes("schema cache") ||
    lower.includes("could not find the table") ||
    lower.includes("could not find the function") ||
    lower.includes("42p01")
  );
}

export function friendlyReviewError(message: string) {
  if (isMissingReviewSchema(message)) {
    return `Reviews/likes tables not found. Run the SQL in ${REVIEWS_MIGRATION} in Supabase, then reload.`;
  }
  return message;
}

export async function getProjectReviews(
  projectId: string,
): Promise<ProjectReview[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_reviews")
    .select(REVIEW_SELECT)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    if (!isMissingReviewSchema(error.message)) {
      console.error("getProjectReviews failed:", error.message);
    }
    return [];
  }

  return ((data ?? []) as unknown as ReviewRow[]).map(toReview);
}

export async function getHomeReviews(): Promise<SiteReview[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_reviews")
    .select(REVIEW_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    if (!isMissingReviewSchema(error.message)) {
      console.error("getHomeReviews failed:", error.message);
    }
    return [];
  }

  return ((data ?? []) as unknown as SiteReviewRow[]).map(toSiteReview);
}

export async function getAllReviewsWithProjects(): Promise<
  ReviewWithProject[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_reviews")
    .select(REVIEW_WITH_PROJECT_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    if (!isMissingReviewSchema(error.message)) {
      console.error("getAllReviewsWithProjects failed:", error.message);
    }
    return [];
  }

  const reviews: ReviewWithProject[] = [];

  for (const row of (data ?? []) as unknown as ReviewRow[]) {
    const project = unwrap(row.projects);

    if (!project) {
      reviews.push({
        id: row.id,
        projectId: "",
        name: row.name,
        rating: row.rating,
        comment: row.comment ?? "",
        createdAt: row.created_at,
        projectTitle: "Home page review",
        projectSlug: "",
        categorySlug: "",
      });
      continue;
    }

    reviews.push({
      ...toReview(row),
      projectTitle: project.title,
      projectSlug: project.slug,
      categorySlug: readCategorySlug(project),
    });
  }

  return reviews;
}

export async function getProjectLikeCounts(
  projectId: string,
): Promise<Record<string, number>> {
  const supabase = await createClient();

  const { data: images, error: imageError } = await supabase
    .from("project_images")
    .select("id")
    .eq("project_id", projectId);

  if (imageError) {
    console.error("getProjectLikeCounts (images) failed:", imageError.message);
    return {};
  }

  const ids = (images ?? []).map((row) => row.id as string);
  if (ids.length === 0) return {};

  const { data, error } = await supabase
    .from("project_image_likes")
    .select("image_id, like_count")
    .in("image_id", ids);

  if (error) {
    if (!isMissingReviewSchema(error.message)) {
      console.error("getProjectLikeCounts failed:", error.message);
    }
    return {};
  }

  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { image_id: string; like_count: number }[]) {
    counts[row.image_id] = row.like_count;
  }
  return counts;
}

export async function getLikeSummaries(): Promise<ProjectLikeSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_image_likes")
    .select(LIKE_SELECT)
    .order("updated_at", { ascending: false });

  if (error) {
    if (!isMissingReviewSchema(error.message)) {
      console.error("getLikeSummaries failed:", error.message);
    }
    return [];
  }

  const byProject = new Map<string, ProjectLikeSummary>();

  for (const row of (data ?? []) as unknown as LikeRow[]) {
    const image = unwrap(row.project_images);
    if (!image) continue;

    const project = unwrap(image.projects);
    if (!project) continue;

    const existing = byProject.get(project.id) ?? {
      projectId: project.id,
      title: project.title,
      slug: project.slug,
      categorySlug: readCategorySlug(project),
      cover: project.cover ?? "",
      totalLikes: 0,
      lastLikedAt: row.updated_at,
      images: [],
    };

    existing.totalLikes += row.like_count;
    if (row.updated_at > existing.lastLikedAt) {
      existing.lastLikedAt = row.updated_at;
    }
    existing.images.push({
      imageId: row.image_id,
      imageUrl: image.image_url,
      likeCount: row.like_count,
    });
    byProject.set(project.id, existing);
  }

  return [...byProject.values()].sort((a, b) =>
    b.lastLikedAt.localeCompare(a.lastLikedAt),
  );
}

export async function incrementImageLike(
  imageId: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase.rpc("increment_image_like", {
    p_image_id: imageId,
  });

  if (error) return { error: friendlyReviewError(error.message) };
  return { error: null };
}

function friendlyStandaloneReviewError(message: string) {
  if (
    /null value in column/i.test(message) ||
    /violates row-level security/i.test(message) ||
    /not-null/i.test(message)
  ) {
    return `Home page reviews need the SQL in ${STANDALONE_REVIEWS_MIGRATION} run in Supabase first.`;
  }
  return friendlyReviewError(message);
}

export async function addSiteReview(input: {
  name: string;
  rating: number;
  comment: string;
}): Promise<{ id: string | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_reviews")
    .insert({
      name: input.name,
      rating: input.rating,
      comment: input.comment,
    })
    .select("id")
    .single();

  if (error) {
    return { id: null, error: friendlyStandaloneReviewError(error.message) };
  }
  return { id: data?.id ?? null, error: null };
}

export async function addProjectReview(input: {
  projectId: string;
  name: string;
  rating: number;
  comment: string;
}): Promise<{ id: string | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_reviews")
    .insert({
      project_id: input.projectId,
      name: input.name,
      rating: input.rating,
      comment: input.comment,
    })
    .select("id")
    .single();

  if (error) return { id: null, error: friendlyReviewError(error.message) };
  return { id: data?.id ?? null, error: null };
}

export async function updateProjectReview(
  id: string,
  input: { name: string; rating: number; comment: string },
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("project_reviews")
    .update({
      name: input.name,
      rating: input.rating,
      comment: input.comment,
    })
    .eq("id", id);

  if (error) return { ok: false, error: friendlyReviewError(error.message) };
  return { ok: true, error: null };
}

export async function deleteProjectReview(
  id: string,
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("project_reviews")
    .delete()
    .eq("id", id);

  if (error) return { ok: false, error: friendlyReviewError(error.message) };
  return { ok: true, error: null };
}
