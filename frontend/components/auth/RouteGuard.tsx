"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { UserRole } from "@/types/user";
import { useAuth } from "@/context/AuthContext";
import AuthLoading from "./AuthLoading";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { user, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace("/");
    }
  }, [user, isLoaded, allowedRoles, router]);

  if (!isLoaded) {
    return <AuthLoading />;
  }

  if (!user) {
    return <AuthLoading />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <AuthLoading />;
  }

  return <>{children}</>;
}
