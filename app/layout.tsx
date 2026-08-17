import type { Metadata } from "next";

import "./globals.css";

import Navbar from "@/components/layout/Navbar";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Premium Shoes & Watches",
    template: "%s | Premium Shoes & Watches",
  },

  description:
    "Explore premium shoes and watches with stylish designs, comfortable choices and direct WhatsApp ordering.",

  applicationName:
    "Premium Shoes & Watches",

  keywords: [
    "shoes",
    "watches",
    "buy shoes online",
    "buy watches online",
    "premium shoes",
    "premium watches",
    "shoes store",
    "watch store",
  ],

  authors: [
    {
      name: "Premium Shoes & Watches",
    },
  ],

  creator:
    "Premium Shoes & Watches",

  publisher:
    "Premium Shoes & Watches",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview":
        "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",

    locale: "en_IN",

    url: siteUrl,

    siteName:
      "Premium Shoes & Watches",

    title:
      "Premium Shoes & Watches",

    description:
      "Explore premium shoes and watches with stylish designs, comfortable choices and direct WhatsApp ordering.",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Premium Shoes & Watches",

    description:
      "Explore premium shoes and watches with stylish designs, comfortable choices and direct WhatsApp ordering.",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
    >
      <body>
        <Navbar />

        {children}
      </body>
    </html>
  );
}