import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
    responseLimit: '100mb',
  },
};

// GET developer by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    const developer = await prisma.developer.findUnique({
      where: { id },
    });

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

    // Handle logo file if uploaded
    let logoFile = formData.get("logo") as File | null;
    let logo = existingDeveloper.logo; // Keep existing logo by default

    if (logoFile && logoFile.size > 0) {
      // Convert file to base64 for storage
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      logo = `data:${logoFile.type};base64,${buffer.toString("base64")}`;
    }

    // Handle multiple images
    let newImages: string[] = [];

    // Get current images from the form data - this is the authoritative list
    const currentImagesJson = formData.get("currentImages") as string;
    
    if (currentImagesJson) {
      try {
        // Parse the current images JSON
        const parsedImages = JSON.parse(currentImagesJson) as string[];
        
        // Process all images from the JSON
        // Keep non-data URLs (existing images) as is
        const existingImages = parsedImages.filter(img => !img.startsWith("data:"));
        // Get all data URLs (new images)
        const newDataUrls = parsedImages.filter(img => img.startsWith("data:"));
        
        
        // Add all existing images to our final array
        newImages = [...existingImages];
        
        // Process each data URL and add to the images array
        if (newDataUrls.length > 0) {
          for (const dataUrl of newDataUrls) {
            newImages.push(dataUrl);
          }
        }
      } catch (e) {
        console.error("Error parsing currentImages JSON:", e);
        // Fallback to existing images if parsing fails
        newImages = [...(existingDeveloper.images || [])];
      }
    } else {
      // Check if we need to replace all images (legacy support)
      const replaceImages = formData.get("replaceImages") === "true";
      if (replaceImages) {
        newImages = [];
      } else {
        newImages = [...(existingDeveloper.images || [])];
      }

      // Legacy support for removedImages
      const removedImagesJson = formData.get("removedImages") as string;
      if (removedImagesJson) {
        try {
          const removedUrls = JSON.parse(removedImagesJson) as string[];
          if (removedUrls.length > 0) {
            for (const urlToRemove of removedUrls) {
              const index = newImages.indexOf(urlToRemove);
              if (index !== -1) {
                newImages.splice(index, 1);
              }
            }
          }
        } catch (e) {
          console.error("Error parsing removedImages JSON:", e);
        }
      }
      
      // Process image files if needed (legacy support)
      const imageFiles = formData.getAll("images") as File[];
      if (imageFiles && imageFiles.length > 0) {
        for (const imageFile of imageFiles) {
          if (imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const imageBase64 = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
            newImages.push(imageBase64);
          }
        }
      }
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
        ...(logo ? { logo } : {}), // Only update logo if provided or if there was one
        images: newImages, // Always update images array
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
