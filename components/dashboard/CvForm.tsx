"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, FileText, FileUp, Loader2 } from "lucide-react";
import {
  addCvDocument,
  editCvDocument,
  type CvFormState,
} from "@/app/dashboard/cv/actions";
import type { CvDocument } from "@/lib/cv";

const fieldClass =
  "w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-[#8DB355]";

const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45";

export default function CvForm({ cv }: { cv?: CvDocument }) {
  const isEdit = Boolean(cv);

  const [state, formAction, isPending] = useActionState<
    CvFormState,
    FormData
  >(isEdit ? editCvDocument : addCvDocument, { error: null });

  const [fileName, setFileName] = useState("");

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/cv"
        className="mb-6 inline-flex items-center gap-2 text-sm text-cream/50 transition-colors hover:text-[#8DB355]"
      >
        <ArrowLeft size={15} />
        Back to CV management
      </Link>

      <h1 className="font-serif text-2xl font-semibold text-cream">
        {isEdit ? "Edit CV" : "Add CV"}
      </h1>
      <p className="mt-1.5 text-sm text-cream/45">
        {isEdit
          ? "Update the PDF, title or order."
          : "Upload a CV PDF — it shows in the viewer at /about/cv."}
      </p>

      {state.error && (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <form action={formAction} className="mt-8 space-y-6">
        {isEdit && <input type="hidden" name="cvId" value={cv?.id} />}

        <div>
          <label className={labelClass} htmlFor="title">
            Title (optional)
          </label>
          <input
            id="title"
            name="title"
            defaultValue={cv?.title ?? ""}
            placeholder="Curriculum Vitae 2026"
            className={fieldClass}
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
            defaultValue={cv?.sortOrder ?? 0}
            className={fieldClass}
          />
          <p className="mt-1.5 text-xs text-cream/30">
            The viewer at /about/cv shows the CV with the lowest sort order.
          </p>
        </div>

        <div>
          <span className={labelClass}>CV file (pdf only)</span>

          <label
            htmlFor="file"
            className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-dashed border-cream/15 px-4 py-3 text-sm text-cream/50 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
          >
            {fileName ? (
              <>
                <Check size={16} className="text-[#8DB355]" />
                <span className="truncate text-cream/70">{fileName}</span>
              </>
            ) : (
              <>
                <FileUp size={16} />
                Choose CV file
              </>
            )}
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
          />

          <div className="mt-4 flex items-center gap-3 rounded-lg border border-cream/10 bg-black/20 px-4 py-3">
            <FileText size={20} className="shrink-0 text-red-400" />
            <span className="text-xs text-cream/40">
              {isEdit
                ? "Current PDF stays unless you choose a new file."
                : "The uploaded PDF opens in the browser's PDF viewer."}
            </span>
          </div>

          <p className="mt-3 text-xs text-cream/30">
            Or paste a URL below (used when no file is chosen):
          </p>
          <input
            name="fileUrl"
            defaultValue={cv?.fileUrl ?? ""}
            placeholder="https://.../cv.pdf"
            className={`${fieldClass} mt-2`}
          />
        </div>

        <div className="flex items-center gap-3 border-t border-cream/10 pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-6 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending && <Loader2 size={15} className="animate-spin" />}
            {isEdit ? "Save changes" : "Add CV"}
          </button>

          <Link
            href="/dashboard/cv"
            className="rounded-full border border-cream/10 px-6 py-2.5 text-sm text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
