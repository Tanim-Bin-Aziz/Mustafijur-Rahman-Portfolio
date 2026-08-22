import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { VIDEO_ITEMS } from "@/data/video";
import SingleVideoPage from "@/components/SingleVideoPage";

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = VIDEO_ITEMS.find((v) => v.slug === slug);

  if (!item) return notFound();

  return (
    <>
      <Nav />
      <SingleVideoPage item={item} />
      <Footer />
    </>
  );
}
