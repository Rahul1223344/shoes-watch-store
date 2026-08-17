import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetails from "@/components/product/ProductDetails";

import { createProductStructuredData } from "@/lib/structured-data";

import { createClient } from "@/lib/supabase/server";

import {
  getProductImageUrl,
} from "@/lib/supabase/productImageUrl";

import {
  mapDatabaseProduct,
} from "@/lib/supabase/products";

import {
  getRelatedProducts,
} from "@/lib/supabase/productQueries";

import type { Review } from "@/types/review";

import Footer from "@/components/layout/Footer";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/* =========================================================
   DATABASE TYPES
========================================================= */

type DatabaseProduct = {
  id: string;
  category_id: string;

  name: string;
  slug: string;

  brand: string | null;

  description: string;

  price: number | string;

  compare_at_price:
    | number
    | string
    | null;

  is_featured: boolean;
  is_new: boolean;
  is_active: boolean;

  seo_title: string | null;
  seo_description: string | null;

  created_at: string;
};

type DatabaseCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
};

type DatabaseOption = {
  id: string;
  product_id: string;
  name: string;
  values: string[];
  created_at: string;
};

type DatabaseImage = {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
};

/* =========================================================
   GET PRODUCT
========================================================= */

async function getProductBySlug(
  slug: string
) {
  const supabase =
    await createClient();

  /* -------------------------------------------------------
     PRODUCT
  ------------------------------------------------------- */

  const {
    data: product,
    error: productError,
  } = await supabase
    .from("products")
    .select(`
      id,
      category_id,
      name,
      slug,
      brand,
      description,
      price,
      compare_at_price,
      is_featured,
      is_new,
      is_active,
      seo_title,
      seo_description,
      created_at
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (productError) {
    console.error(
      "Product query error:",
      productError
    );

    return null;
  }

  if (!product) {
    return null;
  }

  /* -------------------------------------------------------
     CATEGORY
  ------------------------------------------------------- */

  const {
    data: category,
    error: categoryError,
  } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      description,
      is_active
    `)
    .eq(
      "id",
      product.category_id
    )
    .maybeSingle();

  if (categoryError) {
    console.error(
      "Category query error:",
      categoryError
    );
  }

  /* -------------------------------------------------------
     PRODUCT OPTIONS
  ------------------------------------------------------- */

  const {
    data: options,
    error: optionsError,
  } = await supabase
    .from("product_options")
    .select(`
      id,
      product_id,
      name,
      values,
      created_at
    `)
    .eq(
      "product_id",
      product.id
    )
    .order("created_at", {
      ascending: true,
    });

  if (optionsError) {
    console.error(
      "Product options query error:",
      optionsError
    );
  }

  /* -------------------------------------------------------
     PRODUCT IMAGES
  ------------------------------------------------------- */

  const {
    data: images,
    error: imagesError,
  } = await supabase
    .from("product_images")
    .select(`
      id,
      product_id,
      storage_path,
      alt_text,
      sort_order,
      created_at
    `)
    .eq(
      "product_id",
      product.id
    )
    .order("sort_order", {
      ascending: true,
    });

  if (imagesError) {
    console.error(
      "Product images query error:",
      imagesError
    );
  }

  /* -------------------------------------------------------
     APPROVED REVIEWS
  ------------------------------------------------------- */

  const {
    data: databaseReviews,
    error: reviewsError,
  } = await supabase
    .from("product_reviews")
    .select(`
      id,
      product_id,
      customer_name,
      rating,
      review_text,
      created_at
    `)
    .eq(
      "product_id",
      product.id
    )
    .eq(
      "is_approved",
      true
    )
    .order("created_at", {
      ascending: false,
    });

  if (reviewsError) {
    console.error(
      "Product reviews query error:",
      reviewsError
    );
  }

  /* -------------------------------------------------------
     MAP REVIEWS
  ------------------------------------------------------- */

  const reviews: Review[] =
    (databaseReviews ?? []).map(
      (review) => ({
        id: review.id,

        productId:
          review.product_id,

        customerName:
          review.customer_name,

        rating:
          review.rating,

        reviewText:
          review.review_text,

        verifiedPurchase: false,

        createdAt:
          review.created_at,
      })
    );

  /* -------------------------------------------------------
     CALCULATE RATING
  ------------------------------------------------------- */

  /* -------------------------------------------------------
   REVIEW STATISTICS
------------------------------------------------------- */

const {
  data: reviewStats,
  error: reviewStatsError,
} = await supabase
  .from("product_review_stats")
  .select(`
    average_rating,
    review_count
  `)
  .eq(
    "product_id",
    product.id
  )
  .maybeSingle();

if (reviewStatsError) {
  console.error(
    "Product review stats query error:",
    reviewStatsError
  );
}

const averageRating =
  Number(
    reviewStats?.average_rating ?? 0
  );

const reviewCount =
  Number(
    reviewStats?.review_count ?? 0
  );

  /* -------------------------------------------------------
     MAP PRODUCT
  ------------------------------------------------------- */

  const mappedProduct =
    mapDatabaseProduct(
      {
        ...(product as DatabaseProduct),

        categories:
          (category as DatabaseCategory | null) ??
          null,

        product_options:
          (options as DatabaseOption[]) ??
          [],

        product_images:
          (images as DatabaseImage[]) ??
          [],
      },

      (storagePath) =>
        getProductImageUrl(
          process.env
            .NEXT_PUBLIC_SUPABASE_URL!,
          storagePath
        )
    );

  /* -------------------------------------------------------
     ADD REAL REVIEW DATA
  ------------------------------------------------------- */

 mappedProduct.rating =
  averageRating;

mappedProduct.reviewCount =
  reviewCount;

  /* -------------------------------------------------------
     RELATED PRODUCTS
  ------------------------------------------------------- */

  const relatedProducts =
    await getRelatedProducts(
      mappedProduct.id,
      mappedProduct.category
    );

  return {
    product: mappedProduct,
    reviews,
    relatedProducts,

    seoTitle: product.seo_title,
  seoDescription: product.seo_description,
  };
}

/* =========================================================
   SEO METADATA
========================================================= */

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const result =
    await getProductBySlug(slug);

  if (!result) {
    return {
      title: "Product Not Found",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const {
    product,
    seoTitle,
    seoDescription,
  } = result;

  const title =
    seoTitle?.trim() ||
    `${product.name} | Premium Shoes & Watches`;

  const description =
    seoDescription?.trim() ||
    product.description;

  return {
    title,

    description,

    alternates: {
      canonical:
        `/product/${product.slug}`,
    },

    openGraph: {
      title,

      description,

      type: "website",

      url:
        `/product/${product.slug}`,

      images:
        product.images.length > 0
          ? [
              {
                url: product.images[0],
                alt: product.name,
              },
            ]
          : [],
    },

    twitter: {
      card: "summary_large_image",

      title,

      description,

      images:
        product.images.length > 0
          ? [product.images[0]]
          : [],
    },
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const result =
    await getProductBySlug(slug);

  if (!result) {
    notFound();
  }

  const {
    product,
    reviews,
    relatedProducts,
  } = result;

  /* -------------------------------------------------------
     PRODUCT STRUCTURED DATA
  ------------------------------------------------------- */

  const structuredData =
    createProductStructuredData(
      product
    );

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              structuredData
            ),
        }}
      />

      <ProductDetails
        product={product}
        reviews={reviews}
        relatedProducts={
          relatedProducts
        }
      />
      <Footer />
    </main>
  );
}