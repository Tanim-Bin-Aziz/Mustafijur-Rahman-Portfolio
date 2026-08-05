import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SimpleCard from "@/components/SimpleCard";
import { VIDEO_ITEMS } from "@/data/video";

export default function VideoIndexPage() {
  return (
    <>
      <Nav />
      <main className="bg-[#09090a] min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight mb-16 text-[#F4EEE3]">
            Video <span className="text-[#8db355]">Gallery</span>
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {VIDEO_ITEMS.map((item) => (
              <SimpleCard
                key={item.id}
                title={item.title}
                cover={item.cover}
                href={`/video/${item.slug}`}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
