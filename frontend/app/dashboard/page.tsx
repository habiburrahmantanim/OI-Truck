"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Plus,
  Route,
  Truck,
  XCircle,
} from "lucide-react";

import { useBooking } from "@/context/BookingContext";
import { Booking, BookingStatus } from "@/types/booking";
import RouteGuard from "@/components/auth/RouteGuard";

export default function DashboardPage() {
  return (
    <RouteGuard role="customer">
      <DashboardContent />
    </RouteGuard>
  );
}

function DashboardContent() {
  const { bookings, isLoaded } = useBooking();

  /* =========================================
     STATISTICS
  ========================================= */

  const stats = useMemo(() => {
    const total = bookings.length;

    const pending = bookings.filter(
      (booking) => booking.status === "Pending",
    ).length;

    const active = bookings.filter(
      (booking) =>
        booking.status === "Confirmed" ||
        booking.status === "Accepted" ||
        booking.status === "In Transit",
    ).length;

    const completed = bookings.filter(
      (booking) => booking.status === "Completed",
    ).length;

    const cancelled = bookings.filter(
      (booking) => booking.status === "Cancelled",
    ).length;

    const paid = bookings.filter(
      (booking) => booking.paymentStatus === "Paid",
    ).length;

    const totalSpent = bookings
      .filter((booking) => booking.paymentStatus === "Paid")
      .reduce((sum, booking) => sum + Number(booking.price || 0), 0);

    return {
      total,
      pending,
      active,
      completed,
      cancelled,
      paid,
      totalSpent,
    };
  }, [bookings]);

  /* =========================================
     RECENT BOOKINGS
  ========================================= */

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => {
        const firstDate = new Date(b.createdAt || b.date || 0).getTime();

        const secondDate = new Date(a.createdAt || a.date || 0).getTime();

        return firstDate - secondDate;
      })
      .slice(0, 5);
  }, [bookings]);

  /* =========================================
     LOADING
  ========================================= */

  if (!isLoaded) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* =====================================
            HEADER
        ===================================== */}

        <section className="rounded-2xl bg-slate-900 px-5 py-7 text-white sm:px-8 sm:py-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-400">
                Customer Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                Welcome to Truck Lagbe
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Manage your truck bookings, track deliveries and check your
                payment information from one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                <Plus size={18} />
                Book a Truck
              </Link>

              <Link
                href="/bookings"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                View Bookings
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================
            STATISTICS
        ===================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={stats.total}
            description="All your bookings"
            icon={<Package size={22} />}
            color="orange"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            description="Waiting for confirmation"
            icon={<Clock3 size={22} />}
            color="yellow"
          />

          <StatCard
            title="Active Trips"
            value={stats.active}
            description="Confirmed or in progress"
            icon={<Truck size={22} />}
            color="blue"
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            description="Successfully delivered"
            icon={<CheckCircle2 size={22} />}
            color="green"
          />
        </section>

        {/* =====================================
            SECONDARY STATS
        ===================================== */}

        <section className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Paid</p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  ৳{stats.totalSpent.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  From completed payments
                </p>
              </div>

              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <CreditCard size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Paid Bookings
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.paid}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Payment successfully completed
                </p>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <CheckCircle2 size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Cancelled</p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.cancelled}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Cancelled bookings
                </p>
              </div>

              <div className="rounded-xl bg-red-100 p-3 text-red-600">
                <XCircle size={23} />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================
            MAIN CONTENT
        ===================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* ===================================
              RECENT BOOKINGS
          =================================== */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Bookings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest truck booking activity.
                </p>
              </div>

              <Link
                href="/bookings"
                className="text-sm font-bold text-orange-600 hover:text-orange-700"
              >
                View All
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <Truck size={30} />
                </div>

                <h3 className="mt-4 font-bold text-slate-800">
                  No bookings yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  You have not made any truck bookings yet. Book a truck to get
                  started.
                </p>

                <Link
                  href="/booking"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
                >
                  <Plus size={17} />
                  Book a Truck
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentBookings.map((booking) => (
                  <RecentBookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </section>

          {/* ===================================
              QUICK ACTIONS
          =================================== */}

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quickly manage your deliveries.
              </p>

              <div className="mt-5 space-y-3">
                <QuickAction
                  href="/booking"
                  icon={<Plus size={20} />}
                  title="Book a Truck"
                  description="Create a new delivery booking"
                  color="orange"
                />

                <QuickAction
                  href="/bookings"
                  icon={<Package size={20} />}
                  title="My Bookings"
                  description="View all your bookings"
                  color="blue"
                />

                <QuickAction
                  href="/tracking"
                  icon={<Route size={20} />}
                  title="Track Delivery"
                  description="Track your active shipment"
                  color="green"
                />
              </div>
            </section>

            {/* ===================================
                DELIVERY OVERVIEW
            =================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Delivery Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                A summary of your booking progress.
              </p>

              <div className="mt-5 space-y-4">
                <ProgressItem
                  label="Completed"
                  value={stats.completed}
                  total={stats.total}
                  className="bg-green-500"
                />

                <ProgressItem
                  label="Active"
                  value={stats.active}
                  total={stats.total}
                  className="bg-blue-500"
                />

                <ProgressItem
                  label="Pending"
                  value={stats.pending}
                  total={stats.total}
                  className="bg-yellow-500"
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================
   STAT CARD
========================================= */

function StatCard({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  color: "orange" | "yellow" | "blue" | "green";
}) {
  const colors = {
    orange: "bg-orange-100 text-orange-600",
    yellow: "bg-yellow-100 text-yellow-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value.toLocaleString()}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${colors[color]}`}>{icon}</div>
      </div>

      <p className="mt-4 text-xs text-slate-400">{description}</p>
    </article>
  );
}

/* =========================================
   RECENT BOOKING CARD
========================================= */

function RecentBookingCard({ booking }: { booking: Booking }) {
  const bookingNumber = booking.bookingId || booking.id;

  return (
    <div className="p-5 transition hover:bg-slate-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-900">#{bookingNumber}</h3>

            <StatusBadge status={booking.status} />
          </div>

          <div className="mt-3 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="shrink-0 text-orange-500" />

              <span className="truncate">{booking.pickupLocation}</span>
            </div>

            <div className="flex items-center gap-2">
              <Route size={16} className="shrink-0 text-blue-500" />

              <span className="truncate">{booking.deliveryLocation}</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            {booking.vehicleName || booking.vehicleType}
            {" • "}
            {formatBookingDate(booking)}
          </p>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 sm:block sm:text-right">
          <div>
            <p className="text-xs text-slate-400">Total Fare</p>

            <p className="mt-1 font-bold text-slate-900">
              ৳{Number(booking.price || 0).toLocaleString()}
            </p>
          </div>

          <Link
            href={`/bookings/${booking.id}`}
            className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            Details
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   QUICK ACTION
========================================= */

function QuickAction({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "orange" | "blue" | "green";
}) {
  const colors = {
    orange: "bg-orange-100 text-orange-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-orange-200 hover:bg-orange-50/30"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-slate-800">{title}</h3>

        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <ArrowRight
        size={18}
        className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-500"
      />
    </Link>
  );
}

/* =========================================
   PROGRESS ITEM
========================================= */

function ProgressItem({
  label,
  value,
  total,
  className,
}: {
  label: string;
  value: number;
  total: number;
  className: string;
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>

        <span className="font-bold text-slate-900">
          {value} ({percentage}%)
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${className}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/* =========================================
   STATUS BADGE
========================================= */

function StatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Accepted: "bg-indigo-100 text-indigo-700",
    "In Transit": "bg-purple-100 text-purple-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* =========================================
   DATE FORMATTER
========================================= */

function formatBookingDate(booking: Booking) {
  const dateValue = booking.createdAt || booking.date;

  if (!dateValue) {
    return "Date not available";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return booking.date || "Date not available";
  }

  return date.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
