import type { Metadata } from "next";
import PolicyLayout, { PolicyList, PolicySection } from "../_components/PolicyLayout";

export const metadata: Metadata = {
  title: "Cash on Delivery Policy | Lakshay Fashion Collection",
  description: "Understand how Cash on Delivery orders work at Lakshay Fashion Collection.",
};

export default function CashOnDeliveryPage() {
  return (
    <PolicyLayout
      title="Cash on Delivery Policy"
      description="Cash on Delivery (COD) is the payment option currently available at checkout. Customers pay for an order when it is delivered."
    >
      <PolicySection title="1. Payment method">
        Orders placed through our website use <strong>Cash on Delivery (COD)</strong>. The checkout displays COD as the selected payment method. Online payment is not offered through this checkout flow.
      </PolicySection>

      <PolicySection title="2. Order confirmation">
        Submitting the order form sends an order request to our store. Our team may contact you to verify the order, product availability, delivery address, and phone number. An order request is not a guarantee that the order has been accepted or dispatched.
      </PolicySection>

      <PolicySection title="3. Payment at delivery">
        Please pay the amount confirmed for your order to the delivery person according to the courier's instructions. Keep the order confirmation available in case you need to refer to your order details.
      </PolicySection>

      <PolicySection title="4. Accurate information">
        Provide a reachable phone number and complete delivery address. We may contact you before dispatch or delivery if details need confirmation.
      </PolicySection>

      <PolicySection title="5. Refused or unsuccessful deliveries">
        If you need to cancel or change an order, contact us as soon as possible. Orders may already be packed or handed to a courier, so changes cannot be guaranteed after processing. Repeated refused or unsuccessful deliveries may affect our ability to accept future COD orders, subject to applicable law.
      </PolicySection>

      <PolicySection title="6. Exchanges and refunds">
        Our standard policy is exchange-only for eligible change-of-mind requests within 7 calendar days of delivery. We do not offer ordinary change-of-mind refunds. Additional shipping charges may apply to exchanges. These terms do not restrict remedies required by applicable law.
      </PolicySection>

      <PolicySection title="7. Support">
        For questions about a COD order, contact us through the official WhatsApp or email details on our Contact Us page.
      </PolicySection>
    </PolicyLayout>
  );
}
