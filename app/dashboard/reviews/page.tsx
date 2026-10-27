import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Heart, MessageSquare, Star } from "lucide-react";
import { getAllProjects } from "@/lib/projects";
import {
  getAllReviewsWithProjects,
  getLikeSummaries,
  REVIEWS_MIGRATION,
} from "@/lib/reviews";
import ReviewItem from "@/components/dashboard/ReviewItem";

const fieldClass =
  "w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2.5 text-sm text-cream outline-none transition-colors focus:border-[#8DB355]";

export default async function ReviewsManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const { project: projectFilter } = await searchParams;

  const [projects, reviews, likeSummaries] = await Promise.all([
    getAllProjects(),
    getAllReviewsWithProjects(),
    getLikeSummaries(),
  ]);

  const filteredReviews = projectFilter
    ? reviews.filter((review) => review.projectId === projectFilter)
    : reviews;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
  const totalLikes = likeSummaries.reduce(
    (sum, summary) => sum + summary.totalLikes,
    0,
  );
  // Only the most recently liked projects are shown here.
  const recentLikeSummaries = likeSummaries.slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-cream">
            Reviews &amp; Likes
          </h1>
          <p className="mt-1.5 text-sm text-cream/45">
            Visitor notes and per-image like counts. Like counts are only
            visible here and to a signed-in admin on the project page.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<MessageSquare size={16} />}
          label="Reviews"
          value={String(reviews.length)}
        />
        <StatCard
          icon={<Star size={16} />}
          label="Average rating"
          value={reviews.length ? averageRating.toFixed(1) : "—"}
        />
        <StatCard
          icon={<Heart size={16} />}
          label="Total likes"
          value={String(totalLikes)}
        />
      </div>

      <section className="mt-10">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45">
          Recent likes by project
        </h2>

        {recentLikeSummaries.length === 0 ? (
          <div className="mt-4 rounded-xl border border-cream/10 bg-card px-5 py-6 text-sm text-cream/50">
            <p>No likes yet.</p>
            <p className="mt-3">
              If likes fail to save, run the SQL in{" "}
              <code className="text-[#8DB355]">{REVIEWS_MIGRATION}</code> in
              your Supabase project first.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {recentLikeSummaries.map((summary) => (
              <div
                key={summary.projectId}
                className="rounded-xl border border-cream/10 bg-card p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-cream">
                      {summary.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-cream/35">
                      {summary.categorySlug}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#8DB355]/15 px-2.5 py-1 text-xs font-medium text-[#8DB355]">
                    <Heart size={12} fill="currentColor" />
                    {summary.totalLikes}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {summary.images.map((image) => (
                    <div
                      key={image.imageId}
                      className="relative h-16 w-16 overflow-hidden rounded-lg border border-cream/10 bg-black/30"
                    >
                      <Image
                        src={image.imageUrl}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                      <span className="absolute bottom-0 right-0 rounded-tl-md bg-black/75 px-1.5 py-0.5 font-mono text-[10px] text-cream">
                        {image.likeCount}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/portfolio/${summary.categorySlug}/${summary.slug}`}
                  className="mt-4 inline-block text-xs text-cream/45 transition-colors hover:text-[#8DB355]"
                >
                  View project page →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45">
            Reviews
          </h2>

          <form className="flex items-center gap-2">
            <select
              name="project"
              defaultValue={projectFilter ?? ""}
              className={`${fieldClass} w-auto`}
            >
              <option value="">All projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-full border border-cream/10 px-4 py-2 text-sm text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
            >
              Filter
            </button>
            {projectFilter && (
              <Link
                href="/dashboard/reviews"
                className="text-xs text-cream/40 transition-colors hover:text-cream"
              >
                Clear
              </Link>
            )}
          </form>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="mt-4 rounded-xl border border-cream/10 bg-card px-5 py-6 text-sm text-cream/50">
            <p>No reviews yet.</p>
            <p className="mt-3">
              If the review form on a project page fails, run the SQL in{" "}
              <code className="text-[#8DB355]">{REVIEWS_MIGRATION}</code> in
              your Supabase project first.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4">
            {filteredReviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-cream/10 bg-card p-5">
      <div className="flex items-center gap-2 text-cream/45">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>
      <p className="mt-3 font-serif text-3xl text-cream">{value}</p>
    </div>
  );
}
