import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";

import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const primaryImage = product.images[0];

  return (
    <article className="group relative overflow-hidden rounded-[22px] border border-black/5 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">

      {/* Product Image */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden rounded-t-[22px] bg-[#f7f7f7]"
      >
        {/* Badge */}
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {product.badge}
          </span>
        )}

        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105 sm:p-8"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              No Image
            </span>
          </div>
        )}

        {/* Hover Arrow */}
        <div className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={17} />
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 sm:p-5">

        {/* Product Name */}
        <Link
          href={`/product/${product.slug}`}
          className="block"
        >
          <h3 className="line-clamp-2 text-sm font-bold leading-5 transition-colors hover:text-blue-600 sm:text-[15px]">
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

        {/* CTA */}
        <Link
          href={`/product/${product.slug}`}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-gray-800"
        >
          View Product
        </Link>

      </div>
    </article>
  );
}