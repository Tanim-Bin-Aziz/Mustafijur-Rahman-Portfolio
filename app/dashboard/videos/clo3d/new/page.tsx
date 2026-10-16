import { getClo3dFolders } from "@/lib/clo3d";
import Clo3dVideoForm from "@/components/dashboard/Clo3dVideoForm";

export default async function NewClo3dVideoPage() {
  const folders = await getClo3dFolders();

  return <Clo3dVideoForm folders={folders} />;
}
