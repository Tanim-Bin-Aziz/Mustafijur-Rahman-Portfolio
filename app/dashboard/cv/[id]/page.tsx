import { notFound } from "next/navigation";
import { getCvDocument } from "@/lib/cv";
import CvForm from "@/components/dashboard/CvForm";

export default async function EditCvPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cv = await getCvDocument(id);

  if (!cv) notFound();

  return <CvForm cv={cv} />;
}
