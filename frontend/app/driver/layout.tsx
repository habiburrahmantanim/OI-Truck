"use client";
import { useState, type ReactNode } from "react";
import DriverHeader from "@/components/driver/DriverHeader";
import DriverSidebar from "@/components/driver/DriverSidebar";
export default function DriverLayout({ children }: { children: ReactNode }) { const [menuOpen, setMenuOpen] = useState(false); return <div className="min-h-screen bg-slate-50"><DriverSidebar open={menuOpen} onClose={() => setMenuOpen(false)} /><div className="lg:pl-68"><DriverHeader onMenuOpen={() => setMenuOpen(true)} /><main className="p-4 sm:p-6 lg:p-8">{children}</main></div></div>; }
