import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const primaryImage = product.images[0];

  return (
    <article
      className="
        group relative overflow-hidden
        rounded-[22px]
        border border-black/5
        bg-white/70
        p-3
        shadow-[0_10px_35px_rgba(15,23,42,0.05)]
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_45px_rgba(15,23,42,0.09)]
        sm:p-4
      "
    >
      {/* Product Image */}
      <Link
        href={`/product/${product.slug}`}
        className="
          relative block
          aspect-square
          overflow-hidden
          rounded-[18px]
          bg-gradient-to-br
          from-gray-50
          via-white
          to-gray-100
        "
      >
        {/* Badge */}
        {product.badge && (
          <span
            className="
              absolute left-3 top-3 z-10
              rounded-full bg-black
              px-2.5 py-1
              text-[10px] font-bold
              uppercase tracking-wide
              text-white
            "
          >
            {product.badge}
          </span>
        )}

        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="
              (max-width: 640px) 50vw,
              (max-width: 1024px) 25vw,
              300px
            "
            className="
              object-contain
              p-3
              transition-transform
              duration-500
              group-hover:scale-[1.03]
              sm:p-4
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div
              className="
                flex h-32 w-32
                items-center justify-center
                rounded-full bg-white
                shadow-[0_15px_35px_rgba(0,0,0,0.06)]
              "
            >
              <span
                className="
                  text-xs font-bold
                  uppercase tracking-wider
                  text-gray-400
                "
              >
                No Image
              </span>
            </div>
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="px-1 pt-4">

        {/* Product Name */}
        <Link
          href={`/product/${product.slug}`}
          className="block min-w-0"
        >
          <h3
            className="
              line-clamp-2
              text-sm font-semibold
              leading-5
              transition-colors
              hover:text-blue-600
              sm:text-[15px]
            "
          >
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <Star
            size={14}
            className={
              product.rating > 0
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />

          <span className="text-xs font-semibold">
            {product.rating > 0
              ? product.rating.toFixed(1)
              : "New"}
          </span>

          {product.reviewCount > 0 && (
            <span className="text-xs text-gray-400">
              ({product.reviewCount})
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-base font-black">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* View Product */}
        <Link
          href={`/product/${product.slug}`}
          className="
            mt-4 flex w-full
            items-center justify-center
            rounded-xl
            border border-black/10
            bg-white/80
            px-4 py-2.5
            text-xs font-bold
            transition-all duration-300

            /* Mobile */
            opacity-100

            /* Desktop */
            md:translate-y-2
            md:opacity-0
            md:group-hover:translate-y-0
            md:group-hover:opacity-100

            hover:bg-black
            hover:text-white
          "
        >
          View Product
        </Link>
      </div>
    </article>
  );
}