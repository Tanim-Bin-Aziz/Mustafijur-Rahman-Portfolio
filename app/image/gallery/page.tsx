import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageGallerySystem from "@/components/ImageGallerySystem";
import { getGalleryFolders, getGalleryImages } from "@/lib/gallery";

export default async function ImageGalleryPage() {
  const [folders, images] = await Promise.all([
    getGalleryFolders(),
    getGalleryImages(),
  ]);

  return (
    <>
      <Nav />
      <main className="bg-[#09090a] min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <h1 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight text-[#F4EEE3]">
            Image <span className="text-[#8db355]">Gallery</span>
          </h1>
          <ImageGallerySystem folders={folders} images={images} />
        </div>
      </main>
      <Footer />
    </>
  );
}
