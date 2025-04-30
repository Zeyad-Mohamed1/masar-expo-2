"use client";

import { useUser } from "@/hooks/useUser";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { redirect } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({
  children,
  requireAuth = true,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, refreshAuth } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip this check for sign-in page or when not requiring auth
    if (pathname === "/sign-in" || !requireAuth) {
      return;
    }

    // If not loading and not authenticated, redirect to sign-in
    if (!isLoading && !isAuthenticated) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, pathname, requireAuth, router]);

  useEffect(() => {
    // Refresh auth status every 5 minutes
    const intervalId = setInterval(
      () => {
        refreshAuth();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(intervalId);
  }, [refreshAuth]);

  // For sign-in page, redirect to home if already authenticated
  if (pathname === "/sign-in" && isAuthenticated && !isLoading) {
    redirect("/");
  }

  // Show loading indicator or children
  return (
    <>
      {isLoading && requireAuth ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
        </div>
      ) : (
        children
      )}
    </>
  );
}
