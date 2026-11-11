"use client";

import { useState, type ReactNode } from "react";
import { Pencil } from "lucide-react";

export default function VideoEditToggle({
  editForm,
  deleteForm,
}: {
  editForm: ReactNode;
  deleteForm: ReactNode;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="border-t border-cream/10">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setEditing((value) => !value)}
          className="inline-flex items-center gap-2 rounded-full border border-cream/10 px-4 py-1.5 text-xs text-cream/60 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
        >
          <Pencil size={13} />
          {editing ? "Close" : "Edit"}
        </button>
        {deleteForm}
      </div>

      {editing && <div className="border-t border-cream/10 p-4">{editForm}</div>}
    </div>
  );
}
