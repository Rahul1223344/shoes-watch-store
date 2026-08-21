import Link from "next/link";
import {
  Package,
  MessageSquare,
  Plus,
  ExternalLink,
  FolderOpen,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch dashboard statistics in parallel
  const [
    productsResult,
    activeProductsResult,
    reviewsResult,
    categoriesResult,
  ] = await Promise.all([
    supabase
      .from("products")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),

    supabase
      .from("product_reviews")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("categories")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  const totalProducts = productsResult.count ?? 0;
  const activeProducts = activeProductsResult.count ?? 0;
  const totalReviews = reviewsResult.count ?? 0;
  const totalCategories = categoriesResult.count ?? 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Store Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your shoes, watches and customer reviews.
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

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Products */}
        <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur-xl">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Package size={19} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Total Products
          </p>

          <p className="mt-1 text-3xl font-black">
            {totalProducts}
          </p>

        </div>

        {/* Active Products */}
        <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur-xl">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <Package size={19} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Active Products
          </p>

          <p className="mt-1 text-3xl font-black">
            {activeProducts}
          </p>

        </div>

        {/* Reviews */}
        <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur-xl">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <MessageSquare size={19} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Reviews
          </p>

          <p className="mt-1 text-3xl font-black">
            {totalReviews}
          </p>

        </div>

        {/* Categories */}
        <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur-xl">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <FolderOpen size={19} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Store Categories
          </p>

          <p className="mt-1 text-3xl font-black">
            {totalCategories}
          </p>

        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2">

        {/* Products */}
        <Link
          href="/admin/products"
          className="
            group rounded-3xl
            border border-white/80
            bg-white/70
            p-6
            shadow-sm
            backdrop-blur-xl
            transition
            hover:-translate-y-0.5
            hover:shadow-xl
          "
        >

          <div className="flex items-center justify-between">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
              <Package size={21} />
            </div>

            <ExternalLink
              size={18}
              className="text-gray-300 transition group-hover:text-black"
            />

          </div>

          <h2 className="mt-6 text-xl font-black">
            Manage Products
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Add new shoes and watches, edit product
            information and manage product images.
          </p>

        </Link>

        {/* Reviews */}
        <Link
          href="/admin/reviews"
          className="
            group rounded-3xl
            border border-white/80
            bg-white/70
            p-6
            shadow-sm
            backdrop-blur-xl
            transition
            hover:-translate-y-0.5
            hover:shadow-xl
          "
        >

          <div className="flex items-center justify-between">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
              <MessageSquare size={21} />
            </div>

            <ExternalLink
              size={18}
              className="text-gray-300 transition group-hover:text-black"
            />

          </div>

          <h2 className="mt-6 text-xl font-black">
            Manage Reviews
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Add customer feedback, review ratings and
            publish approved reviews on your website.
          </p>

        </Link>

      </div>

    </div>
  );
}