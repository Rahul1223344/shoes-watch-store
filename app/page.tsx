import { Suspense } from "react";

import CategoryCards from "@/components/home/CategoryCards";
import Hero from "@/components/home/Hero";
import ProductSection from "@/components/home/ProductSection";
import TrustFeatures from "@/components/home/TrustFeatures";
import Footer from "@/components/layout/Footer";

import {
  getHomeProducts,
} from "@/lib/supabase/productQueries";

/* =========================================================
   PRODUCT SECTIONS
========================================================= */

async function HomeProducts() {
  const [
    shoesResult,
    watchesResult,
  ] = await Promise.all([
    getHomeProducts(
      "shoes",
      0,
      8
    ),

    getHomeProducts(
      "watches",
      0,
      8
    ),
  ]);

  return (
    <>
      <ProductSection
        id="shoes"
        title="Shoes"
        subtitle="Step into comfort, style and confidence."
        category="shoes"
        initialProducts={
          shoesResult.products
        }
        initialHasMore={
          shoesResult.hasMore
        }
      />

      <ProductSection
        id="watches"
        title="Watches"
        subtitle="Timeless designs made for every occasion."
        category="watches"
        initialProducts={
          watchesResult.products
        }
        initialHasMore={
          watchesResult.hasMore
        }
      />
    </>
  );
}

/* =========================================================
   PRODUCT SKELETON
========================================================= */

function ProductSectionsSkeleton() {
  return (
    <div className="px-3 py-12 sm:px-5 sm:py-16">
      <div className="mx-auto max-w-7xl">

        <div className="mb-7 sm:mb-8">
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />

          <div className="mt-3 h-9 w-32 animate-pulse rounded-lg bg-gray-200 sm:h-10 sm:w-40" />

          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-gray-100 sm:w-80" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <div
              key={index}
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
              <div
                className="
                  aspect-square
                  animate-pulse
                  rounded-[18px]
                  bg-gray-100
                "
              />

              <div className="mt-4 space-y-2">
                <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-3/5 animate-pulse rounded bg-gray-100" />
              </div>

              <div className="mt-3 h-4 w-20 animate-pulse rounded bg-gray-100" />

              <div className="mt-3 h-5 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   HOMEPAGE
========================================================= */

export default function Home() {
  return (
    <main>
      <Hero />

      <CategoryCards />

      <TrustFeatures />

      <Suspense
        fallback={
          <ProductSectionsSkeleton />
        }
      >
        <HomeProducts />
      </Suspense>

      <Footer />
    </main>
  );
}