import Link from "next/link";
import { ArrowUpRight, Folder, Pencil, Plus, Trash2 } from "lucide-react";
import {
  getClo3dVideos,
  getClo3dFolders,
  CLO3D_MIGRATION,
  type Clo3dVideo,
  type Clo3dFolder,
} from "@/lib/clo3d";
import { removeClo3dVideo, removeClo3dFolder } from "./actions";
import ConfirmSubmit from "@/components/dashboard/ConfirmSubmit";
import Clo3dFolderAdd from "@/components/dashboard/Clo3dFolderAdd";

export default async function Clo3dManagementPage() {
  const [videos, folders] = await Promise.all([
    getClo3dVideos(),
    getClo3dFolders(),
  ]);

  const folderName = (id: string | null) =>
    folders.find((folder) => folder.id === id)?.name ?? "No folder";

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-cream">
            CLO 3D Management
          </h1>
          <p className="mt-1.5 text-sm text-cream/45">
            {videos.length} video{videos.length === 1 ? "" : "s"} in the
            gallery at /video/clo-3d.
          </p>
        </div>

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
            href="/dashboard/clo3d/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
          >
            <Plus size={16} />
            Add video
          </Link>
        </div>
      </div>

      {/* Folders section */}
      <div className="mt-10 rounded-xl border border-cream/10 bg-card px-5 py-4">
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
        <div className="mt-8 rounded-xl border border-cream/10 bg-card px-5 py-6 text-sm text-cream/50">
          <p>
            No CLO 3D videos yet. Upload render videos and they show in the
            gallery at{" "}
            <code className="text-[#8DB355]">/video/clo-3d</code>.
          </p>
          <p className="mt-3">
            If uploads fail, run the SQL in{" "}
            <code className="text-[#8DB355]">{CLO3D_MIGRATION}</code> in your
            Supabase project first.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              folderLabel={folderName(video.folderId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VideoCard({
  video,
  folderLabel,
}: {
  video: Clo3dVideo;
  folderLabel: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-cream/10 bg-card">
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
              href={`/dashboard/clo3d/${video.id}`}
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
          {folderLabel} · {video.videoDate}
        </p>
      </div>
    </div>
  );
}
