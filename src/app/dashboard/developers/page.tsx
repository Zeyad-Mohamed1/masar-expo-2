import { Metadata } from "next";
import { getDevelopers } from "../actions";
import DevelopersList from "../components/DevelopersList";
import PageHeader from "../components/PageHeader";

export const metadata: Metadata = {
  title: "المطورين العقاريين | لوحة التحكم",
  description: "قائمة المطورين العقاريين وإدارتهم",
};

export default async function DevelopersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="المطورين العقاريين"
        iconName="Users"
        iconBgColor="bg-blue-600"
        actionLink="/dashboard/developers/new"
        actionText="إضافة مطور"
      />

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <DevelopersList />
        </div>
      </div>
    </div>
  );
}
