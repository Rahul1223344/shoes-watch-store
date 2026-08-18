export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-white">
      <section className="px-3 py-8 sm:px-5 sm:py-12">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">

            {/* Gallery Skeleton */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-[28px] bg-gray-100">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>

              {/* Thumbnail skeletons */}
              <div className="mt-4 flex gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="
                      h-16 w-16
                      animate-pulse
                      rounded-xl
                      bg-gray-100
                      sm:h-20 sm:w-20
                    "
                  />
                ))}
              </div>
            </div>

            {/* Product Information Skeleton */}
            <div className="flex flex-col justify-center">

              {/* Brand */}
              <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />

              {/* Title */}
              <div className="mt-4 space-y-2">
                <div className="h-8 w-4/5 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-8 w-3/5 animate-pulse rounded-lg bg-gray-100" />
              </div>

              {/* Rating */}
              <div className="mt-5 flex items-center gap-2">
                <div className="h-5 w-24 animate-pulse rounded-full bg-gray-100" />
                <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
              </div>

              {/* Price */}
              <div className="mt-6 h-8 w-32 animate-pulse rounded-lg bg-gray-100" />

              {/* Description */}
              <div className="mt-6 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-11/12 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
              </div>

              {/* Options */}
              <div className="mt-8 space-y-3">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />

                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="
                        h-10 w-16
                        animate-pulse
                        rounded-xl
                        bg-gray-100
                      "
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-7">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />

                <div className="mt-3 h-11 w-32 animate-pulse rounded-xl bg-gray-100" />
              </div>

              {/* Order Button */}
              <div className="mt-7 h-14 w-full animate-pulse rounded-2xl bg-gray-100" />

            </div>
          </div>

        </div>
      </section>
    </main>
  );
}