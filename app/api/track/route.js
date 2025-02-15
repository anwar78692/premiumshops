import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(req) {
  try {
    // ✅ Get the user's IP and User-Agent
    const ipAddress = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // ✅ Store visit in database
    await prisma.visit.create({
      data: { ipAddress, userAgent },
    });

    // ✅ Return the total visit count
    const totalVisits = await prisma.visit.count();

    return NextResponse.json({ message: "Visit tracked!", totalVisits });
  } catch (error) {
    console.error("Error tracking visit:", error);
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 });
  }
}
