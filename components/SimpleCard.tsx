import Image from "next/image";
import Link from "next/link";

export default function SimpleCard({
  title,
  cover,
  href,
}: {
  title: string;
  cover: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block w-full aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#1A1613] transition-all duration-500 hover:border-[#C89B6A]/50"
    >
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
    </Link>
  );
}
