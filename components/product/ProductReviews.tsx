"use client";

import {
  Star,
} from "lucide-react";

type Review = {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
};

type ProductReviewsProps = {
  reviews: Review[];
};

function formatReviewDate(
  dateString: string
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }
  ).format(new Date(dateString));
}

function Stars({
  rating,
}: {
  rating: number;
}) {
  return (
    <div
      className="flex items-center gap-1 text-amber-500"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from(
        { length: 5 },
        (_, index) => (
          <Star
            key={index}
            size={16}
            fill={
              index < rating
                ? "currentColor"
                : "none"
            }
          />
        )
      )}
    </div>
  );
}

export default function ProductReviews({
  reviews,
}: ProductReviewsProps) {
  if (reviews.length === 0) {
    return (
      <section className="mt-16 border-t border-black/5 pt-12">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Customer Feedback
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight">
            No reviews yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Be the first customer to share your experience.
          </p>
        </div>
      </section>
    );
  }

  const totalRating =
    reviews.reduce(
      (sum, review) =>
        sum + review.rating,
      0
    );

  const averageRating =
    totalRating / reviews.length;

  const roundedAverage =
    Math.round(
      averageRating * 10
    ) / 10;

  return (
    <section className="mt-16 border-t border-black/5 pt-12">

      {/* Header */}

      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          Customer Feedback
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight">
          Customer Reviews
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Real feedback from customers who purchased this product.
        </p>
      </div>

      {/* Rating summary */}

      <div className="mb-8 rounded-3xl border border-white/80 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-8">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

          <div>
            <p className="text-5xl font-black tracking-tight">
              {roundedAverage}
            </p>

            <div className="mt-2">
              <Stars
                rating={Math.round(
                  averageRating
                )}
              />
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Based on{" "}
              <span className="font-semibold text-gray-800">
                {reviews.length}
              </span>{" "}
              {reviews.length === 1
                ? "review"
                : "reviews"}
            </p>
          </div>

        </div>
      </div>

      {/* Reviews */}

      <div className="space-y-4">

        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_15px_50px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-7"
          >

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <div className="flex flex-wrap items-center gap-3">

                  <h3 className="font-bold text-gray-900">
                    {review.customer_name}
                  </h3>

                  <Stars
                    rating={review.rating}
                  />

                </div>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  {review.review_text}
                </p>
              </div>

              <time
                dateTime={
                  review.created_at
                }
                className="shrink-0 text-xs text-gray-400"
              >
                {formatReviewDate(
                  review.created_at
                )}
              </time>

            </div>

          </article>
        ))}

      </div>

    </section>
  );
}