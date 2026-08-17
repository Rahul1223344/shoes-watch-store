"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Pencil,
  MoreVertical,
  PackageOpen,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  price: number;
  compare_at_price: number | null;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  category_id: string;
  categoryName: string;
  created_at: string;
};

type ProductTableProps = {
  products: Product[];
};

export default function ProductTable({
  products,
}: ProductTableProps) {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name
          .toLowerCase()
          .includes(query) ||
        product.brand
          ?.toLowerCase()
          .includes(query) ||
        product.categoryName
          .toLowerCase()
          .includes(query)
      );
    });
  }, [products, search]);

  return (
    <div className="overflow-hidden rounded-3xl border border-black/5 bg-white/75 shadow-sm backdrop-blur-xl">

      {/* Search */}
      <div className="border-b border-black/5 p-4 sm:p-5">

        <div className="relative max-w-md">

          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search products..."
            className="w-full rounded-xl border border-black/10 bg-white px-11 py-3 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
          />

        </div>

      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <PackageOpen size={25} />
          </div>

          <h2 className="mt-5 text-lg font-black">
            {products.length === 0
              ? "No products yet"
              : "No products found"}
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            {products.length === 0
              ? "Start by adding your first shoe or watch."
              : "Try searching with a different product name, brand or category."}
          </p>

          {products.length === 0 && (
            <Link
              href="/admin/products/new"
              className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              Add your first product
            </Link>
          )}

        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">

            <table className="w-full text-left">

              <thead className="border-b border-black/5 bg-gray-50/70">
                <tr>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Product
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Price
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-black/5">

                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-gray-50/70"
                  >

                    {/* Product */}
                    <td className="px-5 py-4">

                      <div>
                        <p className="font-bold">
                          {product.name}
                        </p>

                        {product.brand && (
                          <p className="mt-1 text-xs text-gray-400">
                            {product.brand}
                          </p>
                        )}
                      </div>

                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                        {product.categoryName}
                      </span>

                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">

                      <div>
                        <p className="font-bold">
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString("en-IN")}
                        </p>

                        {product.compare_at_price && (
                          <p className="text-xs text-gray-400 line-through">
                            ₹
                            {Number(
                              product.compare_at_price
                            ).toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>

                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">

                      <div className="flex flex-wrap gap-2">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            product.is_active
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {product.is_active
                            ? "Active"
                            : "Draft"}
                        </span>

                        {product.is_new && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                            New
                          </span>
                        )}

                        {product.is_featured && (
                          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                            Featured
                          </span>
                        )}

                      </div>

                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">

                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-gray-500 transition hover:bg-black hover:text-white"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil size={16} />
                      </Link>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-black/5 md:hidden">

            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="p-4"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <h3 className="truncate font-bold">
                      {product.name}
                    </h3>

                    {product.brand && (
                      <p className="mt-1 text-xs text-gray-400">
                        {product.brand}
                      </p>
                    )}

                  </div>

                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10"
                  >
                    <Pencil size={15} />
                  </Link>

                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    {product.categoryName}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      product.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {product.is_active
                      ? "Active"
                      : "Draft"}
                  </span>

                </div>

                <p className="mt-4 text-lg font-black">
                  ₹
                  {Number(
                    product.price
                  ).toLocaleString("en-IN")}
                </p>

              </div>
            ))}

          </div>
        </>
      )}

    </div>
  );
}