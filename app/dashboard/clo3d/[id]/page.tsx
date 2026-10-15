import { notFound } from "next/navigation";
import { getClo3dVideo, getClo3dFolders } from "@/lib/clo3d";
import Clo3dVideoForm from "@/components/dashboard/Clo3dVideoForm";

export default async function EditClo3dVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [video, folders] = await Promise.all([
    getClo3dVideo(id),
    getClo3dFolders(),
  ]);

  if (!video) notFound();

  return <Clo3dVideoForm video={video} folders={folders} />;
}
