import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import EditProductForm from "@/components/admin/EditProductForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const [
    productResult,
    categoriesResult,
    optionsResult,
    imagesResult,
  ] = await Promise.all([
    supabase
      .from("products")
      .select(`
        id,
        name,
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
      .eq("id", id)
      .maybeSingle(),

    supabase
      .from("categories")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("name"),

    supabase
      .from("product_options")
      .select("id, name, values")
      .eq("product_id", id)
      .order("id"),

    supabase
  .from("product_images")
  .select(`
    id,
    storage_path,
    alt_text,
    sort_order
  `)
      .eq("product_id", id)
      .order("sort_order"),
  ]);

  if (
    productResult.error ||
    !productResult.data
  ) {
    notFound();
  }

  if (categoriesResult.error) {
    throw new Error(
      "Unable to load categories."
    );
  }

  if (optionsResult.error) {
    throw new Error(
      "Unable to load product options."
    );
  }

  if (imagesResult.error) {
    throw new Error(
      "Unable to load product images."
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          Product Management
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Edit Product
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update product information, options and SEO.
        </p>
      </div>

      <EditProductForm
        product={productResult.data}
        categories={categoriesResult.data ?? []}
        options={
          (optionsResult.data ?? []).map(
            (option) => ({
              name: option.name,
              values: option.values,
            })
          )
        }
        images={imagesResult.data ?? []}
      />

    </div>
  );
}