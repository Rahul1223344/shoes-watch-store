"use client";

import { useState } from "react";

import ProductCard from "./ProductCard";

import type {
  Product,
  ProductCategory,
} from "@/types/product";

interface ProductSectionProps {
  title: string;
  subtitle: string;
  category: ProductCategory;
  initialProducts: Product[];
  initialHasMore: boolean;
  id: string;
}

const PAGE_SIZE = 8;

function ProductSkeleton() {
  return (
    <div
      className="
        overflow-hidden
        rounded-[22px]
        border border-black/5
        bg-white
        p-3
        shadow-[0_10px_35px_rgba(15,23,42,0.04)]
        sm:p-4
      "
    >
      {/* Image */}
      <div
        className="
          aspect-square
          animate-pulse
          rounded-[18px]
          bg-gray-100
        "
      />

      {/* Product information */}
      <div className="mt-4 space-y-2">
        <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-gray-100" />
      </div>

      {/* Rating */}
      <div className="mt-3 h-4 w-20 animate-pulse rounded bg-gray-100" />

      {/* Price */}
      <div className="mt-3 h-5 w-24 animate-pulse rounded bg-gray-200" />
    </div>
  );
}

export default function ProductSection({
  title,
  subtitle,
  category,
  initialProducts,
  initialHasMore,
  id,
}: ProductSectionProps) {
  const [products, setProducts] =
    useState<Product[]>(
      initialProducts
    );

  const [hasMore, setHasMore] =
    useState(
      initialHasMore
    );

  const [loading, setLoading] =
    useState(false);

  const handleViewMore =
    async () => {
      if (
        loading ||
        !hasMore
      ) {
        return;
      }

      setLoading(true);

      try {
        const nextPage =
          Math.floor(
            products.length /
              PAGE_SIZE
          );

        const response =
          await fetch(
            `/api/products/home?category=${category}&page=${nextPage}&limit=${PAGE_SIZE}`
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load products."
          );
        }

        const data: {
          products: Product[];
          hasMore: boolean;
        } =
          await response.json();

        setProducts(
          (
            currentProducts
          ) => [
            ...currentProducts,
            ...data.products,
          ]
        );

        setHasMore(
          data.hasMore
        );
      } catch (error) {
        console.error(
          "View more products error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <section
      id={id}
      className="px-3 py-12 sm:px-5 sm:py-16"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}

        <div className="mb-7 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Collection
          </p>

          <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                {title}
              </h2>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                {subtitle}
              </p>
            </div>

            <p className="text-xs font-semibold text-gray-400">
              {products.length}{" "}
              {products.length === 1
                ? "Product"
                : "Products"}
            </p>
          </div>
        </div>

        {/* Products */}

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
  {products.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
    />
  ))}

  {loading &&
    Array.from({ length: 8 }).map(
      (_, index) => (
        <ProductSkeleton
          key={`skeleton-${index}`}
        />
      )
    )}
</div>

            {/* View More */}

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={
                    handleViewMore
                  }
                  disabled={
                    loading
                  }
                  className="rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  View More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[22px] border border-black/5 bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <p className="text-sm font-semibold text-gray-500">
              No{" "}
              {title.toLowerCase()}{" "}
              available right now.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}