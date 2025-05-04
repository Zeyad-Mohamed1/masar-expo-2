"use client";

import { Users } from "lucide-react";
import { usePageViews } from "@/hooks/usePageViews";

interface LiveUserCountBadgeProps {
  developerName: string;
}

export default function LiveUserCountBadge({
  developerName,
}: LiveUserCountBadgeProps) {
  const { viewerCount } = usePageViews(developerName);

  return (
    <span className="text-sm text-gray-700">
      {viewerCount > 0 ? viewerCount : 0}
    </span>
  );
}
