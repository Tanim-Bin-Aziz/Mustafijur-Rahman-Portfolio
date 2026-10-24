"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, FileUp, Film, Loader2 } from "lucide-react";
import {
  addClo3dVideo,
  editClo3dVideo,
  type Clo3dFormState,
} from "@/app/dashboard/videos/clo3d/actions";
import DirectFileInput from "@/components/dashboard/DirectFileInput";
import type { Clo3dVideo, Clo3dFolder } from "@/lib/clo3d";

const fieldClass =
  "w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-[#8DB355]";

const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45";

// Client-side guard: uploads go straight to R2, so this only keeps accidental
// multi-GB picks from tying up the browser tab.
const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
const MAX_VIDEO_LABEL = "500 MB";

export default function Clo3dVideoForm({
  video,
  folders,
}: {
  video?: Clo3dVideo;
  folders: Clo3dFolder[];
}) {
  const isEdit = Boolean(video);

  const [state, formAction, isPending] = useActionState<
    Clo3dFormState,
    FormData
  >(isEdit ? editClo3dVideo : addClo3dVideo, { error: null });

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/videos"
        className="mb-6 inline-flex items-center gap-2 text-sm text-cream/50 transition-colors hover:text-[#8DB355]"
      >
        <ArrowLeft size={15} />
        Back to Video Management
      </Link>

      <h1 className="font-serif text-2xl font-semibold text-cream">
        {isEdit ? "Edit CLO 3D video" : "Add CLO 3D video"}
      </h1>
      <p className="mt-1.5 text-sm text-cream/45">
        {isEdit
          ? "Update the video, title, folder or date."
          : "Upload a CLO 3D render video (mp4) for the gallery at /video/clo-3d."}
      </p>

      {state.error && (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <form action={formAction} className="mt-8 space-y-6">
        {isEdit && <input type="hidden" name="videoId" value={video?.id} />}

        <div>
          <label className={labelClass} htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={video?.title ?? ""}
            placeholder="CLO 3D Sample 01"
            className={fieldClass}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="folderId">
              Folder
            </label>
            <select
              id="folderId"
              name="folderId"
              defaultValue={video?.folderId ?? ""}
              className={fieldClass}
            >
              <option value="" className="bg-bg">
                No folder
              </option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id} className="bg-bg">
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="videoDate">
              Date
            </label>
            <input
              id="videoDate"
              name="videoDate"
              type="date"
              defaultValue={video?.videoDate ?? ""}
              className={fieldClass}
            />
          </div>
        </div>

        {folders.length === 0 && (
          <p className="rounded-lg border border-cream/10 bg-black/20 px-4 py-3 text-xs text-cream/40">
            No folders yet — create one from the CLO 3D management page to
            organize videos in the gallery.
          </p>
        )}

        <div>
          <span className={labelClass}>Video file (mp4)</span>

          {isEdit && video?.videoUrl && (
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-cream/10 bg-black/20 px-4 py-3">
              <Film size={20} className="shrink-0 text-[#8DB355]" />
              <span className="truncate text-xs text-cream/40">
                Current video is kept unless you choose a new file.
              </span>
            </div>
          )}

          <DirectFileInput
            urlName="videoUrl"
            accept="video/*"
            kind="video"
            folder="clo3d"
            existingUrl={video?.videoUrl ?? ""}
            label="Choose video file"
            icon={<FileUp size={16} />}
            maxBytes={MAX_VIDEO_BYTES}
            maxLabel={MAX_VIDEO_LABEL}
            placeholder="https://.../video.mp4"
            hint={
              <p className="mt-2 text-xs text-cream/30">
                Maximum {MAX_VIDEO_LABEL}. The file goes straight to R2, so large
                renders no longer hit Vercel&apos;s request limit.
              </p>
            }
          />
        </div>

        <div className="flex items-center gap-3 border-t border-cream/10 pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-6 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending && <Loader2 size={15} className="animate-spin" />}
            {isEdit ? "Save changes" : "Add video"}
          </button>

          <Link
            href="/dashboard/videos"
            className="rounded-full border border-cream/10 px-6 py-2.5 text-sm text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
