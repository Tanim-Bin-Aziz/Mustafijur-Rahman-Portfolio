"use client";

import { useState } from "react";
import { Reorder, motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import type { ShowcaseVideoCard } from "@/lib/showcase";
import { reorderShowcaseVideoCards } from "@/app/dashboard/videos/actions";

export default function ShowcaseReorder({
  cards,
}: {
  cards: ShowcaseVideoCard[];
}) {
  const [items, setItems] = useState(cards);
  const changed =
    items.map((c) => c.id).join("|") !== cards.map((c) => c.id).join("|");

  return (
    <form action={reorderShowcaseVideoCards} className="mt-6">
      {items.map((c) => (
        <input key={c.id} type="hidden" name="ids" value={c.id} />
      ))}

      <div className="rounded-xl border border-cream/10 bg-card p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45">
          Reorder showcase videos (drag to change order, then Save order)
        </p>
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className="mt-3 space-y-2"
        >
          {items.map((card) => (
            <Reorder.Item
              key={card.id}
              value={card}
              className="flex cursor-grab items-center gap-3 rounded-lg border border-cream/10 bg-bg/40 px-3 py-2 active:cursor-grabbing"
            >
              <GripVertical size={14} className="text-cream/40" />
              <span className="flex-1 truncate text-sm text-cream">
                {card.label || "Untitled"}
              </span>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {changed && (
          <button
            type="submit"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-5 py-2 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163]"
          >
            Save order
          </button>
        )}
      </div>
    </form>
  );
}
