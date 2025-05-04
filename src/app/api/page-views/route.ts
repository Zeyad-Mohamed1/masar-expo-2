import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// In-memory store for real-time user counts
// This will reset when the server restarts
const activeUsers: Record<string, Set<string>> = {};

export async function POST(request: NextRequest) {
  try {
    // Check content type to handle both JSON and text/plain (for navigator.sendBeacon)
    let data;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await request.json();
    } else if (contentType.includes("text/plain")) {
      // Handle sendBeacon which sends as text/plain
      const text = await request.text();
      data = JSON.parse(text);
    } else {
      // Try to parse as JSON anyway as a fallback
      try {
        data = await request.json();
      } catch (e) {
        const text = await request.text();
        data = JSON.parse(text);
      }
    }

    const { developerName, sessionId, action } = data;

    if (!developerName || !sessionId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!activeUsers[developerName]) {
      activeUsers[developerName] = new Set();
    }

    // Add or remove user from active users
    if (action === "enter") {
      activeUsers[developerName].add(sessionId);
    } else if (action === "leave") {
      activeUsers[developerName].delete(sessionId);
    }

    // Get current count
    const count = activeUsers[developerName].size;

    // Update database count (optional)
    await prisma.developer.update({
      where: { name: developerName },
      data: { count },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error handling page view:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const developerName = request.nextUrl.searchParams.get("developerName");

    if (!developerName) {
      return NextResponse.json(
        { error: "Missing developerName parameter" },
        { status: 400 },
      );
    }

    // Get current real-time count
    const count = activeUsers[developerName]?.size || 0;

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching page views:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
