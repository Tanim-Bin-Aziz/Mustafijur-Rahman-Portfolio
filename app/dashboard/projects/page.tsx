import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getCategories, getCategoryProjectCounts } from "@/lib/projects";

export default async function ProjectsManagementPage() {
  const [categories, counts] = await Promise.all([
    getCategories(),
    getCategoryProjectCounts(),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-2xl font-semibold text-cream">
        Project Management
      </h1>
      <p className="mt-1.5 text-sm text-cream/45">
        Pick a category to add, edit or remove its projects.
      </p>

      {categories.length === 0 ? (
        <p className="mt-8 rounded-xl border border-cream/10 bg-card px-5 py-6 text-sm text-cream/50">
          No categories found. Run the SQL in{" "}
          <code className="text-[#8DB355]">
            lib/supabase/migrations/001_init.sql
          </code>{" "}
          in your Supabase project first.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/dashboard/projects/${category.slug}`}
              className="group overflow-hidden rounded-2xl border border-cream/10 bg-card transition-colors hover:border-[#8DB355]/50"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {category.cover ? (
                  <Image
                    src={category.cover}
                    alt={category.title}
                    fill
                    sizes="(max-width:640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-bg" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908] via-transparent to-transparent" />
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-serif text-lg text-cream">
                    {category.title}
                  </h2>
                  <span className="shrink-0 rounded-full bg-[#8DB355]/15 px-2.5 py-0.5 font-mono text-[10px] text-[#8DB355]">
                    {counts[category.id] ?? 0} project
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-xs leading-5 text-cream/40">
                  {category.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-cream/50 transition-colors group-hover:text-[#8DB355]">
                  Manage
                  <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
