"use client";

import { ReactNode } from "react";

import RoleGuard from "@/components/RoleGuard";
import DriverSidebar from "@/components/driver/DriverSidebar";
import DriverHeader from "@/components/driver/DriverHeader";

export default function DriverLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["driver"]}>
      <div className="min-h-screen bg-slate-50">
        <DriverSidebar />

        <div className="lg:pl-64">
          <DriverHeader />

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
