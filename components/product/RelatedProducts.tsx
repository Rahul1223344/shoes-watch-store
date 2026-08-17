import ProductCard from "@/components/home/ProductCard";
import { Product } from "@/types/product";

interface RelatedProductsProps {
  currentProduct: Product;
  products: Product[];
}

export default function RelatedProducts({
  currentProduct,
  products,
}: RelatedProductsProps) {
  const relatedProducts = products
    .filter(
      (product) =>
        product.category === currentProduct.category &&
        product.id !== currentProduct.id
    )
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">

      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          You May Also Like
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-tight">
          Related Products
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

    </section>
  );
}