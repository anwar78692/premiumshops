import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(req, { params }) {
  try {
    const { id } = params; // Get product ID from URL

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { features: true }, // Fetch related features from DB
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    return NextResponse.json({ error: "Failed to fetch product details" }, { status: 500 });
  }
}
