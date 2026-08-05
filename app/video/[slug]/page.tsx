import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { VIDEO_ITEMS } from "@/data/video";

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = VIDEO_ITEMS.find((v) => v.slug === slug);

  if (!item) return notFound();

  return (
    <>
      <Nav />
      <main className="bg-[#09090a] min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#8db355] mb-6">
            Video
          </p>
          <h1 className="font-serif italic text-5xl md:text-6xl mb-10 text-[#F4EEE3]">
            {item.title}
          </h1>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 mb-10 bg-black">
            {item.videoSrc ? (
              <video
                src={item.videoSrc}
                controls
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[#F4EEE3]/40 text-sm">
                Video ekhono add kora hoy nai
              </div>
            )}
          </div>

          <p className="text-lg leading-8 text-[#F4EEE3]/70 font-light">
            {item.description}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
