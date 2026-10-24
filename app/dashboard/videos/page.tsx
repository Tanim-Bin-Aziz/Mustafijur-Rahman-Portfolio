import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Clapperboard,
  Film,
  Folder,
  Images,
  Pencil,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import {
  getClo3dVideos,
  getClo3dFolders,
  CLO3D_MIGRATION,
  type Clo3dVideo,
} from "@/lib/clo3d";
import {
  getShowcaseVideoCards,
  type ShowcaseVideoCard,
} from "@/lib/showcase";
import {
  getPageVideos,
  getAdditionalWorkVideos,
  VIDEO_MIGRATION,
  type PageVideo,
  type AdditionalWorkVideo,
} from "@/lib/video";
import { removeClo3dVideo, removeClo3dFolder } from "./clo3d/actions";
import {
  addShowcaseVideoCard,
  updateShowcaseVideoCardAction,
  removeShowcaseVideoCard,
  savePageVideo,
  addAdditionalWorkVideo,
  updateAdditionalWorkVideoAction,
  removeAdditionalWorkVideo,
} from "./actions";
import ConfirmSubmit from "@/components/dashboard/ConfirmSubmit";
import Clo3dFolderAdd from "@/components/dashboard/Clo3dFolderAdd";
import DirectFileInput from "@/components/dashboard/DirectFileInput";
import UploadSubmit, { UploadProgress } from "@/components/dashboard/UploadSubmit";
import ShowcaseReorder from "@/components/dashboard/ShowcaseReorder";

