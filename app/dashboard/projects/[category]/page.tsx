import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { getCategory, getProjectsByCategory } from "@/lib/projects";
import { deleteProject } from "../actions";
import ConfirmSubmit from "@/components/dashboard/ConfirmSubmit";

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
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-cream/10 bg-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {project.cover ? (
                  <Image
                    src={project.cover}
                    alt={project.title}
                    fill
                    sizes="(max-width:640px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-bg" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908] via-transparent to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h2 className="font-serif text-base leading-snug text-cream">
                  {project.title}
                </h2>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-cream/35">
                  {project.projectType || "—"}
                </p>

                <div className="mt-4 flex items-center gap-2 border-t border-cream/10 pt-4">
                  <Link
                    href={`/dashboard/projects/${categorySlug}/${project.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cream/10 px-3 py-1.5 text-xs text-cream/60 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
                  >
                    <Pencil size={13} />
                    Edit
                  </Link>

                  {project.pdfSrc && (
                    <a
                      href={project.pdfSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View PDF"
                      className="inline-flex items-center rounded-full border border-cream/10 p-1.5 text-cream/50 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
                    >
                      <FileText size={13} />
                    </a>
                  )}

                  <form action={deleteProject} className="ml-auto">
                    <input type="hidden" name="projectId" value={project.id} />
                    <input
                      type="hidden"
                      name="categorySlug"
                      value={categorySlug}
                    />
                    <ConfirmSubmit
                      message={`Delete “${project.title}”? This cannot be undone.`}
                      title="Delete project"
                      className="inline-flex items-center rounded-full border border-cream/10 p-1.5 text-cream/50 transition-colors hover:border-red-500 hover:text-red-400"
                    >
                      <Trash2 size={13} />
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
