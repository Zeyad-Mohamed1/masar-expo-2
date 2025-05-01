"use client";

import { Developer } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { Eye, Pencil, Plus, Trash } from "lucide-react";

interface DeveloperWithProjects extends Developer {
  _count?: {
    projects: number;
  };
}

interface DevelopersListProps {
  developers: DeveloperWithProjects[];
}

export default function DevelopersList({ developers }: DevelopersListProps) {
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
                          onClick={() => {
                            /* Handle delete */
                          }}
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
    </div>
  );
}
