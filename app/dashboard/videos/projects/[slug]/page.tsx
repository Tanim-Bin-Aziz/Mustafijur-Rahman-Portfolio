import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Pencil, Film, Image as ImageIcon } from "lucide-react";
import {
  getVideoProject,
  getVideoProjectVideos,
} from "@/lib/video-projects";
import {
  addVideoProjectVideoAction,
  updateVideoProjectVideoAction,
  deleteVideoProjectVideoAction,
  deleteVideoProjectAction,
  updateVideoProjectCoverAction,
} from "../actions";
import ConfirmSubmit from "@/components/dashboard/ConfirmSubmit";
import DirectFileInput from "@/components/dashboard/DirectFileInput";

const fieldClass =
  "w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-[#8DB355]";

const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45";

export default async function VideoProjectManagementPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { slug } = await params;
  const { saved, error } = await searchParams;
  const project = await getVideoProject(slug);
  if (!project) notFound();

  const videos = await getVideoProjectVideos(slug);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/videos?tab=video-projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-cream/50 transition-colors hover:text-[#8DB355]"
      >
        <ArrowLeft size={15} />
        Video Projects
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-cream">
            {project.title}
          </h1>
          <p className="mt-1.5 text-sm text-cream/45">
            {videos.length} video{videos.length === 1 ? "" : "s"} in this project.
          </p>
        </div>

        <form action={deleteVideoProjectAction}>
          <input type="hidden" name="slug" value={project.slug} />
          <ConfirmSubmit
            message={`Delete project “${project.title}”? All its videos will be removed.`}
            title="Delete project"
            className="inline-flex items-center gap-2 rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/10"
          >
            <Trash2 size={14} />
            Delete project
          </ConfirmSubmit>
        </form>
      </div>

      <form
        action={updateVideoProjectCoverAction}
        className="mt-6 rounded-xl border border-cream/10 bg-card p-5"
      >
        <input type="hidden" name="projectSlug" value={project.slug} />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45">
          Card image
        </p>
        {project.cover && (
          <div className="mt-3 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover}
              alt={project.title}
              className="h-24 w-40 rounded-lg border border-cream/10 object-cover"
            />
          </div>
        )}
        <DirectFileInput
          urlName="coverUrl"
          accept="image/*"
          kind="cover"
          folder={`video-projects/${project.slug}`}
          label="Choose card image"
          icon={<ImageIcon size={16} />}
        />
        <button
          type="submit"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-5 py-2 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
        >
          Save card image
        </button>
      </form>

      {saved && (
        <p className="mt-6 rounded-lg border border-[#8DB355]/30 bg-[#8DB355]/10 px-3 py-2 text-sm text-[#8DB355]">
          Saved. The change is live.
        </p>
      )}

      {error && (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* Add form */}
      <form
        action={addVideoProjectVideoAction}
        className="mt-6 rounded-xl border border-cream/10 bg-card p-5"
      >
        <input type="hidden" name="projectSlug" value={project.slug} />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45">
          Add video
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="aw-title">
              Title
            </label>
            <input
              id="aw-title"
              name="title"
              placeholder="Video title"
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="aw-date">
              Date
            </label>
            <input
              id="aw-date"
              name="videoDate"
              type="date"
              className={fieldClass}
            />
          </div>
        </div>

        <div className="mt-4">
          <span className={labelClass}>Video file (mp4)</span>
          <DirectFileInput
            urlName="videoUrl"
            accept="video/*"
            kind="video"
            folder={`video-projects/${project.slug}`}
            label="Choose video file"
            icon={<Film size={16} />}
            placeholder="https://.../video.mp4"
          />
        </div>

        <button
          type="submit"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-5 py-2 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
        >
          <Plus size={15} />
          Add video
        </button>
      </form>

      {/* Existing videos */}
      {videos.length === 0 ? (
        <div className="mt-6 rounded-xl border border-cream/10 bg-card px-5 py-6 text-sm text-cream/50">
          No videos yet.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {videos.map((video) => (
            <div
              key={video.id}
              className="overflow-hidden rounded-xl border border-cream/10 bg-card"
            >
              <div className="relative aspect-video w-full bg-black/40">
                <video
                  src={video.videoUrl}
                  preload="metadata"
                  muted
                  className="h-full w-full object-cover"
                />
              </div>

              <form
                action={updateVideoProjectVideoAction}
                className="space-y-3 p-4"
              >
                <input type="hidden" name="id" value={video.id} />
                <input type="hidden" name="projectSlug" value={project.slug} />
                <input
                  type="hidden"
                  name="currentVideoUrl"
                  value={video.videoUrl}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      className={labelClass}
                      htmlFor={`vp-edit-title-${video.id}`}
                    >
                      Title
                    </label>
                    <input
                      id={`vp-edit-title-${video.id}`}
                      name="title"
                      defaultValue={video.title}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label
                      className={labelClass}
                      htmlFor={`vp-edit-date-${video.id}`}
                    >
                      Date
                    </label>
                    <input
                      id={`vp-edit-date-${video.id}`}
                      name="videoDate"
                      type="date"
                      defaultValue={video.videoDate}
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div>
                  <span className={labelClass}>
                    New video (leave empty to keep current)
                  </span>
                  <DirectFileInput
                    urlName="videoUrl"
                    accept="video/*"
                    kind="video"
                    folder={`video-projects/${project.slug}`}
                    label="Choose new video"
                    icon={<Film size={16} />}
                    placeholder="https://.../video.mp4"
                  />
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    type="submit"
                    className="rounded-full bg-[#8DB355] px-4 py-1.5 text-xs font-semibold text-bg transition-colors hover:bg-[#9cc163]"
                  >
                    Save
                  </button>
                </div>
              </form>

              <div className="border-t border-cream/10 px-4 py-3">
                <form action={deleteVideoProjectVideoAction}>
                  <input type="hidden" name="id" value={video.id} />
                  <input type="hidden" name="projectSlug" value={project.slug} />
                  <ConfirmSubmit
                    message={`Delete “${video.title}”? This cannot be undone.`}
                    title="Delete video"
                    className="rounded-full border border-cream/10 px-4 py-1.5 text-xs text-cream/50 transition-colors hover:border-red-500/40 hover:text-red-300"
                  >
                    Delete
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}