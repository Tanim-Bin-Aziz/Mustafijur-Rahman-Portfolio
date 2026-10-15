import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import VideoGallerySystem from "@/components/VideoGallerySystem";
import { getClo3dGallery } from "@/lib/clo3d";

export default async function CLO3DPage() {
  const { items, folders } = await getClo3dGallery();

  return (
    <>
      <Nav />
      <main className="bg-[#09090a] min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <h1 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight text-[#F4EEE3]">
            CLO <span className="text-[#8db355]">3D</span>
          </h1>
          <VideoGallerySystem
            title="CLO 3D"
            items={items}
            folders={folders}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
