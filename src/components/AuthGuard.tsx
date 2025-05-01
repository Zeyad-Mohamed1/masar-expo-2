"use client";

import { useUser } from "@/hooks/useUser";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({
  children,
  requireAuth = true,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, refreshAuth } = useUser();
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Use next-auth session status directly
  const isNextAuthAuthenticated = status === "authenticated";
  const isNextAuthLoading = status === "loading";

  // Set initial check as done when next-auth completes its check
  useEffect(() => {
    if (status !== "loading") {
      setInitialCheckDone(true);
    }
  }, [status]);

  useEffect(() => {
    // Skip this check for sign-in page or when not requiring auth
    if (pathname === "/sign-in" || !requireAuth) {
      return;
    }

    // If session check is done and not authenticated, redirect to sign-in
    if (!isNextAuthLoading && !isNextAuthAuthenticated && initialCheckDone) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [
    isNextAuthLoading,
    isNextAuthAuthenticated,
    pathname,
    requireAuth,
    router,
    initialCheckDone,
  ]);

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
  if (
    pathname === "/sign-in" &&
    (isAuthenticated || isNextAuthAuthenticated) &&
    !isLoading &&
    !isNextAuthLoading
  ) {
    redirect("/");
  }

  // Show loading indicator only briefly or when truly loading auth state
  const showLoading = requireAuth && isNextAuthLoading && !initialCheckDone;

  return (
    <>
      {showLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-yellow-500"></div>
        </div>
      ) : (
        children
      )}
    </>
  );
}