const TABS = [
  { id: "clo3d", label: "CLO 3D", icon: Clapperboard },
  { id: "showcase", label: "Showcase Video", icon: Images },
  { id: "final-collection", label: "Final Collections", icon: Film },
  { id: "drapping", label: "Drapping", icon: Film },
  { id: "studio-collection", label: "Studio Collections", icon: Film },
  { id: "additional-work", label: "Additional Work", icon: Video },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PAGE_VIDEO_TABS: Record<string, string> = {
  "final-collection": "Final Collection",
  drapping: "Drapping Final Dress",
  "studio-collection": "Studio Collection",
};

const fieldClass =
  "w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-[#8DB355]";

const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45";

export default async function VideosManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; saved?: string; error?: string }>;
}) {
  const { tab, saved, error } = await searchParams;

  const activeTab: TabId = TABS.some((t) => t.id === tab)
    ? (tab as TabId)
    : "clo3d";

  const [clo3dVideos, folders, showcaseVideos, pageVideos, additionalVideos] =
    await Promise.all([
      getClo3dVideos(),
      getClo3dFolders(),
      getShowcaseVideoCards(),
      getPageVideos(),
      getAdditionalWorkVideos(),
    ]);

  const counts: Record<TabId, number> = {
    clo3d: clo3dVideos.length,
    showcase: showcaseVideos.length,
    "final-collection": 1,
    drapping: 1,
    "studio-collection": 1,
    "additional-work": additionalVideos.length,
  };

  const pageVideoBySlug = (slug: string) =>
    pageVideos.find((video) => video.slug === slug) ?? null;

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-cream">
          Video Management
        </h1>
        <p className="mt-1.5 text-sm text-cream/45">
          All video content in one place — CLO 3D gallery, showcase card
          videos, /video page cards and additional work.
        </p>
      </div>

      {/* Top bar — section cards */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;

          return (
            <Link
              key={id}
              href={`/dashboard/videos?tab=${id}`}
              className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                isActive
                  ? "border-[#8DB355]/50 bg-[#8DB355]/10"
                  : "border-cream/10 bg-card hover:border-cream/25"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-[#8DB355]" : "text-cream/45"}
              />
              <p
                className={`mt-3 text-sm font-medium ${
                  isActive ? "text-[#8DB355]" : "text-cream/80"
                }`}
              >
                {label}
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-cream/35">
                {counts[id]} {counts[id] === 1 ? "video" : "videos"}
              </p>
            </Link>
          );
        })}
      </div>

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

      <div className="mt-8">
        {activeTab === "clo3d" && (
          <Clo3dTab videos={clo3dVideos} folders={folders} />
        )}

        {activeTab === "showcase" && <ShowcaseTab cards={showcaseVideos} />}

        {PAGE_VIDEO_TABS[activeTab] && (
          <PageVideoTab
            label={PAGE_VIDEO_TABS[activeTab]}
            video={pageVideoBySlug(activeTab)}
          />
        )}

        {activeTab === "additional-work" && (
          <AdditionalWorkTab videos={additionalVideos} />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   CLO 3D tab
--------------------------------------------------------- */
function Clo3dTab({
  videos,
  folders,
}: {
  videos: Clo3dVideo[];
  folders: { id: string; name: string }[];
}) {
  const folderName = (id: string | null) =>
    folders.find((folder) => folder.id === id)?.name ?? "No folder";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-cream/45">
          CLO 3D render videos — shown in the gallery at /video/clo-3d.
        </p>

        <div className="flex items-center gap-3">
          {videos.length > 0 && (
            <a
              href="/video/clo-3d"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-cream/10 px-5 py-2.5 text-sm text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
            >
              Open gallery
              <ArrowUpRight size={14} />
            </a>
          )}

          <Link
            href="/dashboard/videos/clo3d/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
          >
            <Plus size={16} />
            Add video
          </Link>
        </div>
      </div>

      {/* Folders */}
      <div className="mt-6 rounded-xl border border-cream/10 bg-card px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45">
          Folders
        </p>

        {folders.length === 0 ? (
          <p className="mt-3 text-sm text-cream/50">
            No folders yet. Add one to organize the gallery.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {folders.map((folder) => (
              <span
                key={folder.id}
                className="inline-flex items-center gap-2 rounded-full border border-cream/10 bg-black/20 py-1 pl-3 pr-1.5 text-sm text-cream/70"
              >
                <Folder size={13} className="text-[#8DB355]" />
                {folder.name}
                <form action={removeClo3dFolder}>
                  <input type="hidden" name="folderId" value={folder.id} />
                  <ConfirmSubmit
                    message={`Delete folder “${folder.name}”? Its videos move to No folder.`}
                    title="Delete folder"
                    className="inline-flex items-center rounded-full p-1 text-cream/40 transition-colors hover:bg-red-500/20 hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </ConfirmSubmit>
                </form>
              </span>
            ))}
          </div>
        )}

        <Clo3dFolderAdd />
      </div>

      {/* Videos */}
      {videos.length === 0 ? (
        <div className="mt-6 rounded-xl border border-cream/10 bg-card px-5 py-6 text-sm text-cream/50">
          <p>
            No CLO 3D videos yet. Upload render videos and they show in the
            gallery at <code className="text-[#8DB355]">/video/clo-3d</code>.
          </p>
          <p className="mt-3">
            If uploads fail, run the SQL in{" "}
            <code className="text-[#8DB355]">{CLO3D_MIGRATION}</code> in your
            Supabase project first.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group relative overflow-hidden rounded-xl border border-cream/10 bg-card"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                <video
                  src={video.videoUrl}
                  preload="metadata"
                  muted
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/videos/clo3d/${video.id}`}
                      title="Edit video"
                      className="inline-flex items-center rounded-full bg-[#8DB355] p-1.5 text-bg transition-colors hover:bg-[#9cc163]"
                    >
                      <Pencil size={13} />
                    </Link>
                    <form action={removeClo3dVideo}>
                      <input type="hidden" name="videoId" value={video.id} />
                      <ConfirmSubmit
                        message={`Delete “${video.title}”? This cannot be undone.`}
                        title="Delete video"
                        className="inline-flex items-center rounded-full bg-black/60 p-1.5 text-cream/80 transition-colors hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={13} />
                      </ConfirmSubmit>
                    </form>
                  </div>
                </div>
              </div>

              <div className="px-3 py-2.5">
                <p className="truncate text-sm text-cream">{video.title}</p>
                <p className="mt-0.5 truncate font-mono text-[10px] text-cream/35">
                  {folderName(video.folderId)} · {video.videoDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Showcase video tab (home page "Showcase" section —
   each card plays a looping background video)
--------------------------------------------------------- */
function ShowcaseTab({ cards }: { cards: ShowcaseVideoCard[] }) {
  const atLimit = cards.length >= 7;
  return (
    <div>
      <p className="text-sm text-cream/45">
        The home page Showcase section — each card plays a looping background
        video. Maximum 7 videos.
      </p>

      {cards.length > 1 && <ShowcaseReorder cards={cards} />}

      {/* Add form */}
      {!atLimit && (
      <form
        action={addShowcaseVideoCard}
        className="mt-6 rounded-xl border border-cream/10 bg-card p-5"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45">
          Add showcase video
        </p>

        <div className="mt-4">
          <label className={labelClass} htmlFor="sc-label">
            Label (optional)
          </label>
          <input
            id="sc-label"
            name="label"
            placeholder="Motion 02"
            className={fieldClass}
          />
        </div>

        <div className="mt-4">
          <span className={labelClass}>Video file (mp4)</span>
          <DirectFileInput
            urlName="videoUrl"
            accept="video/*"
            kind="video"
            folder="showcase"
            label="Choose video file"
            icon={<Film size={16} />}
            placeholder="https://.../video.mp4"
          />
        </div>

        <UploadProgress label="Uploading video…" />

        <UploadSubmit
          idleLabel="Add video"
          pendingLabel="Uploading…"
          icon={<Plus size={15} />}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-5 py-2 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
        />
      </form>
      )}

      {/* Existing cards */}
      {cards.length === 0 ? (
        <div className="mt-6 rounded-xl border border-cream/10 bg-card px-5 py-6 text-sm text-cream/50">
          No showcase videos yet. If uploads fail, run the SQL in{" "}
          <code className="text-[#8DB355]">
            lib/supabase/migrations/011_showcase_videos.sql
          </code>{" "}
          in your Supabase project first.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className="overflow-hidden rounded-xl border border-cream/10 bg-card"
            >
              <div className="relative aspect-video w-full bg-black/40">
                <video
                  src={card.videoUrl}
                  preload="metadata"
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="h-full w-full object-cover"
                />
                {card.label && (
                  <span className="absolute bottom-2 left-0 right-0 z-10 text-center text-[13px] tracking-wide text-white [text-shadow:0_2px_8px_rgba(0,0,0,.7)]">
                    {card.label}
                  </span>
                )}
              </div>

              <form
                action={updateShowcaseVideoCardAction}
                className="space-y-3 p-4"
              >
                <input type="hidden" name="id" value={card.id} />
                <input
                  type="hidden"
                  name="currentVideoUrl"
                  value={card.videoUrl}
                />

                <div>
                  <label
                    className={labelClass}
                    htmlFor={`sc-edit-label-${card.id}`}
                  >
                    Label
                  </label>
                  <input
                    id={`sc-edit-label-${card.id}`}
                    name="label"
                    defaultValue={card.label}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <span className={labelClass}>
                    New video (leave empty to keep current)
                  </span>
                  <DirectFileInput
                    urlName="videoUrl"
                    accept="video/*"
                    kind="video"
                    folder="showcase"
                    label="Choose new video"
                    icon={<Film size={16} />}
                    placeholder="https://.../video.mp4"
                  />
                </div>

                <UploadProgress label="Uploading video…" />

                <div className="flex items-center justify-end pt-1">
                  <UploadSubmit
                    idleLabel="Save"
                    pendingLabel="Uploading…"
                    className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-4 py-1.5 text-xs font-semibold text-bg transition-colors hover:bg-[#9cc163]"
                  />
                </div>
              </form>

              <div className="border-t border-cream/10 px-4 py-3">
                <form action={removeShowcaseVideoCard}>
                  <input type="hidden" name="id" value={card.id} />
                  <ConfirmSubmit
                    message={`Delete “${card.label || "this card"}”? This cannot be undone.`}
                    title="Delete showcase video"
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

/* ---------------------------------------------------------
   /video page card tabs (Final Collection / Drapping / Studio)
--------------------------------------------------------- */
function PageVideoTab({
  label,
  video,
}: {
  label: string;
  video: PageVideo | null;
}) {
  if (!video) {
    return (
      <div className="rounded-xl border border-cream/10 bg-card px-5 py-6 text-sm text-cream/50">
        {label} card not found. Run the SQL in{" "}
        <code className="text-[#8DB355]">{VIDEO_MIGRATION}</code> in your
        Supabase project first.
      </div>
    );
  }

  return (
    <form action={savePageVideo} className="max-w-2xl">
      <input type="hidden" name="slug" value={video.slug} />
      <input type="hidden" name="currentVideoUrl" value={video.videoUrl} />

      <p className="text-sm text-cream/45">
        Card at <code className="text-[#8DB355]">/video/{video.slug}</code> —
        title, cover, video and play mode.
      </p>

      <div className="mt-6 space-y-6 rounded-xl border border-cream/10 bg-card p-5">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-cream/10">
            <Image
              src={video.cover}
              alt={video.title}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
          <video
            src={video.videoUrl}
            preload="metadata"
            muted
            className="h-20 w-32 shrink-0 rounded-lg border border-cream/10 object-cover"
          />
          <span className="text-xs text-cream/40">
            Current cover and video. Upload files to replace them.
          </span>
        </div>

        <div>
          <label className={labelClass} htmlFor={`title-${video.slug}`}>
            Title
          </label>
          <input
            id={`title-${video.slug}`}
            name="title"
            defaultValue={video.title}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor={`mode-${video.slug}`}>
            Play mode
          </label>
          <select
            id={`mode-${video.slug}`}
            name="mode"
            defaultValue={video.mode}
            className={fieldClass}
          >
            <option value="autoplay" className="bg-bg">
              Autoplay — loops on the page
            </option>
            <option value="click-fullscreen" className="bg-bg">
              Click to open fullscreen player
            </option>
          </select>
        </div>

        <div>
          <span className={labelClass}>
            Video file (leave empty to keep current)
          </span>
          <DirectFileInput
            urlName="videoUrl"
            accept="video/*"
            kind="video"
            folder="page-videos"
            label="Choose video file"
            icon={<Film size={16} />}
            placeholder="https://.../video.mp4"
          />
        </div>

        <div>
          <span className={labelClass}>
            Cover image (leave empty to keep current)
          </span>
          <DirectFileInput
            urlName="coverUrl"
            accept="image/*"
            kind="cover"
            folder="page-videos"
            label="Choose cover image"
            icon={<Images size={16} />}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor={`desc-${video.slug}`}>
            Description
          </label>
          <textarea
            id={`desc-${video.slug}`}
            name="description"
            rows={3}
            defaultValue={video.description}
            className={fieldClass}
          />
        </div>

        <div className="border-t border-cream/10 pt-5">
          <button
            type="submit"
            className="rounded-full bg-[#8DB355] px-6 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------
   Additional Work tab
--------------------------------------------------------- */
function AdditionalWorkTab({ videos }: { videos: AdditionalWorkVideo[] }) {
  return (
    <div>
      <p className="text-sm text-cream/45">
        Videos in the Additional Work gallery at /video/additional-work.
      </p>

      {/* Add form */}
      <form
        action={addAdditionalWorkVideo}
        className="mt-6 rounded-xl border border-cream/10 bg-card p-5"
      >
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
              placeholder="Additional Work 02"
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
            folder="additional-work"
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
          No additional work videos yet. If uploads fail, run the SQL in{" "}
          <code className="text-[#8DB355]">{VIDEO_MIGRATION}</code> in your
          Supabase project first.
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
                action={updateAdditionalWorkVideoAction}
                className="space-y-3 p-4"
              >
                <input type="hidden" name="id" value={video.id} />
                <input
                  type="hidden"
                  name="currentVideoUrl"
                  value={video.videoUrl}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      className={labelClass}
                      htmlFor={`aw-edit-title-${video.id}`}
                    >
                      Title
                    </label>
                    <input
                      id={`aw-edit-title-${video.id}`}
                      name="title"
                      defaultValue={video.title}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label
                      className={labelClass}
                      htmlFor={`aw-edit-date-${video.id}`}
                    >
                      Date
                    </label>
                    <input
                      id={`aw-edit-date-${video.id}`}
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
                    folder="additional-work"
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
                <form action={removeAdditionalWorkVideo}>
                  <input type="hidden" name="id" value={video.id} />
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
