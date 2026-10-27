import StarRating from "./StarRating";
import type { ProjectReview } from "@/lib/reviews";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ReviewList({ reviews }: { reviews: ProjectReview[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-[#F4EEE3]/40">
        No notes yet — be the first to leave one.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="rounded-2xl border border-white/10 bg-[#151311] p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C89B6A]/40 bg-[#C89B6A]/10 font-serif text-sm text-[#C89B6A]">
                {review.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-sm text-[#F4EEE3]">{review.name}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#F4EEE3]/35">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>
            <StarRating value={review.rating} size={13} />
          </div>

          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#F4EEE3]/70">
            {review.comment}
          </p>
        </article>
      ))}
    </div>
  );
}
