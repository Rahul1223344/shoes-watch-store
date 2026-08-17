import type { SupabaseClient } from "@supabase/supabase-js";

export type UploadProductImage = {
  file: File;
  sortOrder: number;
  isPrimary: boolean;
};

const BUCKET = "product-images";

export async function uploadProductImages(
  supabase: SupabaseClient,
  productId: string,
  images: UploadProductImage[]
) {
  const uploaded: {
    path: string;
    publicUrl: string;
    sortOrder: number;
    isPrimary: boolean;
  }[] = [];

  try {
    for (const image of images) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(image.file.type)) {
        throw new Error(
          "Unsupported image type."
        );
      }

      if (image.file.size > 5 * 1024 * 1024) {
        throw new Error(
          "Image exceeds the 5 MB limit."
        );
      }

      const extension =
        image.file.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      const fileName =
        `${crypto.randomUUID()}.${extension}`;

      const path =
        `${productId}/${fileName}`;

      const { error: uploadError } =
        await supabase.storage
          .from(BUCKET)
          .upload(path, image.file, {
            cacheControl: "31536000",
            upsert: false,
            contentType: image.file.type,
          });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: publicUrlData,
      } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path);

      uploaded.push({
        path,
        publicUrl: publicUrlData.publicUrl,
        sortOrder: image.sortOrder,
        isPrimary: image.isPrimary,
      });
    }

    return {
      success: true as const,
      images: uploaded,
    };
  } catch (error) {
    console.error(
      "Product image upload error:",
      error
    );

    if (uploaded.length > 0) {
      await supabase.storage
        .from(BUCKET)
        .remove(
          uploaded.map(
            (image) => image.path
          )
        );
    }

    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Unable to upload product images.",
    };
  }
}

export async function saveProductImageRecords(
  supabase: SupabaseClient,
  productId: string,
  images: {
    path: string;
    sortOrder: number;
    isPrimary: boolean;
  }[]
) {
  if (images.length === 0) {
    return {
      success: true as const,
    };
  }

  const rows = images.map((image) => ({
    product_id: productId,
    storage_path: image.path,
    sort_order: image.sortOrder,
  }));

  const { error } = await supabase
    .from("product_images")
    .insert(rows);

  if (error) {
    console.error(
      "Product image records error:",
      JSON.stringify(error, null, 2)
    );

    return {
      success: false as const,
      error:
        `Image database error: ${error.message}`,
    };
  }

  return {
    success: true as const,
  };
}

export async function deleteProductImage(
  supabase: SupabaseClient,
  imageId: string,
  storagePath: string
) {
  // Delete Storage object first.
  const { error: storageError } =
    await supabase.storage
      .from(BUCKET)
      .remove([storagePath]);

      

  if (storageError) {
    console.error(
      "Storage image deletion error:",
      storageError
    );

    return {
      success: false as const,
      error:
        "Unable to delete the image from storage.",
    };
  }

  // Delete database record.
  const { error: databaseError } =
    await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);

  if (databaseError) {
    console.error(
      "Product image record deletion error:",
      databaseError
    );

    return {
      success: false as const,
      error:
        "Image was removed from storage but its database record could not be deleted.",
    };
  }

  return {
    success: true as const,
  };
}