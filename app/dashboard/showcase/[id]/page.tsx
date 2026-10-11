import { notFound } from "next/navigation";
import { getShowcaseImage } from "@/lib/showcase";
import ShowcaseImageForm from "@/components/dashboard/ShowcaseImageForm";

export default async function EditShowcaseImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const image = await getShowcaseImage(id);

  if (!image) notFound();

  return <ShowcaseImageForm image={image} />;
}
