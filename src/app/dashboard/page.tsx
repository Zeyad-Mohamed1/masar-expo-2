import { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  LayoutDashboard,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { PrismaClient } from "@prisma/client";
import PageHeader from "./components/PageHeader";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getDevelopers } from "./actions";
import MainDashboard from "./components/MainDasboard";

export const metadata: Metadata = {
  title: "لوحة التحكم | نظرة عامة",
  description: "نظرة عامة على المطورين والمشاريع العقارية",
};

export default async function DashboardPage() {
  return <MainDashboard />;
}
