"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  ShieldCheck,
  Truck,
  Users,
  X,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/trucks", label: "Trucks", icon: Truck },
  { href: "/admin/drivers", label: "Drivers", icon: ShieldCheck },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-68 flex-col bg-slate-950 text-slate-300 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-18 items-center justify-between border-b border-white/10 px-5">
          <Link href="/admin" onClick={onClose} className="flex items-center gap-3 text-lg font-bold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500"><Truck size={20} /></span>
            Truck<span className="text-orange-400">Lagbe</span>
          </Link>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Operations</p>
          <div className="mt-3 space-y-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
              return (
                <Link key={href} href={href} onClick={onClose} className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${active ? "bg-orange-500 text-white" : "hover:bg-white/8 hover:text-white"}`}>
                  <Icon size={19} />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">AR</span>
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">Admin Rahman</p><p className="text-xs text-slate-500">Administrator</p></div>
          </div>
        </div>
      </aside>
    </>
  );
}
