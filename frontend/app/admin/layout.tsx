"use client";

import { ReactNode, useState } from "react";

import RoleGuard from "@/components/RoleGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="lg:pl-64">
          <AdminHeader onMenuOpen={() => setSidebarOpen(true)} />

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
