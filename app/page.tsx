import HomePage from "@/components/HomePage";
import { getShowcaseItems, getShowcaseVideoCards } from "@/lib/showcase";
import { getCertificates } from "@/lib/certificates";
import { getHomePageVideoUrl } from "@/lib/video";
import { getHomeReviews } from "@/lib/reviews";

export default async function Home() {
  const [items, certificates, showcaseVideos, heroVideoUrl, reviews] =
    await Promise.all([
      getShowcaseItems(),
      getCertificates(),
      getShowcaseVideoCards(),
      getHomePageVideoUrl(),
      getHomeReviews(),
    ]);

  return (
    <HomePage
      items={items}
      certificates={certificates}
      showcaseVideos={showcaseVideos}
      heroVideoUrl={heroVideoUrl}
      reviews={reviews}
    />
  );
}
