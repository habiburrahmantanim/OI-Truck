"use client";

import { type ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/user";

/**
 * Maps a user role to its post-login landing page.
 * Reused by the login/register bounce logic and the guard's role redirect.
 */
export function dashboardFor(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";

    case "driver":
      return "/driver";

    default:
      return "/dashboard";
  }
}

function FullPageSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

        <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}

/**
 * Client-side route guard.
 *
 * Auth state lives in localStorage and is loaded asynchronously (`isLoaded`),
 * so server/middleware guards can't see it — protection must be client-side.
 *
 * - While auth is loading, renders a full-page spinner (avoids redirect flash
 *   and hydration mismatch).
 * - If unauthenticated, redirects to `/login?next=<current path>`.
 * - If a `role` is required and the user's role is not allowed, redirects to
 *   the user's own dashboard.
 * - All redirects run inside `useEffect`, never during render.
 */
export default function RouteGuard({
  role,
  children,
}: {
  role?: UserRole | UserRole[];
  children: ReactNode;
}) {
  const { user, isLoaded } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const roleAllowed =
    !role ||
    (user ? (Array.isArray(role) ? role : [role]).includes(user.role) : false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!roleAllowed) {
      router.replace(dashboardFor(user.role));
    }
  }, [isLoaded, user, roleAllowed, pathname, router]);

  if (!isLoaded) {
    return <FullPageSpinner />;
  }

  if (!user) {
    return <FullPageSpinner label="Redirecting to login..." />;
  }

  if (!roleAllowed) {
    return <FullPageSpinner label="Redirecting..." />;
  }

  return <>{children}</>;
}
