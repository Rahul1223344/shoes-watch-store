import { createClient } from "@/lib/supabase/server";

import type {
  Product,
  ProductCategory,
} from "@/types/product";

import {
  mapDatabaseProduct,
} from "./products";

import {
  getProductImageUrl,
} from "./productImageUrl";

/* =========================================================
   COMMON PRODUCT SELECT
========================================================= */

const PRODUCT_SELECT = `
  id,
  name,
  slug,
  brand,
  category_id,
  description,
  price,
  compare_at_price,
  is_new,
  is_featured,
  is_active,
  seo_title,
  seo_description,
  created_at,

  categories (
    id,
    name,
    slug,
    description,
    is_active
  ),

  product_options (
    id,
    product_id,
    name,
    values,
    created_at
  ),

  product_images (
    id,
    product_id,
    storage_path,
    alt_text,
    sort_order,
    created_at
  )
`;

/* =========================================================
   MAP DATABASE PRODUCTS
========================================================= */

function mapProducts(
  products: unknown[]
): Product[] {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL!;

  return products.map(
    (product) =>
      mapDatabaseProduct(
        product as any,
        (storagePath) =>
          getProductImageUrl(
            supabaseUrl,
            storagePath
          )
      )
  );
}

/* =========================================================
   ALL ACTIVE PRODUCTS
========================================================= */

export async function getProducts(): Promise<
  Product[]
> {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq(
      "is_active",
      true
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    console.error(
      "Failed to fetch products:",
      error
    );

    return [];
  }

  return mapProducts(
    data ?? []
  );
}

/* =========================================================
   HOMEPAGE PRODUCTS
   Lightweight query for product cards
========================================================= */
/* =========================================================
   HOMEPAGE PRODUCTS
   Optimized lightweight query
========================================================= */

/* =========================================================
   HOMEPAGE PRODUCTS
   Initial lightweight query
   8 shoes + 8 watches
========================================================= */

const HOME_PRODUCT_LIMIT = 8;

export interface HomeProductsResult {
  products: Product[];
  hasMore: {
    shoes: boolean;
    watches: boolean;
  };
}

/* =========================================================
   HOMEPAGE PRODUCTS
   Paginated lightweight query for homepage product cards
========================================================= */

