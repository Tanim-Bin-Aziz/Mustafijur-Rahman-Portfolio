import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { getCategory, getProjectsByCategory } from "@/lib/projects";
import ProjectReorderGrid from "@/components/dashboard/ProjectReorderGrid";

export default async function CategoryProjectsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;

  const category = await getCategory(categorySlug);
  if (!category) notFound();

  const projects = await getProjectsByCategory(categorySlug);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-cream/50 transition-colors hover:text-[#8DB355]"
      >
        <ArrowLeft size={15} />
        All categories
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-cream">
            {category.title}
          </h1>
          <p className="mt-1.5 text-sm text-cream/45">
            {projects.length} project{projects.length === 1 ? "" : "s"} in this
            category.
          </p>
        </div>

        <Link
          href={`/dashboard/projects/${categorySlug}/new`}
          className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
        >
          <Plus size={16} />
          Add project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-cream/15 px-5 py-10 text-center text-sm text-cream/45">
          No projects yet. Click “Add project” to create the first one.
        </p>
      ) : (
        <div className="mt-8">
          <ProjectReorderGrid projects={projects} categorySlug={categorySlug} />
        </div>
      )}
    </div>
  );
}
