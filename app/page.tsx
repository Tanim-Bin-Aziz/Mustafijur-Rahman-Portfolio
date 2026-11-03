import HomePage from "@/components/HomePage";
import { getShowcaseItems, getShowcaseVideoCards } from "@/lib/showcase";
import { getCertificates } from "@/lib/certificates";
import { getHomePageVideoUrl } from "@/lib/video";
import { getHomeReviews } from "@/lib/reviews";
import { getProjectsByCategory } from "@/lib/projects";
import { getGalleryFolders, getGalleryImages } from "@/lib/gallery";

export default async function Home() {
  const [items, certificates, showcaseVideos, heroVideoUrl, reviews, academicProjects, professionalProjects, additionalProjects, galleryFolders, galleryImages] =
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
    ]);
  console.log("PROJECT COUNTS", academicProjects.length, professionalProjects.length, additionalProjects.length);

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
    />
  );
}
  
