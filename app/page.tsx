import CategoryCards from "@/components/home/CategoryCards";
import Hero from "@/components/home/Hero";
import ProductSection from "@/components/home/ProductSection";
import TrustFeatures from "@/components/home/TrustFeatures";

import {
  getHomeProducts,
} from "@/lib/supabase/productQueries";
import Footer from "@/components/layout/Footer";

export default async function Home() {
  const products =
    await getHomeProducts();

  return (
    <main>
      <Hero />

      <CategoryCards />

      <TrustFeatures />

      <ProductSection
        id="shoes"
        title="Shoes"
        subtitle="Step into comfort, style and confidence."
        category="shoes"
        products={products}
      />

      <ProductSection
        id="watches"
        title="Watches"
        subtitle="Timeless designs made for every occasion."
        category="watches"
        products={products}
      />
      <Footer />
    </main>
  );
}