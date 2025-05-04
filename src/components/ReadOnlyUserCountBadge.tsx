"use client";

import { Users } from "lucide-react";
import { usePageViewsCount } from "@/hooks/usePageViewsCount";

interface ReadOnlyUserCountBadgeProps {
  developerName: string;
}

export default function ReadOnlyUserCountBadge({
  developerName,
}: ReadOnlyUserCountBadgeProps) {
  const { viewerCount, isLoading } = usePageViewsCount(developerName);

  return (
    <span className="text-sm text-gray-700">
      {isLoading ? "..." : viewerCount}
    </span>
  );
}
