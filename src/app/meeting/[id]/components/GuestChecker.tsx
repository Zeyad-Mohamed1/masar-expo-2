"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface GuestCheckerProps {
  meetingId: string;
}

export default function GuestChecker({ meetingId }: GuestCheckerProps) {
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for visitor data
    const storedName = localStorage.getItem("visitorName");
    const storedPhone = localStorage.getItem("visitorPhone");

    if (storedName && storedPhone) {
      // Visitor data exists, redirect to guest mode
      router.replace(`/meeting/${meetingId}?guest=true`);
    }
  }, [meetingId, router]);

  // This component doesn't render anything visible
  return null;
}
