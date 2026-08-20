import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function CategoryCards() {
  return (
    <section className="px-3 py-4 sm:px-5 sm:py-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2">

        {/* ================= SHOES ================= */}
        <a
          href="#shoes"
          className="
            group relative
            h-[150px]
            overflow-hidden
            rounded-[16px]
            border border-white/80
            bg-gradient-to-br
            from-blue-50
            via-white
            to-blue-100/70
            p-3
            shadow-[0_10px_30px_rgba(15,23,42,0.06)]
            transition-transform duration-300
            hover:-translate-y-1

            sm:h-[280px]
            sm:rounded-[26px]
            sm:p-9
          "
        >
          {/* Background glow */}
          <div
            className="
              absolute
              -right-10
              -top-10
              h-28
              w-28
              rounded-full
              bg-blue-200/40
              blur-3xl
              sm:-right-16
              sm:-top-16
              sm:h-48
              sm:w-48
            "
          />

          <div className="relative z-10 h-full">

            {/* Text */}
            <div className="relative z-20">
              <p
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-blue-600
                  sm:text-xs
                  sm:tracking-[0.18em]
                "
              >
                Collection 01
              </p>

              <h2
                className="
                  mt-1
                  text-lg
                  font-black
                  tracking-tight
                  sm:mt-3
                  sm:text-4xl
                "
              >
                Shoes
              </h2>

              <p
                className="
                  mt-1
                  max-w-[120px]
                  text-[9px]
                  leading-3.5
                  text-gray-600
                  sm:mt-3
                  sm:max-w-xs
                  sm:text-sm
                  sm:leading-6
                "
              >
                Step into comfort and confidence with shoes made for
                everyday style.
              </p>
            </div>

            {/* Explore button */}
            <span
              className="
                absolute
                bottom-2
                left-0
                z-20
                inline-flex
                items-center
                gap-1
                rounded-md
                border
                border-black/10
                bg-white/90
                px-2.5
                py-1.5
                text-[8px]
                font-bold
                backdrop-blur-md
                sm:bottom-0
                sm:gap-2
                sm:rounded-full
                sm:px-5
                sm:py-2.5
                sm:text-xs
              "
            >
              Explore
              <ArrowUpRight
                size={11}
                className="sm:h-[15px] sm:w-[15px]"
              />
            </span>

            {/* Shoe image */}
            <div
              className="
                absolute
                bottom-[-2px]
                right-[-8px]
                h-[78px]
                w-[105px]
                transition-transform
                duration-500
                group-hover:scale-110

                sm:bottom-0
                sm:right-0
                sm:h-36
                sm:w-52
              "
            >
              <Image
                src="/images/categories/shoes.png"
                alt="Shoes collection"
                fill
                sizes="220px"
                className="object-contain object-right"
              />
            </div>

          </div>
        </a>


        {/* ================= WATCHES ================= */}
        <a
          href="#watches"
          className="
            group relative
            h-[150px]
            overflow-hidden
            rounded-[16px]
            border border-white/80
            bg-gradient-to-br
            from-amber-50
            via-white
            to-orange-100/70
            p-3
            shadow-[0_10px_30px_rgba(15,23,42,0.06)]
            transition-transform duration-300
            hover:-translate-y-1

            sm:h-[280px]
            sm:rounded-[26px]
            sm:p-9
          "
        >
          {/* Background glow */}
          <div
            className="
              absolute
              -bottom-10
              -right-10
              h-32
              w-32
              rounded-full
              bg-orange-200/40
              blur-3xl
              sm:-bottom-20
              sm:-right-16
              sm:h-52
              sm:w-52
            "
          />

          <div className="relative z-10 h-full">

            {/* Text */}
            <div className="relative z-20">
              <p
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-orange-600
                  sm:text-xs
                  sm:tracking-[0.18em]
                "
              >
                Collection 02
              </p>

              <h2
                className="
                  mt-1
                  text-lg
                  font-black
                  tracking-tight
                  sm:mt-3
                  sm:text-4xl
                "
              >
                Watches
              </h2>

              <p
                className="
                  mt-1
                  max-w-[120px]
                  text-[9px]
                  leading-3.5
                  text-gray-600
                  sm:mt-3
                  sm:max-w-xs
                  sm:text-sm
                  sm:leading-6
                "
              >
                Timeless watches designed to complete your everyday look.
              </p>
            </div>

            {/* Explore button */}
            <span
              className="
                absolute
                bottom-2
                left-0
                z-20
                inline-flex
                items-center
                gap-1
                rounded-md
                border
                border-black/10
                bg-white/90
                px-2.5
                py-1.5
                text-[8px]
                font-bold
                backdrop-blur-md
                sm:bottom-0
                sm:gap-2
                sm:rounded-full
                sm:px-5
                sm:py-2.5
                sm:text-xs
              "
            >
              Explore
              <ArrowUpRight
                size={11}
                className="sm:h-[15px] sm:w-[15px]"
              />
            </span>

            {/* Watch image */}
            <div
              className="
                absolute
                bottom-[-3px]
                right-[-6px]
                h-[82px]
                w-[88px]
                transition-transform
                duration-500
                group-hover:scale-110

                sm:bottom-0
                sm:right-0
                sm:h-36
                sm:w-40
              "
            >
              <Image
                src="/images/categories/watch.png"
                alt="Watches collection"
                fill
                sizes="180px"
                className="object-contain object-right"
              />
            </div>

          </div>
        </a>

      </div>
    </section>
  );
}