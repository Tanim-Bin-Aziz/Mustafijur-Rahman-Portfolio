import HomePage from "@/components/HomePage";
import { getShowcaseItems, getShowcaseVideoCards } from "@/lib/showcase";
import { getCertificates } from "@/lib/certificates";

export default async function Home() {
  const [items, certificates, showcaseVideos] = await Promise.all([
    getShowcaseItems(),
    getCertificates(),
    getShowcaseVideoCards(),
  ]);

  return (
    <HomePage
      items={items}
      certificates={certificates}
      showcaseVideos={showcaseVideos}
    />
  );
}
