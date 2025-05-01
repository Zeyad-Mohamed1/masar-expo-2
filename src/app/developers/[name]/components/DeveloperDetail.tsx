"use client";

import Image from "next/image";
import { Developer, Project } from "@prisma/client";
import {
  Mail,
  Phone,
  Video,
  MapPin,
  HomeIcon,
  Tag,
  CheckCircle,
  Calendar,
  Users,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type DeveloperWithProjects = Developer & {
  projects: Project[];
};

interface DeveloperDetailProps {
  developer: DeveloperWithProjects;
}

const DeveloperDetail = ({ developer }: DeveloperDetailProps) => {
  const router = useRouter();

  const handleJoinMeeting = () => {
    if (developer.zoomId) {
      router.push(`/meeting/${developer.zoomId}?guest=true`);
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Custom styles for HTML content */}
      <style jsx global>{`
        .developer-long-description h1 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #1f2937;
        }
        .developer-long-description ul {
          list-style-type: disc;
          padding-right: 2rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .developer-long-description li {
          margin-top: 0.5rem;
          color: #4b5563;
        }
      `}</style>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Developer profile card - Image and title */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="relative p-6">
            {/* Yellow accent bar */}

            <div className="flex flex-col items-center md:items-start">
              <div className="flex flex-col md:flex-row md:items-center md:gap-6">
                <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-md transition-transform hover:scale-105 md:mb-0">
                  {developer.logo ? (
                    <Image
                      src={developer.logo}
                      alt={developer.name}
                      width={144}
                      height={144}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-gray-800 to-black text-white">
                      <HomeIcon className="h-12 w-12 opacity-70" />
                    </div>
                  )}
                </div>

                <div className="text-center md:text-right">
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    {developer.name}
                  </h1>
                  <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                    <div className="flex items-center rounded-full bg-yellow-100 px-4 py-1.5 text-sm text-gray-700">
                      <Users className="ml-2 h-4 w-4 text-yellow-600" />
                      <span>{developer.projects.length} مشروع</span>
                    </div>
                    <div className="flex items-center rounded-full bg-yellow-100 px-4 py-1.5 text-sm text-gray-700">
                      <HomeIcon className="ml-2 h-4 w-4 text-yellow-600" />
                      <span>
                        {developer.projects.reduce(
                          (sum, project) => sum + project.units,
                          0,
                        )}{" "}
                        وحدة
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">
                    {developer.shortDescription || "لا يوجد وصف موجز"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact information card */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="relative bg-gray-50 p-6">
            {/* Yellow accent bar */}

            <div className="mx-auto max-w-sm">
              <h3 className="mb-6 border-b border-gray-200 pb-2 text-center text-lg font-semibold text-gray-800">
                معلومات الاتصال
              </h3>

              <div className="mb-5 flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                  <Mail className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="mr-4">
                  <div className="text-xs text-gray-500">البريد الإلكتروني</div>
                  <div className="font-medium text-gray-800">
                    {developer.email}
                  </div>
                </div>
              </div>

              <div className="mb-5 flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                  <Phone className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="mr-4">
                  <div className="text-xs text-gray-500">رقم الهاتف</div>
                  <div className="font-medium text-gray-800">
                    {developer.phone}
                  </div>
                </div>
              </div>

              {developer.zoomId && (
                <button
                  onClick={handleJoinMeeting}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-l from-black to-gray-800 px-4 py-3 text-white transition-all hover:from-gray-900 hover:to-black hover:shadow-md"
                >
                  <Video className="h-5 w-5" />
                  <span>انضم إلى الاجتماع المباشر</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Long Description - Sticky on left side */}
        <div className="md:col-span-1">
          <div className="sticky top-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
            {developer.longDescription ? (
              <div className="p-6">
                <h2 className="mb-4 flex items-center rounded-lg bg-yellow-50 px-4 py-3 text-xl font-bold text-gray-900">
                  <Tag className="ml-2 h-5 w-5 text-yellow-600" />
                  <span>نبذة عن المطور</span>
                </h2>
                <div
                  className="developer-long-description text-right"
                  dangerouslySetInnerHTML={{
                    __html: developer.longDescription,
                  }}
                />
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                لا يوجد وصف مفصل للمطور
              </div>
            )}
          </div>
        </div>

        {/* Projects */}
        <div className="md:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">المشاريع</h2>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-gray-800">
              {developer.projects.length} مشروع
            </span>
          </div>

          {developer.projects.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <p className="text-center text-gray-500">لا توجد مشاريع متاحة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {developer.projects.map((project) => (
                <div
                  key={project.id}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:border-yellow-400 hover:shadow-lg"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    {project.images && project.images.length > 0 ? (
                      <Image
                        src={project.images[0]}
                        alt={project.name}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400">
                        <HomeIcon className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute left-0 top-0 m-3 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-gray-800">
                      {project.status === "completed"
                        ? "مكتمل"
                        : project.status === "in_progress"
                          ? "قيد الإنشاء"
                          : project.status === "planned"
                            ? "مخطط"
                            : project.status}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-3 text-xl font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <div className="flex items-center rounded-full bg-yellow-50 px-3 py-1 text-sm text-gray-700">
                        <HomeIcon className="ml-1 h-4 w-4 text-yellow-600" />
                        <span>{project.units} وحدة</span>
                      </div>
                      <div className="flex items-center rounded-full bg-yellow-50 px-3 py-1 text-sm text-gray-700">
                        <MapPin className="ml-1 h-4 w-4 text-yellow-600" />
                        <span>{project.location}</span>
                      </div>
                    </div>
                    {project.description && (
                      <div className="mt-3 border-t border-gray-100 pt-3">
                        <p className="line-clamp-3 text-sm text-gray-700">
                          {project.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDetail;
