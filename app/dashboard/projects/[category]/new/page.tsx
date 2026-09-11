import { notFound } from "next/navigation";
import { getCategory } from "@/lib/projects";
import ProjectForm from "@/components/dashboard/ProjectForm";

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const existing = await getCategory(category);
  if (!existing) notFound();

  return <ProjectForm categorySlug={category} />;
}
