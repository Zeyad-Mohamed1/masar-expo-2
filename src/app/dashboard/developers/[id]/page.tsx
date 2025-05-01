import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Building2, Clock, Mail, Pencil, Phone } from "lucide-react";
import { getDeveloperById } from "../../actions";
import ProjectsList from "./components/ProjectsList";

export const metadata: Metadata = {
  title: "تفاصيل المطور العقاري | لوحة التحكم",
  description: "عرض تفاصيل المطور العقاري ومشاريعه",
};

interface DeveloperDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function DeveloperDetailsPage({
  params,
}: DeveloperDetailsPageProps) {
  const developer = await getDeveloperById(params.id);

  if (!developer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">تفاصيل المطور العقاري</h1>
        <Link
          href={`/dashboard/developers/${developer.id}/edit`}
          className="flex items-center gap-2 rounded-md bg-yellow-500 px-4 py-2 text-black transition-colors hover:bg-yellow-600"
        >
          <Pencil className="h-4 w-4" />
          <span>تعديل</span>
        </Link>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-shrink-0">
            {developer.logo ? (
              <div className="relative h-32 w-32 overflow-hidden rounded-lg">
                <Image
                  src={developer.logo}
                  alt={developer.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-gray-200">
                <span className="text-2xl font-bold text-gray-500">
                  {developer.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="mb-4 text-2xl font-bold">{developer.name}</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{developer.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{developer.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  {developer.projects.length} مشروع
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  {new Date(developer.createdAt).toLocaleDateString("ar-SA")}
                </span>
              </div>
            </div>

            {developer.description && (
              <div className="mt-4">
                <h3 className="mb-2 text-lg font-medium">الوصف</h3>
                <p className="text-gray-700">{developer.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-semibold">مشاريع المطور</h2>
        <ProjectsList projects={developer.projects} />
      </div>
    </div>
  );
}
