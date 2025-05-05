import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Get all website data records ordered by creation date (newest first)
    const allRecords = await prisma.websiteData.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // If we have more than one record
    if (allRecords.length > 1) {
      // Keep the first one (most recent) and delete the rest
      const [keepRecord, ...deleteRecords] = allRecords;

      const deleteIds = deleteRecords.map((record) => record.id);

      // Delete all records except the most recent one
      const deleted = await prisma.websiteData.deleteMany({
        where: {
          id: {
            in: deleteIds,
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: `Cleaned up ${deleted.count} duplicate website data records`,
        remaining: keepRecord,
      });
    }

    // If we have one or zero records, no cleanup needed
    return NextResponse.json({
      success: true,
      message: "No cleanup needed",
      recordCount: allRecords.length,
    });
  } catch (error) {
    console.error("Error cleaning up website data:", error);
    return NextResponse.json(
      { error: "Failed to clean up website data" },
      { status: 500 },
    );
  }
}
