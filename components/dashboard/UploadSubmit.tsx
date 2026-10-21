"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function UploadProgress({
  label = "Uploading…",
}: {
  label?: string;
}) {
  const { pending } = useFormStatus();

  if (!pending) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-3 flex items-center gap-3 text-[#8DB355]"
    >
      <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-cream/10">
        <span className="animate-upload-bar absolute inset-y-0 left-0 w-1/3 rounded-full bg-[#8DB355]" />
      </span>
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
}

export default function UploadSubmit({
  idleLabel,
  pendingLabel = "Uploading…",
  icon,
  className = "",
}: {
  idleLabel: string;
  pendingLabel?: string;
  icon?: ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {pending ? <Loader2 size={15} className="animate-spin" /> : icon}
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
