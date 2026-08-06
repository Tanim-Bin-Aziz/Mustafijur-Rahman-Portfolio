import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({
  title,
  cover,
  href,
  previewImages,
}: {
  title: string;
  cover: string;
  href: string;
  previewImages?: string[]; // thakle stacked layer gula-te alada image dekhabe
}) {
  const backImage = previewImages?.[1] ?? cover;
  const midImage = previewImages?.[0] ?? cover;

  return (
    <Link
      href={href}
      className="group relative block w-full aspect-[16/10]"
    >
      {/* Shobcheye piche-r layer */}
      <div
        className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 origin-bottom-left
        rotate-[4deg] translate-x-1.5 translate-y-1
        transition-transform duration-500 ease-out
        group-hover:rotate-[10deg] group-hover:translate-x-3 group-hover:translate-y-2"
      >
        <Image
          src={backImage}
          alt=""
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className="object-cover opacity-40 blur-[1.5px] scale-105"
        />
        <div className="absolute inset-0 bg-[#0B0908]/60" />
      </div>

      {/* Majher layer */}
      <div
        className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 origin-bottom-left
        rotate-[2deg] translate-x-1 translate-y-0.5
        transition-transform duration-500 ease-out
        group-hover:rotate-[6deg] group-hover:translate-x-1.5 group-hover:translate-y-1"
      >
        <Image
          src={midImage}
          alt=""
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className="object-cover opacity-60 blur-[0.5px] scale-105"
        />
        <div className="absolute inset-0 bg-[#0B0908]/40" />
      </div>

      {/* Main card — shobar shamne */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-[#1A1613] transition-all duration-500 ease-out group-hover:border-[#C89B6A]/50 group-hover:-translate-y-1.5">
        <Image
          src={cover}
          alt={title}
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908] via-[#0B0908]/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-serif italic text-2xl leading-tight text-[#F4EEE3]">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
