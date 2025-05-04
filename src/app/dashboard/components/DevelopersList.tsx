"use client";

import { Developer } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { Eye, Pencil, Plus, Trash, X } from "lucide-react";
import { useState } from "react";

interface DeveloperWithProjects extends Developer {
  _count?: {
    projects: number;
  };
}

interface DevelopersListProps {
  developers: DeveloperWithProjects[];
}

export default function DevelopersList({
  developers: initialDevelopers,
}: DevelopersListProps) {
  const [developers, setDevelopers] = useState(initialDevelopers);
  const [developerToDelete, setDeveloperToDelete] = useState<Developer | null>(
    null,
  );

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/developers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete developer");
      }

      setDevelopers(developers.filter((developer) => developer.id !== id));
      setDeveloperToDelete(null);
    } catch (error) {
      console.error("Error deleting developer:", error);
    }
  };

  return (
    <div>
      {developers.length === 0 ? (
        <div className="rounded-lg bg-gray-50 py-10 text-center shadow-inner">
          <p className="text-gray-500">لا يوجد مطورين عقاريين بعد</p>
          <Link
            href="/dashboard/developers/new"
            className="mt-4 inline-block font-medium text-yellow-500 hover:text-yellow-600"
          >
            إضافة أول مطور
          </Link>
        </div>
      ) : (
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900"
                  >
                    الشعار
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                  >
                    الاسم
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                  >
                    البريد الإلكتروني
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                  >
                    الهاتف
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                  >
                    عدد المشاريع
                  </th>
                  <th scope="col" className="relative py-3.5 pl-4 pr-3">
                    <span className="sr-only">الإجراءات</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {developers.map((developer) => (
                  <tr key={developer.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-3 pr-4">
                      {developer.logo ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={developer.logo}
                            alt={developer.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                          <span className="text-sm font-bold text-gray-500">
                            {developer.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                      {developer.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                      {developer.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                      {developer.phone}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                      {developer._count?.projects || 0}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-right text-sm">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/dashboard/developers/${developer.id}`}
                          className="rounded p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/dashboard/developers/${developer.id}/edit`}
                          className="rounded p-1 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-800"
                          onClick={() => setDeveloperToDelete(developer)}
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
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {developerToDelete && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setDeveloperToDelete(null)}
            />
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle">
              &#8203;
            </span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-right shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mr-4 sm:mt-0 sm:text-right">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      حذف المطور
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        هل أنت متأكد من حذف &ldquo;{developerToDelete.name}
                        &rdquo;؟ هذا الإجراء لا يمكن التراجع عنه.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:mr-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDelete(developerToDelete.id)}
                >
                  حذف
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setDeveloperToDelete(null)}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
