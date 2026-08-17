"use client";

import { Bell, Menu, Search } from "lucide-react";

export default function AdminHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenuOpen} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open menu"><Menu size={22} /></button>
        <div className="hidden items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-400 sm:flex"><Search size={17} /><input aria-label="Search" placeholder="Search operations..." className="w-44 bg-transparent outline-none" /></div>
      </div>
      <div className="flex items-center gap-3"><button type="button" className="relative rounded-md p-2 text-slate-600 hover:bg-slate-100" aria-label="Notifications"><Bell size={20} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500" /></button><span className="hidden text-sm font-semibold text-slate-700 sm:block">16 Aug 2026</span></div>
    </header>
  );
}
