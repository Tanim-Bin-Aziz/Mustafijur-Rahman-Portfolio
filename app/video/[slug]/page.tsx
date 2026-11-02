import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getPageVideo, toVideoItem } from "@/lib/video";
import SingleVideoPage from "@/components/SingleVideoPage";
import { getVideoProject, getVideoProjectVideos } from "@/lib/video-projects";
import VideoGallerySystem from "@/components/VideoGallerySystem";

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await getVideoProject(slug);
  if (project) {
    const videos = await getVideoProjectVideos(slug);
    const items = videos.map((video) => ({
      id: video.id,
      title: video.title,
      src: video.videoUrl,
      date: video.videoDate,
      folderId: "misc",
    }));

    return (
      <>
        <Nav />
        <main className="bg-[#09090a] min-h-screen pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto space-y-10">
            <h1 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight text-[#F4EEE3]">
              {project.title}
            </h1>
            <VideoGallerySystem
              title={project.title}
              items={items}
              folders={[
                { id: "all", name: "All Videos" },
                { id: "misc", name: "Miscellaneous" },
              ]}
            />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const video = await getPageVideo(slug);
  if (!video) return notFound();

  return (
    <>
      <Nav />
      <SingleVideoPage item={toVideoItem(video)} />
      <Footer />
    </>
  );
}