import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block w-full aspect-[16/10]"
    >
      {/* Piche-r stacked pages — base transform ekhon Tailwind class diye,
          inline style e na, tai group-hover thik moto override korte parbe */}
      <div
        className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 origin-bottom-left
        rotate-[4deg] translate-x-1.5 translate-y-1
        transition-transform duration-500 ease-out
        group-hover:rotate-[10deg] group-hover:translate-x-3 group-hover:translate-y-2"
      >
        <Image
          src={project.cover}
          alt=""
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className="object-cover opacity-40 blur-[1.5px] scale-105"
        />
        <div className="absolute inset-0 bg-[#0B0908]/60" />
      </div>

      <div
        className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 origin-bottom-left
        rotate-[2deg] translate-x-1 translate-y-0.5
        transition-transform duration-500 ease-out
        group-hover:rotate-[6deg] group-hover:translate-x-1.5 group-hover:translate-y-1"
      >
        <Image
          src={project.cover}
          alt=""
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className="object-cover opacity-60 blur-[0.5px] scale-105"
        />
        <div className="absolute inset-0 bg-[#0B0908]/40" />
      </div>

      {/* Main card — shobar shamne, actual sharp image ei ta te thake */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-[#1A1613] transition-all duration-500 ease-out group-hover:border-[#C89B6A]/50 group-hover:-translate-y-1.5">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908] via-[#0B0908]/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#C89B6A]">
            {project.projectType}
          </p>

          <h3 className="font-serif italic text-2xl leading-tight text-[#F4EEE3]">
            {project.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
