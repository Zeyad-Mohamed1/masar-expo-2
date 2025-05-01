import { Metadata } from "next";
import DeveloperForm from "../components/DeveloperForm";

export const metadata: Metadata = {
  title: "إضافة مطور عقاري جديد | لوحة التحكم",
  description: "إضافة مطور عقاري جديد إلى النظام",
};

export default function NewDeveloperPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إضافة مطور عقاري جديد</h1>
      </div>
      <DeveloperForm />
    </div>
  );
}
