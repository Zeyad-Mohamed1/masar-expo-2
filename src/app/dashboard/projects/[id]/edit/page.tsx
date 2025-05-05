import { Metadata } from "next";
// import { getProjectById } from "@/app/dashboard/actions";
import ProjectForm from "../../components/ProjectForm";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "تعديل مشروع عقاري | لوحة التحكم",
  description: "تعديل بيانات مشروع عقاري في النظام",
};

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  // const project = await getProjectById(id);

  // if (!project) {
  //   notFound();
  // }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {/* <h1 className="text-2xl font-bold">تعديل مشروع: {project.name}</h1> */}
      </div>
      {/* <ProjectForm project={project} /> */}
    </div>
  );
}
