import Link from "next/link";
import {
  MessageCircle,
  MapPin,
  RotateCcw,
} from "lucide-react";

export default function Footer() {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`
    : "#";

  const address =
    "Jhilay Road, Laxmi Nagar, Niwai, Tonk, Rajasthan – 304021, India";

  const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=JhIlay+Road,+Laxmi+Nagar,+Niwai,+Tonk,+Rajasthan+304021,+India";

  const instagramUrl =
    "https://www.instagram.com/lakshayfashioncollection?igsi=aTdyNGRxaWkxbjRn";

  return (
    <footer className="mt-16 bg-[#111111] text-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">

            <Link
              href="/"
              className="inline-flex items-center"
            >
              <img
                src="/images/lakshay-logo.png"
                alt="Lakshay Fashion Collection"
                className="h-14 w-auto max-w-[220px] object-contain"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/60">
              Discover stylish shoes and watches carefully
              selected for everyday comfort, confidence
              and timeless style.
            </p>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-gray-200"
            >
              <MessageCircle size={17} />
              Chat on WhatsApp
            </a>

            {/* Physical Address */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex max-w-md items-start gap-3 text-sm leading-6 text-white/50 transition hover:text-white"
            >
              <MapPin
                size={17}
                className="mt-1 shrink-0"
              />

              <span>
                {address}
              </span>
            </a>

          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.16em] text-white">
              Shop
            </h3>

            <ul className="mt-5 space-y-4 text-sm text-white/55">

              <li>
                <Link
                  href="/"
                  className="transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/#shoes"
                  className="transition hover:text-white"
                >
                  Shoes
                </Link>
              </li>

              <li>
                <Link
                  href="/#watches"
                  className="transition hover:text-white"
                >
                  Watches
                </Link>
              </li>

            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.16em] text-white">
              Customer Care
            </h3>

            <ul className="mt-5 space-y-4 text-sm text-white/55">

              {/* WhatsApp */}
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition hover:text-white"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <MessageCircle size={14} />
                  </span>

                  <span>
                    WhatsApp Support
                  </span>
                </a>
              </li>

              {/* Instagram */}
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition hover:text-white"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <svg
  viewBox="0 0 24 24"
  className="h-[14px] w-[14px]"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  aria-hidden="true"
>
  <rect
    width="18"
    height="18"
    x="3"
    y="3"
    rx="5"
  />
  <circle
    cx="12"
    cy="12"
    r="4"
  />
  <circle
    cx="17.5"
    cy="6.5"
    r="0.75"
    fill="currentColor"
    stroke="none"
  />
</svg>
                  </span>

                  <span>
                    lakshayfashioncollection
                  </span>
                </a>
              </li>

              {/* Returns */}
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <RotateCcw size={14} />
                </span>

                <span>
                  7 Days Easy Returns
                </span>
              </li>

              {/* Location */}
              <li>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition hover:text-white"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <MapPin size={14} />
                  </span>

                  <span>
                    Niwai, Tonk, Rajasthan
                  </span>
                </a>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-white/40 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">

          <p>
            © {new Date().getFullYear()} Lakshay Fashion Collection.
            All rights reserved.
          </p>

          <p>
            Shoes · Watches · Everyday Style
          </p>

        </div>
      </div>

    </footer>
  );
}