"use client";

import {
  useRef,
  useState,
} from "react";

import {
  Star,
  Trash2,
  Pencil,
  Plus,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  name: string;
};

type Review = {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  is_approved: boolean;
  created_at: string;
  products: Product | null;
};

type ReviewManagerProps = {
  initialReviews: Review[];
  products: Product[];
};

function formatReviewDate(
  dateString: string
) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }
  ).format(date);
}

export default function ReviewManager({
  initialReviews,
  products,
}: ReviewManagerProps) {
  const [reviews, setReviews] =
    useState<Review[]>(
      initialReviews
    );

  const [showForm, setShowForm] =
    useState(false);

  const [editingReview, setEditingReview] =
    useState<Review | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [productId, setProductId] =
    useState("");

  const [customerName, setCustomerName] =
    useState("");

  const [rating, setRating] =
    useState(5);

  const [reviewText, setReviewText] =
    useState("");

  // --------------------------------
  // Reset form
  // --------------------------------
  const formRef =
  useRef<HTMLDivElement>(null);

  function resetForm() {
    setProductId("");
    setCustomerName("");
    setRating(5);
    setReviewText("");
    setEditingReview(null);
    setShowForm(false);
    setError("");
  }

  // --------------------------------
  // Open Add form
  // --------------------------------

  function openAddForm() {
    setProductId(
      products.length > 0
        ? products[0].id
        : ""
    );

    setCustomerName("");
    setRating(5);
    setReviewText("");
    setEditingReview(null);
    setError("");
    setShowForm(true);
  }

  // --------------------------------
  // Open Edit form
  // --------------------------------

  function openEditForm(
  review: Review
) {
  setEditingReview(review);

  setProductId(
    review.product_id
  );

  setCustomerName(
    review.customer_name
  );

  setRating(review.rating);

  setReviewText(
    review.review_text
  );

  setError("");
  setShowForm(true);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}

  // --------------------------------
  // Save review
  // --------------------------------

  async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const supabase =
        createClient();

      const cleanCustomerName =
        customerName.trim();

      const cleanReviewText =
        reviewText.trim();

      if (!productId) {
        setError(
          "Please select a product."
        );
        return;
      }

      if (!cleanCustomerName) {
        setError(
          "Customer name is required."
        );
        return;
      }

      if (!cleanReviewText) {
        setError(
          "Review text is required."
        );
        return;
      }

      if (
        rating < 1 ||
        rating > 5
      ) {
        setError(
          "Rating must be between 1 and 5."
        );
        return;
      }

      // --------------------------------
      // EDIT REVIEW
      // --------------------------------

     if (editingReview) {
  const { error: updateError } =
    await supabase.rpc(
      "admin_edit_review",
      {
        p_review_id:
          editingReview.id,

        p_product_id:
          productId,

        p_customer_name:
          cleanCustomerName,

        p_rating:
          rating,

        p_review_text:
          cleanReviewText,
      }
    );

  if (updateError) {
    throw updateError;
  }

  const updatedReview: Review = {
    ...editingReview,

    product_id: productId,

    customer_name:
      cleanCustomerName,

    rating,

    review_text:
      cleanReviewText,

    products:
      products.find(
        (product) =>
          product.id === productId
      ) ?? null,
  };

  setReviews((current) =>
    current.map((review) =>
      review.id === editingReview.id
        ? updatedReview
        : review
    )
  );

  resetForm();
  return;
}

      // --------------------------------
      // CREATE REVIEW
      // --------------------------------

      else {
        const {
          data,
          error: insertError,
        } = await supabase
          .from("product_reviews")
          .insert({
            product_id: productId,
            customer_name:
              cleanCustomerName,
            rating,
            review_text:
              cleanReviewText,
            is_approved: true,
          })
          .select(`
            id,
            product_id,
            customer_name,
            rating,
            review_text,
            is_approved,
            created_at
          `)
          .single();

        if (insertError) {
          throw insertError;
        }

        if (!data) {
          throw new Error(
            "Created review was not returned."
          );
        }

        const newReview: Review = {
          id: data.id,
          product_id:
            data.product_id,
          customer_name:
            data.customer_name,
          rating: data.rating,
          review_text:
            data.review_text,
          is_approved:
            data.is_approved,
          created_at:
            data.created_at,

          products:
            products.find(
              (product) =>
                product.id ===
                data.product_id
            ) ?? null,
        };

        setReviews(
          (current) => [
            newReview,
            ...current,
          ]
        );
      }

      resetForm();
    } catch (error) {
      console.error(
        "Review save error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save review."
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------
  // Toggle approval
  // --------------------------------

 async function toggleApproval(
  review: Review
) {
  setError("");

  const supabase = createClient();

  const newStatus =
    !review.is_approved;

  const { error } =
    await supabase.rpc(
      "admin_update_review",
      {
        p_review_id: review.id,
        p_is_approved: newStatus,
      }
    );

  if (error) {
    console.error(
      "Review approval error:",
      error
    );

    setError(
      "Unable to update review status."
    );

    return;
  }

  setReviews((current) =>
    current.map((item) =>
      item.id === review.id
        ? {
            ...item,
            is_approved: newStatus,
          }
        : item
    )
  );
}

  // --------------------------------
  // Delete review
  // --------------------------------

  async function deleteReview(
    reviewId: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this review?"
      );

    if (!confirmed) {
      return;
    }

    setError("");

    const supabase =
      createClient();

    const { error } =
      await supabase
        .from("product_reviews")
        .delete()
        .eq(
          "id",
          reviewId
        );

    if (error) {
      console.error(
        "Review deletion error:",
        error
      );

      setError(
        "Unable to delete review."
      );

      return;
    }

    setReviews(
      (current) =>
        current.filter(
          (review) =>
            review.id !==
            reviewId
        )
    );

    if (
      editingReview?.id ===
      reviewId
    ) {
      resetForm();
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {reviews.length}{" "}
            {reviews.length === 1
              ? "review"
              : "reviews"}
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
        >
          <Plus size={17} />

          Add Review
        </button>

      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form */}

      {showForm && (
  <div
    ref={formRef}
    className="scroll-mt-24 rounded-3xl border border-black/5 bg-white/80 p-5 shadow-sm backdrop-blur-xl sm:p-7"
  >

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-black">
                {editingReview
                  ? "Edit Review"
                  : "Add Customer Review"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add feedback received from a customer.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-gray-200 disabled:opacity-50"
              aria-label="Close"
            >
              <X size={17} />
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Product */}

            <div>
              <label
                htmlFor="review-product"
                className="mb-2 block text-sm font-semibold"
              >
                Product
              </label>

              <select
                id="review-product"
                value={productId}
                onChange={(event) =>
                  setProductId(
                    event.target.value
                  )
                }
                required
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
              >
                <option value="">
                  Select product
                </option>

                {products.map(
                  (product) => (
                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Customer Name */}

            <div>
              <label
                htmlFor="customer-name"
                className="mb-2 block text-sm font-semibold"
              >
                Customer Name
              </label>

              <input
                id="customer-name"
                type="text"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(
                    event.target.value
                  )
                }
                placeholder="e.g. Rahul"
                maxLength={80}
                required
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
              />
            </div>

            {/* Rating */}

            <div>
              <label
                htmlFor="review-rating"
                className="mb-2 block text-sm font-semibold"
              >
                Rating
              </label>

              <select
                id="review-rating"
                value={rating}
                onChange={(event) =>
                  setRating(
                    Number(
                      event.target.value
                    )
                  )
                }
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
              >
                <option value={5}>
                  5 — Excellent
                </option>

                <option value={4}>
                  4 — Very Good
                </option>

                <option value={3}>
                  3 — Good
                </option>

                <option value={2}>
                  2 — Average
                </option>

                <option value={1}>
                  1 — Poor
                </option>
              </select>
            </div>

            {/* Review */}

            <div>
              <label
                htmlFor="review-text"
                className="mb-2 block text-sm font-semibold"
              >
                Review
              </label>

              <textarea
                id="review-text"
                value={reviewText}
                onChange={(event) =>
                  setReviewText(
                    event.target.value
                  )
                }
                rows={5}
                maxLength={1000}
                placeholder="Customer feedback..."
                required
                className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {reviewText.length}/1000
              </p>
            </div>

            {/* Buttons */}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-bold hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingReview
                    ? "Update Review"
                    : "Add Review"}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* Reviews */}

      {reviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/10 bg-white/60 p-12 text-center">

          <p className="text-sm font-semibold">
            No reviews yet
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Add the first customer review.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {reviews.map(
            (review) => (
              <div
                key={review.id}
                className="rounded-3xl border border-black/5 bg-white/75 p-5 shadow-sm backdrop-blur-xl"
              >

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div className="min-w-0">

                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                      {review.products?.name ??
                        "Unknown product"}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">

                      <h3 className="font-bold">
                        {review.customer_name}
                      </h3>

                      <div
                        className="flex items-center gap-0.5 text-amber-500"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {Array.from(
                          {
                            length: 5,
                          },
                          (_, index) => (
                            <Star
                              key={index}
                              size={14}
                              fill={
                                index <
                                review.rating
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          )
                        )}
                      </div>

                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {review.review_text}
                    </p>

                   <p className="mt-3 text-xs text-gray-400">
  {formatReviewDate(
    review.created_at
  )}
</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        toggleApproval(
                          review
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-bold ${
                        review.is_approved
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {review.is_approved
                        ? "Approved"
                        : "Hidden"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(
                          review
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                      aria-label="Edit review"
                    >
                      <Pencil
                        size={14}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteReview(
                          review.id
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                      aria-label="Delete review"
                    >
                      <Trash2
                        size={14}
                      />
                    </button>

                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}