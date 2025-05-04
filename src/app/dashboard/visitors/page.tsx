import { Metadata } from "next";
import PageHeader from "../components/PageHeader";
import VisitorsTable from "./components/VisitorsTable";

export const metadata: Metadata = {
  title: "لوحة التحكم | الزوار",
  description: "إدارة زوار الموقع وعرض إحصائيات الزيارات",
};

export default async function VisitorsPage() {
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
      <VisitorsTable />
    </div>
  );
}
