"use client";

import Link from "next/link";
import { Menu, Store } from "lucide-react";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

const links = [
  {
    name: "Overview",
    href: "/admin",
  },
  {
    name: "Products",
    href: "/admin/products",
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
  },
  {
    name: "Settings",
    href: "/admin/settings",
  },
];

export default function AdminMobileHeader() {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/admin/login";
  };

  return (
    <div className="lg:hidden">

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-black/5 bg-white/80 px-4 backdrop-blur-xl">

        <div className="flex items-center gap-2">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
            <Store size={17} />
          </div>

          <span className="text-sm font-black">
            Store Admin
          </span>

        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Open dashboard menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/5 bg-white"
        >
          <Menu size={20} />
        </button>

      </header>

      {open && (
        <div className="border-b border-black/5 bg-white px-4 py-3 shadow-lg">

          <nav className="space-y-1">

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 hover:bg-black/5 hover:text-black"
              >
                {link.name}
              </Link>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Logout
            </button>

          </nav>

        </div>
      )}

    </div>
  );
}