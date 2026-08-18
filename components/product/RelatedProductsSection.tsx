import { Suspense } from "react";

import RelatedProducts from "./RelatedProducts";

import {
  getRelatedProducts,
} from "@/lib/supabase/productQueries";

import type { Product } from "@/types/product";

interface RelatedProductsSectionProps {
  product: Product;
}

async function RelatedProductsContent({
  product,
}: RelatedProductsSectionProps) {
  const products =
    await getRelatedProducts(
      product.id,
      product.category
    );

  return (
    <RelatedProducts
      currentProduct={product}
      products={products}
    />
  );
}

function RelatedProductsSkeleton() {
  return (
    <section className="mt-10">
      <div className="mb-6">
        <div className="h-7 w-48 animate-pulse rounded-lg bg-gray-100" />

        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="
              overflow-hidden
              rounded-[22px]
              border border-black/5
              bg-white/70
              p-3
              sm:p-4
            "
          >
            <div className="relative aspect-square animate-pulse rounded-[18px] bg-gray-100" />

            <div className="mt-4 space-y-3 px-1">
              <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />

              <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />

              <div className="h-5 w-1/2 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function RelatedProductsSection({
  product,
}: RelatedProductsSectionProps) {
  return (
    <Suspense fallback={<RelatedProductsSkeleton />}>
      <RelatedProductsContent
        product={product}
      />
    </Suspense>
  );
}