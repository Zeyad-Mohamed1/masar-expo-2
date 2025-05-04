import { Metadata } from "next";
import { getDeveloperById } from "@/app/dashboard/actions";
import DeveloperForm from "../../components/DeveloperForm";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "تعديل مطور عقاري | لوحة التحكم",
  description: "تعديل معلومات مطور عقاري",
};

export default async function EditDeveloperPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const developer = await getDeveloperById(id);

  if (!developer) {
    return <div>Developer not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">تعديل مطور: {developer.name}</h1>
      </div>
      <DeveloperForm developer={developer} />
    </div>
  );
}