export async function getHomeProducts(
  category: "shoes" | "watches",
  page = 0,
  limit = 8
): Promise<{
  products: Product[];
  hasMore: boolean;
}> {
  const supabase = await createClient();

  /* -------------------------------------------------------
     Find category
  ------------------------------------------------------- */

  const {
    data: categoryData,
    error: categoryError,
  } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", category)
    .eq("is_active", true)
    .maybeSingle();

  if (categoryError) {
    console.error(
      "Homepage category error:",
      categoryError
    );

    return {
      products: [],
      hasMore: false,
    };
  }

  if (!categoryData) {
    return {
      products: [],
      hasMore: false,
    };
  }

  /* -------------------------------------------------------
     Pagination
  ------------------------------------------------------- */

  const safePage = Math.max(0, page);
  const safeLimit = Math.min(
    8,
    Math.max(1, limit)
  );

  const from = safePage * safeLimit;
  const to = from + safeLimit;

  /*
   * Fetch one extra product.
   *
   * Example:
   * limit = 8
   * We fetch 9.
   *
   * If 9 products exist:
   * hasMore = true
   *
   * We return only 8.
   */

  const {
    data: products,
    error: productsError,
  } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      category_id,
      price,
      compare_at_price,
      is_new,
      is_featured,
      is_active,
      created_at
    `)
    .eq(
      "category_id",
      categoryData.id
    )
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    })
    .range(
      from,
      to
    );

  if (productsError) {
    console.error(
      "Failed to fetch homepage products:",
      productsError
    );

    return {
      products: [],
      hasMore: false,
    };
  }

  const fetchedProducts =
    products ?? [];

  const hasMore =
    fetchedProducts.length >
    safeLimit;

  const visibleProducts =
    fetchedProducts.slice(
      0,
      safeLimit
    );

  if (!visibleProducts.length) {
    return {
      products: [],
      hasMore: false,
    };
  }

  /* -------------------------------------------------------
     Product IDs
  ------------------------------------------------------- */

  const productIds =
    visibleProducts.map(
      (product) => product.id
    );

  /* -------------------------------------------------------
     Supporting data
  ------------------------------------------------------- */

  const [
    reviewStatsResult,
    imagesResult,
  ] = await Promise.all([
    supabase
      .from("product_review_stats")
      .select(
        "product_id, average_rating, review_count"
      )
      .in(
        "product_id",
        productIds
      ),

    supabase
      .from("product_images")
      .select(
        "product_id, storage_path"
      )
      .in(
        "product_id",
        productIds
      )
      .eq(
        "sort_order",
        0
      ),
  ]);

  /* -------------------------------------------------------
     Review lookup
  ------------------------------------------------------- */

  const reviewStatsMap =
    new Map<
      string,
      {
        rating: number;
        reviewCount: number;
      }
    >();

  for (
    const stat of
      reviewStatsResult.data ?? []
  ) {
    reviewStatsMap.set(
      stat.product_id,
      {
        rating:
          Number(
            stat.average_rating
          ),

        reviewCount:
          Number(
            stat.review_count
          ),
      }
    );
  }

  /* -------------------------------------------------------
     Image lookup
  ------------------------------------------------------- */

  const imageMap =
    new Map<
      string,
      string
    >();

  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL!;

  for (
    const image of
      imagesResult.data ?? []
  ) {
    if (
      !imageMap.has(
        image.product_id
      )
    ) {
      imageMap.set(
        image.product_id,
        getProductImageUrl(
          supabaseUrl,
          image.storage_path
        )
      );
    }
  }

  /* -------------------------------------------------------
     Convert to frontend Product
  ------------------------------------------------------- */

  const mappedProducts =
    visibleProducts
      .map(
        (
          product
        ): Product | null => {
          const stats =
            reviewStatsMap.get(
              product.id
            );

          const badge: Product["badge"] =
            product.is_new
              ? "NEW"
              : product.is_featured
                ? "POPULAR"
                : undefined;

          return {
            id: product.id,

            name: product.name,

            slug: product.slug,

            category,

            price:
              Number(
                product.price
              ),

            originalPrice:
              product.compare_at_price !==
              null
                ? Number(
                    product.compare_at_price
                  )
                : undefined,

            rating:
              stats?.rating ??
              0,

            reviewCount:
              stats?.reviewCount ??
              0,

            images:
              imageMap.has(
                product.id
              )
                ? [
                    imageMap.get(
                      product.id
                    )!,
                  ]
                : [],

            description: "",

            options: [],

            badge,

            inStock:
              product.is_active,
          };
        }
      )
      .filter(
        (
          product
        ): product is Product =>
          product !== null
      );

  return {
    products:
      mappedProducts,

    hasMore,
  };
}
/* =========================================================
   RELATED PRODUCTS
========================================================= */

export async function getRelatedProducts(
  currentProductId: string,
  category: "shoes" | "watches"
): Promise<Product[]> {
  const supabase =
    await createClient();

  /* -------------------------------------------------------
     Find category
  ------------------------------------------------------- */

  const {
    data: categoryData,
    error: categoryError,
  } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", category)
    .eq("is_active", true)
    .maybeSingle();

  if (categoryError) {
    console.error(
      "Related products category error:",
      categoryError
    );

    return [];
  }

  if (!categoryData) {
    return [];
  }

  /* -------------------------------------------------------
     Find related products
  ------------------------------------------------------- */

  const {
    data,
    error,
  } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("category_id", categoryData.id)
    .eq("is_active", true)
    .neq("id", currentProductId)
    .order("created_at", {
      ascending: false,
    })
    .limit(4);

  if (error) {
    console.error(
      "Related products query error:",
      error
    );

    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  /* -------------------------------------------------------
     Fetch review statistics
  ------------------------------------------------------- */

  const productIds = data.map(
    (product) => product.id
  );

  const {
    data: reviewStats,
    error: reviewStatsError,
  } = await supabase
    .from("product_review_stats")
    .select(`
      product_id,
      average_rating,
      review_count
    `)
    .in("product_id", productIds);

  if (reviewStatsError) {
    console.error(
      "Related products review stats error:",
      reviewStatsError
    );
  }

  /* -------------------------------------------------------
     Create review statistics lookup
  ------------------------------------------------------- */

  const reviewStatsMap =
    new Map<
      string,
      {
        rating: number;
        reviewCount: number;
      }
    >();

  for (const stat of reviewStats ?? []) {
    reviewStatsMap.set(
      stat.product_id,
      {
        rating: Number(
          stat.average_rating
        ),

        reviewCount: Number(
          stat.review_count
        ),
      }
    );
  }

  /* -------------------------------------------------------
     Map products
  ------------------------------------------------------- */

  const mappedProducts =
    mapProducts(data);

  return mappedProducts.map(
    (product) => {
      const stats =
        reviewStatsMap.get(
          product.id
        );

      return {
        ...product,

        rating:
          stats?.rating ?? 0,

        reviewCount:
          stats?.reviewCount ?? 0,
      };
    }
  );
}