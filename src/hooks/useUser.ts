import { useCallback, useEffect } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export const useUser = () => {
  const router = useRouter();
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    setError,
    setUser,
    checkAuth,
    logout,
  } = useUserStore();

  // Automatically check authentication on mount
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, isLoading, checkAuth]);

  // Logout function that clears both store and next-auth session
  const handleLogout = useCallback(async () => {
    try {
      // First sign out from next-auth
      await signOut({ redirect: false });
      // Then clear our store state
      logout();
      // Navigate to sign-in page
      router.push("/sign-in");
    } catch (error) {
      setError("Logout failed");
      console.error("Logout error:", error);
    }
  }, [logout, router, setError]);

  // Function to force refresh authentication
  const refreshAuth = useCallback(() => {
    return checkAuth();
  }, [checkAuth]);

  // Function to get full user details from API
  const getFullUserDetails = useCallback(async () => {
    if (!isAuthenticated) return null;

    try {
      const response = await fetch("/api/auth/get-user");

      if (!response.ok) {
        const error = await response.json();
        setError(error.message || "Failed to fetch user details");
        return null;
      }

      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (error) {
      setError("Failed to fetch user details");
      console.error("Error fetching user details:", error);
      return null;
    }
  }, [isAuthenticated, setError, setUser]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    logout: handleLogout,
    refreshAuth,
    getFullUserDetails,
  };
};
