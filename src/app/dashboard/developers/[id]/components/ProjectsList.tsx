"use client";

import { Project } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { Eye, MapPin, Tag } from "lucide-react";

interface ProjectsListProps {
  projects: Project[];
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 py-8 text-center">
        <p className="text-gray-500">لا توجد مشاريع لهذا المطور حتى الآن</p>
        <Link
          href="/dashboard/projects/new"
          className="mt-4 inline-block text-yellow-500 hover:text-yellow-600"
        >
          إضافة مشروع جديد
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md"
        >
          <div className="relative h-48 w-full">
            {project.images && project.images.length > 0 ? (
              <Image
                src={project.images[0]}
                alt={project.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <span className="text-lg text-gray-400">لا توجد صورة</span>
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="mb-2 text-lg font-bold">{project.name}</h3>

            <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{project.location}</span>
            </div>

            <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
              <Tag className="h-4 w-4" />
              <span className="rounded-full bg-gray-100 px-2 py-1">
                {project.status}
              </span>
              <span className="ml-2">{project.units} وحدة</span>
            </div>

            <Link
              href={`/dashboard/projects/${project.id}`}
              className="mt-2 flex items-center gap-2 text-yellow-500 hover:text-yellow-600"
            >
              <Eye className="h-4 w-4" />
              <span>عرض التفاصيل</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
