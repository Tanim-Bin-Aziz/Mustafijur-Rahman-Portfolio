"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, FileText, FileUp, Loader2 } from "lucide-react";
import {
  addCertificate,
  editCertificate,
  type CertificateFormState,
} from "@/app/dashboard/certificates/actions";
import DirectFileInput from "@/components/dashboard/DirectFileInput";
import type { Certificate } from "@/lib/certificates";

const fieldClass =
  "w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-[#8DB355]";

const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45";

function looksPdf(url: string) {
  return url.toLowerCase().split("?")[0].endsWith(".pdf");
}

export default function CertificateForm({
  certificate,
}: {
  certificate?: Certificate;
}) {
  const isEdit = Boolean(certificate);

  const [state, formAction, isPending] = useActionState<
    CertificateFormState,
    FormData
  >(isEdit ? editCertificate : addCertificate, { error: null });

  const [previewUrl, setPreviewUrl] = useState(certificate?.fileUrl ?? "");

  const previewIsPdf = looksPdf(previewUrl);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/certificates"
        className="mb-6 inline-flex items-center gap-2 text-sm text-cream/50 transition-colors hover:text-[#8DB355]"
      >
        <ArrowLeft size={15} />
        Back to certificates
      </Link>

      <h1 className="font-serif text-2xl font-semibold text-cream">
        {isEdit ? "Edit certificate" : "Add certificate"}
      </h1>
      <p className="mt-1.5 text-sm text-cream/45">
        {isEdit
          ? "Update the file, title or description."
          : "Upload a certificate (jpg, png or pdf) for the Certificates section on the homepage."}
      </p>

      {state.error && (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <form action={formAction} className="mt-8 space-y-6">
        {isEdit && (
          <input type="hidden" name="certificateId" value={certificate?.id} />
        )}

        <div>
          <label className={labelClass} htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={certificate?.title ?? ""}
            placeholder="Advanced Fashion Design Award"
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="description">
            Mini description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={certificate?.description ?? ""}
            placeholder="Issued by ... — 2025"
            rows={3}
            className={`${fieldClass} resize-y`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="sortOrder">
            Sort order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={certificate?.sortOrder ?? 0}
            className={fieldClass}
          />
          <p className="mt-1.5 text-xs text-cream/30">
            Lower numbers appear first on the homepage.
          </p>
        </div>

        <div>
          <span className={labelClass}>File (jpg, png or pdf)</span>

          {previewUrl && (
            <div className="mb-4 flex items-center gap-4">
              {previewIsPdf ? (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-cream/10 bg-red-500/10">
                  <FileText size={26} className="text-red-400" />
                </div>
              ) : (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-cream/10">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              )}
              <span className="text-xs text-cream/40">
                {isEdit ? "Current file" : "Selected file"}
              </span>
            </div>
          )}

          <DirectFileInput
            urlName="fileUrl"
            accept="image/*,.pdf,application/pdf"
            kind={(file) =>
              file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "image"
            }
            folder="certificates"
            existingUrl={certificate?.fileUrl ?? ""}
            label="Choose certificate file"
            icon={<FileUp size={16} />}
            onUrlChange={setPreviewUrl}
          />
        </div>

        <div className="flex items-center gap-3 border-t border-cream/10 pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-6 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending && <Loader2 size={15} className="animate-spin" />}
            {isEdit ? "Save changes" : "Add certificate"}
          </button>

          <Link
            href="/dashboard/certificates"
            className="rounded-full border border-cream/10 px-6 py-2.5 text-sm text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
