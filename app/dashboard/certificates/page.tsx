import Link from "next/link";
import Image from "next/image";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import {
  getCertificates,
  isPdfUrl,
  CERTIFICATES_MIGRATION,
  type Certificate,
} from "@/lib/certificates";
import { removeCertificate } from "./actions";
import ConfirmSubmit from "@/components/dashboard/ConfirmSubmit";

export default async function CertificateManagementPage() {
  const certificates = await getCertificates();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-cream">
            Certificate Management
          </h1>
          <p className="mt-1.5 text-sm text-cream/45">
            {certificates.length} certificate
            {certificates.length === 1 ? "" : "s"} shown on the homepage.
          </p>
        </div>

        <Link
          href="/dashboard/certificates/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
        >
          <Plus size={16} />
          Add certificate
        </Link>
      </div>

      {certificates.length === 0 ? (
        <div className="mt-10 rounded-xl border border-cream/10 bg-card px-5 py-6 text-sm text-cream/50">
          <p>
            No certificates yet. Uploaded certificates (jpg, png or pdf)
            appear in the Certificates section on the homepage.
          </p>
          <p className="mt-3">
            If uploads fail, run the SQL in{" "}
            <code className="text-[#8DB355]">{CERTIFICATES_MIGRATION}</code>{" "}
            in your Supabase project first.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      )}
    </div>
  );
}

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const pdf = isPdfUrl(certificate.fileUrl);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-cream/10 bg-card">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/30">
        {pdf ? (
          <div className="flex h-full w-full items-center justify-center">
            <FileText size={40} className="text-red-400/80" />
          </div>
        ) : (
          <Image
            src={certificate.fileUrl}
            alt={certificate.title}
            fill
            sizes="(max-width:640px) 92vw, 30vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {pdf && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500/90 px-2.5 py-1 font-mono text-[10px] tracking-widest text-white">
            PDF
          </span>
        )}

        <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/certificates/${certificate.id}`}
              title="Edit certificate"
              className="inline-flex items-center rounded-full bg-[#8DB355] p-1.5 text-bg transition-colors hover:bg-[#9cc163]"
            >
              <Pencil size={13} />
            </Link>
            <form action={removeCertificate}>
              <input
                type="hidden"
                name="certificateId"
                value={certificate.id}
              />
              <ConfirmSubmit
                message={`Delete “${certificate.title}”? This cannot be undone.`}
                title="Delete certificate"
                className="inline-flex items-center rounded-full bg-black/60 p-1.5 text-cream/80 transition-colors hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={13} />
              </ConfirmSubmit>
            </form>
          </div>
        </div>
      </div>

      <div className="px-3 py-2.5">
        <p className="truncate text-sm text-cream">{certificate.title}</p>
        {certificate.description && (
          <p className="mt-0.5 truncate text-xs text-cream/40">
            {certificate.description}
          </p>
        )}
      </div>
    </div>
  );
}
