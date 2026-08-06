import { notFound } from "next/navigation";
import { getCategory, getProject, getProjectsByCategory } from "@/data/projects";
import ProjectDetailClient from "./ProjectDetailClient";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  const cat = getCategory(category);
  if (!cat) return notFound();

  const project = getProject(category, slug);
  if (!project) return notFound();

  // "Next project" — shei category-r moddhei cycle korbe
  const categoryProjects = getProjectsByCategory(category);
  const index = categoryProjects.findIndex((p) => p.slug === slug);
  const nextProject = categoryProjects[(index + 1) % categoryProjects.length];

  return (
    <ProjectDetailClient
      project={project}
      nextProject={nextProject}
      categorySlug={category}
    />
  );
}
