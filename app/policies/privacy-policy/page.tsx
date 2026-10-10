import type { Metadata } from "next";
import PolicyLayout, { PolicyList, PolicySection } from "../_components/PolicyLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Lakshay Fashion Collection",
  description: "Learn how Lakshay Fashion Collection handles information collected through its website and order process.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      description="This policy describes how Lakshay Fashion Collection may collect, use, and protect information when you browse our website, contact us, or submit an order."
    >
      <PolicySection title="1. Information we collect">
        Depending on how you use the website, we may collect:
        <PolicyList items={[
          "Contact and order information you provide, such as your name, phone number, delivery address, city, state, PIN code, and product choices.",
          "Messages and information you share with us through customer support.",
          "Technical and usage information such as device, browser, pages visited, referral source, and interactions, where collected by website analytics or advertising tools.",
        ]} />
        Please do not send payment card details or other unnecessary sensitive information through our contact channels.
      </PolicySection>

      <PolicySection title="2. How we use information">
        We may use information to process and confirm order requests, coordinate delivery, respond to customer service messages, handle exchange requests, maintain website security, improve the website, and understand marketing performance.
      </PolicySection>

      <PolicySection title="3. Cookies, analytics, and advertising">
        Our website may use Google Analytics, Meta Pixel, cookies, or similar technologies to measure website activity and advertising performance. These tools may receive technical identifiers and information about page visits or actions, subject to their settings and applicable requirements. Review the relevant providers' privacy information for details about their practices. The store should configure these tools and any consent controls to reflect its actual use and applicable law.
      </PolicySection>

      <PolicySection title="4. When information may be shared">
        We may share relevant information with service providers that help operate the store, such as email delivery, hosting, analytics, advertising, and courier or delivery services. We may also disclose information where required by law or to protect legitimate rights and security. We do not state that every provider receives every category of information; sharing depends on the service and configuration in use.
      </PolicySection>

      <PolicySection title="5. Retention and security">
        We retain information for as long as reasonably necessary for order handling, customer support, legal obligations, dispute resolution, and legitimate business purposes. We use reasonable safeguards, but no internet transmission or storage system can be guaranteed completely secure.
      </PolicySection>

      <PolicySection title="6. Your choices and requests">
        You may contact us to ask about personal information associated with your order or to request correction or deletion where applicable. We may need to retain some information to fulfil legal obligations, resolve disputes, or complete legitimate order-related tasks.
      </PolicySection>

      <PolicySection title="7. Children's privacy">
        Our website is intended for general shopping use and is not designed to knowingly collect personal information from children without appropriate authorization. A parent or guardian who believes a child has provided personal information may contact us.
      </PolicySection>

      <PolicySection title="8. Third-party services">
        Links or integrations to third-party services are governed by those providers' own terms and privacy practices. We are not responsible for the independent privacy practices of external services.
      </PolicySection>

      <PolicySection title="9. Changes to this policy">
        We may update this policy when our practices or legal requirements change. The latest version will be published on this page with an updated date.
      </PolicySection>

      <PolicySection title="10. Contact">
        For privacy-related questions or requests, use the official email or WhatsApp contact details listed on our Contact Us page.
      </PolicySection>
    </PolicyLayout>
  );
}
