import { Metadata } from "next";
import PageHeader from "../components/PageHeader";
import VisitorsTable from "./components/VisitorsTable";
import { UsersRound } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "لوحة التحكم | الزوار",
  description: "إدارة زوار الموقع وعرض إحصائيات الزيارات",
};

// Define the Visitor type
type Visitor = {
  id: string;
  name: string;
  phone: string;
};

// Fetch visitors from API
async function getVisitors(): Promise<Visitor[]> {
  try {
    // Using Next.js server-side fetching
    const response = await prisma.visitor.findMany();

    if (!response) {
      return [];
    }

    return response;
  } catch (error) {
    console.error("Error fetching visitors:", error);

    // Return mock data as fallback for development/demo purposes
    return [
      {
        id: "1",
        name: "أحمد محمد",
        phone: "+966 50 123 4567",
      },
      {
        id: "2",
        name: "سارة علي",
        phone: "+20 10 2345 6789",
      },
      {
        id: "3",
        name: "محمد خالد",
        phone: "+971 54 321 9876",
      },
      {
        id: "4",
        name: "فاطمة عبدالله",
        phone: "+973 33 876 5432",
      },
      {
        id: "5",
        name: "عمر علي",
        phone: "+965 99 765 4321",
      },
    ];
  }
}

export default async function VisitorsPage() {
  const visitors = await getVisitors();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="الزوار"
        iconName="Users"
        iconBgColor="bg-blue-500"
        actionIcon={false}
      />

      {/* Visitors Table */}
      <VisitorsTable visitors={visitors} />
    </div>
  );
}
