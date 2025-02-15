import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; // Prisma client

export async function GET() {
  try {
    let filter = await prisma.userFilter.findFirst();
    if (!filter) {
      filter = await prisma.userFilter.create({ data: { selectedFilter: "All" } });
    }
    return NextResponse.json(filter);
  } catch (error) {
    console.error("Error fetching filter:", error);
    return NextResponse.json({ error: "Failed to fetch filter" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { selectedFilter } = body;

    let existingFilter = await prisma.userFilter.findFirst();

    if (existingFilter) {
      existingFilter = await prisma.userFilter.update({
        where: { id: existingFilter.id },
        data: { selectedFilter },
      });
    } else {
      existingFilter = await prisma.userFilter.create({ data: { selectedFilter } });
    }

    return NextResponse.json(existingFilter);
  } catch (error) {
    console.error("Error updating filter:", error);
    return NextResponse.json({ error: "Failed to update filter" }, { status: 500 });
  }
}
