import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import ProjectDetailClient from "./ProjectDetailClient";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((p) => p.slug === slug);

  if (index === -1) return notFound();

  const project = PROJECTS[index];
  const nextProject = PROJECTS[(index + 1) % PROJECTS.length];

  return <ProjectDetailClient project={project} nextProject={nextProject} />;
}
