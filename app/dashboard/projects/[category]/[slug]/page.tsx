import { notFound } from "next/navigation";
import { getProjectWithImages } from "@/lib/projects";
import ProjectForm from "@/components/dashboard/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  const project = await getProjectWithImages(category, slug);
  if (!project) notFound();

  return <ProjectForm categorySlug={category} project={project} />;
}
