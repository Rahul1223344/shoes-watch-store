export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div
          className="
            relative
            mx-auto
            max-w-7xl
            overflow-hidden
            rounded-[28px]
            bg-gray-100
            aspect-[16/8]
            animate-pulse
            sm:aspect-[16/7]
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
      </section>

      {/* Category Cards Skeleton */}
      <section className="px-3 py-4 sm:px-5 sm:py-6">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="
                min-h-[280px]
                animate-pulse
                rounded-[26px]
                border border-black/5
                bg-gray-100
                p-7
                sm:p-9
              "
            >
              <div className="h-3 w-24 rounded bg-gray-200" />

              <div className="mt-5 h-10 w-32 rounded-lg bg-gray-200" />

              <div className="mt-4 space-y-2">
                <div className="h-3 w-64 rounded bg-gray-200" />
                <div className="h-3 w-52 rounded bg-gray-200" />
              </div>

              <div className="mt-10 h-10 w-36 rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </section>

      {/* Trust Features Skeleton */}
      <section className="px-3 py-4 sm:px-5 sm:py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-2 overflow-hidden rounded-[24px] border border-black/5 bg-gray-100 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
                flex
                items-center
                gap-3
                border-black/5
                p-5
                animate-pulse
                md:border-r
                last:border-r-0
              "
            >
              <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />

              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-gray-200" />
                <div className="h-2.5 w-20 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Section Skeleton */}
      <section className="px-3 py-12 sm:px-5 sm:py-16">
        <div className="mx-auto max-w-7xl">

          {/* Heading */}
          <div className="mb-7 animate-pulse">
            <div className="h-3 w-32 rounded bg-gray-100" />

            <div className="mt-4 h-9 w-48 rounded-lg bg-gray-100" />

            <div className="mt-3 h-4 w-72 rounded bg-gray-100" />
          </div>

          {/* Product cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  animate-pulse
                  overflow-hidden
                  rounded-[22px]
                  border border-black/5
                  bg-white
                  p-3
                  sm:p-4
                "
              >
                <div className="aspect-square rounded-[18px] bg-gray-100" />

                <div className="px-1 pt-4">
                  <div className="h-4 w-4/5 rounded bg-gray-100" />

                  <div className="mt-3 h-3 w-20 rounded bg-gray-100" />

                  <div className="mt-4 h-5 w-24 rounded bg-gray-100" />

                  <div className="mt-4 h-10 w-full rounded-xl bg-gray-100" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Second Product Section Skeleton */}
      <section className="px-3 py-12 sm:px-5 sm:py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-7 animate-pulse">
            <div className="h-3 w-32 rounded bg-gray-100" />

            <div className="mt-4 h-9 w-48 rounded-lg bg-gray-100" />

            <div className="mt-3 h-4 w-72 rounded bg-gray-100" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  animate-pulse
                  overflow-hidden
                  rounded-[22px]
                  border border-black/5
                  bg-white
                  p-3
                  sm:p-4
                "
              >
                <div className="aspect-square rounded-[18px] bg-gray-100" />

                <div className="px-1 pt-4">
                  <div className="h-4 w-4/5 rounded bg-gray-100" />
                  <div className="mt-3 h-3 w-20 rounded bg-gray-100" />
                  <div className="mt-4 h-5 w-24 rounded bg-gray-100" />
                  <div className="mt-4 h-10 w-full rounded-xl bg-gray-100" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}