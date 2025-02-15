import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

// 📌 Fetch Cart Items
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const uuid = searchParams.get("uuid");

    if (!uuid) {
      return NextResponse.json({ error: "UUID is required" }, { status: 400 });
    }

    const cartItems = await prisma.cart.findMany({
      where: { userUUID: uuid },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// 📌 Add Product to Cart
export async function POST(req) {
  try {
    const { uuid, id, name, category, price, currency, image, quantity = 1 } = await req.json();

    if (!uuid) {
      return NextResponse.json({ error: "UUID is required" }, { status: 400 });
    }

    // Check if the item is already in the cart for this user
    const existingItem = await prisma.cart.findFirst({
      where: { userUUID: uuid, productId: id },
    });

    if (existingItem) {
      // ✅ Update quantity if already exists
      await prisma.cart.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // ✅ Create new cart entry
      await prisma.cart.create({
        data: { userUUID: uuid, productId: id, name, category, price, currency, image, quantity },
      });
    }

    return NextResponse.json({ message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}

export async function DELETE(req) {
    try {
        const body = await req.json(); // ✅ Parse request body once

        const { uuid, clearAll, id } = body; // ✅ Extract all needed fields

        if (!uuid) {
            return NextResponse.json({ error: "UUID is required" }, { status: 400 });
        }

        if (clearAll) {
            // ✅ Clear all items for the user
            await prisma.cart.deleteMany({
                where: { userUUID: uuid },
            });

            return NextResponse.json({ message: "All cart items removed successfully" });
        }

        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        // ✅ Remove a specific item from the cart
        await prisma.cart.deleteMany({
            where: { userUUID: uuid, productId: id },
        });

        return NextResponse.json({ message: "Product removed successfully" });
    } catch (error) {
        console.error("Error removing cart items:", error);
        return NextResponse.json({ error: "Failed to remove cart items" }, { status: 500 });
    }
}

  
