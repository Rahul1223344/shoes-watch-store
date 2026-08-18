"use client";

import { useState } from "react";
import { Star, Check, Mail } from "lucide-react";

import { Product } from "@/types/product";
import ProductGallery from "./ProductGallery";

import Reviews from "./Reviews";


import type { Review } from "@/types/review";

interface ProductDetailsProps {
  product: Product;
  reviews: Review[];
}

export default function ProductDetails({
  product,
  reviews,
}: ProductDetailsProps) {
  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>({});

  const [quantity, setQuantity] = useState(1);

  const [error, setError] = useState("");

  const handleOptionChange = (
    optionName: string,
    value: string
  ) => {
    setSelectedOptions((previous) => ({
      ...previous,
      [optionName]: value,
    }));

    setError("");
  };

  const increaseQuantity = () => {
    setQuantity((previous) => previous + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((previous) =>
      previous > 1 ? previous - 1 : 1
    );
  };

  const handleEmailOrder = () => {
  if (!product.inStock) {
    setError("This product is currently unavailable.");
    return;
  }

  const missingOption = product.options.find(
    (option) => !selectedOptions[option.name]
  );

  if (missingOption) {
    setError(
      `Please select ${missingOption.name.toLowerCase()}.`
    );
    return;
  }

  const orderEmail =
    process.env.NEXT_PUBLIC_ORDER_EMAIL;

  if (!orderEmail) {
    setError(
      "Order email is not configured yet."
    );
    return;
  }

  const optionsText =
    Object.entries(selectedOptions)
      .map(
        ([name, value]) =>
          `${name}: ${value}`
      )
      .join("\n");

  const totalPrice =
    product.price * quantity;

  const subject = encodeURIComponent(
    `New Order - ${product.name}`
  );

  const body = encodeURIComponent(
    `Hello,

I would like to place an order.

Product: ${product.name}
Price: ₹${product.price.toLocaleString("en-IN")}
Quantity: ${quantity}
Total: ₹${totalPrice.toLocaleString("en-IN")}

${optionsText}

Please contact me to confirm the order and delivery details.

Thank you.`
  );

  window.location.href =
    `mailto:${orderEmail}?subject=${subject}&body=${body}`;
};

  return (
    <section className="px-3 py-6 sm:px-5 sm:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Product layout */}
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">

          {/* Gallery */}
          <ProductGallery product={product} />

          {/* Information */}
          <div className="rounded-[28px] border border-white/80 bg-white/65 p-6 shadow-[0_15px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-8 lg:p-10">

            {/* Category */}
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              {product.category}
            </p>

            {/* Product name */}
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
           <div className="mt-4 flex items-center gap-2">

  {product.reviewCount > 0 ? (
    <>
      <div className="flex items-center gap-1">
        <Star
          size={17}
          className="fill-yellow-400 text-yellow-400"
        />

        <span className="text-sm font-bold">
          {product.rating.toFixed(1)}
        </span>
      </div>

      <span className="text-sm text-gray-400">
        ({product.reviewCount}{" "}
        {product.reviewCount === 1
          ? "review"
          : "reviews"})
      </span>
    </>
  ) : (
    <span className="text-sm text-gray-400">
      No reviews yet
    </span>
  )}

</div>

            {/* Price */}
            <div className="mt-6 flex flex-wrap items-center gap-3">

              <span className="text-3xl font-black">
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ₹
                  {product.originalPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>
              )}

              {product.originalPrice && (
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                  Save ₹
                  {(
                    product.originalPrice -
                    product.price
                  ).toLocaleString("en-IN")}
                </span>
              )}

            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-7 text-gray-600">
              {product.description}
            </p>

            <div className="my-7 h-px bg-black/5" />

            {/* Product options */}
            <div className="space-y-6">

              {product.options.map((option) => (
                <div key={option.name}>

                  <div className="mb-3 flex items-center justify-between gap-3">

                    <h2 className="text-sm font-bold">
                      {option.name}
                    </h2>

                    {selectedOptions[option.name] && (
                      <span className="text-xs text-gray-500">
                        {selectedOptions[option.name]}
                      </span>
                    )}

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {option.values.map((value) => {
                      const selected =
                        selectedOptions[option.name] ===
                        value;

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            handleOptionChange(
                              option.name,
                              value
                            )
                          }
                          className={`
                            rounded-xl
                            border
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            transition-all
                            ${
                              selected
                                ? "border-black bg-black text-white"
                                : "border-black/10 bg-white/70 hover:border-black/30"
                            }
                          `}
                        >
                          {value}
                        </button>
                      );
                    })}

                  </div>
                </div>
              ))}

            </div>

            {/* Quantity */}
            <div className="mt-7">

              <h2 className="mb-3 text-sm font-bold">
                Quantity
              </h2>

              <div className="inline-flex items-center rounded-xl border border-black/10 bg-white/70">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="px-4 py-3 text-lg transition-colors hover:bg-black/5"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="min-w-10 text-center text-sm font-bold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  className="px-4 py-3 text-lg transition-colors hover:bg-black/5"
                  aria-label="Increase quantity"
                >
                  +
                </button>

              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* WhatsApp */}
            {/* Email Order */}
<button
  type="button"
  onClick={handleEmailOrder}
  disabled={!product.inStock}
  className="
    mt-7
    flex
    w-full
    items-center
    justify-center
    gap-2
    rounded-2xl
    bg-black
    px-6
    py-4
    text-sm
    font-black
    text-white
    shadow-lg
    shadow-black/10
    transition-all
    hover:scale-[1.01]
    hover:bg-blue-600
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
>
  <Mail size={19} />
  Order via Email
</button>

            {/* Availability */}
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">

              {product.inStock ? (
                <>
                  <Check
                    size={15}
                    className="text-green-500"
                  />

                  Currently available
                </>
              ) : (
                "Currently unavailable"
              )}

            </div>

          </div>
        </div>

        {/* Product information */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* Description */}
          <div className="rounded-[24px] border border-white/80 bg-white/65 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-8">

            <h2 className="text-xl font-black">
              Product Details
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              {product.description}
            </p>

          </div>

          {/* Basic information */}
          <div className="rounded-[24px] border border-white/80 bg-white/65 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-8">

            <h2 className="text-xl font-black">
              Product Information
            </h2>

            <div className="mt-5 space-y-4">

              <div className="flex justify-between border-b border-black/5 pb-3">
                <span className="text-sm text-gray-500">
                  Category
                </span>

                <span className="text-sm font-semibold capitalize">
                  {product.category}
                </span>
              </div>

              <div className="flex justify-between border-b border-black/5 pb-3">
                <span className="text-sm text-gray-500">
                  Availability
                </span>

                <span className="text-sm font-semibold">
                  {product.inStock
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Rating
                </span>

                <span className="text-sm font-semibold">
                  ⭐ {product.rating} / 5
                </span>
              </div>

            </div>
            

          </div>
          

        </div>
        <Reviews reviews={reviews} />
      </div>
    </section>
  );
}