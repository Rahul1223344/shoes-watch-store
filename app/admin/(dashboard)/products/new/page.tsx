import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Categories fetch error:", error);

    return (
      <div className="p-6 lg:p-8">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
          <h1 className="font-bold text-red-700">
            Unable to load categories
          </h1>

          <p className="mt-1 text-sm text-red-600">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!categories?.length) {
    redirect("/admin/products");
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          Product Management
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Add Product
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new shoe or watch to your store.
        </p>
      </div>

      <ProductForm categories={categories} />

    </div>
  );
}