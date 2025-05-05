import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const websiteData = await prisma.websiteData.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(websiteData);
  } catch (error) {
    console.error("Error fetching website data:", error);
    return NextResponse.json(
      { error: "Error fetching website data" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Get existing website data
    const existingData = await prisma.websiteData.findFirst();

    // Handle banner image
    let banner = existingData?.banner || null;
    const bannerDataUrl = formData.get("banner") as string | null;
    const keepExistingBanner = formData.get("keepExistingBanner") === "true";

    if (bannerDataUrl) {
      // Use the data URL directly
      banner = bannerDataUrl;
    } else if (!keepExistingBanner) {
      // If not keeping existing and no new image, set to null
      banner = null;
    }

    // Handle about image
    let aboutImage = existingData?.aboutImage || null;
    const aboutImageDataUrl = formData.get("aboutImage") as string | null;
    const keepExistingAboutImage =
      formData.get("keepExistingAboutImage") === "true";

    if (aboutImageDataUrl) {
      // Use the data URL directly
      aboutImage = aboutImageDataUrl;
    } else if (!keepExistingAboutImage) {
      // If not keeping existing and no new image, set to null
      aboutImage = null;
    }

    // Get about text
    const about =
      (formData.get("about") as string) || existingData?.about || null;

    let result;

    // If we have existing data, update it
    if (existingData) {
      result = await prisma.websiteData.update({
        where: { id: existingData.id },
        data: {
          banner,
          about,
          aboutImage,
        },
      });
    }
    // Otherwise create a new record
    else {
      result = await prisma.websiteData.create({
        data: {
          banner,
          about,
          aboutImage,
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating website data:", error);
    return NextResponse.json(
      { error: "Error updating website data" },
      { status: 500 },
    );
  }
}
