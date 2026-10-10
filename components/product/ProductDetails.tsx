"use client";

import { useEffect, useState } from "react";
import { event } from "@/lib/fpixel";
import type { FormEvent } from "react";
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

  const [showBuyerForm, setShowBuyerForm] =
    useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [buyerMobile, setBuyerMobile] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Rajasthan");
  const [pinCode, setPinCode] = useState("");
  const country = "India";
  const paymentMethod = "COD" as const;

  const [orderLoading, setOrderLoading] =
    useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    event("ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "INR",
    });
  }, [product.id, product.name, product.price]);

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
      setError(
        "This product is currently unavailable."
      );
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

    setError("");

    event("InitiateCheckout", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      num_items: quantity,
      value: product.price * quantity,
      currency: "INR",
    });

    setShowBuyerForm(true);
  };

  const handleCompleteOrder = async (
    e : FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    const first = firstName.trim();
    const last = lastName.trim();
    const name = `${first} ${last}`.trim();
    const mobile = buyerMobile.trim();
    const streetAddress = buyerAddress.trim();
    const apartmentValue = apartment.trim();
    const cityValue = city.trim();
    const pinCodeValue = pinCode.trim();
    const address = [
      streetAddress,
      apartmentValue,
      cityValue,
      state,
      pinCodeValue,
      country,
    ].filter(Boolean).join(", ");

    if (first.length < 1 || last.length < 1) {
      setError("Please enter your first and last name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (streetAddress.length < 5) {
      setError("Please enter your street address.");
      return;
    }

    if (!cityValue) {
      setError("Please enter your city.");
      return;
    }

    if (!state) {
      setError("Please select your state.");
      return;
    }

    if (!/^\d{6}$/.test(pinCodeValue)) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    setOrderLoading(true);

    const optionsText = Object.entries(
      selectedOptions
    )
      .map(
        ([name, value]) =>
          `${name}: ${value}`
      )
      .join("\n");

    const totalPrice =
      product.price * quantity;

    try {
      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            firstName: first,
            lastName: last,
            mobile,
            address,
            streetAddress,
            apartment: apartmentValue,
            city: cityValue,
            state,
            pinCode: pinCodeValue,
            country,
            paymentMethod,
            productName: product.name,
            productPrice: product.price,
            quantity,
            totalPrice,
            optionsText,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to submit your order."
        );
      }

      // This confirms an order inquiry was submitted, not a completed sale.
      event("Lead", {
        content_ids: [product.id],
        content_name: product.name,
        content_type: "product",
        num_items: quantity,
        value: totalPrice,
        currency: "INR",
      });

      setOrderLoading(false);
      setShowBuyerForm(false);
      setError("");
      setOrderSuccess(true);
    } catch (error) {
      console.error(
        "Order submission error:",
        error
      );

      setOrderLoading(false);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit your order. Please try again."
      );
    }
  };

  const handleContinueShopping = () => {
    window.location.href = "/";
  };

  return (
    <section className="px-3 py-6 sm:px-5 sm:py-10">
      <div className="mx-auto max-w-7xl">

        {/* ================= PRODUCT LAYOUT ================= */}
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">

          {/* Gallery */}
          <ProductGallery product={product} />

          {/* Information */}
          <div
            className="
              rounded-[28px]
              border border-white/80
              bg-white/65
              p-6
              shadow-[0_15px_50px_rgba(15,23,42,0.06)]
              backdrop-blur-xl
              sm:p-8
              lg:p-10
            "
          >

            {/* Category */}
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-blue-600
              "
            >
              {product.category}
            </p>

            {/* Product Name */}
            <h1
              className="
                mt-3
                text-3xl
                font-black
                tracking-tight
                sm:text-4xl
              "
            >
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
            <div
              className="
                mt-6
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
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
                <span
                  className="
                    rounded-full
                    bg-green-50
                    px-3
                    py-1
                    text-xs
                    font-bold
                    text-green-700
                  "
                >
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

            {/* Product Options */}
            <div className="space-y-6">

              {product.options.map((option) => (
                <div key={option.name}>

                  <div
                    className="
                      mb-3
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
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
                        selectedOptions[
                          option.name
                        ] === value;

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

              <div
                className="
                  inline-flex
                  items-center
                  rounded-xl
                  border
                  border-black/10
                  bg-white/70
                "
              >

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="
                    px-4
                    py-3
                    text-lg
                    transition-colors
                    hover:bg-black/5
                  "
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span
                  className="
                    min-w-10
                    text-center
                    text-sm
                    font-bold
                  "
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  className="
                    px-4
                    py-3
                    text-lg
                    transition-colors
                    hover:bg-black/5
                  "
                  aria-label="Increase quantity"
                >
                  +
                </button>

              </div>

            </div>

            {/* Error */}
            {error && (
              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-red-100
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-red-600
                "
              >
                {error}
              </div>
            )}

            {/* Order Via Email */}
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
              Buy Now
            </button>

            {/* Availability */}
            <div
              className="
                mt-5
                flex
                items-center
                justify-center
                gap-2
                text-xs
                text-gray-500
              "
            >
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

        {/* ================= PRODUCT INFORMATION ================= */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* Description */}
          <div
            className="
              rounded-[24px]
              border border-white/80
              bg-white/65
              p-6
              shadow-[0_10px_40px_rgba(15,23,42,0.05)]
              backdrop-blur-xl
              sm:p-8
            "
          >
            <h2 className="text-xl font-black">
              Product Details
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              {product.description}
            </p>
          </div>

          {/* Basic Information */}
          <div
            className="
              rounded-[24px]
              border border-white/80
              bg-white/65
              p-6
              shadow-[0_10px_40px_rgba(15,23,42,0.05)]
              backdrop-blur-xl
              sm:p-8
            "
          >
            <h2 className="text-xl font-black">
              Product Information
            </h2>

            <div className="mt-5 space-y-4">

              <div
                className="
                  flex
                  justify-between
                  border-b
                  border-black/5
                  pb-3
                "
              >
                <span className="text-sm text-gray-500">
                  Category
                </span>

                <span className="text-sm font-semibold capitalize">
                  {product.category}
                </span>
              </div>

              <div
                className="
                  flex
                  justify-between
                  border-b
                  border-black/5
                  pb-3
                "
              >
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

        {/* Reviews */}
        <Reviews reviews={reviews} />

        {/* ================= ORDER SUCCESS ================= */}
        {orderSuccess && (
          <div className="fixed inset-0 z-[110] overflow-y-auto bg-white px-4 py-8 sm:px-6">
            <div className="mx-auto flex min-h-full w-full max-w-2xl items-center justify-center">
              <div className="w-full">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check size={34} strokeWidth={2.5} />
                  </div>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    Order Submitted
                  </p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                    Thank you for your order!
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
                    Your order request has been sent successfully. The shopkeeper will contact you to confirm the order and delivery details.
                  </p>
                </div>

                <div className="mt-8 rounded-[24px] border border-black/5 bg-gray-50 p-5 sm:p-7">
                  <h3 className="text-lg font-black">Order details</h3>
                  <div className="mt-5 space-y-5 text-sm">
                    <div>
                      <p className="text-gray-500">Customer</p>
                      <p className="mt-1 font-semibold">{`${firstName} ${lastName}`.trim()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Mobile number</p>
                      <p className="mt-1 font-semibold">{buyerMobile}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Delivery address</p>
                      <p className="mt-1 whitespace-pre-line font-semibold leading-6">{[buyerAddress, apartment, city, state, pinCode, country].filter(Boolean).join(", ")}</p>
                    </div>
                    <div className="border-t border-black/5 pt-5">
                      <p className="text-gray-500">Product</p>
                      <p className="mt-1 font-semibold">{product.name}</p>
                      {Object.keys(selectedOptions).length > 0 && (
                        <p className="mt-2 text-gray-500">
                          {Object.entries(selectedOptions).map(([name, value]) => `${name}: ${value}`).join(" • ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between border-t border-black/5 pt-5">
                      <div>
                        <p className="text-gray-500">Quantity</p>
                        <p className="mt-1 font-semibold">{quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500">Total</p>
                        <p className="mt-1 text-xl font-black">₹{(product.price * quantity).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleContinueShopping}
                  className="mt-6 flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Continue Shopping
                </button>

                <p className="mt-5 text-center text-xs leading-5 text-gray-400">
                  Order submitted successfully. Please keep your mobile number available so the shopkeeper can contact you.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= CUSTOMER FORM MODAL ================= */}
        {showBuyerForm && (
          <div
            className="
              fixed
              inset-0
              z-[100]
              overflow-y-auto
              bg-black/40
              px-4
              py-6
              backdrop-blur-sm
              sm:py-8
            "
          >
            <div
              className="
                flex
                min-h-full
                items-center
                justify-center
              "
            >
              <div
                className="
                  w-full
                  max-w-lg
                  rounded-[28px]
                  border
                  border-white/80
                  bg-white
                  p-6
                  shadow-[0_30px_100px_rgba(15,23,42,0.2)]
                  sm:p-8
                "
              >

                {/* Header */}
                <div>
                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-blue-600
                    "
                  >
                    Order Details
                  </p>

                  <h2
                    className="
                      mt-2
                      text-2xl
                      font-black
                      tracking-tight
                    "
                  >
                    Delivery Information
                  </h2>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-gray-500
                    "
                  >
                    Please enter your details so the
                    shopkeeper can contact you and
                    confirm your order.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleCompleteOrder}
                  className="mt-6 space-y-5"
                >

                  {/* Country / Region */}
                  <div>
                    <label htmlFor="buyer-country" className="mb-2 block text-sm font-semibold">
                      Country/Region
                    </label>
                    <select
                      id="buyer-country"
                      value={country}
                      disabled
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-100"
                    >
                      <option value="India">India</option>
                    </select>
                  </div>

                  {/* First and Last Name */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="buyer-first-name" className="sr-only">First name</label>
                      <input
                        id="buyer-first-name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        autoComplete="given-name"
                        maxLength={60}
                        required
                        className="w-full min-w-0 rounded-xl border border-black/10 bg-gray-50/70 px-4 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                    <div>
                      <label htmlFor="buyer-last-name" className="sr-only">Last name</label>
                      <input
                        id="buyer-last-name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        autoComplete="family-name"
                        maxLength={60}
                        required
                        className="w-full min-w-0 rounded-xl border border-black/10 bg-gray-50/70 px-4 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label htmlFor="buyer-address" className="sr-only">Address</label>
                    <input
                      id="buyer-address"
                      type="text"
                      value={buyerAddress}
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      placeholder="Address"
                      autoComplete="address-line1"
                      maxLength={200}
                      required
                      className="w-full rounded-xl border border-black/10 bg-gray-50/70 px-4 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Apartment / Suite */}
                  <div>
                    <label htmlFor="buyer-apartment" className="sr-only">Apartment, suite, etc. (optional)</label>
                    <input
                      id="buyer-apartment"
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder="Apartment, suite, etc. (optional)"
                      autoComplete="address-line2"
                      maxLength={150}
                      className="w-full rounded-xl border border-black/10 bg-gray-50/70 px-4 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* City, State and PIN code */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label htmlFor="buyer-city" className="sr-only">City</label>
                      <input
                        id="buyer-city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        autoComplete="address-level2"
                        maxLength={80}
                        required
                        className="w-full min-w-0 rounded-xl border border-black/10 bg-gray-50/70 px-3 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                    <div>
                      <label htmlFor="buyer-state" className="sr-only">State</label>
                      <select
                        id="buyer-state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        autoComplete="address-level1"
                        required
                        className="w-full min-w-0 rounded-xl border border-black/10 bg-white px-3 py-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      >
                        <option value="">Select state</option>
                        {[
                          "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
                          "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
                          "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
                          "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
                          "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
                          "Uttar Pradesh", "Uttarakhand", "West Bengal",
                          "Andaman and Nicobar Islands", "Chandigarh",
                          "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
                          "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
                        ].map((stateName) => (
                          <option key={stateName} value={stateName}>{stateName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="buyer-pin" className="sr-only">PIN code</label>
                      <input
                        id="buyer-pin"
                        type="text"
                        inputMode="numeric"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="PIN code"
                        autoComplete="postal-code"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        required
                        className="w-full min-w-0 rounded-xl border border-black/10 bg-gray-50/70 px-3 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="buyer-mobile" className="mb-2 block text-sm font-semibold">Phone</label>
                    <input
                      id="buyer-mobile"
                      type="tel"
                      inputMode="numeric"
                      value={buyerMobile}
                      onChange={(e) => setBuyerMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit mobile number"
                      autoComplete="tel-national"
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      required
                      className="w-full rounded-xl border border-black/10 bg-gray-50/70 px-4 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Payment: COD is the only available method */}
                  <div className="pt-2">
                    <h3 className="text-xl font-semibold">Payment</h3>
                    <p className="mt-1 text-sm text-gray-500">All transactions are secure and encrypted.</p>
                    <div className="mt-4 rounded-2xl border border-blue-600 bg-blue-50/70 px-5 py-5" aria-label="Payment method: Cash on Delivery, selected">
                      <div className="flex items-center gap-3">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-blue-600" aria-hidden="true">
                          <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                        </span>
                        <span className="font-semibold">Cash on Delivery (COD)</span>
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div
                      className="
                        rounded-xl
                        border
                        border-red-100
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-red-600
                      "
                    >
                      {error}
                    </div>
                  )}

                  {/* Buttons */}
                  <div
                    className="
                      flex
                      flex-col-reverse
                      gap-3
                      sm:flex-row
                    "
                  >

                    <button
                      type="button"
                      onClick={() => {
                        setShowBuyerForm(false);
                        setError("");
                      }}
                      disabled={orderLoading}
                      className="
                        flex-1
                        rounded-xl
                        border
                        border-black/10
                        bg-white
                        px-5
                        py-3.5
                        text-sm
                        font-bold
                        transition
                        hover:bg-gray-50
                        disabled:opacity-50
                      "
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={orderLoading}
                      className="
                        flex-1
                        rounded-xl
                        bg-black
                        px-5
                        py-3.5
                        text-sm
                        font-bold
                        text-white
                        shadow-lg
                        shadow-black/10
                        transition
                        hover:bg-blue-600
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {orderLoading
                        ? "Sending Order..."
                        : "Complete Order"}
                    </button>

                  </div>

                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}