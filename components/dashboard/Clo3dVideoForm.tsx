"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Film, FileUp, Loader2 } from "lucide-react";
import {
  addClo3dVideo,
  editClo3dVideo,
  type Clo3dFormState,
} from "@/app/dashboard/clo3d/actions";
import type { Clo3dVideo, Clo3dFolder } from "@/lib/clo3d";

const fieldClass =
  "w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-[#8DB355]";

const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45";

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

  const [fileName, setFileName] = useState("");

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/clo3d"
        className="mb-6 inline-flex items-center gap-2 text-sm text-cream/50 transition-colors hover:text-[#8DB355]"
      >
        <ArrowLeft size={15} />
        Back to CLO 3D
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

          {isEdit && video?.videoUrl && !fileName && (
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-cream/10 bg-black/20 px-4 py-3">
              <Film size={20} className="shrink-0 text-[#8DB355]" />
              <span className="truncate text-xs text-cream/40">
                Current video is kept unless you choose a new file.
              </span>
            </div>
          )}

          <label
            htmlFor="video"
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
                Choose video file
              </>
            )}
          </label>
          <input
            id="video"
            name="video"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
          />
          <p className="mt-2 text-xs text-cream/30">
            Keep files reasonably small — large videos can fail to upload.
          </p>

          <p className="mt-3 text-xs text-cream/30">
            Or paste a URL below (used when no file is chosen):
          </p>
          <input
            name="videoUrl"
            defaultValue={video?.videoUrl ?? ""}
            placeholder="https://.../video.mp4"
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
            {isEdit ? "Save changes" : "Add video"}
          </button>

          <Link
            href="/dashboard/clo3d"
            className="rounded-full border border-cream/10 px-6 py-2.5 text-sm text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
