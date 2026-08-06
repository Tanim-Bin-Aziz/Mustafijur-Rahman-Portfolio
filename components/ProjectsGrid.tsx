import ProjectCard from "./ProjectCard";
import { CATEGORIES } from "@/data/projects";
import { FadeUp } from "./Motion";

export default function ProjectsGrid() {
  return (
    <section id="projects" className="py-28 px-6 bg-[##09090a]">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <h2 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight mb-16 text-[#F4EEE3]">
            The <span className="text-[#8db355]">Portfolio Archive</span>
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((c) => (
            <ProjectCard
              key={c.id}
              title={c.title}
              cover={c.cover}
              href={`/portfolio/${c.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
