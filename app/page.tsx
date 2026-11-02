import HomePage from "@/components/HomePage";
import { getShowcaseItems, getShowcaseVideoCards } from "@/lib/showcase";
import { getCertificates } from "@/lib/certificates";
import { getHomePageVideoUrl } from "@/lib/video";
import { getHomeReviews } from "@/lib/reviews";
import { getProjectsByCategory } from "@/lib/projects";

export default async function Home() {
  const [items, certificates, showcaseVideos, heroVideoUrl, reviews, academicProjects, professionalProjects, additionalProjects] =
    await Promise.all([
      getShowcaseItems(),
      getCertificates(),
      getShowcaseVideoCards(),
      getHomePageVideoUrl(),
      getHomeReviews(),
      getProjectsByCategory("academic-hons"),
      getProjectsByCategory("professional"),
      getProjectsByCategory("additional-work"),
    ]);

  return (
    <HomePage
      items={items}
      certificates={certificates}
      showcaseVideos={showcaseVideos}
      heroVideoUrl={heroVideoUrl}
      reviews={reviews}
      projectGroups={[
        { label: "Academic Hons", slug: "academic-hons", projects: academicProjects.slice(0, 4) },
        { label: "Professional", slug: "professional", projects: professionalProjects.slice(0, 4) },
        { label: "Additional Work", slug: "additional-work", projects: additionalProjects.slice(0, 4) },
      ]}
    />
  );
}
