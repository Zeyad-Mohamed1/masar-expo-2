import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, phone } = await request.json();

    if (!name || !phone) {
      return NextResponse.json(
        { message: "Name and phone are required" },
        { status: 400 },
      );
    }

    // Check if visitor already exists
    const existingVisitor = await prisma.visitor.findUnique({
      where: { phone },
    });

    if (existingVisitor) {
      // Visitor exists, return success without creating a new record
      return NextResponse.json({
        exists: true,
        message: "Visitor verified successfully",
      });
    }

    // Create new visitor
    await prisma.visitor.create({
      data: {
        name,
        phone,
      },
    });

    return NextResponse.json({
      exists: false,
      message: "Visitor registered successfully",
    });
  } catch (error) {
    console.error("Error verifying visitor:", error);
    return NextResponse.json(
      { message: "Failed to verify visitor" },
      { status: 500 },
    );
  }
}
