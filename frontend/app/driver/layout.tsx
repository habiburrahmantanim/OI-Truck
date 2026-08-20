"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import DriverHeader from "@/components/driver/DriverHeader";
import DriverSidebar from "@/components/driver/DriverSidebar";
import RouteGuard from "@/components/auth/RouteGuard";

export default function DriverLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Driver registration is public: render it without the portal chrome/guard.
  if (pathname === "/driver/register") {
    return <>{children}</>;
  }

  return (
    <RouteGuard role="driver">
      <div className="min-h-screen bg-slate-50">
        <DriverSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <div className="lg:pl-68">
          <DriverHeader onMenuOpen={() => setMenuOpen(true)} />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </RouteGuard>
  );
}
