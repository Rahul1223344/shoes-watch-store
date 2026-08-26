import type { MetadataRoute } from "next";

import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.lakshayfashioncollection.com";

  const supabase = await createClient();

  const {
    data: products,
    error,
  } = await supabase
    .from("products")
    .select(`
      slug,
      updated_at
    `)
    .eq("is_active", true);

  if (error) {
    console.error(
      "Sitemap product query error:",
      error
    );
  }

  const productUrls =
    (products ?? []).map(
      (product) => ({
        url: `${siteUrl}/product/${product.slug}`,

        lastModified:
          product.updated_at
            ? new Date(product.updated_at)
            : new Date(),

        changeFrequency: "weekly" as const,

        priority: 0.8,
      })
    );

  return [
    {
      url: siteUrl,

      lastModified: new Date(),

      changeFrequency: "daily",

      priority: 1,
    },

    ...productUrls,
  ];
}