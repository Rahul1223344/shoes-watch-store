import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full">
      <div className="relative w-full overflow-hidden">

        {/* =====================================================
            DESKTOP HERO
        ===================================================== */}

        <div className="relative hidden w-full md:block">

          <img
            src="/images/hero/hero-desktop.png"
            alt="Lakshay Fashion Collection - Shoes and Watches"
            className="block h-auto w-full"
          />

          {/* SHOP WATCHES */}
          <a
  href="#watches"
  aria-label="Shop Watches"
  className="absolute z-20 block cursor-pointer"
  style={{
    left: "8.3%",
    top: "70.4%",
    width: "15.7%",
    height: "9%",
  }}
/>

<a
  href="#shoes"
  aria-label="Shop Shoes"
  className="absolute z-20 block cursor-pointer"
  style={{
    left: "25.6%",
    top: "70.4%",
    width: "13.4%",
    height: "9%",
  }}
/>
        </div>


        {/* =====================================================
            MOBILE HERO
        ===================================================== */}

        <div className="relative block w-full md:hidden">

          <img
            src="/images/hero/hero-mobile.png"
            alt="Lakshay Fashion Collection - Shoes and Watches"
            className="block h-auto w-full"
          />

          {/* SHOP WATCHES */}
          <a
  href="#watches"
  aria-label="Shop Watches"
  className="absolute z-20 block cursor-pointer"
  style={{
    left: "7%",
    top: "34.5%",
    width: "36.5%",
    height: "5%",
  }}
/>

<a
  href="#shoes"
  aria-label="Shop Shoes"
  className="absolute z-20 block cursor-pointer"
  style={{
    left: "7%",
    top: "40.7%",
    width: "36.5%",
    height: "5%",
  }}
/>

        </div>

      </div>
    </section>
  );
}