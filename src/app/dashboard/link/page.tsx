import { Metadata } from "next";
import PageHeader from "../components/PageHeader";
import LinkForm from "../components/LinkForm";

export const metadata: Metadata = {
  title: "إدارة رابط الدعوة",
  description: "إدارة رابط الدعوة للاجتماعات",
};

export default function LinkManagementPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="إدارة رابط الدعوة"
        iconName="Link2"
        iconBgColor="bg-blue-500"
      />

      <div className="max-w-3xl">
        <LinkForm />
      </div>
    </div>
  );
}
