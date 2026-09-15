import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      mobile,
      address,
      productName,
      productPrice,
      quantity,
      totalPrice,
      optionsText,
    } = body;

    // Server-side validation
    if (
      typeof name !== "string" ||
      name.trim().length < 2
    ) {
      return Response.json(
        { error: "Invalid customer name." },
        { status: 400 }
      );
    }

    if (
      typeof mobile !== "string" ||
      !/^[6-9]\d{9}$/.test(mobile.trim())
    ) {
      return Response.json(
        { error: "Invalid mobile number." },
        { status: 400 }
      );
    }

    if (
      typeof address !== "string" ||
      address.trim().length < 10
    ) {
      return Response.json(
        { error: "Invalid delivery address." },
        { status: 400 }
      );
    }

    if (
      typeof productName !== "string" ||
      typeof productPrice !== "number" ||
      typeof quantity !== "number" ||
      typeof totalPrice !== "number"
    ) {
      return Response.json(
        { error: "Invalid order information." },
        { status: 400 }
      );
    }

    const orderEmail =
      process.env.NEXT_PUBLIC_ORDER_EMAIL;

    if (!orderEmail) {
      return Response.json(
        { error: "Order email is not configured." },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from:
        "Lakshay Fashion Collection <orders@lakshayfashioncollection.com>",
      to: [orderEmail],
      subject: `New Order - ${productName}`,
      html: `
        <h2>New Order Received</h2>

        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Delivery Address:</strong><br />
        ${address.replace(/\n/g, "<br />")}</p>

        <h3>Product Information</h3>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Price:</strong> ₹${productPrice.toLocaleString("en-IN")}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Total:</strong> ₹${totalPrice.toLocaleString("en-IN")}</p>

        <p><strong>Selected Options:</strong><br />
        ${String(optionsText || "").replace(/\n/g, "<br />")}</p>

        <hr />

        <p>Please contact the customer to confirm the order and delivery details.</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return Response.json(
        { error: "Unable to send order email." },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      id: data?.id,
    });
  } catch (error) {
    console.error("Order API error:", error);

    return Response.json(
      { error: "Unable to process the order." },
      { status: 500 }
    );
  }
}