import HomePage from "@/components/HomePage";
import { getShowcaseItems, getShowcaseVideoCards } from "@/lib/showcase";
import { getCertificates } from "@/lib/certificates";
import { getHomePageVideoUrl } from "@/lib/video";

export default async function Home() {
  const [items, certificates, showcaseVideos, heroVideoUrl] = await Promise.all([
    getShowcaseItems(),
    getCertificates(),
    getShowcaseVideoCards(),
    getHomePageVideoUrl(),
  ]);

  return (
    <HomePage
      items={items}
      certificates={certificates}
      showcaseVideos={showcaseVideos}
      heroVideoUrl={heroVideoUrl}
    />
  );
}
