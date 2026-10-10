
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });

const isString = (value: unknown): value is string =>
  typeof value === "string";

const isValidName = (value: unknown): value is string =>
  isString(value) &&
  value.trim().length >= 1 &&
  value.trim().length <= 60;

export async function POST(request: Request) {
  try {
    // Reject unexpectedly large request bodies.
    const contentLength = Number(
      request.headers.get("content-length") || 0
    );

    if (contentLength > 20_000) {
      return Response.json(
        { error: "Request is too large." },
        { status: 413 }
      );
    }

    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return Response.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const {
      name,
      firstName,
      lastName,
      mobile,
      address,
      apartment,
      city,
      state,
      pinCode,
      country,
      paymentMethod,
      productName,
      productPrice,
      quantity,
      totalPrice,
      optionsText,
    } = body as Record<string, unknown>;

    // Customer validation
    if (!isValidName(firstName) || !isValidName(lastName)) {
      return Response.json(
        { error: "Please enter your first and last name." },
        { status: 400 }
      );
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    if (
      !isString(name) ||
      name.trim() !== fullName
    ) {
      return Response.json(
        { error: "Invalid customer name." },
        { status: 400 }
      );
    }

    if (
      !isString(mobile) ||
      !/^[6-9]\d{9}$/.test(mobile.trim())
    ) {
      return Response.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    // Delivery address validation
    if (
      !isString(address) ||
      address.trim().length < 10 ||
      address.length > 700
    ) {
      return Response.json(
        { error: "Please enter a complete delivery address." },
        { status: 400 }
      );
    }

    if (
      !isString(city) ||
      !city.trim() ||
      city.trim().length > 80
    ) {
      return Response.json(
        { error: "Please enter a valid city." },
        { status: 400 }
      );
    }

    if (
      !isString(state) ||
      !state.trim() ||
      state.length > 80
    ) {
      return Response.json(
        { error: "Please select a valid state." },
        { status: 400 }
      );
    }

    if (
      country !== "India" ||
      !isString(pinCode) ||
      !/^\d{6}$/.test(pinCode)
    ) {
      return Response.json(
        { error: "Please provide a valid Indian delivery address." },
        { status: 400 }
      );
    }

    if (
      apartment !== undefined &&
      (!isString(apartment) || apartment.length > 150)
    ) {
      return Response.json(
        { error: "Invalid apartment or suite details." },
        { status: 400 }
      );
    }

    // COD is the only supported payment method.
    if (paymentMethod !== "COD") {
      return Response.json(
        { error: "Only Cash on Delivery is supported." },
        { status: 400 }
      );
    }

    // Order validation
    if (
      !isString(productName) ||
      !productName.trim() ||
      productName.length > 200
    ) {
      return Response.json(
        { error: "Invalid product name." },
        { status: 400 }
      );
    }

    if (
      typeof productPrice !== "number" ||
      !Number.isFinite(productPrice) ||
      productPrice <= 0 ||
      productPrice > 10_000_000
    ) {
      return Response.json(
        { error: "Invalid product price." },
        { status: 400 }
      );
    }

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      return Response.json(
        { error: "Quantity must be between 1 and 99." },
        { status: 400 }
      );
    }

    const calculatedTotal = productPrice * quantity;

    if (
      !Number.isSafeInteger(calculatedTotal) ||
      typeof totalPrice !== "number" ||
      !Number.isFinite(totalPrice) ||
      totalPrice !== calculatedTotal
    ) {
      return Response.json(
        { error: "Invalid order total." },
        { status: 400 }
      );
    }

    if (
      optionsText !== undefined &&
      (!isString(optionsText) || optionsText.length > 2000)
    ) {
      return Response.json(
        { error: "Invalid product options." },
        { status: 400 }
      );
    }

    const orderEmail =
      process.env.ORDER_EMAIL ||
      process.env.NEXT_PUBLIC_ORDER_EMAIL;

    if (!process.env.RESEND_API_KEY || !orderEmail) {
      console.error("Order email configuration is missing.");

      return Response.json(
        { error: "Order service is temporarily unavailable." },
        { status: 500 }
      );
    }

    // Escape every customer-controlled value before inserting it into HTML.
    const safeName = escapeHtml(fullName);
    const safeMobile = escapeHtml(mobile.trim());
    const safeAddress = escapeHtml(address.trim()).replace(
      /\r?\n/g,
      "<br />"
    );
    const safeCity = escapeHtml(city.trim());
    const safeState = escapeHtml(state.trim());
    const safePinCode = escapeHtml(pinCode);
    const safeApartment = escapeHtml(
      isString(apartment) ? apartment.trim() : ""
    );
    const safeProductName = escapeHtml(productName.trim());
    const safeOptions = escapeHtml(
      isString(optionsText) ? optionsText : ""
    ).replace(/\r?\n/g, "<br />");

    const formattedPrice = calculatedTotal.toLocaleString("en-IN");

    const { data, error } = await resend.emails.send({
      from:
        "Lakshay Fashion Collection <orders@lakshayfashioncollection.com>",
      to: [orderEmail],
      subject: `New COD Order - ${productName.trim().slice(0, 100)}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
          <h2>New Order Received</h2>

          <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>

          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Mobile:</strong> ${safeMobile}</p>

          <h3>Delivery Information</h3>
          <p><strong>Country:</strong> India</p>
          <p><strong>Address:</strong> ${safeAddress}</p>
          ${
            safeApartment
              ? `<p><strong>Apartment / Suite:</strong> ${safeApartment}</p>`
              : ""
          }
          <p><strong>City:</strong> ${safeCity}</p>
          <p><strong>State:</strong> ${safeState}</p>
          <p><strong>PIN Code:</strong> ${safePinCode}</p>

          <h3>Product Information</h3>
          <p><strong>Product:</strong> ${safeProductName}</p>
          <p><strong>Unit Price:</strong> ₹${productPrice.toLocaleString("en-IN")}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Total:</strong> ₹${formattedPrice}</p>
          <p><strong>Selected Options:</strong><br />
            ${safeOptions || "No options selected"}
          </p>

          <hr />
          <p>Please contact the customer to confirm product availability
          and delivery details before dispatch.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return Response.json(
        { error: "Unable to send your order. Please try again." },
        { status: 502 }
      );
    }

    return Response.json(
      {
        success: true,
        id: data?.id,
        paymentMethod: "COD",
        message: "Your order request was submitted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order API error:", error);

    return Response.json(
      { error: "Unable to process your order. Please try again." },
      { status: 500 }
    );
  }
}
