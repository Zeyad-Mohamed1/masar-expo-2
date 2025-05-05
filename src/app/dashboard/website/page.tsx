import { Metadata } from "next";
import PageHeader from "../components/PageHeader";
import WebsiteDataForm from "./components/WebsiteDataForm";
import { getWebsiteData, updateWebsiteData } from "../actions";

export const metadata: Metadata = {
  title: "إدارة بيانات الموقع | لوحة التحكم",
  description: "تعديل بيانات الموقع مثل البانر وقسم من نحن",
};

export default async function WebsiteDataPage() {
  const websiteData = await getWebsiteData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="بيانات الموقع"
        iconName="Globe"
        iconBgColor="bg-blue-500"
        actionIcon={false}
      />

      {/* Website Data Form */}
      <WebsiteDataForm websiteData={websiteData} onSubmit={updateWebsiteData} />
    </div>
  );
}
