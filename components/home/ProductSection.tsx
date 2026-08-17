import ProductCard from "./ProductCard";
import { Product, ProductCategory } from "@/types/product";

interface ProductSectionProps {
  title: string;
  subtitle: string;
  category: ProductCategory;
  products: Product[];
  id: string;
}

export default function ProductSection({
  title,
  subtitle,
  category,
  products,
  id,
}: ProductSectionProps) {
  const categoryProducts = products.filter(
    (product) => product.category === category
  );

  return (
    <section
      id={id}
      className="px-3 py-12 sm:px-5 sm:py-16"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-7 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Collection
          </p>

          <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                {title}
              </h2>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                {subtitle}
              </p>
            </div>

            <p className="text-xs font-semibold text-gray-400">
              {categoryProducts.length}{" "}
              {categoryProducts.length === 1
                ? "Product"
                : "Products"}
            </p>
          </div>
        </div>

        {/* Products */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[22px] border border-black/5 bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <p className="text-sm font-semibold text-gray-500">
              No {title.toLowerCase()} available right now.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}