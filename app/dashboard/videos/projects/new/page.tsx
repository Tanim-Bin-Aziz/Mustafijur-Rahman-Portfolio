import Link from "next/link";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { createVideoProjectAction } from "../actions";
import DirectFileInput from "@/components/dashboard/DirectFileInput";
import UploadSubmit from "@/components/dashboard/UploadSubmit";

export default async function NewVideoProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/videos?tab=video-projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-cream/50 transition-colors hover:text-[#8DB355]"
      >
        <ArrowLeft size={15} />
        Back
      </Link>

      <h1 className="font-serif text-2xl font-semibold text-cream">
        New Video Project
      </h1>
      <p className="mt-1.5 text-sm text-cream/45">
        Create a new video gallery (like Additional Work). You can upload videos
        after creating it.
      </p>

      {error && (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <form action={createVideoProjectAction} className="mt-8 space-y-5">
        <div>
          <label
            className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            placeholder="Additional Work"
            className="w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-[#8DB355]"
            required
          />
        </div>

        <div>
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45">
            Card image (optional)
          </span>
          <DirectFileInput
            urlName="coverUrl"
            accept="image/*"
            kind="cover"
            folder="video-projects"
            label="Choose card image"
            icon={<ImageIcon size={16} />}
          />
        </div>

        <UploadSubmit
          idleLabel="Create project"
          className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-6 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
        />
      </form>
    </div>
  );
}