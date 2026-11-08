import Link from "next/link";

export interface HomeVideoItem {
  id: string;
  title: string;
  src: string;
}

export interface HomeVideoSection {
  label: string;
  slug: string;
  videos: HomeVideoItem[];
}

const MAX_TILES = 8;

export default function HomeVideoSections({
  sections,
}: {
  sections: HomeVideoSection[];
}) {
  const visible = sections.filter((section) => section.videos.length > 0);
  if (visible.length === 0) return null;

  return (
    <section className="relative py-20 px-6 md:px-10 bg-[#0d0d0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-20">
          {visible.map((section) => (
            <div key={section.slug}>
              <div className="mb-8 text-center">
                <h2 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight text-[#F4EEE3]">
                  {section.label}
                </h2>
              </div>
              <div className="flex flex-wrap justify-center gap-4 px-2">
                {section.videos.slice(0, MAX_TILES).map((video) => (
                  <div
                    key={video.id}
                    className="relative aspect-video w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] overflow-hidden rounded-2xl border border-white/10 bg-black/40"
                  >
                    <video
                      src={video.src}
                      className="h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Link
                  href={`/video/${section.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm text-[#F4EEE3]/70 hover:text-[#8db355] hover:border-[#8db355]/50 transition-colors"
                >
                  View more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
