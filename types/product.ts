export type ProductCategory = "shoes" | "watches";

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;

  price: number;
  originalPrice?: number;

  rating: number;
  reviewCount: number;

  images: string[];

  description: string;

  options: ProductOption[];

  badge?: "NEW" | "POPULAR";

  inStock: boolean;
}