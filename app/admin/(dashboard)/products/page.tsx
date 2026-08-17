import Link from "next/link";
import { Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import ProductTable from "@/components/admin/ProductTable";

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      brand,
      price,
      compare_at_price,
      is_active,
      is_featured,
      is_new,
      category_id,
      created_at
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Products fetch error:", error);

    return (
      <div className="p-6 lg:p-8">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
          <h1 className="font-bold text-red-700">
            Unable to load products
          </h1>

          <p className="mt-1 text-sm text-red-600">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  const categoryMap = new Map(
    (categories ?? []).map((category) => [
      category.id,
      category.name,
    ])
  );

  const formattedProducts = (products ?? []).map(
    (product) => ({
      ...product,
      categoryName:
        categoryMap.get(product.category_id) ??
        "Unknown",
    })
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Store Management
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your shoes and watches.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
        >
          <Plus size={17} />
          Add Product
        </Link>

      </div>

      {/* Product table */}
      <div className="mt-8">
        <ProductTable
          products={formattedProducts}
        />
      </div>

    </div>
  );
}