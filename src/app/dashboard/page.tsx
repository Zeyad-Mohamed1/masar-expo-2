import { Metadata } from "next";
import MainDashboard from "./components/MainDasboard";

export const metadata: Metadata = {
  title: "لوحة التحكم | نظرة عامة",
  description: "نظرة عامة على المطورين والمشاريع العقارية",
};

export default async function DashboardPage() {
  return <MainDashboard />;
}
