import { ReactNode } from "react";
import DashboardSidebar from "./components/DashboardSidebar";
import { Metadata } from "next";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "لوحة التحكم | إدارة المطورين العقاريين",
  description: "لوحة تحكم للمشرفين لإدارة المطورين العقاريين ومشاريعهم",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div dir="rtl" className="flex min-h-screen overflow-hidden bg-gray-50">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <main className="flex-1 overflow-auto px-4 py-6 md:px-6 md:py-8">
            {children}
          </main>
          <footer className="border-t border-gray-200 bg-white py-4 text-center text-sm text-gray-500">
            <p>
              نظام إدارة المطورين والمشاريع العقارية ©{" "}
              {new Date().getFullYear()}
            </p>
          </footer>
        </div>
      </div>
    </AuthGuard>
  );
}
