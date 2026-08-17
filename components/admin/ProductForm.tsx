"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import ProductOptions, {
  ProductOption,
} from "./ProductOptions";
import { useRouter } from "next/navigation";
import {
  createProduct,
} from "@/app/admin/(dashboard)/products/actions";
import ProductImageUploader, {
  ProductImageFile,
} from "./ProductImageUploader";

import { createClient } from "@/lib/supabase/client";

import {
  uploadProductImages,
  saveProductImageRecords,
} from "@/lib/supabase/uploadProductImages";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ProductFormProps = {
  categories: Category[];
};

export default function ProductForm({
  categories,
}: ProductFormProps) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] =
    useState("");

  const [isNew, setIsNew] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [options, setOptions] = useState<
  ProductOption[]
>([]);
  const [images, setImages] = useState<
  ProductImageFile[]
>([]);

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

async function handleSubmit(
  event: SubmitEvent<HTMLFormElement>
) {
  event.preventDefault();

  setError("");
  setLoading(true);

  try {
    // ------------------------------
    // Clean options
    // ------------------------------

    const cleanedOptions = options
      .map((option) => ({
        name: option.name.trim(),

        values: option.values
          .map((value) => value.trim())
          .filter(Boolean),
      }))
      .filter(
        (option) =>
          option.name &&
          option.values.length > 0
      );

    // ------------------------------
    // Validate options
    // ------------------------------

    if (options.length > 0) {
      const invalidOption = options.some(
        (option) =>
          !option.name.trim() ||
          option.values.every(
            (value) => !value.trim()
          )
      );

      if (invalidOption) {
        setError(
          "Please complete every product option before saving."
        );

        return;
      }
    }

    // ------------------------------
    // Validate category
    // ------------------------------

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    // ------------------------------
    // Convert prices
    // ------------------------------

    const numericPrice = Number(price);

    const numericComparePrice =
      compareAtPrice.trim()
        ? Number(compareAtPrice)
        : null;

    // ------------------------------
    // Send to server
    // ------------------------------

    const result = await createProduct({
      name,
      brand,
      categoryId,
      description,
      price: numericPrice,
      compareAtPrice: numericComparePrice,
      options: cleanedOptions,
      isNew,
      isFeatured,
      isActive,
      seoTitle,
      seoDescription,
    });

    // ------------------------------
    // Handle error
    // ------------------------------

    if (result.success === false) {
  setError(result.error);
  return;
}

const productId = result.productId;

const supabase = createClient();
if (images.length > 0) {
  const uploadResult =
    await uploadProductImages(
      supabase,
      productId,
      images.map((image, index) => ({
        file: image.file,
        sortOrder: index,
        isPrimary: index === 0,
      }))
    );

  if (!uploadResult.success) {
    setError(uploadResult.error);
    return;
  }

  const saveImagesResult =
  await saveProductImageRecords(
    supabase,
    productId,
    uploadResult.images.map((image) => ({
      path: image.path,
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
    }))
  );
  if (!saveImagesResult.success) {
    setError(saveImagesResult.error);
    return;
  }
}
router.push("/admin/products");
router.refresh();
  } catch (error) {
    console.error(
      "Unexpected product creation error:",
      error
    );

    setError(
      "Something went wrong while creating the product."
    );
  } finally {
    setLoading(false);
  }
}
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* form sections will go here */}
      {/* Basic information */}
      <section className="rounded-3xl border border-black/5 bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">

  <div className="mb-6">
    <h2 className="text-lg font-black">
      Basic Information
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Basic information customers will see about this product.
    </p>
  </div>

  <div className="grid gap-5 md:grid-cols-2">

    {/* Product Name */}
    <div className="md:col-span-2">
      <label
        htmlFor="name"
        className="mb-2 block text-sm font-bold"
      >
        Product Name
      </label>

      <input
        id="name"
        type="text"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
        required
        placeholder="Premium White Running Shoes"
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
      />
    </div>

    {/* Brand */}
    <div>
      <label
        htmlFor="brand"
        className="mb-2 block text-sm font-bold"
      >
        Brand
      </label>

      <input
        id="brand"
        type="text"
        value={brand}
        onChange={(event) =>
          setBrand(event.target.value)
        }
        placeholder="Nike"
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
      />
    </div>

    {/* Category */}
    <div>
      <label
        htmlFor="category"
        className="mb-2 block text-sm font-bold"
      >
        Category
      </label>

      <select
        id="category"
        value={categoryId}
        onChange={(event) =>
          setCategoryId(event.target.value)
        }
        required
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
      >
        <option value="">
          Select category
        </option>

        {categories.map((category) => (
          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>
        ))}
      </select>
    </div>

    {/* Description */}
    <div className="md:col-span-2">
      <label
        htmlFor="description"
        className="mb-2 block text-sm font-bold"
      >
        Description
      </label>

      <textarea
        id="description"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        required
        rows={6}
        placeholder="Describe the product, material, comfort, style and other important details..."
        className="w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
      />
    </div>

  </div>

