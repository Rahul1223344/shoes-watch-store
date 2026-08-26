import type { Metadata } from "next";

import "./globals.css";

import Navbar from "@/components/layout/Navbar";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.lakshayfashioncollection.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Lakshay Fashion Collection | Shoes & Watches",
    template: "%s | Lakshay Fashion Collection",
  },

  description:
    "Shop stylish shoes and watches at Lakshay Fashion Collection. Discover comfortable footwear and fashionable watches for everyday style.",

  applicationName: "Lakshay Fashion Collection",

  keywords: [
    "Lakshay Fashion Collection",
    "shoes",
    "watches",
    "buy shoes online",
    "buy watches online",
    "shoes store",
    "watch store",
    "shoes and watches",
    "Niwai shoes store",
    "Niwai watch store",
  ],

  authors: [
    {
      name: "Lakshay Fashion Collection",
    },
  ],

  creator: "Lakshay Fashion Collection",

  publisher: "Lakshay Fashion Collection",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Lakshay Fashion Collection",

    title:
      "Lakshay Fashion Collection | Shoes & Watches",

    description:
      "Shop stylish shoes and watches at Lakshay Fashion Collection. Discover comfortable footwear and fashionable watches for everyday style.",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Lakshay Fashion Collection | Shoes & Watches",

    description:
      "Shop stylish shoes and watches at Lakshay Fashion Collection. Discover comfortable footwear and fashionable watches for everyday style.",
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