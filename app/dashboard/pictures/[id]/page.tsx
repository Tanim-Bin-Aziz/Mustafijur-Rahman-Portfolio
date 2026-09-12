import { notFound } from "next/navigation";
import { getGalleryFolders, getGalleryImage } from "@/lib/gallery";
import ImageForm from "@/components/dashboard/ImageForm";

export default async function EditImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [folders, image] = await Promise.all([
    getGalleryFolders(),
    getGalleryImage(id),
  ]);

  if (!image) notFound();

  return <ImageForm folders={folders} image={image} />;
}
