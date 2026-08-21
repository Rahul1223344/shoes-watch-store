import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type SearchCategory = {
  slug: string;
};

type SearchProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  price: number | string;
  compare_at_price: number | string | null;
  is_new: boolean;
  is_featured: boolean;
  category_id: string;
  categories: SearchCategory | SearchCategory[] | null;
  product_images: {
    storage_path: string;
    sort_order: number;
  }[];
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({
      products: [],
    });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      brand,
      price,
      compare_at_price,
      is_new,
      is_featured,
      category_id,
      categories (
        slug
      ),
      product_images (
        storage_path,
        sort_order
      )
    `)
    .eq("is_active", true)
    .or(
      `name.ilike.%${query}%,brand.ilike.%${query}%`
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(8);

  if (error) {
    console.error("Product search error:", error);

    return NextResponse.json(
      {
        error: "Unable to search products.",
      },
      {
        status: 500,
      }
    );
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const products = ((data ?? []) as unknown as SearchProduct[]).map(
    (product) => {
      const image = product.product_images?.find(
        (item) => item.sort_order === 0
      );

      const category = Array.isArray(product.categories)
        ? product.categories[0]?.slug
        : product.categories?.slug;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,

        price: Number(product.price),

        compareAtPrice:
          product.compare_at_price !== null
            ? Number(product.compare_at_price)
            : undefined,

        category,

        image: image
          ? `${supabaseUrl}/storage/v1/object/public/product-images/${image.storage_path}`
          : null,

        badge: product.is_new
          ? "NEW"
          : product.is_featured
            ? "POPULAR"
            : undefined,
      };
    }
  );

  return NextResponse.json({
    products,
  });
}