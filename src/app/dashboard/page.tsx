import { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  LayoutDashboard,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { PrismaClient } from "@prisma/client";
import PageHeader from "./components/PageHeader";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getDevelopers } from "./actions";

export const metadata: Metadata = {
  title: "لوحة التحكم | نظرة عامة",
  description: "نظرة عامة على المطورين والمشاريع العقارية",
};

export default async function DashboardPage() {
  // const { developerCount, projectCount, developers } =
  //   await getDeveloperStats();

  const developerCount = await prisma.developer.count();
  const projectCount = await prisma.project.count();

  const developers = await getDevelopers();
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="لوحة التحكم"
        iconName="LayoutDashboard"
        iconBgColor="bg-yellow-500"
        actionIcon={false}
      />

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Stats Card 1 */}
        <div className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-700">المطورين</h2>
            <div className="rounded-full bg-gray-100 p-2">
              <Users className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">{developerCount}</p>
            <p className="mt-1 text-sm text-gray-500">إجمالي المطورين</p>
          </div>
          <div className="mt-6">
            <Link
              href="/dashboard/developers"
              className="text-sm font-medium text-yellow-500 hover:text-yellow-600"
            >
              عرض المطورين
            </Link>
          </div>
        </div>

        {/* Stats Card 2 */}
        <div className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-700">المشاريع</h2>
            <div className="rounded-full bg-gray-100 p-2">
              <Building2 className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">{projectCount}</p>
            <p className="mt-1 text-sm text-gray-500">إجمالي المشاريع</p>
          </div>
          <div className="mt-6">
            <Link
              href="/dashboard/projects"
              className="text-sm font-medium text-yellow-500 hover:text-yellow-600"
            >
              عرض المشاريع
            </Link>
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-gray-800">إجراءات سريعة</h2>
          </div>
          <div className="flex flex-col gap-2 p-6">
            <Link
              href="/dashboard/developers/new"
              className="flex items-center justify-between rounded-lg border border-transparent bg-gray-50 p-3 text-gray-700 transition-colors hover:bg-gray-100 hover:text-yellow-500"
            >
              <span className="font-medium">إضافة مطور جديد</span>
              <Users className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard/projects/new"
              className="flex items-center justify-between rounded-lg border border-transparent bg-gray-50 p-3 text-gray-700 transition-colors hover:bg-gray-100 hover:text-yellow-500"
            >
              <span className="font-medium">إضافة مشروع جديد</span>
              <Building2 className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Developers - Limited preview without duplication */}
        <div className="rounded-xl bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-gray-800">أحدث المطورين</h2>
            <Link
              href="/dashboard/developers"
              className="text-sm font-medium text-yellow-500 hover:text-yellow-600"
            >
              عرض الكل
            </Link>
          </div>
          <div className="p-6">
            {developers?.length === 0 ? (
              <div className="rounded-lg bg-gray-50 py-8 text-center">
                <p className="text-gray-500">لا يوجد مطورين عقاريين بعد</p>
                <Link
                  href="/dashboard/developers/new"
                  className="mt-4 inline-flex items-center gap-1 rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-yellow-600"
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة مطور</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {developers?.slice(0, 3).map((developer) => (
                  <div
                    key={developer.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                  >
                    <div>
                      <Link
                        href={`/dashboard/developers/${developer.id}`}
                        className="font-medium text-gray-900 hover:text-yellow-500"
                      >
                        {developer.name}
                      </Link>
                      <p className="text-sm text-gray-500">{developer.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800">
                        {developer._count.projects} مشاريع
                      </span>
                      <Link
                        href={`/dashboard/developers/${developer.id}`}
                        className="rounded-full bg-gray-200 p-1 text-gray-700 hover:bg-yellow-100 hover:text-yellow-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
      </div>
    </div>
  );
}
