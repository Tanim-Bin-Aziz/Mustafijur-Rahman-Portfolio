"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function NewProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("New project page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="font-serif text-3xl font-semibold text-cream">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-cream/50">
        {error.message || "An unexpected error occurred while loading the form."}
      </p>
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
