"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProjectEditError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Project edit page error:", error);
  }, [error]);

  const isSizeError =
    error.message?.includes("Body exceeded") ||
    error.message?.includes("1 MB") ||
    error.message?.includes("body size");

  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="font-serif text-3xl font-semibold text-cream">
        Something went wrong
      </h1>

      {isSizeError ? (
        <p className="mt-4 max-w-md text-sm leading-6 text-cream/50">
          The project data is too large to load in the editor. Try reducing the
          number of images, or contact support.
        </p>
      ) : (
        <p className="mt-4 max-w-md text-sm leading-6 text-cream/50">
          {error.message || "An unexpected error occurred."}
        </p>
      )}

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={reset}
          className="rounded-full border border-cream/10 px-6 py-2.5 text-sm text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
        >
          Try again
        </button>
        <Link
          href="/dashboard/projects"
          className="rounded-full bg-[#8DB355] px-6 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
        >
          Back to projects
        </Link>
      </div>
    </div>
  );
}
