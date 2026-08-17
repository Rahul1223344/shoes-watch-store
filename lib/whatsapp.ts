import { Product } from "@/types/product";

interface WhatsAppOrderData {
  product: Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export function createWhatsAppOrderUrl({
  product,
  selectedOptions,
  quantity,
}: WhatsAppOrderData) {
  const phoneNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  if (!phoneNumber) {
    throw new Error(
      "WhatsApp number is not configured."
    );
  }

  const optionsText = Object.entries(selectedOptions)
    .map(([name, value]) => `${name}: ${value}`)
    .join("\n");

  const message = [
    "Hello, I would like to order:",
    "",
    `Product: ${product.name}`,
    `Price: ₹${product.price.toLocaleString("en-IN")}`,
    `Quantity: ${quantity}`,
    "",
    optionsText,
    "",
    "Please confirm availability and order details.",
  ].join("\n");

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
}