import DeveloperDetail from "./components/DeveloperDetail";
import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function generateMetadata({
  params,
}: {
  params: { name: string };
}) {
  const { name } = params;
  const decodedName = decodeURIComponent(name);

  return {
    title: `${decodedName} - Developer Profile`,
    description: `View details and projects of ${decodedName}`,
  };
}

async function getDeveloperByName(name: string) {
  try {
    const developer = await prisma.developer.findUnique({
      where: { name },
      include: {
        projects: true,
      },
    });

    return developer;
  } catch (error) {
    console.error("Error fetching developer:", error);
    return null;
  }
}

export default async function DeveloperDetailPage({
  params,
}: {
  params: { name: string };
}) {
  const { name } = params;
  const decodedName = decodeURIComponent(name);

  const developer = await getDeveloperByName(decodedName);

  if (!developer) {
    notFound();
  }

  return <DeveloperDetail developer={developer} />;
}
