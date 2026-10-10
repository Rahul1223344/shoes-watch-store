
import type { Metadata } from "next";
import PolicyLayout, {
  PolicyList,
  PolicySection,
} from "../_components/PolicyLayout";

export const metadata: Metadata = {
  title: "Contact Us | Lakshay Fashion Collection",
  description:
    "Contact Lakshay Fashion Collection for order, delivery, exchange, and privacy support.",
};

const whatsappUrl = "https://wa.me/918239289650";
const supportEmail = "lakshayfashioncollection@gmail.com";
const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Jhilay+Road%2C+Laxmi+Nagar%2C+Niwai%2C+Tonk%2C+Rajasthan+304021%2C+India";

const contactLinkClass =
  "break-words text-blue-600 transition-colors hover:text-blue-800";

export default function ContactUsPage() {
  return (
    <PolicyLayout
      title="Contact Us"
      description="We're here to help with order requests, delivery questions, eligible exchanges, and privacy-related enquiries."
    >
      <PolicySection title="Customer Support">
        Contact Lakshay Fashion Collection through our official WhatsApp
        or email channel. Please include accurate order details when
        contacting us about an existing order.
      </PolicySection>

      <PolicySection title="What to Include in Your Message">
        <PolicyList
          items={[
            "Your name and order details, if you have already placed an order.",
            "A short description of your question or issue.",
            "For a damaged, defective, or incorrect item, clear photographs of the product and packaging where possible.",
            "For an exchange, contact us within 7 calendar days of delivery and wait for instructions before shipping the product.",
          ]}
        />
      </PolicySection>

      <PolicySection title="Contact Details">
        <ul className="mt-3 list-disc space-y-3 pl-6 marker:text-blue-600">
          <li>
            <strong>WhatsApp: </strong>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={contactLinkClass}
            >
              82392 89650
            </a>
          </li>

          <li>
            <strong>Email: </strong>
            <a
              href={`mailto:${supportEmail}`}
              className={contactLinkClass}
            >
              {supportEmail}
            </a>
          </li>

          <li>
            <strong>Business Address: </strong>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={contactLinkClass}
            >
              Jhilay Road, Laxmi Nagar, Niwai, Tonk,
              Rajasthan – 304021, India
            </a>
          </li>
        </ul>
      </PolicySection>
    </PolicyLayout>
  );
}
