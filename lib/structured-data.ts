import { Product } from "@/types/product";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

export function createProductStructuredData(
  product: Product
) {
  const productUrl =
    `${SITE_URL}/product/${product.slug}`;

  const structuredData: Record<
    string,
    unknown
  > = {
    "@context":
      "https://schema.org",

    "@type":
      "Product",

    name:
      product.name,

    description:
      product.description,

    url:
      productUrl,

    image:
      product.images,

    offers: {
      "@type":
        "Offer",

      url:
        productUrl,

      priceCurrency:
        "INR",

      price:
        product.price,

      availability:
        product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",

      itemCondition:
        "https://schema.org/NewCondition",
    },
  };

  /* --------------------------------
     Aggregate Rating
  -------------------------------- */

  if (
    product.reviewCount > 0 &&
    product.rating > 0
  ) {
    structuredData.aggregateRating = {
      "@type":
        "AggregateRating",

      ratingValue:
        product.rating,

      reviewCount:
        product.reviewCount,

      bestRating:
        5,

      worstRating:
        1,
    };
  }

  return structuredData;
}