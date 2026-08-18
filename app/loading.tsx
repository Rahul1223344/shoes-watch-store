export default function Loading() {
  return (
    <main className="min-h-screen bg-white">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div
          className="
            shimmer
            relative mx-auto
            max-w-7xl
            overflow-hidden
            rounded-[26px]
            bg-gray-100
            aspect-[16/9]
            sm:aspect-[16/7]
          "
        >
          {/* Fake hero content */}
          <div className="absolute inset-0 flex items-center px-6 sm:px-10 lg:px-16">
            <div className="w-full max-w-xl">

              <div className="h-3 w-24 rounded-full bg-black/[0.07]" />

              <div className="mt-5 h-9 w-[70%] rounded-xl bg-black/[0.08] sm:h-12" />

              <div className="mt-3 h-4 w-[52%] rounded-full bg-black/[0.05]" />

            </div>
          </div>

          {/* Slider arrows */}
          <div
            className="
              absolute left-3 top-1/2
              h-9 w-9
              -translate-y-1/2
              rounded-full
              bg-white/70
              shadow-sm
              sm:left-5
            "
          />

          <div
            className="
              absolute right-3 top-1/2
              h-9 w-9
              -translate-y-1/2
              rounded-full
              bg-white/70
              shadow-sm
              sm:right-5
            "
          />

          {/* Slider indicators */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {[1, 2, 3, 4].map((item) => (
              <span
                key={item}
                className="
                  h-1.5 w-1.5
                  rounded-full
                  bg-black/15
                "
              />
            ))}
          </div>
        </div>
      </section>


      {/* =====================================================
          CATEGORY CARDS
      ===================================================== */}
      <section className="px-3 py-4 sm:px-5 sm:py-6">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">

          {/* Shoes */}
          <div
            className="
              relative
              min-h-[280px]
              overflow-hidden
              rounded-[26px]
              border border-black/[0.04]
              bg-gradient-to-br
              from-blue-50
              via-white
              to-blue-100/70
              p-7
              shadow-[0_15px_45px_rgba(15,23,42,0.04)]
              sm:p-9
            "
          >
            <div className="shimmer absolute inset-0" />

            <div className="relative z-10 flex h-full flex-col justify-between">

              <div>
                <div className="h-3 w-24 rounded-full bg-blue-600/10" />

                <div className="mt-4 h-9 w-28 rounded-xl bg-black/[0.07] sm:h-10" />

                <div className="mt-4 space-y-2">
                  <div className="h-3 w-64 max-w-full rounded-full bg-black/[0.045]" />
                  <div className="h-3 w-52 max-w-full rounded-full bg-black/[0.045]" />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">

                <div className="h-10 w-36 rounded-full bg-white/70" />

                {/* Shoe image placeholder */}
                <div className="h-32 w-44 rounded-[40%] bg-black/[0.035] sm:h-36 sm:w-52" />

              </div>

            </div>
          </div>


          {/* Watches */}
          <div
            className="
              relative
              min-h-[280px]
              overflow-hidden
              rounded-[26px]
              border border-black/[0.04]
              bg-gradient-to-br
              from-amber-50
              via-white
              to-orange-100/70
              p-7
              shadow-[0_15px_45px_rgba(15,23,42,0.04)]
              sm:p-9
            "
          >
            <div className="shimmer absolute inset-0" />

            <div className="relative z-10 flex h-full flex-col justify-between">

              <div>
                <div className="h-3 w-24 rounded-full bg-orange-600/10" />

                <div className="mt-4 h-9 w-36 rounded-xl bg-black/[0.07] sm:h-10" />

                <div className="mt-4 space-y-2">
                  <div className="h-3 w-64 max-w-full rounded-full bg-black/[0.045]" />
                  <div className="h-3 w-52 max-w-full rounded-full bg-black/[0.045]" />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">

                <div className="h-10 w-40 rounded-full bg-white/70" />

                {/* Watch image placeholder */}
                <div className="h-32 w-36 rounded-[40%] bg-black/[0.035] sm:h-36 sm:w-40" />

              </div>

            </div>
          </div>

        </div>
      </section>


      {/* =====================================================
          TRUST FEATURES
      ===================================================== */}
      <section className="px-3 py-4 sm:px-5 sm:py-6">
        <div
          className="
            mx-auto
            grid max-w-7xl
            grid-cols-2
            overflow-hidden
            rounded-[24px]
            border border-black/[0.05]
            bg-white
            md:grid-cols-4
          "
        >
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
                flex items-center gap-3
                border-black/[0.05]
                p-5
                md:border-r
                last:border-r-0
              "
            >
              <div className="h-10 w-10 shrink-0 rounded-full bg-black/[0.045]" />

              <div className="min-w-0">
                <div className="h-3 w-24 rounded-full bg-black/[0.06]" />
                <div className="mt-2 h-2.5 w-20 rounded-full bg-black/[0.04]" />
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* =====================================================
          SHOES
      ===================================================== */}
      <ProductSectionSkeleton />


      {/* =====================================================
          WATCHES
      ===================================================== */}
      <ProductSectionSkeleton />


      {/* =====================================================
          SHIMMER
      ===================================================== */}
      <style>{`
        .shimmer {
          background:
            linear-gradient(
              110deg,
              transparent 25%,
              rgba(255,255,255,0.55) 45%,
              transparent 65%
            );
          background-size: 220% 100%;
          animation: shimmer 1.8s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: 220% 0;
          }

          100% {
            background-position: -220% 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .shimmer {
            animation: none;
          }
        }
      `}</style>

    </main>
  );
}


/* =========================================================
   PRODUCT SECTION SKELETON
========================================================= */

function ProductSectionSkeleton() {
  return (
    <section className="px-3 py-12 sm:px-5 sm:py-16">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-7">

          <div className="h-3 w-32 rounded-full bg-blue-600/10" />

          <div className="mt-4 h-9 w-40 rounded-xl bg-black/[0.07] sm:h-10" />

          <div className="mt-3 h-4 w-72 max-w-full rounded-full bg-black/[0.04]" />

        </div>


        {/* Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
                overflow-hidden
                rounded-[22px]
                border border-black/[0.05]
                bg-white/70
                p-3
                shadow-[0_10px_35px_rgba(15,23,42,0.035)]
                sm:p-4
              "
            >

              {/* Product image */}
              <div
                className="
                  shimmer
                  relative
                  aspect-square
                  overflow-hidden
                  rounded-[18px]
                  bg-gradient-to-br
                  from-gray-50
                  via-white
                  to-gray-100
                "
              >
                <div
                  className="
                    absolute
                    left-1/2 top-1/2
                    h-[45%] w-[55%]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-[35%]
                    bg-black/[0.025]
                  "
                />
              </div>


              {/* Product information */}
              <div className="px-1 pt-4">

                <div className="h-4 w-4/5 rounded-full bg-black/[0.06]" />

                <div className="mt-2 h-3 w-3/5 rounded-full bg-black/[0.035]" />


                {/* Rating */}
                <div className="mt-3 flex items-center gap-2">

                  <div className="h-3.5 w-3.5 rounded-full bg-yellow-400/10" />

                  <div className="h-3 w-12 rounded-full bg-black/[0.04]" />

                </div>


                {/* Price */}
                <div className="mt-3 h-5 w-24 rounded-full bg-black/[0.065]" />


                {/* View Product */}
                <div className="mt-4 h-10 w-full rounded-xl bg-black/[0.035]" />

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}