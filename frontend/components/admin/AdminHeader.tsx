"use client";

import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function AdminHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenuOpen} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open menu"><Menu size={22} /></button>
        <div className="hidden items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-400 sm:flex"><Search size={17} /><input aria-label="Search" placeholder="Search operations..." className="w-44 bg-transparent outline-none" /></div>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className="relative rounded-md p-2 text-slate-600 hover:bg-slate-100" aria-label="Notifications"><Bell size={20} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500" /></button>
        {user && <span className="hidden text-sm font-semibold text-slate-700 sm:block">{user.name}</span>}
        <button type="button" onClick={handleLogout} className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-600" aria-label="Log out"><LogOut size={17} /><span className="hidden sm:inline">Logout</span></button>
      </div>
    </header>
  );
}
