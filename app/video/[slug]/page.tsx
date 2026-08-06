import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { VIDEO_ITEMS } from "@/data/video";
import ImageGallerySystem from "@/components/ImageGallerySystem";

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
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Integrated Glass Image Gallery */}
          <div>
            <h2 className="font-serif text-3xl text-[#F4EEE3] mb-6">
              Media Gallery
            </h2>
            <ImageGallerySystem />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
