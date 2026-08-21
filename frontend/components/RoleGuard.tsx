"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/user";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { user, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    // User is not logged in
    if (!user) {
      router.replace("/login");
      return;
    }

    // User does not have permission
    if (!allowedRoles.includes(user.role)) {
      if (user.role === "admin") {
        router.replace("/admin");
      } else if (user.role === "driver") {
        router.replace("/driver");
      } else {
        router.replace("/");
      }
    }
  }, [user, isLoaded, allowedRoles, router]);

  // Wait until localStorage authentication is loaded
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />

          <p className="mt-4 text-sm font-medium text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return null;
  }

  // Unauthorized role
  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
