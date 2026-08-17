import type { Product } from "@/types/product";

type DatabaseProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  category_id: string;
  description: string;

  price: number | string;

  compare_at_price:
    | number
    | string
    | null;

  is_new: boolean;
  is_featured: boolean;
  is_active: boolean;

  seo_title: string | null;
  seo_description: string | null;
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

export type DatabaseProductWithRelations =
  DatabaseProduct & {
    categories:
      | DatabaseCategory
      | null;

    product_options:
      | DatabaseOption[]
      | null;

    product_images:
      | DatabaseImage[]
      | null;
  };

export function mapDatabaseProduct(
  product: DatabaseProductWithRelations,
  imageUrlBuilder: (
    storagePath: string
  ) => string
): Product {
  /* -------------------------------------------------------
     CATEGORY
  ------------------------------------------------------- */

  const category =
    product.categories?.slug ===
    "watches"
      ? "watches"
      : "shoes";

  /* -------------------------------------------------------
     IMAGES
  ------------------------------------------------------- */

  const images = [
    ...(product.product_images ?? []),
  ]
    .sort(
      (a, b) =>
        a.sort_order -
        b.sort_order
    )
    .map(
      (image) =>
        imageUrlBuilder(
          image.storage_path
        )
    );

  /* -------------------------------------------------------
     OPTIONS
  ------------------------------------------------------- */

  const options = [
    ...(product.product_options ?? []),
  ].map(
    (option) => ({
      name: option.name,
      values: option.values,
    })
  );

  /* -------------------------------------------------------
     PRODUCT
  ------------------------------------------------------- */

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

    /*
     * Reviews are loaded separately
     * on the product page.
     */
    rating: 0,

    reviewCount: 0,

    images,

    description:
      product.description,

    options,

    badge:
      product.is_new
        ? "NEW"
        : product.is_featured
          ? "POPULAR"
          : undefined,

    inStock:
      product.is_active,
  };
}