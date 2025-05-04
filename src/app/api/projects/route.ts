import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import { join } from "path";
import * as crypto from "crypto";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        developer: true,
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Error fetching projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const developerId = formData.get("developerId") as string;
    const location = formData.get("location") as string;
    const status = formData.get("status") as string;
    const units = parseInt(formData.get("units") as string);
    const description = formData.get("description") as string;

    // Handle image uploads
    const imageFiles = formData.getAll("images") as File[];
    const existingImages = formData.getAll("existingImages") as string[];

    const uploadedImagePaths: string[] = [];

    // Process and save new images
    for (const file of imageFiles) {
      if (file.size === 0) continue; // Skip empty files

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${crypto.randomUUID()}_${file.name.replace(/\s/g, "_")}`;
      const filePath = join(process.cwd(), "public", "uploads", fileName);

      await writeFile(filePath, buffer);
      uploadedImagePaths.push(`/uploads/${fileName}`);
    }

    // Combine existing images with new uploads
    const allImages = [...existingImages, ...uploadedImagePaths];

    // Create the project
    const project = await prisma.project.create({
      data: {
        name,
        developerId,
        location,
        status,
        units,
        description,
        images: allImages,
        Images: allImages, // Include both images and Images fields to match the schema
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return NextResponse.json(
      { error: "Error creating project" },
      { status: 500 },
    );
  }
}
