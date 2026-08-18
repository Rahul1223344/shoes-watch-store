"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2 } from "lucide-react";

export type ProductImageFile = {
  id: string;
  file: File;
  preview: string;
};

type ProductImageUploaderProps = {
  images: ProductImageFile[];
  onChange: (images: ProductImageFile[]) => void;
};

export default function ProductImageUploader({
  images,
  onChange,
}: ProductImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState("");

  function handleFiles(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setError("");

    const files = Array.from(
      event.target.files ?? []
    );

    if (!files.length) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const invalidType = files.some(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidType) {
      setError(
        "Only JPG, PNG and WebP images are allowed."
      );

      return;
    }

    const maxSize = 5 * 1024 * 1024;

    const tooLarge = files.some(
      (file) => file.size > maxSize
    );

    if (tooLarge) {
      setError(
        "Each image must be smaller than 5 MB."
      );

      return;
    }

    const remainingSlots = 6 - images.length;

    if (files.length > remainingSlots) {
      setError(
        `You can upload up to 6 images per product.`
      );

      return;
    }

    const newImages: ProductImageFile[] =
      files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      }));

    onChange([
      ...images,
      ...newImages,
    ]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removeImage(id: string) {
    const image = images.find(
      (item) => item.id === id
    );

    if (image) {
      URL.revokeObjectURL(image.preview);
    }

    onChange(
      images.filter((item) => item.id !== id)
    );
  }

  return (
    <section className="rounded-3xl border border-black/5 bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">

      <div className="mb-6">
        <h2 className="text-lg font-black">
          Product Images
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Upload up to 6 high-quality product images.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/10 bg-gray-50/70 px-5 py-10 text-center transition hover:border-black/20 hover:bg-gray-100/70"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
          <ImagePlus
            size={22}
            className="text-gray-600"
          />
        </div>

        <p className="mt-4 text-sm font-bold">
          Choose product images
        </p>

        <p className="mt-1 text-xs text-gray-400">
          JPG, PNG or WebP · Maximum 5 MB each
        </p>

        <p className="mt-2 text-xs font-semibold text-blue-600">
          {images.length}/6 images selected
        </p>
      </button>

      {error && (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-2xl border border-black/5 bg-gray-100"
            >
              <div className="relative aspect-square">
                <Image
                  src={image.preview}
                  alt={`Product image ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              {index === 0 && (
                <div className="absolute left-2 top-2 rounded-lg bg-black px-2.5 py-1 text-[10px] font-bold text-white">
                  Primary
                </div>
              )}

              <button
  type="button"
  onClick={() => removeImage(image.id)}
  className="
    absolute right-2 top-2
    flex h-8 w-8
    items-center justify-center
    rounded-lg
    bg-white/90
    text-red-500
    shadow-sm
    transition
    opacity-100
    sm:opacity-0
    sm:group-hover:opacity-100
  "
  aria-label="Remove image"
>
  <Trash2 size={14} />
</button>
            </div>
          ))}
        </div>
      )}

    </section>
  );
}