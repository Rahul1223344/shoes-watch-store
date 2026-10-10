import Link from "next/link";
import type { ReactNode } from "react";
import Footer from "@/components/layout/Footer";

const policyLinks = [
  { href: "/policies/privacy-policy", label: "Privacy Policy" },
  { href: "/policies/exchange-policy", label: "Exchange Policy" },
  { href: "/policies/shipping-policy", label: "Shipping Policy" },
  { href: "/policies/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/policies/cash-on-delivery", label: "Cash on Delivery" },
  { href: "/policies/contact-us", label: "Contact Us" },
];

export default function PolicyLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
  <div className="flex min-h-screen flex-col bg-white">
    <main className="min-h-screen bg-[#f7f8fa] px-4 py-10 text-gray-900 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm font-semibold text-blue-700 transition hover:text-blue-900"
          >
            ← Back to Lakshay Fashion Collection
          </Link>
        </div>

        <header className="rounded-3xl border border-white bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            Lakshay Fashion Collection
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
            {description}
          </p>
          <p className="mt-4 text-xs text-gray-400">
            Last updated: 10 October 2026
          </p>
        </header>

        <article className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
          <div className="policy-content space-y-8 text-sm leading-7 text-gray-700 sm:text-base">
            {children}
          </div>
        </article>

        <nav
          aria-label="Store policies"
          className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="text-base font-bold text-gray-900">Store information</h2>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
            {policyLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-blue-700 underline-offset-4 hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </main>
    <Footer/>
  </div>
  );
}

export function PolicySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-bold tracking-tight text-gray-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6 marker:text-blue-600">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
