import HomePage from "@/components/HomePage";
import { getShowcaseItems, getShowcaseVideoCards } from "@/lib/showcase";
import { getCertificates } from "@/lib/certificates";
import { getAdditionalWorkVideos, getHomePageVideoUrl, getPageVideos } from "@/lib/video";
import { getClo3dGallery } from "@/lib/clo3d";
import { getHomeReviews } from "@/lib/reviews";
import { getProjectsByCategory } from "@/lib/projects";
import { getGalleryFolders, getGalleryImages } from "@/lib/gallery";
import type { HomeVideoSection } from "@/components/HomeVideoSections";

export default async function Home() {
  const [items, certificates, showcaseVideos, heroVideoUrl, reviews, academicProjects, professionalProjects, additionalProjects, galleryFolders, galleryImages, pageVideos, clo3dGallery, additionalWorkVideos] =
    await Promise.all([
      getShowcaseItems(),
      getCertificates(),
      getShowcaseVideoCards(),
      getHomePageVideoUrl(),
      getHomeReviews(),
      getProjectsByCategory("academic-hons"),
      getProjectsByCategory("professional"),
      getProjectsByCategory("additional-work"),
      getGalleryFolders(),
      getGalleryImages(),
      getPageVideos(),
      getClo3dGallery(),
      getAdditionalWorkVideos(),
    ]);
  console.log("PROJECT COUNTS", academicProjects.length, professionalProjects.length, additionalProjects.length);

  const pageVideoSection = (label: string, slug: string): HomeVideoSection => {
    const video = pageVideos.find((item) => item.slug === slug);
    return {
      label,
      slug,
      videos: video
        ? [{ id: video.id, title: video.title, src: video.videoUrl }]
        : [],
    };
  };

  const videoSections: HomeVideoSection[] = [
    pageVideoSection("Final Collection", "final-collection"),
    pageVideoSection("Drapping Final Dress", "drapping-final-dress"),
    pageVideoSection("Studio Collection", "studio-collection"),
    {
      label: "CLO 3D",
      slug: "clo-3d",
      videos: clo3dGallery.items.map((video) => ({
        id: video.id,
        title: video.title,
        src: video.src,
      })),
    },
    {
      label: "Additional Videos",
      slug: "additional-work",
      videos: additionalWorkVideos.map((video) => ({
        id: video.id,
        title: video.title,
        src: video.videoUrl,
      })),
    },
  ].filter((section) => section.videos.length > 0);

  return (
    <HomePage
      items={items}
      certificates={certificates}
      showcaseVideos={showcaseVideos}
      heroVideoUrl={heroVideoUrl}
      reviews={reviews}
      projectGroups={[
        { label: "Academic Hons", slug: "academic-hons", projects: academicProjects },
        { label: "Professional", slug: "professional", projects: professionalProjects },
        { label: "Additional Work", slug: "additional-work", projects: additionalProjects },
      ]}
      galleryFolders={galleryFolders}
      galleryImages={galleryImages}
      videoSections={videoSections}
    />
  );
}
  
