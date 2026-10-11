import HomePage from "@/components/HomePage";
import { getShowcaseItems } from "@/lib/showcase";

export default async function Home() {
  const items = await getShowcaseItems();

  return <HomePage items={items} />;
}
