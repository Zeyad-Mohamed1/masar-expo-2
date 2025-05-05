import { Metadata } from "next";
// import { getProjects } from "../actions";
import ProjectsTable from "./components/ProjectsTable";
import PageHeader from "../components/PageHeader";

export const metadata: Metadata = {
  title: "المشاريع العقارية | لوحة التحكم",
  description: "عرض وإدارة المشاريع العقارية",
};

export default async function ProjectsPage() {
  // const projects = await getProjects();

  return (
    <div className="space-y-6">
      <PageHeader
        title="المشاريع العقارية"
        iconName="Building2"
        iconBgColor="bg-yellow-500"
        actionLink="/dashboard/projects/new"
        actionText="إضافة مشروع"
      />

      <div className="mb-4 rounded-md bg-white p-4 shadow">
        <p className="text-sm text-gray-600">
          عرض جميع المشاريع العقارية المسجلة في النظام. يمكنك إضافة أو تعديل أو
          حذف المشاريع من هنا.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            قائمة المشاريع
          </h2>
          {/* <ProjectsTable projects={projects} /> */}
        </div>
      </div>
    </div>
  );
}
