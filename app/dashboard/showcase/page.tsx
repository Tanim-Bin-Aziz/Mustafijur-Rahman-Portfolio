import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  getShowcaseImages,
  SHOWCASE_MIGRATION,
  type ShowcaseImage,
} from "@/lib/showcase";
import { removeShowcaseImage } from "./actions";
import ConfirmSubmit from "@/components/dashboard/ConfirmSubmit";

export default async function ShowcaseManagementPage() {
  const images = await getShowcaseImages();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-cream">
            Showcase Image Management
          </h1>
          <p className="mt-1.5 text-sm text-cream/45">
            {images.length} image{images.length === 1 ? "" : "s"} in the
            Showcase Gallery.
          </p>
        </div>

        <Link
          href="/dashboard/showcase/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
        >
          <Plus size={16} />
          Add image
        </Link>
      </div>

      {images.length === 0 ? (
        <div className="mt-10 rounded-xl border border-cream/10 bg-card px-5 py-6 text-sm text-cream/50">
          <p>No showcase images yet. Until you add one, the homepage falls
            back to the default Showcase Gallery items.</p>
          <p className="mt-3">
            If uploads fail, run the SQL in{" "}
            <code className="text-[#8DB355]">{SHOWCASE_MIGRATION}</code> in
            your Supabase project first.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <ShowcaseCard key={image.id} image={image} />
          ))}
        </div>
      )}
    </div>
  );
}

function ShowcaseCard({ image }: { image: ShowcaseImage }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-cream/10 bg-card">
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={image.thumbnailUrl || image.imageUrl}
          alt={image.title}
          fill
          sizes="(max-width:640px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/showcase/${image.id}`}
              title="Edit image"
              className="inline-flex items-center rounded-full bg-[#8DB355] p-1.5 text-bg transition-colors hover:bg-[#9cc163]"
            >
              <Pencil size={13} />
            </Link>
            <form action={removeShowcaseImage}>
              <input type="hidden" name="imageId" value={image.id} />
              <ConfirmSubmit
                message={`Delete “${image.title}”? This cannot be undone.`}
                title="Delete image"
                className="inline-flex items-center rounded-full bg-black/60 p-1.5 text-cream/80 transition-colors hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={13} />
              </ConfirmSubmit>
            </form>
          </div>
        </div>
      </div>

      <div className="px-3 py-2.5">
        <p className="truncate text-sm text-cream">{image.title}</p>
        <p className="mt-0.5 truncate font-mono text-[10px] text-cream/35">
          {[image.category, image.location].filter(Boolean).join(" · ")}
        </p>
      </div>
    </div>
  );
}
