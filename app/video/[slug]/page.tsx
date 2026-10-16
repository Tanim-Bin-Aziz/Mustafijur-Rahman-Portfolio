import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getPageVideo, toVideoItem } from "@/lib/video";
import SingleVideoPage from "@/components/SingleVideoPage";

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
