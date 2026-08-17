import {
  ShieldCheck,
  RotateCcw,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Original",
    description: "Authentic products",
  },
  {
    icon: RotateCcw,
    title: "7 Days Easy Returns",
    description: "Simple return policy",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Support",
    description: "Quick customer assistance",
  },
  {
    icon: ShoppingBag,
    title: "Easy Ordering",
    description: "Simple & secure process",
  },
];

export default function TrustFeatures() {
  return (
    <section className="px-3 py-4 sm:px-5 sm:py-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] md:grid-cols-4">

        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className={`
                flex items-center gap-3 p-5
                ${
                  index !== features.length - 1
                    ? "border-black/5 md:border-r"
                    : ""
                }
                ${
                  index < 2
                    ? "border-b md:border-b-0"
                    : ""
                }
              `}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white">
                <Icon
                  size={19}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-xs font-bold uppercase tracking-wide">
                  {feature.title}
                </h3>

                <p className="mt-1 text-[11px] leading-4 text-gray-500">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}