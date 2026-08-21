"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

type SearchProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  price: number;
  compareAtPrice?: number;
  category?: string;
  image: string | null;
  badge?: "NEW" | "POPULAR";
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [searchResults, setSearchResults] =
    useState<SearchProduct[]>([]);

  const [searchLoading, setSearchLoading] =
    useState(false);

  /*
   * Search products
   */
  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const query = searchQuery.trim();

    if (query.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const controller =
      new AbortController();

    const timeout = window.setTimeout(
      async () => {
        try {
          setSearchLoading(true);

          const response = await fetch(
            `/api/products/search?q=${encodeURIComponent(
              query
            )}`,
            {
              signal: controller.signal,
            }
          );

          if (!response.ok) {
            throw new Error(
              "Search request failed."
            );
          }

          const data: {
            products: SearchProduct[];
          } = await response.json();

          setSearchResults(
            data.products ?? []
          );
        } catch (error) {
          if (
            error instanceof DOMException &&
            error.name === "AbortError"
          ) {
            return;
          }

          console.error(
            "Product search error:",
            error
          );

          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      },
      300
    );

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery, searchOpen]);

  /*
   * Open search
   */
  const openSearch = () => {
    setSearchOpen(true);
    setMenuOpen(false);
  };

  /*
   * Close search
   */
  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  /*
   * Close search with Escape
   */
  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [searchOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
        {/* =====================================================
            TOP INFORMATION BAR
        ===================================================== */}

        <div className="mx-auto mb-2 flex max-w-7xl items-center justify-between rounded-xl border border-black/5 bg-white/90 px-3 py-2 text-[9px] text-gray-700 shadow-sm backdrop-blur-xl sm:px-4 sm:text-[11px]">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-semibold">
              ↻ 7 DAYS EASY RETURNS
            </span>

            <span className="text-gray-300">
              |
            </span>

            <a
  href="mailto:lakshayfashioncollection@gmail.com"
  className="font-semibold transition hover:text-blue-600"
>
  EMAIL SUPPORT
</a>
          </div>

          <div className="flex items-center gap-1.5">
            <span>India</span>
            <span>🇮🇳</span>
          </div>
        </div>

        {/* =====================================================
            MAIN NAVBAR
        ===================================================== */}

        <nav className="mx-auto max-w-7xl rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6">
          <div className="flex items-center justify-between">
            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() =>
                setMenuOpen(
                  (prev) => !prev
                )
              }
              className="rounded-full p-2 transition hover:bg-black/5 md:hidden"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center"
            >
              <Image
                src="/images/lakshay-logo.png"
                alt="Lakshay Fashion Collection"
                width={200}
                height={60}
                priority
                className="h-10 w-auto max-w-[170px] object-contain sm:h-12 sm:max-w-[200px]"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 md:flex">
              <a
                href="#shoes"
                className="text-sm font-medium transition-opacity hover:opacity-60"
              >
                Shoes
              </a>

              <a
                href="#watches"
                className="text-sm font-medium transition-opacity hover:opacity-60"
              >
                Watches
              </a>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                type="button"
                onClick={openSearch}
                className="rounded-full p-2 transition hover:bg-black/5"
                aria-label="Search products"
                aria-expanded={searchOpen}
              >
                <Search size={21} />
              </button>

              <a
                href="https://wa.me/917851908276"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] sm:block"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* =================================================
              MOBILE MENU
          ================================================= */}

          {menuOpen && (
            <div className="mt-4 border-t border-black/5 pt-4 md:hidden">
              <div className="flex flex-col gap-2">
                <a
                  href="#shoes"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-black/5"
                >
                  Shoes
                </a>

                <a
                  href="#watches"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-black/5"
                >
                  Watches
                </a>

                <a
  href="mailto:lakshayfashioncollection@gmail.com"
  className="mt-2 rounded-xl bg-black px-4 py-3 text-center text-sm font-semibold text-white"
>
 Order on Email 
</a>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* =====================================================
          SEARCH OVERLAY
      ===================================================== */}

      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/30 px-3 pt-3 backdrop-blur-sm sm:px-5">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl">
              {/* Search Header */}
              <div className="flex items-center gap-3 border-b border-black/5 px-4 py-3 sm:px-5">
                <Search
                  size={20}
                  className="shrink-0 text-gray-400"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(
                      event.target.value
                    )
                  }
                  autoFocus
                  placeholder="Search shoes, watches or brands..."
                  className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-gray-400"
                />

                <button
                  type="button"
                  onClick={closeSearch}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-black/5"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Content */}
              <div className="max-h-[70vh] overflow-y-auto">
                {/* Empty State */}
                {searchQuery.trim().length < 2 && (
                  <div className="px-5 py-12 text-center">
                    <Search
                      size={30}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-4 text-sm font-semibold text-gray-700">
                      Search our collection
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Search by product name or
                      brand.
                    </p>
                  </div>
                )}

                {/* Loading */}
                {searchQuery.trim().length >= 2 &&
                  searchLoading && (
                    <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
                      {Array.from({
                        length: 4,
                      }).map((_, index) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-xl p-3"
                        >
                          <div className="h-20 w-20 shrink-0 animate-pulse rounded-xl bg-gray-100" />

                          <div className="flex-1 space-y-2 pt-1">
                            <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />

                            <div className="h-3 w-2/5 animate-pulse rounded bg-gray-100" />

                            <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Results */}
                {!searchLoading &&
                  searchResults.length > 0 && (
                    <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-2">
                      {searchResults.map(
                        (product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={
                              closeSearch
                            }
                            className="flex gap-3 rounded-xl p-3 transition hover:bg-gray-50"
                          >
                            {/* Image */}
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                              {product.image ? (
                                <Image
                                  src={
                                    product.image
                                  }
                                  alt={
                                    product.name
                                  }
                                  width={80}
                                  height={80}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                  No image
                                </div>
                              )}
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1 py-1">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="line-clamp-2 text-sm font-bold text-gray-900">
                                  {
                                    product.name
                                  }
                                </h3>

                                {product.badge && (
                                  <span className="shrink-0 rounded-full bg-black px-2 py-1 text-[9px] font-bold text-white">
                                    {
                                      product.badge
                                    }
                                  </span>
                                )}
                              </div>

                              {product.brand && (
                                <p className="mt-1 text-xs text-gray-400">
                                  {
                                    product.brand
                                  }
                                </p>
                              )}

                              <p className="mt-2 text-sm font-black">
                                ₹
                                {product.price.toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>
                          </Link>
                        )
                      )}
                    </div>
                  )}

                {/* No Results */}
                {!searchLoading &&
                  searchQuery.trim()
                    .length >= 2 &&
                  searchResults.length === 0 && (
                    <div className="px-5 py-12 text-center">
                      <p className="text-sm font-semibold text-gray-700">
                        No products found
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Try another product name
                        or brand.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}