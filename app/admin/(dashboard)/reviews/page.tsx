import { createClient } from "@/lib/supabase/server";
import ReviewManager from "@/components/admin/ReviewManager";

type Product = {
  id: string;
  name: string;
};

type DatabaseReview = {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  is_approved: boolean;
  created_at: string;
};

type Review = DatabaseReview & {
  products: Product | null;
};

export default async function ReviewsPage() {
  const supabase = await createClient();

  // -------------------------------------------------------
  // Load reviews
  // -------------------------------------------------------

  const {
    data: reviewData,
    error: reviewsError,
  } = await supabase
    .from("product_reviews")
    .select(`
      id,
      product_id,
      customer_name,
      rating,
      review_text,
      is_approved,
      created_at
    `)
    .order("created_at", {
      ascending: false,
    });

  if (reviewsError) {
    console.error(
      "Reviews loading error:",
      reviewsError
    );

    throw new Error(
      "Unable to load reviews."
    );
  }

  // -------------------------------------------------------
  // Load products
  // -------------------------------------------------------

  const {
    data: productData,
    error: productsError,
  } = await supabase
    .from("products")
    .select("id, name")
    .order("name", {
      ascending: true,
    });

  if (productsError) {
    console.error(
      "Products loading error:",
      productsError
    );

    throw new Error(
      "Unable to load products."
    );
  }

  const products: Product[] =
    productData ?? [];

  // -------------------------------------------------------
  // Attach product information to reviews
  // -------------------------------------------------------

  const reviews: Review[] = (
    reviewData ?? []
  ).map((review) => ({
    ...review,

    products:
      products.find(
        (product) =>
          product.id ===
          review.product_id
      ) ?? null,
  }));

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Header */}

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          Customer Feedback
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Reviews
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage customer reviews for your products.
        </p>
      </div>

      {/* Review Manager */}

      <ReviewManager
        initialReviews={reviews}
        products={products}
      />

    </div>
  );
}