</section>
       
      {/* Product Images */}
      <ProductImageUploader
  images={images}
  onChange={setImages}
/>
      {/* pricing */}
      <section className="rounded-3xl border border-black/5 bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">

  <div className="mb-6">
    <h2 className="text-lg font-black">
      Pricing
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Set the selling price and optional original price.
    </p>
  </div>

  <div className="grid gap-5 md:grid-cols-2">

    {/* Price */}
    <div>
      <label
        htmlFor="price"
        className="mb-2 block text-sm font-bold"
      >
        Selling Price
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
          ₹
        </span>

        <input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(event) =>
            setPrice(event.target.value)
          }
          required
          placeholder="1999"
          className="w-full rounded-xl border border-black/10 bg-white py-3 pl-9 pr-4 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
        />
      </div>
    </div>

    {/* Compare price */}
    <div>
      <label
        htmlFor="compareAtPrice"
        className="mb-2 block text-sm font-bold"
      >
        Original Price
        <span className="ml-2 font-normal text-gray-400">
          Optional
        </span>
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
          ₹
        </span>

        <input
          id="compareAtPrice"
          type="number"
          min="0"
          step="0.01"
          value={compareAtPrice}
          onChange={(event) =>
            setCompareAtPrice(event.target.value)
          }
          placeholder="2499"
          className="w-full rounded-xl border border-black/10 bg-white py-3 pl-9 pr-4 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
        />
      </div>

      <p className="mt-2 text-xs text-gray-400">
        Used to display the discount/original price.
      </p>
    </div>

  </div>

</section>
      {/* product option */}
         <ProductOptions
  options={options}
  onChange={setOptions}
/> 
      {/* product status */}
         <section className="rounded-3xl border border-black/5 bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">

  <div className="mb-6">
    <h2 className="text-lg font-black">
      Product Status
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Control how this product appears on the website.
    </p>
  </div>

  <div className="grid gap-3 sm:grid-cols-3">

    {/* Active */}
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/5 bg-gray-50/70 p-4 transition hover:bg-gray-100/70">

      <input
        type="checkbox"
        checked={isActive}
        onChange={(event) =>
          setIsActive(event.target.checked)
        }
        className="mt-1 h-4 w-4"
      />

      <div>
        <p className="text-sm font-bold">
          Active
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          Show this product on the website.
        </p>
      </div>

    </label>

    {/* New */}
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/5 bg-gray-50/70 p-4 transition hover:bg-gray-100/70">

      <input
        type="checkbox"
        checked={isNew}
        onChange={(event) =>
          setIsNew(event.target.checked)
        }
        className="mt-1 h-4 w-4"
      />

      <div>
        <p className="text-sm font-bold">
          New Arrival
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          Mark this product as new.
        </p>
      </div>

    </label>

    {/* Featured */}
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/5 bg-gray-50/70 p-4 transition hover:bg-gray-100/70">

      <input
        type="checkbox"
        checked={isFeatured}
        onChange={(event) =>
          setIsFeatured(event.target.checked)
        }
        className="mt-1 h-4 w-4"
      />

      <div>
        <p className="text-sm font-bold">
          Featured
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          Highlight this product on the homepage.
        </p>
      </div>

    </label>

  </div>

</section>
      {/* SEO */}
          <section className="rounded-3xl border border-black/5 bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">

  <div className="mb-6">
    <h2 className="text-lg font-black">
      SEO
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Optimize this product for search engines.
    </p>
  </div>

  <div className="space-y-5">

    {/* SEO Title */}
    <div>
      <label
        htmlFor="seoTitle"
        className="mb-2 block text-sm font-bold"
      >
        SEO Title
      </label>

      <input
        id="seoTitle"
        type="text"
        value={seoTitle}
        onChange={(event) =>
          setSeoTitle(event.target.value)
        }
        maxLength={60}
        placeholder="Premium White Running Shoes | Your Store"
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
      />

      <p className="mt-2 text-xs text-gray-400">
        {seoTitle.length}/60 characters
      </p>
    </div>

    {/* SEO Description */}
    <div>
      <label
        htmlFor="seoDescription"
        className="mb-2 block text-sm font-bold"
      >
        SEO Description
      </label>

      <textarea
        id="seoDescription"
        value={seoDescription}
        onChange={(event) =>
          setSeoDescription(event.target.value)
        }
        maxLength={160}
        rows={4}
        placeholder="Shop premium white running shoes with comfortable design and everyday style..."
        className="w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
      />

      <p className="mt-2 text-xs text-gray-400">
        {seoDescription.length}/160 characters
      </p>
    </div>

  </div>

</section>
          {error && (
  <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
    {error}
  </div>
)}

<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

  <a
    href="/admin/products"
    className="rounded-xl border border-black/10 bg-white px-6 py-3 text-center text-sm font-bold text-gray-600 transition hover:bg-gray-50"
  >
    Cancel
  </a>

  <button
    type="submit"
    disabled={loading}
    className="rounded-xl bg-black px-7 py-3 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {loading
      ? "Saving..."
      : "Save Product"}
  </button>

</div>
    </form>
  );
}