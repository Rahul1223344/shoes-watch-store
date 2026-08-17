import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function CategoryCards() {
  return (
    <section className="px-3 py-4 sm:px-5 sm:py-6">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">

        {/* Shoes */}
        <a
          href="#shoes"
          className="group relative min-h-[280px] overflow-hidden rounded-[26px] border border-white/80 bg-gradient-to-br from-blue-50 via-white to-blue-100/70 p-7 shadow-[0_15px_45px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1 sm:p-9"
        >
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Collection 01
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Shoes
              </h2>

              <p className="mt-3 max-w-xs text-sm leading-6 text-gray-600">
                Step into comfort and confidence with shoes made for
                everyday style.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between">

              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-5 py-2.5 text-xs font-bold backdrop-blur-md">
                Explore Shoes
                <ArrowUpRight size={15} />
              </span>

              {/* Real Shoe Image */}
              <div className="relative h-32 w-44 transition-transform duration-500 group-hover:scale-110 sm:h-36 sm:w-52">
                <Image
                  src="/images/categories/shoes.png"
                  alt="Shoes collection"
                  fill
                  sizes="220px"
                  className="object-contain object-right"
                />
              </div>

            </div>
          </div>
        </a>

        {/* Watches */}
        <a
          href="#watches"
          className="group relative min-h-[280px] overflow-hidden rounded-[26px] border border-white/80 bg-gradient-to-br from-amber-50 via-white to-orange-100/70 p-7 shadow-[0_15px_45px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1 sm:p-9"
        >
          <div className="absolute -bottom-20 -right-16 h-52 w-52 rounded-full bg-orange-200/40 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                Collection 02
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Watches
              </h2>

              <p className="mt-3 max-w-xs text-sm leading-6 text-gray-600">
                Timeless watches designed to complete your everyday look.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between">

              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-5 py-2.5 text-xs font-bold backdrop-blur-md">
                Explore Watches
                <ArrowUpRight size={15} />
              </span>

              {/* Real Watch Image */}
              <div className="relative h-32 w-36 transition-transform duration-500 group-hover:scale-110 sm:h-36 sm:w-40">
                <Image
                  src="/images/categories/watch.png"
                  alt="Watches collection"
                  fill
                  sizes="180px"
                  className="object-contain object-right"
                />
              </div>

            </div>
          </div>
        </a>

      </div>
    </section>
  );
}