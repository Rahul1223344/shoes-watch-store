import type { Metadata } from "next";
import PolicyLayout, { PolicyList, PolicySection } from "../_components/PolicyLayout";

export const metadata: Metadata = {
  title: "Exchange Policy | Lakshay Fashion Collection",
  description: "Read the exchange eligibility, time window, and process for Lakshay Fashion Collection orders.",
};

export default function ExchangePolicyPage() {
  return (
    <PolicyLayout
      title="Exchange Policy"
      description="We currently offer exchanges rather than change-of-mind returns or refunds. Please review the eligibility requirements and contact our support team before sending an item back."
    >
      <PolicySection title="1. Exchange window">
        You may request an exchange within <strong>7 calendar days from the date of delivery</strong>. Contact us within this period and wait for instructions before shipping an item.
      </PolicySection>

      <PolicySection title="2. Exchange eligibility">
        Products requested for exchange must be:
        <PolicyList items={[
          "Unused and unworn, with no signs of use, damage, washing, or alteration.",
          "Returned with original packaging, tags, labels, and any accessories supplied with the product.",
          "Accompanied by the order details or other reasonable proof of purchase.",
        ]} />
        <p className="mt-3">
          We may inspect an item before approving an exchange. An item that does not meet the stated condition requirements may not qualify for a voluntary exchange, subject to applicable law.
        </p>
      </PolicySection>

      <PolicySection title="3. How to request an exchange">
        <PolicyList items={[
          "Contact us through our official WhatsApp or support email within 7 calendar days of delivery.",
          "Share your order details, the reason for the exchange, and clear photographs if requested.",
          "Wait for our approval and return instructions before dispatching the product.",
          "Pack the item securely with its original packaging and tags.",
          "After we receive and inspect the item, we will confirm whether the exchange can proceed and explain the next steps.",
        ]} />
      </PolicySection>

      <PolicySection title="4. Exchange shipping charges">
        Original orders qualify for free shipping. However, <strong>additional shipping or handling charges may apply to an exchange</strong>. We will communicate any applicable charge and obtain your agreement before arranging paid exchange shipping.
      </PolicySection>

      <PolicySection title="5. Availability of replacement items">
        Exchanges depend on availability of the requested size, colour, model, or replacement product. If the requested item is unavailable, our support team will discuss available alternatives. Do not send a different product without prior approval.
      </PolicySection>

      <PolicySection title="6. Damaged, defective, or incorrect items">
        If your order arrives damaged, defective, or different from what you ordered, contact us as soon as reasonably possible with your order details and photographs. We will review the issue and explain the available remedy under our process and applicable law. This policy does not remove any rights or remedies that cannot legally be excluded.
      </PolicySection>

      <PolicySection title="7. No change-of-mind returns or refunds">
        We do not offer ordinary change-of-mind returns or refunds; our standard customer-initiated option is exchange under the conditions above. This statement does not limit any refund, replacement, repair, or other remedy that may be required by applicable law, including where goods are defective, damaged, incorrect, or materially misrepresented.
      </PolicySection>

      <PolicySection title="8. Contact us">
        To request an exchange, use the official WhatsApp or email contact details displayed on our Contact Us page. Please do not ship a product before receiving instructions from our team.
      </PolicySection>
    </PolicyLayout>
  );
}
