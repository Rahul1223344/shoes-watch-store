"use server";

import { createClient } from "@/lib/supabase/server";

export type ProductOptionInput = {
  name: string;
  values: string[];
};

export type CreateProductInput = {
  name: string;
  brand: string;
  categoryId: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  options: ProductOptionInput[];
  isNew: boolean;
  isFeatured: boolean;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
};

type CreateProductSuccess = {
  success: true;
  productId: string;
  slug: string;
};

type CreateProductError = {
  success: false;
  error: string;
};

type CreateProductResult =
  | CreateProductSuccess
  | CreateProductError;

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createProduct(
  input: CreateProductInput
): Promise<CreateProductResult> {
  const supabase = await createClient();

  // --------------------------------
  // 1. Verify authentication
  // --------------------------------

  const { data, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !data?.claims) {
    return {
      success: false,
      error: "You are not authenticated.",
    };
  }

  const userId = data.claims.sub;

  // --------------------------------
  // 2. Verify admin
  // --------------------------------

  const { data: admin, error: adminError } =
    await supabase
      .from("admin_users")
      .select("user_id, role, is_active")
      .eq("user_id", userId)
      .maybeSingle();

  if (
    adminError ||
    !admin ||
    !admin.is_active ||
    admin.role !== "admin"
  ) {
    return {
      success: false,
      error: "You are not authorized to create products.",
    };
  }

  // --------------------------------
  // 3. Validate basic fields
  // --------------------------------

  const name = input.name.trim();
  const brand = input.brand.trim();
  const description = input.description.trim();

  if (!name) {
    return {
      success: false,
      error: "Product name is required.",
    };
  }

  if (!input.categoryId) {
    return {
      success: false,
      error: "Please select a category.",
    };
  }

  if (!description) {
    return {
      success: false,
      error: "Product description is required.",
    };
  }

  // --------------------------------
  // 4. Validate price
  // --------------------------------

  if (
    !Number.isFinite(input.price) ||
    input.price <= 0
  ) {
    return {
      success: false,
      error: "Please enter a valid selling price.",
    };
  }

  if (
    input.compareAtPrice !== null &&
    (!Number.isFinite(input.compareAtPrice) ||
      input.compareAtPrice <= 0)
  ) {
    return {
      success: false,
      error: "Please enter a valid original price.",
    };
  }

  if (
    input.compareAtPrice !== null &&
    input.compareAtPrice < input.price
  ) {
    return {
      success: false,
      error:
        "Original price should be greater than or equal to the selling price.",
    };
  }

  // --------------------------------
  // 5. Validate SEO
  // --------------------------------

  if (input.seoTitle.length > 60) {
    return {
      success: false,
      error: "SEO title cannot exceed 60 characters.",
    };
  }

  if (input.seoDescription.length > 160) {
    return {
      success: false,
      error:
        "SEO description cannot exceed 160 characters.",
    };
  }

  // --------------------------------
  // 6. Clean options
  // --------------------------------

  const cleanedOptions =
    input.options
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

  // --------------------------------
  // 7. Validate category
  // --------------------------------

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("id", input.categoryId)
    .eq("is_active", true)
    .maybeSingle();

  if (!category) {
    return {
      success: false,
      error: "Selected category is invalid.",
    };
  }

  // --------------------------------
  // 8. Create slug
  // --------------------------------

  const baseSlug = createSlug(name);

  if (!baseSlug) {
    return {
      success: false,
      error: "Unable to create product slug.",
    };
  }

  let slug = baseSlug;

  // Check whether slug already exists.
  const { data: existingProduct } =
    await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

  if (existingProduct) {
    slug = `${baseSlug}-${Date.now()}`;
  }

  // --------------------------------
  // 9. Insert product
  // --------------------------------

  const { data: product, error: productError } =
    await supabase
      .from("products")
      .insert({
        category_id: input.categoryId,
        name,
        slug,
        brand: brand || null,
        description,
        price: input.price,
        compare_at_price:
          input.compareAtPrice,
        is_featured: input.isFeatured,
        is_new: input.isNew,
        is_active: input.isActive,
        seo_title:
          input.seoTitle.trim() || null,
        seo_description:
          input.seoDescription.trim() || null,
      })
      .select("id, slug")
      .single();

  if (productError || !product) {
    console.error(
      "Product creation error:",
      productError
    );

    return {
      success: false,
      error:
        productError?.message ||
        "Unable to create product.",
    };
  }

  // --------------------------------
  // 10. Insert product options
  // --------------------------------

  if (cleanedOptions.length > 0) {
    const optionRows = cleanedOptions.map(
      (option) => ({
        product_id: product.id,
        name: option.name,
        values: option.values,
      })
    );

    const { error: optionsError } =
      await supabase
        .from("product_options")
        .insert(optionRows);

    if (optionsError) {
      console.error(
        "Product options error:",
        optionsError
      );

      // Remove product if option creation fails.
      await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      return {
        success: false,
        error:
          "Product could not be saved because its options could not be created.",
      };
    }
  }

  // --------------------------------
  // 11. Success
  // --------------------------------

  return {
    success: true,
    productId: product.id,
    slug: product.slug,
  };
}
export type UpdateProductInput = {
  productId: string;

  name: string;
  brand: string;
  categoryId: string;
  description: string;

  price: number;
  compareAtPrice: number | null;

  options: ProductOptionInput[];

  isNew: boolean;
  isFeatured: boolean;
  isActive: boolean;

  seoTitle: string;
  seoDescription: string;
};
export async function updateProduct(
  input: UpdateProductInput
): Promise<CreateProductResult> {
  const supabase = await createClient();

  // --------------------------------
  // 1. Authentication
  // --------------------------------

  const { data, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !data?.claims) {
    return {
      success: false,
      error: "You are not authenticated.",
    };
  }

  const userId = data.claims.sub;

  // --------------------------------
  // 2. Admin authorization
  // --------------------------------

  const { data: admin, error: adminError } =
    await supabase
      .from("admin_users")
      .select("user_id, role, is_active")
      .eq("user_id", userId)
      .maybeSingle();

  if (
    adminError ||
    !admin ||
    !admin.is_active ||
    admin.role !== "admin"
  ) {
    return {
      success: false,
      error: "You are not authorized.",
    };
  }

  // --------------------------------
  // 3. Validate product ID
  // --------------------------------

  if (!input.productId) {
    return {
      success: false,
      error: "Product ID is required.",
    };
  }

  // --------------------------------
  // 4. Clean fields
  // --------------------------------

  const name = input.name.trim();
  const brand = input.brand.trim();
  const description =
    input.description.trim();

  if (!name) {
    return {
      success: false,
      error: "Product name is required.",
    };
  }

  if (!input.categoryId) {
    return {
      success: false,
      error: "Please select a category.",
    };
  }

  if (!description) {
    return {
      success: false,
      error:
        "Product description is required.",
    };
  }

  // --------------------------------
  // 5. Validate price
  // --------------------------------

  if (
    !Number.isFinite(input.price) ||
    input.price <= 0
  ) {
    return {
      success: false,
      error:
        "Please enter a valid selling price.",
    };
  }

  if (
    input.compareAtPrice !== null &&
    (!Number.isFinite(input.compareAtPrice) ||
      input.compareAtPrice <= 0)
  ) {
    return {
      success: false,
      error:
        "Please enter a valid original price.",
    };
  }

  if (
    input.compareAtPrice !== null &&
    input.compareAtPrice < input.price
  ) {
    return {
      success: false,
      error:
        "Original price should be greater than or equal to the selling price.",
    };
  }

  // --------------------------------
  // 6. Validate SEO
  // --------------------------------

  if (input.seoTitle.length > 60) {
    return {
      success: false,
      error:
        "SEO title cannot exceed 60 characters.",
    };
  }

  if (input.seoDescription.length > 160) {
    return {
      success: false,
      error:
        "SEO description cannot exceed 160 characters.",
    };
  }

  // --------------------------------
  // 7. Validate category
  // --------------------------------

  const { data: category } =
    await supabase
      .from("categories")
      .select("id")
      .eq("id", input.categoryId)
      .eq("is_active", true)
      .maybeSingle();

  if (!category) {
    return {
      success: false,
      error: "Selected category is invalid.",
    };
  }

  // --------------------------------
  // 8. Check product exists
  // --------------------------------

  const { data: existingProduct } =
    await supabase
      .from("products")
      .select("id, slug")
      .eq("id", input.productId)
      .maybeSingle();

  if (!existingProduct) {
    return {
      success: false,
      error: "Product not found.",
    };
  }

  // --------------------------------
  // 9. Clean options
  // --------------------------------

  const cleanedOptions =
    input.options
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

  // --------------------------------
  // 10. Update product
  // --------------------------------

  const { error: productError } =
    await supabase
      .from("products")
      .update({
        category_id: input.categoryId,
        name,
        brand: brand || null,
        description,
        price: input.price,
        compare_at_price:
          input.compareAtPrice,
        is_featured: input.isFeatured,
        is_new: input.isNew,
        is_active: input.isActive,
        seo_title:
          input.seoTitle.trim() || null,
        seo_description:
          input.seoDescription.trim() || null,
      })
      .eq("id", input.productId);

  if (productError) {
    console.error(
      "Product update error:",
      productError
    );

    return {
      success: false,
      error:
        "Unable to update the product.",
    };
  }

  // --------------------------------
  // 11. Replace product options
  // --------------------------------

  const { error: deleteOptionsError } =
    await supabase
      .from("product_options")
      .delete()
      .eq("product_id", input.productId);

  if (deleteOptionsError) {
    console.error(
      "Option deletion error:",
      deleteOptionsError
    );

    return {
      success: false,
      error:
        "Product updated, but options could not be updated.",
    };
  }

  if (cleanedOptions.length > 0) {
    const optionRows =
      cleanedOptions.map((option) => ({
        product_id: input.productId,
        name: option.name,
        values: option.values,
      }));

    const { error: optionError } =
      await supabase
        .from("product_options")
        .insert(optionRows);

    if (optionError) {
      console.error(
        "Option update error:",
        optionError
      );

      return {
        success: false,
        error:
          "Product updated, but new options could not be saved.",
      };
    }
  }

  return {
    success: true,
    productId: input.productId,
    slug: existingProduct.slug,
  };
}