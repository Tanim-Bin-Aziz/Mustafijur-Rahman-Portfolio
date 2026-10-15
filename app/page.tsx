import HomePage from "@/components/HomePage";
import { getShowcaseItems } from "@/lib/showcase";
import { getCertificates } from "@/lib/certificates";

export default async function Home() {
  const [items, certificates] = await Promise.all([
    getShowcaseItems(),
    getCertificates(),
  ]);

  return <HomePage items={items} certificates={certificates} />;
}
