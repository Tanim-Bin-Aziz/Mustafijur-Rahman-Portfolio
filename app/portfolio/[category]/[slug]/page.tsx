import { notFound } from "next/navigation";
import { getCategory, getProject, getProjectsByCategory } from "@/lib/projects";
import { getProjectLikeCounts, getProjectReviews } from "@/lib/reviews";
import { createClient } from "@/lib/supabase/server";
import ProjectDetailClient from "./ProjectDetailClient";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  const cat = await getCategory(category);
  if (!cat) return notFound();

  const project = await getProject(category, slug);
  if (!project) return notFound();

  // "Next project" — shei category-r moddhei cycle korbe
  const categoryProjects = await getProjectsByCategory(category);
  const index = categoryProjects.findIndex((p) => p.slug === slug);
  const nextProject = categoryProjects[(index + 1) % categoryProjects.length];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = !!user;

  const reviews = await getProjectReviews(project.id);
  const likeCounts: Record<string, number> = isAdmin
    ? await getProjectLikeCounts(project.id)
    : {};

  return (
    <ProjectDetailClient
      project={project}
      nextProject={nextProject}
      categorySlug={category}
      isAdmin={isAdmin}
      likeCounts={likeCounts}
      reviews={reviews}
    />
  );
}
