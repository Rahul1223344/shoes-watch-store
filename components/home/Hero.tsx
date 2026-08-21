"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const heroSlides = [
  {
    src: "/images/hero/hero-desktop1.png",
    alt: "Shree Shyam Fashion featured collection",
  },
  {
    src: "/images/hero/hero-desktop2.png",
    alt: "Shree Shyam Fashion shoes collection",
  },
  {
    src: "/images/hero/hero-desktop3.png",
    alt: "Shree Shyam Fashion new arrivals",
  },
  {
    src: "/images/hero/hero-desktop4.png",
    alt: "Shree Shyam Fashion premium shoes",
  },
];

const SLIDE_INTERVAL = 10000;

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === heroSlides.length - 1 ? 0 : prev + 1
    );
  };

  const previousSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  };

  // Auto slide
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1
      );
    }, SLIDE_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      aria-label="Featured collections"
    >
      {/* Hero */}
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={heroSlides[currentSlide].src}
          alt={heroSlides[currentSlide].alt}
          fill
          priority={currentSlide === 0}
          sizes="100vw"
          quality={75}
          className="object-cover"
        />

        {/* Previous */}
        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous slide"
          className="
            absolute left-3 top-1/2 z-20
            flex h-10 w-10
            -translate-y-1/2
            items-center justify-center
            rounded-full
            bg-white/80
            text-black
            shadow-md
            backdrop-blur-md
            transition
            hover:bg-white
            sm:left-5
            sm:h-12
            sm:w-12
          "
        >
          <ChevronLeft
            size={24}
            strokeWidth={2}
          />
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="
            absolute right-3 top-1/2 z-20
            flex h-10 w-10
            -translate-y-1/2
            items-center justify-center
            rounded-full
            bg-white/80
            text-black
            shadow-md
            backdrop-blur-md
            transition
            hover:bg-white
            sm:right-5
            sm:h-12
            sm:w-12
          "
        >
          <ChevronRight
            size={24}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Indicators */}
      <div
        className="
          absolute bottom-4 left-1/2 z-30
          flex -translate-x-1/2
          items-center gap-2
        "
      >
        {heroSlides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={
              index === currentSlide
                ? "true"
                : undefined
            }
            onClick={() => setCurrentSlide(index)}
            className={`
              h-2 rounded-full
              transition-all duration-300
              ${
                index === currentSlide
                  ? "w-7 bg-black"
                  : "w-2 bg-black/30"
              }
            `}
          />
        ))}
      </div>
    </section>
  );
}