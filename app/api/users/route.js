import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; // Prisma Client

export async function POST(req) {
  try {
    const { uuid } = await req.json();

    if (!uuid) {
      return NextResponse.json({ error: "UUID is required" }, { status: 400 });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { uuid } });

    if (!user) {
      user = await prisma.user.create({
        data: { uuid, theme: "light" },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
