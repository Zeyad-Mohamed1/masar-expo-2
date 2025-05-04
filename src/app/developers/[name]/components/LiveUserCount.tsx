"use client";

import { Users } from "lucide-react";
import { usePageViews } from "@/hooks/usePageViews";
import { useEffect, useState } from "react";

interface LiveUserCountProps {
  developerName: string;
}

export default function LiveUserCount({ developerName }: LiveUserCountProps) {
  const { viewerCount } = usePageViews(developerName);
  const [isLoading, setIsLoading] = useState(true);

  // Set loading state for a better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Display appropriate text based on count
  const displayText = () => {
    // Just started loading - initial state
    if (isLoading) {
      return "جاري التحميل...";
    }

    // Count is 0 (no users)
    if (viewerCount === 0) {
      return "لا يوجد متواجدين";
    }

    // Count is 1 (only current user)
    if (viewerCount === 1) {
      return "أنت فقط المتواجد";
    }

    // More than 1 user (current user + others)
    return `${viewerCount} متواجد الآن`;
  };

  return (
    <div
      className={`flex items-center rounded-full px-4 py-1.5 text-sm text-gray-700 transition-colors ${isLoading ? "bg-gray-100" : viewerCount > 1 ? "bg-green-100" : "bg-blue-100"}`}
    >
      <Users
        className={`ml-2 h-4 w-4 ${isLoading ? "text-gray-500" : viewerCount > 1 ? "text-green-600" : "text-blue-600"}`}
      />
      <span>{displayText()}</span>
    </div>
  );
}
