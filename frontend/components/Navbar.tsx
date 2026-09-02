"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Truck,
  User,
  UserPlus,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, logout, isLoaded } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Close all open navigation overlays on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Handle clicking outside the desktop profile dropdown menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setProfileOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  }

  function getDashboardLink() {
    if (!user) return "/";
    if (user.role === "admin") return "/admin";
    if (user.role === "driver") return "/driver";
    return "/bookings";
  }

  function getDashboardLabel() {
    if (!user) return "";
    if (user.role === "admin") return "Admin Panel";
    if (user.role === "driver") return "Driver Panel";
    return "My Bookings";
  }

  function getProfileLink() {
    if (user?.role === "driver") return "/driver/profile";
    if (user?.role === "admin") return "/admin/profile";
    return "/profile";
  }

  const customerLinks = [
    { label: "Home", href: "/" },
    { label: "Trucks", href: "/trucks" },
    { label: "Book Truck", href: "/booking" },
    { label: "My Bookings", href: "/bookings" },
    { label: "Tracking", href: "/tracking" },
  ];

  const driverLinks = [
    { label: "Dashboard", href: "/driver" },
    { label: "Assignments", href: "/driver/assignments" },
    { label: "Trips", href: "/driver/trips" },
    { label: "Earnings", href: "/driver/earnings" },
  ];

  const adminLinks = [
    { label: "Dashboard", href: "/admin" },
    { label: "Bookings", href: "/admin/bookings" },
    { label: "Drivers", href: "/admin/drivers" },
    { label: "Trucks", href: "/admin/trucks" },
    { label: "Users", href: "/admin/users" },
  ];

  const navLinks =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "driver"
        ? driverLinks
        : customerLinks;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
            <Truck size={22} />
          </div>

          <div>
            <p className="text-lg font-extrabold leading-none text-slate-900">
              OI-Truck
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Truck Lagbe
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive(link.href)
                  ? "bg-orange-50 text-orange-600"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP RIGHT SIDE ACTION BUTTONS */}
        <div className="hidden items-center gap-3 lg:flex">
          {isLoaded === false ? (
            <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />
          ) : !user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                <LogIn size={18} />
                Login
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                <UserPlus size={18} />
                Register
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:border-orange-300 hover:bg-orange-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>

                <div className="max-w-32 text-left">
                  <p className="truncate text-sm font-bold text-slate-800">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs capitalize text-slate-500">
                    {user?.role || "Customer"}
                  </p>
                </div>

                <ChevronDown
                  size={17}
                  className={`text-slate-400 transition ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {user?.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    href={getDashboardLink()}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
                  >
                    <LayoutDashboard size={18} />
                    {getDashboardLabel()}
                  </Link>

                  <Link
                    href={getProfileLink()}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
                  >
                    <User size={18} />
                    My Profile
                  </Link>

                  <div className="my-2 border-t border-slate-100" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold text-red-500 transition hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-xl p-2.5 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR PANELS */}
      <aside
        className={`fixed right-0 top-0 z-60 flex h-screen w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Truck size={22} />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">OI-Truck</p>
              <p className="text-xs text-slate-500">Truck Lagbe</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* MOBILE LOGGED IN USER CARD */}
        {user && (
          <div className="border-b border-slate-200 bg-orange-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              <div className="min-w-0">
                <p className="truncate font-bold text-slate-900">{user.name}</p>
                <p className="mt-1 text-sm capitalize text-orange-600">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE LINKS */}
        <nav className="flex-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </p>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive(link.href)
                    ? "bg-orange-500 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* MOBILE FOOTER ACTIONS */}
        <div className="border-t border-slate-200 p-4">
          {!user ? (
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-700 hover:bg-slate-50"
              >
                <LogIn size={18} />
                Login
              </Link>

              <Link
                href="/register"
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href={getProfileLink()}
                className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"
              >
                <User size={19} />
                My Profile
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-bold text-red-500 hover:bg-red-50"
              >
                <LogOut size={19} />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>
    </header>
  );
}
