"use client";

import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
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
            href="https://wa.me/917851908276"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold transition hover:text-blue-600"
          >
            WHATSAPP SUPPORT
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
              setMenuOpen((prev) => !prev)
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
          <a
            href="/"
            className="flex items-center"
          >
            <img
              src="/images/lakshay-logo.png"
              alt="Lakshay Fashion Collection"
              className="h-10 w-auto max-w-[170px] object-contain sm:h-12 sm:max-w-[200px]"
            />
          </a>

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

            <button
              type="button"
              className="rounded-full p-2 transition hover:bg-black/5"
              aria-label="Search products"
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
                href="https://wa.me/917851908276"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 rounded-xl bg-black px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Order on WhatsApp
              </a>

            </div>

          </div>
        )}

      </nav>

    </header>
  );
}