import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const link = await prisma.link.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error("Error fetching link:", error);
    return NextResponse.json({ error: "Error fetching link" }, { status: 500 });
  }
}
