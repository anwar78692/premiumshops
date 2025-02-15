import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; // Prisma client

export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const uuid = searchParams.get("uuid");
  
      if (!uuid) {
        return NextResponse.json({ error: "UUID is required" }, { status: 400 });
      }
  
      let userTheme = await prisma.userTheme.findUnique({ where: { userUUID: uuid } });
  
      // ✅ If no theme exists, create a new default theme
      if (!userTheme) {
        userTheme = await prisma.userTheme.create({
          data: { userUUID: uuid, darkMode: false },
        });
      }
  
      return NextResponse.json(userTheme);
    } catch (error) {
      console.error("Error fetching theme:", error);
      return NextResponse.json({ error: "Failed to fetch theme" }, { status: 500 });
    }
  }
  
  // ✅ Handle POST request to update theme
  export async function POST(req) {
    try {
      const body = await req.json();
      const { uuid, darkMode } = body;
  
      if (!uuid || typeof darkMode !== "boolean") {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
      }
  
      let existingTheme = await prisma.userTheme.findUnique({ where: { userUUID: uuid } });
  
      if (existingTheme) {
        existingTheme = await prisma.userTheme.update({
          where: { userUUID: uuid },
          data: { darkMode },
        });
      } else {
        existingTheme = await prisma.userTheme.create({
          data: { userUUID: uuid, darkMode },
        });
      }
  
      return NextResponse.json(existingTheme);
    } catch (error) {
      console.error("Error updating theme:", error);
      return NextResponse.json({ error: "Failed to update theme" }, { status: 500 });
    }
  }  
