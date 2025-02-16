import Stripe from "stripe";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { session_id } = req.body;
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product"], // Expanding for better product details
    });

    if (!session) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    // Extract ordered products from the session
    const orderedProducts = session.line_items.data.map((item) => ({
      name: item.price.product.name,
      quantity: item.quantity,
      price: item.price.unit_amount / 100, // Convert to normal currency value
      currency: item.price.currency.toUpperCase(),
    }));

    // ✅ Store Order in Database (Prisma)
    const newOrder = await prisma.order.create({
      data: {
        userEmail: session.customer_email,
        paymentId: session.payment_intent,
        products: orderedProducts, // Store structured product details
      },
    });

    // ✅ Send Email with Order Details
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    let mailOptions = {
      from: `"Premium Shop" <${process.env.EMAIL_USER}>`,
      to: session.customer_email,
      subject: "Your Purchase Confirmation - Premium Shop",
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>You have successfully purchased the following products:</p>
        <ul>
          ${orderedProducts
            .map(
              (item) =>
                `<li><strong>${item.name}</strong> - Quantity: ${item.quantity} | Price: ${item.currency} ${item.price}</li>`
            )
            .join("")}
        </ul>
        <p><strong>Payment ID:</strong> ${session.payment_intent}</p>
        <p>If you have any issues, please contact our support.</p>
        <br/>
        <p>Best Regards,<br/>Premium Shop Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Payment confirmed, order stored, and email sent!" });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
