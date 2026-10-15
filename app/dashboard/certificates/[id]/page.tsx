import { notFound } from "next/navigation";
import { getCertificate } from "@/lib/certificates";
import CertificateForm from "@/components/dashboard/CertificateForm";

export default async function EditCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const certificate = await getCertificate(id);

  if (!certificate) notFound();

  return <CertificateForm certificate={certificate} />;
}
