import Link from "next/link";
import { ArrowUpRight, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import {
  getCvDocuments,
  CV_MIGRATION,
  type CvDocument,
} from "@/lib/cv";
import { removeCvDocument } from "./actions";
import ConfirmSubmit from "@/components/dashboard/ConfirmSubmit";

export default async function CvManagementPage() {
  const documents = await getCvDocuments();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-cream">
            CV Management
          </h1>
          <p className="mt-1.5 text-sm text-cream/45">
            The viewer at /about/cv shows the CV with the lowest sort order.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {documents.length > 0 && (
            <a
              href="/about/cv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-cream/10 px-5 py-2.5 text-sm text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
            >
              Open viewer
              <ArrowUpRight size={14} />
            </a>
          )}

          <Link
            href="/dashboard/cv/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
          >
            <Plus size={16} />
            Add CV
          </Link>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="mt-10 rounded-xl border border-cream/10 bg-card px-5 py-6 text-sm text-cream/50">
          <p>
            No CV uploaded yet. Upload a CV PDF and it opens in the viewer at{" "}
            <code className="text-[#8DB355]">/about/cv</code>.
          </p>
          <p className="mt-3">
            If uploads fail, run the SQL in{" "}
            <code className="text-[#8DB355]">{CV_MIGRATION}</code> in your
            Supabase project first.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((document, index) => (
            <CvCard key={document.id} cv={document} isActive={index === 0} />
          ))}
        </div>
      )}
    </div>
  );
}

function CvCard({ cv, isActive }: { cv: CvDocument; isActive: boolean }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-cream/10 bg-card">
      <div className="relative flex aspect-[4/3] w-full items-center justify-center bg-black/30">
        <FileText size={44} className="text-red-400/80" />

        {isActive ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#8DB355] px-2.5 py-1 font-mono text-[10px] tracking-widest text-bg">
            IN VIEWER
          </span>
        ) : (
          <span className="absolute left-3 top-3 rounded-full bg-red-500/90 px-2.5 py-1 font-mono text-[10px] tracking-widest text-white">
            PDF
          </span>
        )}

        <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/cv/${cv.id}`}
              title="Edit CV"
              className="inline-flex items-center rounded-full bg-[#8DB355] p-1.5 text-bg transition-colors hover:bg-[#9cc163]"
            >
              <Pencil size={13} />
            </Link>
            <form action={removeCvDocument}>
              <input type="hidden" name="cvId" value={cv.id} />
              <ConfirmSubmit
                message={`Delete “${cv.title}”? This cannot be undone.`}
                title="Delete CV"
                className="inline-flex items-center rounded-full bg-black/60 p-1.5 text-cream/80 transition-colors hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={13} />
              </ConfirmSubmit>
            </form>
          </div>
        </div>
      </div>

      <div className="px-3 py-2.5">
        <p className="truncate text-sm text-cream">{cv.title || "Untitled CV"}</p>
        <p className="mt-0.5 truncate font-mono text-[10px] text-cream/35">
          Sort order {cv.sortOrder}
        </p>
      </div>
    </div>
  );
}
