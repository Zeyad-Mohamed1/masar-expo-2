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
      {/* Developer Header */}
      <div className="border-base mb-8 overflow-hidden rounded-xl border-l-4 bg-gradient-to-l from-gray-100 to-gray-200 p-6 shadow-md">
        <div className="flex flex-col items-center md:flex-row md:items-start md:gap-8">
          <div className="mb-4 h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md md:mb-0 md:h-32 md:w-32">
            {developer.logo ? (
              <Image
                src={developer.logo}
                alt={developer.name}
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-gray-800 to-black text-white">
                <HomeIcon className="h-12 w-12 opacity-70" />
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-right">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {developer.name}
            </h1>
            <p className="mb-4 text-gray-600">
              {developer.description && developer.description.length > 120
                ? `${developer.description.substring(0, 120)}...`
                : developer.description || "مطور عقاري"}
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <div className="bg-base flex items-center rounded-full bg-opacity-10 px-4 py-1.5 text-sm text-gray-700">
                <Users className="ml-2 h-4 w-4 text-base" />
                <span>{developer.projects.length} مشروع</span>
              </div>
              <div className="bg-base flex items-center rounded-full bg-opacity-10 px-4 py-1.5 text-sm text-gray-700">
                <HomeIcon className="ml-2 h-4 w-4 text-base" />
                <span>
                  {developer.projects.reduce(
                    (sum, project) => sum + project.units,
                    0,
                  )}{" "}
                  وحدة
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Developer Info */}
        <div className="md:col-span-1">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
            <div className="bg-base border-b border-gray-100 bg-opacity-5 p-4">
              <h2 className="text-lg font-bold text-gray-900">
                معلومات الاتصال
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-6 space-y-4">
                <p className="flex items-center text-gray-600">
                  <Mail className="ml-3 h-5 w-5 text-base" />
                  <span className="ml-1 font-medium">
                    البريد الإلكتروني:
                  </span>{" "}
                  {developer.email}
                </p>
                <p className="flex items-center text-gray-600">
                  <Phone className="ml-3 h-5 w-5 text-base" />
                  <span className="ml-1 font-medium">رقم الهاتف:</span>{" "}
                  {developer.phone}
                </p>
              </div>

              {developer.zoomId && (
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <button
                    onClick={handleJoinMeeting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-white shadow-md transition-all hover:bg-gray-800 hover:shadow-lg active:bg-gray-900"
                  >
                    <Video className="h-5 w-5" />
                    <span className="font-medium">
                      انضم إلى الاجتماع المباشر
                    </span>
                  </button>
                  <p className="mt-2 text-center text-xs text-gray-500">
                    انقر للانضمام إلى المحادثة المباشرة مع المطور
                  </p>
                </div>
              )}

              {developer.description && (
                <div className="border-base bg-base mt-6 rounded-lg border border-opacity-20 bg-opacity-5 p-4">
                  <h2 className="mb-2 text-lg font-semibold text-gray-900">
                    نبذة عن المطور
                  </h2>
                  <p className="text-gray-700">{developer.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="md:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">المشاريع</h2>
            <span className="bg-base rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium text-gray-800">
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
                  className="hover:border-base group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg"
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
                    <div className="bg-base absolute left-0 top-0 m-3 rounded-full bg-opacity-10 px-3 py-1 text-sm font-semibold text-gray-800">
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
                      <div className="bg-base flex items-center rounded-full bg-opacity-10 px-3 py-1 text-sm text-gray-700">
                        <HomeIcon className="ml-1 h-4 w-4 text-base" />
                        <span>{project.units} وحدة</span>
                      </div>
                      <div className="bg-base flex items-center rounded-full bg-opacity-10 px-3 py-1 text-sm text-gray-700">
                        <MapPin className="ml-1 h-4 w-4 text-base" />
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
