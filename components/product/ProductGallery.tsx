"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types/product";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({
  product,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = product.images[activeIndex];

  return (
    <div className="rounded-[28px] border border-white/80 bg-white/65 p-3 shadow-[0_15px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-5">

      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-[22px] bg-gradient-to-br from-gray-50 via-white to-gray-100">

        {activeImage ? (
          <Image
            src={activeImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-contain p-6 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-gray-400">
              No image available
            </span>
          </div>
        )}

        {/* Image counter */}
        <div className="absolute bottom-4 right-4 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-gray-500 shadow-sm backdrop-blur-md">
          {activeIndex + 1} / {product.images.length}
        </div>

      </div>

      {/* Thumbnails */}
      {product.images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">

          {product.images.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1}`}
                className={`
                  relative aspect-square overflow-hidden rounded-xl
                  border transition-all
                  ${
                    isActive
                      ? "border-black ring-1 ring-black"
                      : "border-black/5 hover:border-black/20"
                  }
                `}
              >
                <Image
                  src={image}
                  alt={`${product.name} image ${index + 1}`}
                  fill
                  sizes="120px"
                  className="object-contain bg-gray-50 p-2"
                />
              </button>
            );
          })}

        </div>
      )}

    </div>
  );
}