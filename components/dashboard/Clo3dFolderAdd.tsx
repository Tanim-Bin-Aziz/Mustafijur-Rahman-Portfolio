"use client";

import { useActionState } from "react";
import { FolderPlus, Loader2 } from "lucide-react";
import { addClo3dFolder, type Clo3dFormState } from "@/app/dashboard/videos/clo3d/actions";

export default function Clo3dFolderAdd() {
  const [state, formAction, isPending] = useActionState<
    Clo3dFormState,
    FormData
  >(addClo3dFolder, { error: null });

  return (
    <form action={formAction} className="mt-4 space-y-2">
      <div className="flex items-center gap-2">
        <input
          name="name"
          placeholder="New folder name"
          className="w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-[#8DB355]"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#8DB355] px-4 py-2 text-xs font-semibold text-bg transition-colors hover:bg-[#9cc163] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <FolderPlus size={13} />
          )}
          Add
        </button>
      </div>
      {state.error && <p className="text-xs text-red-300">{state.error}</p>}
    </form>
  );
}
