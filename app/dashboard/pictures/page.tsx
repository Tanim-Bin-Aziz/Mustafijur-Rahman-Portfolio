import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  getGalleryFolders,
  getGalleryImages,
  type GalleryFolder,
  type GalleryImage,
} from "@/lib/gallery";
import { removeGalleryImage } from "./actions";
import ConfirmSubmit from "@/components/dashboard/ConfirmSubmit";

function groupByFolder(
  images: GalleryImage[],
  folders: GalleryFolder[],
) {
  const groups: Record<string, { folder: GalleryFolder; images: GalleryImage[] }> = {};
  for (const folder of folders) {
    groups[folder.id] = { folder, images: [] };
  }
  for (const image of images) {
    if (groups[image.folderId]) {
      groups[image.folderId].images.push(image);
    }
  }
  return groups;
}

export default async function PicturesManagementPage() {
  const [folders, images] = await Promise.all([
    getGalleryFolders(),
    getGalleryImages(),
  ]);

  if (folders.length === 0) {
    return (
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-2xl font-semibold text-cream">
          Picture Management
        </h1>
        <p className="mt-8 rounded-xl border border-cream/10 bg-card px-5 py-6 text-sm text-cream/50">
          No folders found. Run the SQL in{" "}
          <code className="text-[#8DB355]">
            lib/supabase/migrations/002_gallery.sql
          </code>{" "}
          in your Supabase project first.
        </p>
      </div>
    );
  }

  const groups = groupByFolder(images, folders);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-cream">
            Picture Management
          </h1>
          <p className="mt-1.5 text-sm text-cream/45">
            {images.length} image{images.length === 1 ? "" : "s"} across{" "}
            {folders.length} folders.
          </p>
        </div>

        <Link
          href="/dashboard/pictures/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
        >
          <Plus size={16} />
          Add image
        </Link>
      </div>

      <div className="mt-10 space-y-10">
        {folders.map((folder) => {
          const group = groups[folder.id];
          if (!group || group.images.length === 0) return null;

          return (
            <section key={folder.id}>
              <h2 className="mb-4 font-serif text-lg text-cream">
                {folder.name}
                <span className="ml-2 font-mono text-xs text-cream/35">
                  {group.images.length}
                </span>
              </h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {group.images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-xl border border-cream/10 bg-card"
                  >
                    <div className="relative aspect-square w-full overflow-hidden">
                      <Image
                        src={image.imageUrl}
                        alt={image.title}
                        fill
                        sizes="(max-width:640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/pictures/${image.id}`}
                            title="Edit image"
                            className="inline-flex items-center rounded-full bg-[#8DB355] p-1.5 text-bg transition-colors hover:bg-[#9cc163]"
                          >
                            <Pencil size={13} />
                          </Link>
                          <form action={removeGalleryImage}>
                            <input
                              type="hidden"
                              name="imageId"
                              value={image.id}
                            />
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
                      {image.date && (
                        <p className="mt-0.5 font-mono text-[10px] text-cream/35">
                          {image.date}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
