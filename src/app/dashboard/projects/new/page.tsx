import { Metadata } from "next";
import ProjectForm from "../components/ProjectForm";

export const metadata: Metadata = {
  title: "إضافة مشروع عقاري جديد | لوحة التحكم",
  description: "إضافة مشروع عقاري جديد إلى النظام",
};

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إضافة مشروع عقاري جديد</h1>
      </div>
      <ProjectForm />
    </div>
  );
}
