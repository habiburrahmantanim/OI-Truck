"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type UserRole = "customer" | "driver" | "admin";

interface RouteGuardProps {
  children: ReactNode;
  role?: UserRole;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export default function RouteGuard({
  children,
  role,
  allowedRoles,
  redirectTo = "/login",
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isLoaded } = useAuth();

  /*
   * Support both:
   *
   * <RouteGuard role="customer">
   *
   * and:
   *
   * <RouteGuard allowedRoles={["customer", "admin"]}>
   */

  const roles: UserRole[] = allowedRoles ?? (role ? [role] : []);

  useEffect(() => {
    if (!isLoaded) return;

    // User is not logged in
    if (!user) {
      router.replace(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // No role restriction
    if (roles.length === 0) {
      return;
    }

    // User has the wrong role
    if (!roles.includes(user.role)) {
      if (user.role === "admin") {
        router.replace("/admin");
      } else if (user.role === "driver") {
        router.replace("/driver");
      } else {
        router.replace("/");
      }
    }
  }, [isLoaded, user, roles, router, pathname, redirectTo]);

  /*
   * Loading state
   */
  if (!isLoaded) {
    return <AuthLoading />;
  }

  /*
   * Not authenticated
   */
  if (!user) {
    return <AuthLoading />;
  }

  /*
   * Wrong role
   */
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <AuthLoading />;
  }

  /*
   * Authorized
   */
  return <>{children}</>;
}

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />

        <p className="mt-4 text-sm font-medium text-slate-600">
          Checking authentication...
        </p>
      </div>
    </div>
  );
}
