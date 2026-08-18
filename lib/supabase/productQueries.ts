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

export async function getHomeProducts(): Promise<Product[]> {
  const supabase = await createClient();

  /* -------------------------------------------------------
     Fetch active products
  ------------------------------------------------------- */

  const {
    data: products,
    error: productsError,
  } = await supabase
    .from("products")
    .select(`
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
      seo_description
    `)
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    });

  if (productsError) {
    console.error(
      "Failed to fetch homepage products:",
      productsError
    );

    return [];
  }

  if (!products || products.length === 0) {
    return [];
  }

  /* -------------------------------------------------------
     Fetch categories
  ------------------------------------------------------- */

  const categoryIds = [
    ...new Set(
      products.map(
        (product) => product.category_id
      )
    ),
  ];

  const {
    data: categories,
    error: categoriesError,
  } = await supabase
    .from("categories")
    .select(`
      id,
      slug
    `)
    .in("id", categoryIds)
    .eq("is_active", true);

  if (categoriesError) {
    console.error(
      "Failed to fetch product categories:",
      categoriesError
    );

    return [];
  }

  /* -------------------------------------------------------
     Create category lookup
  ------------------------------------------------------- */

  const categoryMap =
    new Map<string, ProductCategory>();

  for (const category of categories ?? []) {
    if (
      category.slug === "shoes" ||
      category.slug === "watches"
    ) {
      categoryMap.set(
        category.id,
        category.slug
      );
    }
  }

  /* -------------------------------------------------------
     Fetch approved review statistics
  ------------------------------------------------------- */

  const productIds = products.map(
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
      "Failed to fetch product review stats:",
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
     Fetch primary product images
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
    .in("product_id", productIds)
    .eq("sort_order", 0);

  if (imagesError) {
    console.error(
      "Failed to fetch homepage product images:",
      imagesError
    );
  }

  /* -------------------------------------------------------
     Create image lookup
  ------------------------------------------------------- */

  const imageMap =
    new Map<string, string>();

  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL!;

  for (const image of images ?? []) {
    if (
      imageMap.has(
        image.product_id
      )
    ) {
      continue;
    }

    imageMap.set(
      image.product_id,
      getProductImageUrl(
        supabaseUrl,
        image.storage_path
      )
    );
  }

  /* -------------------------------------------------------
     Map products
  ------------------------------------------------------- */

  return products
    .map(
      (product): Product | null => {
        /* -----------------------------------------------
           Determine category
        ------------------------------------------------ */

        const category =
          categoryMap.get(
            product.category_id
          );

        /*
         * Never silently turn an unknown category
         * into "shoes".
         */

        if (!category) {
          console.error(
            "Invalid product category:",
            {
              productId:
                product.id,

              productName:
                product.name,

              categoryId:
                product.category_id,
            }
          );

          return null;
        }

        /* -----------------------------------------------
           Review statistics
        ------------------------------------------------ */

        const stats =
          reviewStatsMap.get(
            product.id
          );

        const rating =
          stats?.rating ?? 0;

        const reviewCount =
          stats?.reviewCount ?? 0;

        /* -----------------------------------------------
           Badge
        ------------------------------------------------ */

        const badge: Product["badge"] =
          product.is_new
            ? "NEW"
            : product.is_featured
              ? "POPULAR"
              : undefined;

        /* -----------------------------------------------
           Product
        ------------------------------------------------ */

        return {
          id: product.id,

          name: product.name,

          slug: product.slug,

          category,

          price:
            Number(product.price),

          originalPrice:
            product.compare_at_price !==
            null
              ? Number(
                  product.compare_at_price
                )
              : undefined,

          rating,

          reviewCount,

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

          description:
            product.description,

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