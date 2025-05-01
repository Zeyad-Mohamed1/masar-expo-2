import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const developers = await prisma.developer.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(developers);
  } catch (error) {
    console.error("Error fetching developers:", error);
    return NextResponse.json(
      { error: "Error fetching developers" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const description = formData.get("description") as string;
    const zoomId = formData.get("zoomId") as string;

    // Check if developer ID is provided (for updates)
    const developerId = formData.get("id") as string | null;

    // Handle logo file if uploaded
    let logoFile = formData.get("logo") as File | null;
    let logo = null;

    if (logoFile && logoFile.size > 0) {
      // Convert file to base64 for storage
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      logo = `data:${logoFile.type};base64,${buffer.toString("base64")}`;
    }

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required fields" },
        { status: 400 },
      );
    }

    if (developerId) {
      // Update existing developer
      const updatedDeveloper = await prisma.developer.update({
        where: { id: developerId },
        data: {
          name,
          email,
          phone,
          description,
          zoomId,
          ...(logo ? { logo } : {}), // Only update logo if provided
        },
      });

      return NextResponse.json(updatedDeveloper, { status: 200 });
    } else {
      // Create new developer
      const newDeveloper = await prisma.developer.create({
        data: {
          name,
          email,
          phone,
          description,
          zoomId,
          ...(logo ? { logo } : {}),
        },
      });

      return NextResponse.json(newDeveloper, { status: 201 });
    }
  } catch (error) {
    console.error("Error handling developer:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
