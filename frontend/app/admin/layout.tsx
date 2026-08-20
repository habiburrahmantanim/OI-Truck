"use client";

import { useState, type ReactNode } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import RouteGuard from "@/components/auth/RouteGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <RouteGuard role="admin">
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <div className="lg:pl-68">
          <AdminHeader onMenuOpen={() => setMenuOpen(true)} />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </RouteGuard>
  );
}
