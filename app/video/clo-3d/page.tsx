import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import VideoGallerySystem from "@/components/VideoGallerySystem";
import { CLO3D_VIDEOS, CLO3D_FOLDERS } from "@/data/video";

export default function CLO3DPage() {
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
            items={CLO3D_VIDEOS}
            folders={CLO3D_FOLDERS}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
