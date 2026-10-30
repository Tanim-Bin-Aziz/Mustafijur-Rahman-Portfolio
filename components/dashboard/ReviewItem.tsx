"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Pencil, Trash2, X } from "lucide-react";
import StarRating from "@/components/project/StarRating";
import ConfirmSubmit from "@/components/dashboard/ConfirmSubmit";
import {
  deleteReview,
  updateReview,
  type AdminReviewState,
} from "@/app/dashboard/reviews/actions";
import type { ReviewWithProject } from "@/lib/reviews";

const fieldClass =
  "w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-[#8DB355]";
const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45";

const initialState: AdminReviewState = { error: null, saved: false };

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ReviewItem({
  review,
}: {
  review: ReviewWithProject;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateReview,
    initialState,
  );
  const [name, setName] = useState(review.name);
  const [comment, setComment] = useState(review.comment);
  const [rating, setRating] = useState(review.rating);
  const handledStateRef = useRef<AdminReviewState | null>(null);

  useEffect(() => {
    if (!state.saved || handledStateRef.current === state) return;
    handledStateRef.current = state;
    setEditing(false);
  }, [state]);

  useEffect(() => {
    if (editing) return;
    setName(review.name);
    setComment(review.comment);
    setRating(review.rating);
  }, [editing, review.name, review.comment, review.rating]);

  const cancelEdit = () => {
    setName(review.name);
    setComment(review.comment);
    setRating(review.rating);
    setEditing(false);
  };

  return (
    <article className="rounded-xl border border-cream/10 bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C89B6A]/40 bg-[#C89B6A]/10 font-serif text-sm text-[#C89B6A]">
            {review.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-sm text-cream">{review.name}</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-cream/35">
              {[review.categorySlug, review.projectTitle]
                .filter(Boolean)
                .join(" / ")}{" "}
              · {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StarRating value={review.rating} size={14} />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => (editing ? cancelEdit() : setEditing(true))}
              title={editing ? "Cancel edit" : "Edit review"}
              className="inline-flex items-center rounded-full bg-cream/5 p-1.5 text-cream/70 transition-colors hover:bg-[#8DB355] hover:text-bg"
            >
              {editing ? <X size={13} /> : <Pencil size={13} />}
            </button>
            <form action={deleteReview}>
              <input type="hidden" name="reviewId" value={review.id} />
              <input type="hidden" name="projectId" value={review.projectId} />
              <ConfirmSubmit
                message={`Delete the review by “${review.name}”? This cannot be undone.`}
                title="Delete review"
                className="inline-flex items-center rounded-full bg-black/40 p-1.5 text-cream/80 transition-colors hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={13} />
              </ConfirmSubmit>
            </form>
          </div>
        </div>
      </div>

      {editing ? (
        <form action={formAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="reviewId" value={review.id} />
          <input type="hidden" name="projectId" value={review.projectId} />

          <div>
            <label className={labelClass} htmlFor={`name-${review.id}`}>
              Name
            </label>
            <input
              id={`name-${review.id}`}
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              required
              className={fieldClass}
            />
          </div>

          <div>
            <span className={labelClass}>Rating</span>
            <div className="flex h-[42px] items-center">
              <StarRating value={rating} onChange={setRating} size={20} />
              <input type="hidden" name="rating" value={rating} />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass} htmlFor={`comment-${review.id}`}>
              Comment
            </label>
            <textarea
              id={`comment-${review.id}`}
              name="comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              maxLength={2000}
              required
              className={`${fieldClass} resize-none`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-[#9cc163] disabled:opacity-60"
            >
              {pending && <Loader2 size={15} className="animate-spin" />}
              {pending ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full border border-cream/10 px-5 py-2.5 text-sm text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
            >
              Cancel
            </button>
          </div>

          {state.error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 md:col-span-2">
              {state.error}
            </p>
          )}
        </form>
      ) : review.comment ? (
        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-cream/60">
          {review.comment}
        </p>
      ) : (
        <p className="mt-4 text-sm italic text-cream/30">
          No comment — rating only.
        </p>
      )}
    </article>
  );
}
