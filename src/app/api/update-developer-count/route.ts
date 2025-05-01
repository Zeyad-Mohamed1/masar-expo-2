import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { zoomId, count } = await request.json();

    if (!zoomId || typeof count !== "number") {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 },
      );
    }

    // Find the developer with the provided zoomId
    const developer = await prisma.developer.findFirst({
      where: { zoomId },
    });

    if (!developer) {
      return NextResponse.json(
        { error: "Developer not found with the provided zoomId" },
        { status: 404 },
      );
    }

    // Update the developer count
    await prisma.developer.update({
      where: { id: developer.id },
      data: { count },
    });

    // For now, we'll just log the update
    console.log(`Updated developer count for meeting ${zoomId} to ${count}`);

    return NextResponse.json({
      success: true,
      developerId: developer.id,
      count,
    });
  } catch (error) {
    console.error("Error updating developer count:", error);
    return NextResponse.json(
      { error: "Failed to update developer count" },
      { status: 500 },
    );
  }
}
