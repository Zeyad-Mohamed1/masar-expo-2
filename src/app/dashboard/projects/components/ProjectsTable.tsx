"use client";

import { Project } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ProjectWithDeveloper extends Project {
  developer: {
    id: string;
    name: string;
  };
}

interface ProjectsTableProps {
  projects: ProjectWithDeveloper[];
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  if (projects.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 py-10 text-center shadow-inner">
        <p className="text-gray-500">لا توجد مشاريع حتى الآن</p>
        <Link
          href="/dashboard/projects/new"
          className="mt-4 inline-block font-medium text-yellow-500 hover:text-yellow-600"
        >
          إضافة أول مشروع
        </Link>
      </div>
    );
  }

  // Function to get status badge color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "مكتمل":
        return "bg-green-100 text-green-800";
      case "in progress":
      case "قيد الإنشاء":
        return "bg-blue-100 text-blue-800";
      case "planned":
      case "مخطط":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("حدث خطأ أثناء حذف المشروع");
        return;
      }

      // Refresh the page to show updated projects list
      router.refresh();
    } catch (error) {
      console.error("Error deleting project:", error);
      // Handle error state if needed
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  return (
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th
                scope="col"
                className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900"
              >
                الصورة
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
              >
                اسم المشروع
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
              >
                المطور
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
              >
                الموقع
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
              >
                الحالة
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
              >
                عدد الوحدات
              </th>
              <th scope="col" className="relative py-3.5 pl-4 pr-3">
                <span className="sr-only">الإجراءات</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap py-4 pl-3 pr-4">
                  {project.images && project.images.length > 0 ? (
                    <div className="relative h-14 w-20 overflow-hidden rounded-md">
                      <Image
                        src={project.images[0]}
                        alt={project.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-14 w-20 items-center justify-center rounded-md bg-gray-200">
                      <span className="text-xs text-gray-400">
                        لا توجد صورة
                      </span>
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                  {project.name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                  <Link
                    href={`/dashboard/developers/${project.developer.id}`}
                    className="font-medium text-yellow-600 hover:text-yellow-800"
                  >
                    {project.developer.name}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                  {project.location}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                  {project.units}
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-right text-sm">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="rounded p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                      title="عرض التفاصيل"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/dashboard/projects/${project.id}/edit`}
                      className="rounded p-1 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-800"
                      title="تعديل"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-800"
                      onClick={() => handleDeleteClick(project.id)}
                      title="حذف"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              تأكيد الحذف
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              هل أنت متأكد من رغبتك في حذف هذا المشروع؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                disabled={isDeleting}
              >
                إلغاء
              </button>
              <button
                onClick={() => confirmDelete(deleteId)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
