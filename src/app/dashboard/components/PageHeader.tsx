"use client";

import {
  LucideIcon,
  Plus,
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  FileText,
} from "lucide-react";
import Link from "next/link";

// Define allowed icon types
type IconName =
  | "LayoutDashboard"
  | "Users"
  | "Building2"
  | "Settings"
  | "FileText";

interface PageHeaderProps {
  title: string;
  iconName?: IconName;
  iconBgColor?: string;
  iconColor?: string;
  actionLink?: string;
  actionText?: string;
  actionIcon?: boolean;
}

export default function PageHeader({
  title,
  iconName,
  iconBgColor = "bg-yellow-500",
  iconColor = "text-white",
  actionLink,
  actionText,
  actionIcon = true,
}: PageHeaderProps) {
  // Icon mapping
  const iconMap: Record<IconName, LucideIcon> = {
    LayoutDashboard,
    Users,
    Building2,
    Settings,
    FileText,
  };

  // Get the icon component
  const Icon = iconName ? iconMap[iconName] : null;

  return (
    <div className="mb-8 border-b border-gray-200 pb-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`rounded-lg ${iconBgColor} p-2`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        {actionLink && actionText && (
          <div className="flex items-center gap-2">
            <Link
              href={actionLink}
              className="flex items-center gap-2 rounded-md bg-yellow-500 px-4 py-2 font-medium text-black shadow-sm transition-colors hover:bg-yellow-600"
            >
              {actionIcon && <Plus className="h-4 w-4" />}
              <span>{actionText}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
