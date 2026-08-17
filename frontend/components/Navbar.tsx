"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChevronRight,
  Home,
  Menu,
  Search,
  Truck,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Trucks",
    href: "/trucks",
    icon: Truck,
  },
  {
    name: "My Bookings",
    href: "/bookings",
    icon: CalendarDays,
  },
  {
    name: "Track Booking",
    href: "/tracking",
    icon: Search,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Close mobile menu when changing page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Prevent background scrolling while menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-100 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <nav className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20">
          {/* LOGO */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-xl font-bold text-slate-900 sm:text-2xl"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Truck size={21} />
            </span>

            <span>
              Truck<span className="text-orange-500">Lagbe</span>
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden items-center gap-6 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition ${
                  isActive(link.href)
                    ? "text-orange-500"
                    : "text-slate-600 hover:text-orange-500"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* DESKTOP BUTTONS */}
          <div className="hidden items-center gap-4 xl:flex">
            <Link
              href="/login"
              className={`text-sm font-semibold transition ${
                pathname === "/login"
                  ? "text-orange-500"
                  : "text-slate-700 hover:text-orange-500"
              }`}
            >
              Login
            </Link>

            <Link
              href="/register"
              className={`text-sm font-semibold transition ${
                pathname.startsWith("/register") || pathname.startsWith("/driver/register")
                  ? "text-orange-500"
                  : "text-slate-700 hover:text-orange-500"
              }`}
            >
              Sign up
            </Link>

            <Link
              href="/booking"
              className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Book a Truck
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="relative z-110 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 active:scale-95 xl:hidden"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* ================= DARK OVERLAY ================= */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 z-200 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* ================= SLIDE-IN MOBILE MENU ================= */}
      <aside
        className={`fixed right-0 top-0 z-300 flex h-dvh w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out xl:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
      >
        {/* MENU HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Truck size={22} />
            </span>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Truck<span className="text-orange-500">Lagbe</span>
              </h2>

              <p className="text-xs text-slate-400">Smart Logistics</p>
            </div>
          </Link>

          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-red-50 hover:text-red-500 active:scale-95"
            aria-label="Close navigation menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Navigation
          </p>

          <div className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group flex items-center justify-between rounded-2xl px-4 py-3.5 transition ${
                    isActive(link.href)
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                        isActive(link.href)
                          ? "bg-orange-500 text-white"
                          : "bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-500"
                      }`}
                    >
                      <Icon size={21} />
                    </div>

                    <span className="font-semibold">{link.name}</span>
                  </div>

                  <ChevronRight
                    size={20}
                    className={`transition ${
                      isActive(link.href)
                        ? "text-orange-500"
                        : "text-slate-300 group-hover:translate-x-1 group-hover:text-orange-500"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* ACCOUNT */}
          <div className="mt-7 border-t border-slate-100 pt-6">
            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
              Account
            </p>

            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className={`group flex items-center justify-between rounded-2xl px-4 py-3.5 transition ${pathname === "/login" ? "bg-orange-50 text-orange-600" : "text-slate-700 hover:bg-slate-50"}`}>
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-500">
                  <User size={21} />
                </div>

                <span className="font-semibold">Login</span>
              </div>

              <ChevronRight size={20} className="text-slate-300" />
            </Link>

            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className={`group mt-2 flex items-center justify-between rounded-2xl px-4 py-3.5 transition ${pathname.startsWith("/register") || pathname.startsWith("/driver/register") ? "bg-orange-50 text-orange-600" : "text-slate-700 hover:bg-slate-50"}`}>
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><User size={21} /></div>
                <span className="font-semibold">Sign up</span>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </Link>
          </div>
        </nav>

        {/* BOTTOM CTA */}
        <div className="border-t border-slate-100 p-5">
          <Link
            href="/booking"
            onClick={() => setMobileMenuOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 active:scale-[0.98]"
          >
            <Truck size={20} />
            Book a Truck
          </Link>

          <p className="mt-4 text-center text-xs text-slate-400">
            Fast • Reliable • Easy
          </p>
        </div>
      </aside>
    </>
  );
}
