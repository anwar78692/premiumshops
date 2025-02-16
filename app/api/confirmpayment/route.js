import Stripe from "stripe";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json(); // ✅ Parse JSON body
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    console.log("🔹 Received session_id:", session_id);

    // ✅ Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product"],
    });

    if (!session) {
      console.error("❌ Invalid session ID:", session_id);
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    }

    console.log("✅ Stripe Session Retrieved:", session);

    // ✅ Extract product details
    const orderedProducts = session.line_items.data.map((item) => ({
      name: item.price.product.name,
      quantity: item.quantity,
      price: (item.price.unit_amount / 100).toFixed(2), // Convert to normal currency value
      currency: item.price.currency.toUpperCase(),
    }));

    console.log("🛍 Ordered Products:", orderedProducts);

    // ✅ Store Order in Database (Prisma)
    const newOrder = await prisma.order.create({
      data: {
        userEmail: session.customer_email,
        paymentId: session.payment_intent,
        products: {
          create: orderedProducts.map((product) => ({
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            currency: product.currency,
          })),
        },
      },
    });

    console.log("✅ Order Stored in Database:", newOrder);

    // ✅ Send Email with Order Details
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER, // Your email
        pass: process.env.NEXT_PUBLIC_EMAIL_PASS, // Your email password (use app password if 2FA enabled)
      },
    });

    let mailOptions = {
      from: `"Premium Shop" <${process.env.NEXT_PUBLIC_EMAIL_USER}>`,
      to: session.customer_email,
      subject: "Your Purchase Confirmation - Premium Shop",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #2563EB;">Thank you for your purchase!</h2>
          <p>You have successfully purchased the following products:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderedProducts
                .map(
                  (item) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.currency} ${item.price}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <p><strong>Payment ID:</strong> ${session.payment_intent}</p>
          <p>If you have any issues, please contact our support.</p>
          <br/>
          <p>Best Regards,<br/><strong>Premium Shop Team</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Order Confirmation Email Sent!");

    return NextResponse.json({ message: "Payment confirmed, order stored, and email sent!" });
  } catch (error) {
    console.error("❌ Error confirming payment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // ✅ Prevents memory leaks
  }
}
