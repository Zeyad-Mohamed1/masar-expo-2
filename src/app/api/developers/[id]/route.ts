import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET developer by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    const developer = await prisma.developer.findUnique({
      where: { id },
      include: {
        projects: true,
      },
    });

    console.log("developer", developer);

    if (!developer) {
      return NextResponse.json(
        { error: "Developer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(developer, { status: 200 });
  } catch (error) {
    console.error("Error fetching developer:", error);
    return NextResponse.json(
      { error: "Failed to fetch developer" },
      { status: 500 },
    );
  }
}

// UPDATE developer by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    // Check if developer exists
    const existingDeveloper = await prisma.developer.findUnique({
      where: { id },
    });

    if (!existingDeveloper) {
      return NextResponse.json(
        { error: "Developer not found" },
        { status: 404 },
      );
    }

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const longDescription = formData.get("longDescription") as string;
    const zoomId = formData.get("zoomId") as string;

    // Handle logo file if uploaded
    let logoFile = formData.get("logo") as File | null;
    let logo = existingDeveloper.logo; // Keep existing logo by default

    if (logoFile && logoFile.size > 0) {
      // Convert file to base64 for storage
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      logo = `data:${logoFile.type};base64,${buffer.toString("base64")}`;
    }

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required fields" },
        { status: 400 },
      );
    }

    // Update the developer
    const updatedDeveloper = await prisma.developer.update({
      where: { id },
      data: {
        name,
        phone,
        shortDescription,
        longDescription,
        zoomId,
        ...(logo ? { logo } : {}), // Only update logo if provided or if there was one
      },
    });

    return NextResponse.json(updatedDeveloper, { status: 200 });
  } catch (error) {
    console.error("Error updating developer:", error);
    return NextResponse.json(
      { error: "Failed to update developer" },
      { status: 500 },
    );
  }
}

// DELETE developer by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    // Check if developer exists
    const existingDeveloper = await prisma.developer.findUnique({
      where: { id },
    });

    if (!existingDeveloper) {
      return NextResponse.json(
        { error: "Developer not found" },
        { status: 404 },
      );
    }

    // Delete the developer
    await prisma.developer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting developer:", error);
    return NextResponse.json(
      { error: "Failed to delete developer" },
      { status: 500 },
    );
  }
}
