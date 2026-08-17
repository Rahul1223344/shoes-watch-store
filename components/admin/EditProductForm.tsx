"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ImagePlus,
  Star,
  Trash2,
} from "lucide-react";

import {
  updateProduct,
} from "@/app/admin/(dashboard)/products/actions";

import ProductOptions, {
  ProductOption,
} from "./ProductOptions";

import {
  getProductImageUrl,
} from "@/lib/supabase/productImageUrl";

import ProductImageUploader, {
  ProductImageFile,
} from "./ProductImageUploader";

import { createClient } from "@/lib/supabase/client";

import {
  deleteProductImage,
} from "@/lib/supabase/uploadProductImages";

import {
  uploadProductImages,
  saveProductImageRecords,
} from "@/lib/supabase/uploadProductImages";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ExistingImage = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
};

type EditProductFormProps = {
  product: {
    id: string;
    name: string;
    brand: string | null;
    category_id: string;
    description: string;
    price: number;
    compare_at_price: number | null;
    is_new: boolean;
    is_featured: boolean;
    is_active: boolean;
    seo_title: string | null;
    seo_description: string | null;
  };

  categories: Category[];

  options: ProductOption[];

  images: ExistingImage[];
};

export default function EditProductForm({
  product,
  categories,
  options: initialOptions,
  images: initialImages,
}: EditProductFormProps) {
  const router = useRouter();

  // --------------------------------
  // Product fields
  // --------------------------------

  const [name, setName] = useState(
    product.name
  );

  const [brand, setBrand] = useState(
    product.brand ?? ""
  );

  const [categoryId, setCategoryId] =
    useState(product.category_id);

  const [description, setDescription] =
    useState(product.description);

  const [price, setPrice] = useState(
    String(product.price)
  );

  const [compareAtPrice, setCompareAtPrice] =
    useState(
      product.compare_at_price !== null
        ? String(product.compare_at_price)
        : ""
    );

  // --------------------------------
  // Product status
  // --------------------------------

  const [isNew, setIsNew] = useState(
    product.is_new
  );

  const [isFeatured, setIsFeatured] =
    useState(product.is_featured);

  const [isActive, setIsActive] =
    useState(product.is_active);

  // --------------------------------
  // SEO
  // --------------------------------

  const [seoTitle, setSeoTitle] =
    useState(product.seo_title ?? "");

  const [seoDescription, setSeoDescription] =
    useState(
      product.seo_description ?? ""
    );

  // --------------------------------
  // Options
  // --------------------------------

  const [options, setOptions] =
    useState<ProductOption[]>(
      initialOptions
    );

  // --------------------------------
  // Existing images
  // --------------------------------

  const [images, setImages] =
  useState<ExistingImage[]>(
    [...initialImages].sort(
      (a, b) =>
        a.sort_order - b.sort_order
    )
  );
   
  // -------------------------------
   const [deletedImages, setDeletedImages] =
  useState<ExistingImage[]>([]);
   
  // --------------------------------
  // UI state
  // --------------------------------

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

//----------------------------------------
  const [newImages, setNewImages] =
  useState<ProductImageFile[]>([]);


  //---------------------------------------

  const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

 // ------------------------------------------------

  // --------------------------------
  // Delete existing image from UI
  // --------------------------------

function removeImage(imageId: string) {
  setImages((currentImages) => {
    if (currentImages.length <= 1) {
      setError(
        "A product must have at least one image."
      );

      return currentImages;
    }

    const imageToDelete =
      currentImages.find(
        (image) => image.id === imageId
      );

    if (imageToDelete) {
      setDeletedImages((current) => [
        ...current,
        imageToDelete,
      ]);
    }

    return currentImages.filter(
      (image) => image.id !== imageId
    );
  });
}

  // --------------------------------
  // Set primary image
  // --------------------------------

 function setPrimaryImage(
  imageId: string
) {
  setImages((currentImages) => {
    const selectedImage =
      currentImages.find(
        (image) => image.id === imageId
      );

    if (!selectedImage) {
      return currentImages;
    }

    const remainingImages =
      currentImages.filter(
        (image) => image.id !== imageId
      );

    return [
      selectedImage,
      ...remainingImages,
    ].map((image, index) => ({
      ...image,
      sort_order: index,
    }));
  });
}
  // --------------------------------
  // Submit
  // --------------------------------

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      // ------------------------------
      // Validate category
      // ------------------------------

      if (!categoryId) {
        setError(
          "Please select a category."
        );

        return;
      }

      // ------------------------------
      // Convert prices
      // ------------------------------

      const numericPrice =
        Number(price);

      const numericCompareAtPrice =
        compareAtPrice.trim()
          ? Number(compareAtPrice)
          : null;

      // ------------------------------
      // Clean options
      // ------------------------------

      const cleanedOptions =
        options
          .map((option) => ({
            name: option.name.trim(),

            values: option.values
              .map((value) =>
                value.trim()
              )
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

      const invalidOption =
        options.some(
          (option) =>
            !option.name.trim() ||
            option.values.every(
              (value) =>
                !value.trim()
            )
        );

      if (invalidOption) {
        setError(
          "Please complete every product option."
        );

        return;
      }

      // ------------------------------
      // Update product
      // ------------------------------
const result =
  await updateProduct({
    productId: product.id,

    name,
    brand,
    categoryId,
    description,

    price: numericPrice,
    compareAtPrice:
      numericCompareAtPrice,

    options: cleanedOptions,

    isNew,
    isFeatured,
    isActive,

    seoTitle,
    seoDescription,
  });

if (result.success === false) {
  setError(result.error);
  return;
}

// --------------------------------
// Image synchronization
// --------------------------------

const supabase = createClient();

// Delete removed images
for (const image of deletedImages) {
  const deleteResult =
    await deleteProductImage(
      supabase,
      image.id,
      image.storage_path
    );

  if (!deleteResult.success) {
    setError(deleteResult.error);
    return;
  }
}

// Recalculate image order
const orderedImages =
  images.map((image, index) => ({
    ...image,
    sort_order: index,
  }));

// Save existing image order
for (const image of orderedImages) {
  const { error: imageUpdateError } =
    await supabase
      .from("product_images")
      .update({
        sort_order: image.sort_order,
      })
      .eq("id", image.id);

  if (imageUpdateError) {
    console.error(
      "Image order update error:",
      imageUpdateError
    );

    setError(
      "Product updated, but image order could not be saved."
    );

    return;
  }
}

// Upload new images
if (newImages.length > 0) {
  const uploadResult =
    await uploadProductImages(
      supabase,
      product.id,
      newImages.map((image, index) => ({
        file: image.file,
        sortOrder:
          orderedImages.length + index,
        isPrimary: false,
      }))
    );

  if (!uploadResult.success) {
    setError(uploadResult.error);
    return;
  }

  const saveImagesResult =
    await saveProductImageRecords(
      supabase,
      product.id,
      uploadResult.images.map(
        (image) => ({
          path: image.path,
          sortOrder: image.sortOrder,
          isPrimary: false,
        })
      )
    );

  if (!saveImagesResult.success) {
    setError(
      saveImagesResult.error
    );

    return;
  }
}

// --------------------------------
// Done
// --------------------------------

router.push("/admin/products");
router.refresh();
    } catch (error) {
      console.error(
        "Unexpected product update error:",
        error
      );

      setError(
        "Something went wrong while updating the product."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-5xl space-y-6"
    >
      {/* -------------------------------- */}
      {/* Basic Information */}
      {/* -------------------------------- */}

      <section className="rounded-3xl border border-black/5 bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">
        <div className="mb-6">
          <h2 className="text-lg font-black">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update the main information about this product.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">

          {/* Product name */}

          <div className="sm:col-span-2">
            <label
              htmlFor="product-name"
              className="mb-2 block text-sm font-semibold"
            >
              Product Name
            </label>

            <input
              id="product-name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </div>

          {/* Brand */}

          <div>
            <label
              htmlFor="brand"
              className="mb-2 block text-sm font-semibold"
            >
              Brand
            </label>

            <input
              id="brand"
              value={brand}
              onChange={(event) =>
                setBrand(event.target.value)
              }
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </div>

          {/* Category */}

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-semibold"
            >
              Category
            </label>

            <select
              id="category"
              value={categoryId}
              onChange={(event) =>
                setCategoryId(
                  event.target.value
                )
              }
              required
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
            >
              <option value="">
                Select category
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Description */}

          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              required
              rows={5}
              className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </div>

        </div>
      </section>

      {/* -------------------------------- */}
      {/* Existing Images */}
      {/* -------------------------------- */}

      <section className="rounded-3xl border border-black/5 bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">

        <div className="mb-6">
          <h2 className="text-lg font-black">
            Product Images
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage the existing product images.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 bg-gray-50 p-8 text-center">
            <ImagePlus
              className="mx-auto text-gray-400"
              size={28}
            />

            <p className="mt-3 text-sm font-semibold">
              No product images
            </p>

            <p className="mt-1 text-xs text-gray-400">
              New image upload will be added next.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map(
              (image, index) => (
                <div
                  key={image.id}
                  className="group relative overflow-hidden rounded-2xl border border-black/5 bg-gray-100"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={getProductImageUrl(
                              supabaseUrl,
                             image.storage_path
                           )}
                      alt={
                        image.alt_text ||
                        `${name} product image ${
                          index + 1
                        }`
                      }
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Primary badge */}

                  {index === 0 && (
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-black px-2.5 py-1 text-[10px] font-bold text-white">
                      <Star
                         size={11}
                         fill="currentColor"
                         />
                     Primary
                    </div>
                  )}

                  {/* Image controls */}

                  <div className="absolute inset-x-2 bottom-2 flex gap-2 opacity-0 transition group-hover:opacity-100">

                    {index !== 0 && (
                      <button
                         type="button"
                         onClick={() =>
                                     setPrimaryImage(image.id)
                                  }
                         className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-white/95 px-2 py-2 text-[11px] font-bold shadow-sm"
                         >
                          <Star size={13} />
                          Primary
                        </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(
                          image.id
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-red-500 shadow-sm"
                      aria-label="Delete image"
                    >
                      <Trash2 size={14} />
                    </button>

                  </div>
                </div>
              )
            )}
          </div>
        )}

      </section>

      {/* upload new image */}

      <div className="mt-8">
           <ProductImageUploader
            images={newImages}
            onChange={setNewImages}
            />
    </div>

      {/* -------------------------------- */}
      {/* Pricing */}
      {/* -------------------------------- */}

      <section className="rounded-3xl border border-black/5 bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">

        <div className="mb-6">
          <h2 className="text-lg font-black">
            Pricing
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">

          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-semibold"
            >
              Selling Price
            </label>

            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) =>
                setPrice(
                  event.target.value
                )
              }
              required
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div>
            <label
              htmlFor="compare-price"
              className="mb-2 block text-sm font-semibold"
            >
              Original Price
            </label>

            <input
              id="compare-price"
              type="number"
              min="0"
              step="0.01"
              value={compareAtPrice}
              onChange={(event) =>
                setCompareAtPrice(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </div>

        </div>
      </section>

      {/* -------------------------------- */}
      {/* Options */}
      {/* -------------------------------- */}

      <section className="rounded-3xl border border-black/5 bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">

        <div className="mb-6">
          <h2 className="text-lg font-black">
            Product Options
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage sizes, colors and other variations.
          </p>
        </div>

        <ProductOptions
          options={options}
          onChange={setOptions}
        />

      </section>

      {/* -------------------------------- */}
      {/* Status */}
      {/* -------------------------------- */}

      <section className="rounded-3xl border border-black/5 bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">

        <div className="mb-6">
          <h2 className="text-lg font-black">
            Product Status
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/5 bg-white p-4">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) =>
                setIsActive(
                  event.target.checked
                )
              }
              className="h-4 w-4"
            />

            <span className="text-sm font-semibold">
              Active
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/5 bg-white p-4">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(event) =>
                setIsNew(
                  event.target.checked
                )
              }
              className="h-4 w-4"
            />

            <span className="text-sm font-semibold">
              New Arrival
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/5 bg-white p-4">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(event) =>
                setIsFeatured(
                  event.target.checked
                )
              }
              className="h-4 w-4"
            />

            <span className="text-sm font-semibold">
              Featured
            </span>
          </label>

        </div>
      </section>

      {/* -------------------------------- */}
      {/* SEO */}
      {/* -------------------------------- */}

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

          <div>
            <label
              htmlFor="seo-title"
              className="mb-2 block text-sm font-semibold"
            >
              SEO Title
            </label>

            <input
              id="seo-title"
              value={seoTitle}
              maxLength={60}
              onChange={(event) =>
                setSeoTitle(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {seoTitle.length}/60
            </p>
          </div>

          <div>
            <label
              htmlFor="seo-description"
              className="mb-2 block text-sm font-semibold"
            >
              SEO Description
            </label>

            <textarea
              id="seo-description"
              value={seoDescription}
              maxLength={160}
              rows={4}
              onChange={(event) =>
                setSeoDescription(
                  event.target.value
                )
              }
              className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {seoDescription.length}/160
            </p>
          </div>

        </div>
      </section>

      {/* -------------------------------- */}
      {/* Error */}
      {/* -------------------------------- */}

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* -------------------------------- */}
      {/* Actions */}
      {/* -------------------------------- */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/products"
            )
          }
          disabled={loading}
          className="rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-bold transition hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving changes..."
            : "Save Changes"}
        </button>

      </div>
    </form>
  );
}