import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { cartItems, email } = body;

    console.log("Received Cart Items:", cartItems);
    console.log("Customer Email:", email);

    if (!cartItems || cartItems.length === 0) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [`${BASE_URL}${item.image}`], // ✅ Convert to absolute URL
        },
        unit_amount: Math.round(Number(item.price.replace("$", "")) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/cart`,
      customer_email: email,
    });

    console.log("Stripe Session Created:", session);
    return Response.json({ url: session.url }, { status: 200 });

  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
