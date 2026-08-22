import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import VideoGallerySystem from "@/components/VideoGallerySystem";
import { ADDITIONAL_WORK_VIDEOS, ADDITIONAL_WORK_FOLDERS } from "@/data/video";

export default function AdditionalWorkPage() {
  return (
    <>
      <Nav />
      <main className="bg-[#09090a] min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <h1 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight text-[#F4EEE3]">
            Additional <span className="text-[#8db355]">Work</span>
          </h1>
          <VideoGallerySystem
            title="Additional Work"
            items={ADDITIONAL_WORK_VIDEOS}
            folders={ADDITIONAL_WORK_FOLDERS}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
