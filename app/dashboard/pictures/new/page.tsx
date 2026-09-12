import { getGalleryFolders } from "@/lib/gallery";
import ImageForm from "@/components/dashboard/ImageForm";

export default async function NewImagePage() {
  const folders = await getGalleryFolders();

  return <ImageForm folders={folders} />;
}
