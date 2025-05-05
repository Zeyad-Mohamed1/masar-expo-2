"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  Users,
  UsersRound,
  X,
  Link2,
  Globe,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle window resize
  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path: string) => {
    // For the main dashboard page, only match exact path
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    // For other pages, check if path matches or starts with path/
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { name: "الرئيسية", path: "/dashboard", icon: Home },
    { name: "المطورين", path: "/dashboard/developers", icon: Users },
    // { name: "المشاريع", path: "/dashboard/projects", icon: Building2 },
    { name: "الزوار", path: "/dashboard/visitors", icon: UsersRound },
    { name: "رابط الدعوة", path: "/dashboard/link", icon: Link2 },
    { name: "بيانات الموقع", path: "/dashboard/website", icon: Globe },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Mobile toggle button
  const MobileMenuToggle = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="fixed left-4 top-4 z-30 rounded-full bg-yellow-500 p-2 text-black shadow-lg md:hidden"
    >
      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  if (!mounted) return null;

  return (
    <>
      <MobileMenuToggle />

      <aside
        className={`fixed inset-y-0 right-0 z-20 w-72 overflow-y-auto bg-white text-gray-800 shadow-lg transition-all duration-300 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "translate-x-full md:translate-x-0"
        } md:relative md:translate-x-0`}
      >
        {/* Header/Logo Section */}
        <div className="flex h-20 items-center border-b border-gray-200 bg-yellow-500 px-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-white"></div>
            <h2 className="text-xl font-bold text-white">لوحة التحكم</h2>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="mt-8 px-4">
          <div className="mb-3 px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            القائمة الرئيسية
          </div>
          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`group flex items-center justify-between rounded-lg px-3 py-3 transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-yellow-500 font-medium text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100 hover:text-yellow-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`h-5 w-5 ${
                          isActive(item.path)
                            ? "text-white"
                            : "text-gray-500 group-hover:text-yellow-500"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {isActive(item.path) && (
                      <ChevronRight className="h-4 w-4 text-white" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Status Section */}
        <div className="mt-10 px-6">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
            <p className="text-sm font-medium text-yellow-500">
              مرحباً بك في لوحة التحكم
            </p>
            <p className="mt-1 text-xs text-gray-500">
              يمكنك إدارة المطورين والمشاريع من هنا
            </p>
          </div>
        </div>

        {/* Footer/Logout Section */}
        <div className="absolute bottom-0 w-full border-t border-gray-200 bg-gray-50 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <span className="font-medium">تسجيل الخروج</span>
            <LogOut className="h-5 w-5 text-red-500" />
          </button>
        </div>
      </aside>
    </>
  );
}
