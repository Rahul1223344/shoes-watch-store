import { Star } from "lucide-react";
import type { Review } from "@/types/review";

interface ReviewsProps {
  reviews: Review[];
}

function getAverageRating(reviews: Review[]) {
  if (reviews.length === 0) return 0;

  const total = reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  return total / reviews.length;
}

function getRatingCount(
  reviews: Review[],
  rating: number
) {
  return reviews.filter(
    (review) => review.rating === rating
  ).length;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function Reviews({
  reviews,
}: ReviewsProps) {
  const average = getAverageRating(reviews);

  return (
    <section className="mt-8 rounded-[28px] border border-white/80 bg-white/65 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-8">

      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          Customer Feedback
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
          Customer Reviews
        </h2>
      </div>

      {/* Rating Summary */}
      <div className="mt-7 grid gap-6 md:grid-cols-[180px_1fr]">

        {/* Average */}
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white/70 p-6 text-center">

          <span className="text-4xl font-black">
            {average.toFixed(1)}
          </span>

          <div className="mt-2 flex gap-0.5">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <Star
                  key={index}
                  size={15}
                  className={
                    index < Math.round(average)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              )
            )}
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Based on {reviews.length}{" "}
            {reviews.length === 1
              ? "review"
              : "reviews"}
          </p>

        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">

          {[5, 4, 3, 2, 1].map((rating) => {
            const count = getRatingCount(
              reviews,
              rating
            );

            const percentage =
              reviews.length > 0
                ? (count / reviews.length) * 100
                : 0;

            return (
              <div
                key={rating}
                className="flex items-center gap-3"
              >
                <span className="w-8 text-xs font-semibold">
                  {rating} ★
                </span>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <span className="w-6 text-right text-xs text-gray-400">
                  {count}
                </span>
              </div>
            );
          })}

        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-8 space-y-3">

        {reviews.length === 0 ? (
          <div className="rounded-2xl bg-white/60 p-8 text-center">
            <p className="text-sm text-gray-500">
              No reviews yet.
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-black/5 bg-white/60 p-5"
            >

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h3 className="text-sm font-bold">
                    {review.customerName}
                  </h3>

                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: 5 }).map(
                      (_, index) => (
                        <Star
                          key={index}
                          size={13}
                          className={
                            index < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      )
                    )}
                  </div>

                </div>

                <span className="shrink-0 text-xs text-gray-400">
                  {formatDate(review.createdAt)}
                </span>

              </div>

              <p className="mt-4 text-sm leading-6 text-gray-600">
                {review.reviewText}
              </p>

            </article>
          ))
        )}

      </div>

    </section>
  );
}