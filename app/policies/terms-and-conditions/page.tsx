import type { Metadata } from "next";
import PolicyLayout, { PolicyList, PolicySection } from "../_components/PolicyLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions | Lakshay Fashion Collection",
  description: "Terms governing use of the Lakshay Fashion Collection website and order requests.",
};

export default function TermsAndConditionsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      description="These terms apply to your use of the Lakshay Fashion Collection website and to order requests submitted through it."
    >
      <PolicySection title="1. Using this website">
        By using this website, you agree to use it lawfully and provide accurate information when submitting an order request. Do not attempt to disrupt the website, misuse forms, or submit fraudulent information.
      </PolicySection>

      <PolicySection title="2. Product information">
        We make reasonable efforts to display products, images, descriptions, options, and prices accurately. Colours may look different depending on your screen. Product availability and displayed details may change.
      </PolicySection>

      <PolicySection title="3. Orders and acceptance">
        Submitting the checkout form creates an order request; it does not by itself guarantee acceptance, availability, or dispatch. We may contact you to verify details and may need to decline or cancel a request if a product is unavailable, information is incomplete, or a clear listing or pricing error occurs. Where a payment has been collected, any required refund will be handled in accordance with applicable law.
      </PolicySection>

      <PolicySection title="4. Prices and shipping">
        Prices are displayed on the product pages. Standard shipping is currently free on all orders. Estimated delivery is 5–10 days, subject to the Shipping & Delivery Policy. Additional shipping or handling charges may apply to exchanges; we will communicate these before proceeding.
      </PolicySection>

      <PolicySection title="5. Payment">
        Cash on Delivery is the payment method currently available through the website checkout. Please review our Cash on Delivery Policy.
      </PolicySection>

      <PolicySection title="6. Exchanges">
        Our standard policy is exchange-only for eligible change-of-mind requests within 7 calendar days from delivery. Items must be unused, unworn, and returned with original packaging and tags. See the Exchange Policy for the full process. Nothing in these terms excludes rights or remedies that cannot legally be excluded.
      </PolicySection>

      <PolicySection title="7. Website content and intellectual property">
        Website text, branding, design, and other content may be protected by intellectual property laws. Do not copy, republish, or commercially exploit site content without permission, except where permitted by law.
      </PolicySection>

      <PolicySection title="8. Third-party services">
        The website may rely on third-party services for hosting, analytics, email, advertising, and delivery. Those services may have their own terms and privacy policies.
      </PolicySection>

      <PolicySection title="9. Limitation">
        To the extent permitted by applicable law, we are not responsible for interruptions or delays caused by circumstances outside our reasonable control. Nothing in these terms limits liability or consumer rights where such limitation is prohibited by law.
      </PolicySection>

      <PolicySection title="10. Changes and governing law">
        We may update these terms by publishing a revised version on this page. These terms are subject to the applicable laws of India, without limiting mandatory consumer protections or other rights available under applicable law.
      </PolicySection>

      <PolicySection title="11. Contact">
        For questions about these terms, use the official support channels listed on our Contact Us page.
      </PolicySection>
    </PolicyLayout>
  );
}
