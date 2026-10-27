"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, PenLine, Send } from "lucide-react";
import StarRating from "./StarRating";
import {
  submitProjectReview,
  type ReviewFormState,
} from "@/app/portfolio/actions";

const NAME_STORAGE_KEY = "portfolio:reviewName";

const initialReviewState: ReviewFormState = { error: null, success: false };

export default function ReviewForm({
  projectId,
  categorySlug,
  slug,
}: {
  projectId: string;
  categorySlug: string;
  slug: string;
}) {
  const [state, formAction, pending] = useActionState(
    submitProjectReview,
    initialReviewState,
  );
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const handledStateRef = useRef<ReviewFormState | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(NAME_STORAGE_KEY);
    if (saved) setName(saved);
  }, []);

  useEffect(() => {
    if (!state.success || handledStateRef.current === state) return;
    handledStateRef.current = state;

    setComment("");
    setRating(0);
    setJustSubmitted(true);
    if (name.trim()) {
      window.localStorage.setItem(NAME_STORAGE_KEY, name.trim());
    }

    const timer = setTimeout(() => setJustSubmitted(false), 4000);
    return () => clearTimeout(timer);
  }, [state, name]);

  const hasComment = comment.trim().length > 0;
  const canSubmit = hasComment && rating > 0 && name.trim().length > 0;

  return (
    <div className="mt-10 rounded-2xl border border-white/10 bg-[#151311] p-6 md:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C89B6A]">
        Leave a note
      </p>
      <h3 className="mt-3 font-serif italic text-2xl text-[#F4EEE3]">
        Share your thoughts
      </h3>

      <form action={formAction} className="mt-7">
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="categorySlug" value={categorySlug} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="rating" value={rating} />

        <div className="flex items-center gap-3 border-b border-white/15 pb-3 transition-colors focus-within:border-[#C89B6A]">
          <PenLine size={16} className="shrink-0 text-[#C89B6A]" />
          <input
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            aria-label="Your name"
            maxLength={80}
            required
            className="w-full bg-transparent text-sm text-[#F4EEE3] outline-none placeholder:text-[#F4EEE3]/30"
          />
        </div>

        <div className="mt-6 flex items-start gap-3 border-b border-white/15 pb-3 transition-colors focus-within:border-[#C89B6A]">
          <PenLine size={16} className="mt-1 shrink-0 text-[#C89B6A]" />
          <textarea
            name="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Write a note about this project…"
            aria-label="Your note"
            rows={3}
            maxLength={2000}
            required
            className="w-full resize-none bg-transparent text-sm leading-7 text-[#F4EEE3] outline-none placeholder:text-[#F4EEE3]/30"
          />
        </div>

        {hasComment && (
          <div className="mt-6 flex flex-wrap items-center gap-3 animate-fade-in">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F4EEE3]/40">
              Your rating
            </span>
            <StarRating value={rating} onChange={setRating} size={20} />
          </div>
        )}

        {canSubmit && (
          <button
            type="submit"
            disabled={pending}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-6 py-2.5 text-sm font-semibold text-black transition-colors animate-fade-in hover:bg-[#9cc163] disabled:opacity-60"
          >
            {pending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
            {pending ? "Sending…" : "Submit review"}
          </button>
        )}

        {state.error && (
          <p className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {state.error}
          </p>
        )}

        {justSubmitted && (
          <p className="mt-5 text-sm text-[#8DB355] animate-fade-in">
            Thanks for your note — it was saved.
          </p>
        )}
      </form>
    </div>
  );
}
