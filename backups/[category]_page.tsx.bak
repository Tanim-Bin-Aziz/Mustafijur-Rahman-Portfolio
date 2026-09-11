import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { getCategory, getProjectsByCategory } from "@/data/projects";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);

  if (!cat) return notFound();

  const projects = getProjectsByCategory(category);

  return (
    <>
      <Nav />
      <main className="bg-[#09090a] min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#8db355] mb-6">
            Portfolio
          </p>
          <h1 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight mb-16 text-[#F4EEE3]">
            {cat.title}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                title={p.title}
                cover={p.cover}
                previewImages={p.previewImages}
                href={`/portfolio/${cat.slug}/${p.slug}`}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
