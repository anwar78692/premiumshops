import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { totalAmount } = await req.json();

    // ✅ Ensure totalAmount is a valid price
    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // ✅ Fetch API Key from environment variables
    const API_KEY = process.env.NEXT_PUBLIC_NOWPAYMENTS_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const response = await axios.post(
        "https://api.nowpayments.io/v1/invoice",
        {
          price_amount: parseFloat(totalAmount),
          price_currency: "usd",
          pay_currency: "btc", // ✅ Change to BTC (or eth, bnb, etc.)
          order_id: `order_${Date.now()}`,
          order_description: "Purchase from Premium Shop",
          success_url: "http://localhost:3000/success",
          cancel_url: "http://localhost:3000/cart",
        },
        {
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      

    // ✅ Return the invoice URL to the frontend
    return NextResponse.json({ invoice_url: response.data.invoice_url });

  } catch (error) {
    console.error("NOWPayments Error:", error.response?.data || error);
    return NextResponse.json({ error: "Crypto Payment Failed" }, { status: 500 });
  }
}
