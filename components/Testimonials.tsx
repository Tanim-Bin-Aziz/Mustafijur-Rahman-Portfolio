"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PenLine, Send, X } from "lucide-react";
import StarRating from "@/components/project/StarRating";
import {
  submitHomeReview,
  type ReviewFormState,
} from "@/app/portfolio/actions";
import type { SiteReview } from "@/lib/reviews";

const MASK_IMAGE =
  "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)";

const initialReviewState: ReviewFormState = { error: null, success: false };

function ReviewCard({ review }: { review: SiteReview }) {
  return (
    <article className="flex w-[270px] shrink-0 flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:w-[330px]">
      <div className="flex items-start justify-between gap-3">
        <p className="truncate font-semibold text-[#f7f6f4]">{review.name}</p>
        <StarRating value={review.rating} size={13} className="shrink-0" />
      </div>

      {review.comment && (
        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-[#f7f6f4]/60">
          {review.comment}
        </p>
      )}
    </article>
  );
}

export default function Testimonials({ reviews }: { reviews: SiteReview[] }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    rating?: string;
  }>({});
  const [thankYou, setThankYou] = useState(false);
  const [state, formAction, pending] = useActionState(
    submitHomeReview,
    initialReviewState,
  );
  const handledStateRef = useRef<ReviewFormState | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!state.success || handledStateRef.current === state) return;
    handledStateRef.current = state;

    setName("");
    setRating(0);
    setComment("");
    setFieldErrors({});
    setOpen(false);
    setThankYou(true);
    router.refresh();

    const timer = setTimeout(() => setThankYou(false), 6000);
    return () => clearTimeout(timer);
  }, [state, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const next: { name?: string; rating?: string } = {};
    if (!name.trim()) next.name = "Your name is required.";
    if (rating < 1) next.rating = "Pick a star rating (1-5).";
    setFieldErrors(next);

    if (Object.keys(next).length > 0) event.preventDefault();
  };

  const closeForm = () => {
    setOpen(false);
    setFieldErrors({});
  };

  const copies = Math.max(1, Math.ceil(6 / Math.max(reviews.length, 1)));
  const base = Array.from({ length: copies }, () => reviews).flat();

  return (
    <section className="w-full overflow-hidden bg-[#09090a] px-6 py-20">
      <div className="mx-auto mb-14 max-w-5xl text-center">
        <h2 className="font-black text-4xl tracking-tight text-[#f7f6f4] md:text-6xl">
          Reviews
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[#f7f6f4]/60 md:text-lg">
          What clients say after working together.
        </p>
      </div>

      {reviews.length === 0 ? (
        <p className="text-center text-sm text-[#f7f6f4]/45">
          No reviews yet — be the first to write one.
        </p>
      ) : (
        <div
          className="relative w-full overflow-hidden"
          style={{ maskImage: MASK_IMAGE, WebkitMaskImage: MASK_IMAGE }}
        >
          <div
            className="marquee-track flex w-max"
            style={{ animationDuration: `${Math.max(30, base.length * 10)}s` }}
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex gap-5 pr-5"
                aria-hidden={copy === 1}
              >
                {base.map((review, index) => (
                  <ReviewCard
                    key={`${copy}-${index}-${review.id}`}
                    review={review}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 flex flex-col items-center">
        <button
          type="button"
          onClick={() => (open ? closeForm() : setOpen(true))}
          aria-expanded={open}
          className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#9cc163]"
        >
          {open ? <X size={16} /> : <PenLine size={16} />}
          {open ? "Close" : "Write a Review"}
        </button>

        {thankYou && (
          <p className="mt-4 text-sm text-[#8DB355] animate-fade-in">
            Thanks for your review — it is live now.
          </p>
        )}

        {open && (
          <div className="mt-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left animate-panel-in sm:p-6">
            <h3 className="font-serif text-lg text-[#f7f6f4]">
              Write a review
            </h3>
            <p className="mt-0.5 text-[11px] text-[#f7f6f4]/45">
              Name and rating are required. The comment is optional.
            </p>

            <form action={formAction} onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="home-review-name"
                  className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#f7f6f4]/45"
                >
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="home-review-name"
                  name="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (fieldErrors.name) {
                      setFieldErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  placeholder="Your name"
                  maxLength={80}
                  aria-required="true"
                  aria-invalid={Boolean(fieldErrors.name)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-[#f7f6f4] outline-none transition-colors placeholder:text-[#f7f6f4]/30 focus:border-[#8DB355]"
                />
                {fieldErrors.name && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#f7f6f4]/45">
                  Rating <span className="text-red-400">*</span>
                </span>
                <div className="flex h-[42px] items-center">
                  <StarRating
                    value={rating}
                    onChange={(value) => {
                      setRating(value);
                      if (fieldErrors.rating) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          rating: undefined,
                        }));
                      }
                    }}
                    size={22}
                  />
                </div>
                <input type="hidden" name="rating" value={rating} />
                {fieldErrors.rating && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {fieldErrors.rating}
                  </p>
                )}
              </div>
              </div>

              <div>
                <label
                  htmlFor="home-review-comment"
                  className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#f7f6f4]/45"
                >
                  Comment{" "}
                  <span className="normal-case tracking-normal text-[#f7f6f4]/35">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="home-review-comment"
                  name="comment"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Share your experience…"
                  rows={2}
                  maxLength={2000}
                  className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm leading-6 text-[#f7f6f4] outline-none transition-colors placeholder:text-[#f7f6f4]/30 focus:border-[#8DB355]"
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#9cc163] disabled:opacity-60"
              >
                {pending ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                {pending ? "Sending…" : "Submit review"}
              </button>

              {state.error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {state.error}
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
