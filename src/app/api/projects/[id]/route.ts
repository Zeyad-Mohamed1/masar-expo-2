import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import * as crypto from "crypto";
import { existsSync } from "fs";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        developer: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(`Error fetching project with ID:`, error);
    return NextResponse.json(
      { error: "Error fetching project" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  try {
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

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

    // Handle removed images
    const imagesToRemove = existingProject.images.filter(
      (img) => !existingImages.includes(img),
    );

    // Delete removed image files from server
    for (const imageUrl of imagesToRemove) {
      try {
        const filePath = join(process.cwd(), "public", imageUrl);
        if (existsSync(filePath)) {
          await unlink(filePath);
        }
      } catch (error) {
        console.error(`Failed to delete image ${imageUrl}:`, error);
      }
    }

    // Combine existing images with new uploads
    const allImages = [...existingImages, ...uploadedImagePaths];

    // Update the project
    const updatedProject = await prisma.project.update({
      where: {
        id,
      },
      data: {
        name,
        developerId,
        location,
        status,
        units,
        description,
        images: allImages,
        Images: allImages,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error(`Error updating project with ID ${id}:`, error);
    return NextResponse.json(
      { error: "Error updating project" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  try {
    // Check if project exists and get its images
    const existingProject = await prisma.project.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        images: true,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete associated image files
    for (const imageUrl of existingProject.images) {
      try {
        // Only delete if it's an uploaded file that exists
        if (imageUrl.startsWith("/uploads/")) {
          const filePath = join(process.cwd(), "public", imageUrl);
          if (existsSync(filePath)) {
            await unlink(filePath);
          }
        }
      } catch (error) {
        console.error(`Failed to delete image ${imageUrl}:`, error);
      }
    }

    // Delete the project
    await prisma.project.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    return NextResponse.json(
      { error: "Error deleting project" },
      { status: 500 },
    );
  }
}
