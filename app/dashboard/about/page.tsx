import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { getAboutItems, ABOUT_MIGRATION } from "@/lib/about";
import { getCvDocuments, CV_MIGRATION, type CvDocument } from "@/lib/cv";
import { saveAboutCard } from "./actions";
import { removeCvDocument } from "./cv/actions";
import ConfirmSubmit from "@/components/dashboard/ConfirmSubmit";

export default async function AboutCardsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const items = await getAboutItems();
  const cvDocuments = await getCvDocuments();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-cream">
            About Cards
          </h1>
          <p className="mt-1.5 text-sm text-cream/45">
            The two cards on /about — edit their title and cover image.
          </p>
        </div>

        <a
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-cream/10 px-5 py-2.5 text-sm text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
        >
          Open /about
          <ArrowUpRight size={14} />
        </a>
      </div>

      {saved && (
        <p className="mt-6 rounded-lg border border-[#8DB355]/30 bg-[#8DB355]/10 px-3 py-2 text-sm text-[#8DB355]">
          {saved === "cv"
            ? "CV saved. It is live in the viewer at /about/cv."
            : "Card updated. The change is live on /about."}
        </p>
      )}

      {error && (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {items.map((item) => (
          <AboutCardForm key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-14 border-t border-cream/10 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-cream">
              CV Documents
            </h2>
            <p className="mt-1.5 text-sm text-cream/45">
              The viewer at /about/cv shows the CV with the lowest sort order.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {cvDocuments.length > 0 && (
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
              href="/dashboard/about/cv/new"
              className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
            >
              <Plus size={16} />
              Add CV
            </Link>
          </div>
        </div>

        {cvDocuments.length === 0 ? (
          <div className="mt-6 rounded-xl border border-cream/10 bg-card px-5 py-6 text-sm text-cream/50">
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
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cvDocuments.map((cv, index) => (
              <CvCard key={cv.id} cv={cv} isActive={index === 0} />
            ))}
          </div>
        )}
      </div>

      <p className="mt-8 text-sm text-cream/40">
        If saving fails with a missing table, run the SQL in{" "}
        <code className="text-[#8DB355]">{ABOUT_MIGRATION}</code> in your
        Supabase project first.
      </p>
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
              href={`/dashboard/about/cv/${cv.id}`}
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

function AboutCardForm({
  item,
}: {
  item: { id: string; slug: string; title: string; cover: string };
}) {
  return (
    <form
      action={saveAboutCard}
      className="overflow-hidden rounded-xl border border-cream/10 bg-card"
    >
      <input type="hidden" name="id" value={item.id} />

      <div className="relative aspect-[16/10] w-full bg-black/30">
        <Image
          src={item.cover}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width:1024px) 100vw, 50vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] tracking-widest text-cream/80">
          /about/{item.slug}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <label
            htmlFor={`title-${item.id}`}
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-cream/50"
          >
            Card Title
          </label>
          <input
            id={`title-${item.id}`}
            name="title"
            type="text"
            required
            defaultValue={item.title}
            className="w-full rounded-lg border border-white/10 bg-bg px-3.5 py-2.5 text-sm text-cream outline-none transition-colors focus:border-[#8DB355]/60"
          />
        </div>

        <div>
          <label
            htmlFor={`cover-${item.id}`}
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-cream/50"
          >
            Cover Image
          </label>
          <input
            id={`cover-${item.id}`}
            name="cover"
            type="file"
            accept="image/*"
            className="w-full rounded-lg border border-white/10 bg-bg px-3.5 py-2 text-sm text-cream/70 file:mr-3 file:rounded-full file:border-0 file:bg-[#8DB355]/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#8DB355]"
          />
          <p className="mt-1.5 text-xs text-cream/35">
            Leave empty to keep the current image.
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <Link
            href={`/about/${item.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-cream/45 transition-colors hover:text-cream"
          >
            Preview
            <ArrowUpRight size={12} />
          </Link>

          <button
            type="submit"
            className="rounded-full bg-[#8DB355] px-5 py-2 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}
