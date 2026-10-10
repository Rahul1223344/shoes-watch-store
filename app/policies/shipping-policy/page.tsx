import type { Metadata } from "next";
import PolicyLayout, { PolicyList, PolicySection } from "../_components/PolicyLayout";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Lakshay Fashion Collection",
  description: "Shipping charges, delivery estimates, and delivery support for Lakshay Fashion Collection.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      title="Shipping & Delivery Policy"
      description="Our shipping policy explains order processing, estimated delivery, shipping charges, and what to do if a delivery is delayed."
    >
      <PolicySection title="1. Shipping charges">
        <strong>Free shipping is offered on all orders</strong> under our standard delivery service. If an exchange requires additional shipping or handling, a separate charge may apply under our Exchange Policy. We will tell you about any exchange charge before proceeding.
      </PolicySection>

      <PolicySection title="2. Order processing">
        Orders are reviewed before dispatch. We may contact you to confirm your contact number, delivery address, product availability, or Cash on Delivery details. Processing may take additional time if information is incomplete or confirmation is required.
      </PolicySection>

      <PolicySection title="3. Estimated delivery time">
        Our current estimated delivery time is <strong>5–10 days</strong>. This is an estimate, not a guaranteed delivery date. The actual time may vary by destination, courier operations, weather, public holidays, and other circumstances outside our reasonable control.
      </PolicySection>

      <PolicySection title="4. Address and contact details">
        Please provide an accurate name, phone number, street address, city, state, and PIN code at checkout. Incorrect or incomplete information may delay delivery or cause the courier to return the parcel. Contact support promptly if you notice an error after placing an order.
      </PolicySection>

      <PolicySection title="5. Delivery attempts and delays">
        The courier may contact you to coordinate delivery. Please keep your phone available and ensure someone can receive the parcel. If delivery is delayed, tracking information is unavailable, or the parcel appears lost, contact us through WhatsApp or email with your order details.
      </PolicySection>

      <PolicySection title="6. Inspecting your parcel">
        Where practical, check the package and product after delivery. If the product appears damaged, defective, or incorrect, keep the packaging and contact us promptly with photographs and your order details. Please refer to the Exchange Policy for the process.
      </PolicySection>

      <PolicySection title="7. Cash on Delivery">
        Cash on Delivery is the payment method currently offered at checkout. Please see our Cash on Delivery Policy for further details.
      </PolicySection>

      <PolicySection title="8. Contact">
        For delivery questions, use the WhatsApp or email contact details listed on our Contact Us page.
      </PolicySection>
    </PolicyLayout>
  );
}
