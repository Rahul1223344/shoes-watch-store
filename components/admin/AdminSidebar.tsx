"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Settings,
  LogOut,
  Store,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const navigation = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/admin/login";
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 border-r border-black/5 bg-white/70 p-4 backdrop-blur-xl lg:block">

      {/* Logo */}
      <div className="flex h-14 items-center gap-3 border-b border-black/5 px-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
          <Store size={18} />
        </div>

        <div>
          <p className="text-sm font-black">
            Store Admin
          </p>

          <p className="text-[10px] font-medium text-gray-400">
            Shoes & Watches
          </p>
        </div>

      </div>

      {/* Navigation */}
      <nav className="mt-6 space-y-1">

        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-xl px-3 py-3
                text-sm font-semibold transition
                ${
                  isActive
                    ? "bg-black text-white shadow-lg shadow-black/10"
                    : "text-gray-500 hover:bg-black/5 hover:text-black"
                }
              `}
            >
              <Icon size={18} />

              {item.name}
            </Link>
          );
        })}

      </nav>

      {/* Logout */}
      <div className="absolute bottom-5 left-4 right-4">

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />

          Logout
        </button>

      </div>

    </aside>
  );
}