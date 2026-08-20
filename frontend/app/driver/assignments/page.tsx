"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Navigation,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";

import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";

export default function DriverAssignmentsPage() {
  const { bookings, isLoaded } = useBooking();
  const { user } = useAuth();

  const driverId = user?.id;

  /* =========================================
     DRIVER ASSIGNMENTS
  ========================================= */

  const assignments = useMemo(() => {
    if (!driverId) return [];

    return bookings
      .filter((booking) => booking.driverId === driverId)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || "").getTime();
        const dateB = new Date(b.createdAt || "").getTime();

        return dateB - dateA;
      });
  }, [bookings, driverId]);

  /* =========================================
     STATISTICS
  ========================================= */

  const activeAssignments = assignments.filter(
    (booking) =>
      booking.status === "Confirmed" ||
      booking.status === "Accepted" ||
      booking.status === "In Transit",
  );

  const completedAssignments = assignments.filter(
    (booking) => booking.status === "Completed",
  );

  const pendingAssignments = assignments.filter(
    (booking) => booking.status === "Pending",
  );

  /* =========================================
     LOADING
  ========================================= */

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading assignments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">DRIVER PORTAL</p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            My Assignments
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View and manage all deliveries assigned to you.
          </p>
        </div>

        <div className="rounded-lg bg-orange-50 px-4 py-3 text-sm">
          <span className="text-slate-500">Total Assignments: </span>

          <span className="font-bold text-orange-600">
            {assignments.length}
          </span>
        </div>
      </div>

      {/* =====================================
          STATISTICS
      ===================================== */}

      <section className="mt-7 grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Active"
          value={activeAssignments.length}
          icon={<Truck size={22} />}
          color="orange"
        />

        <StatCard
          title="Completed"
          value={completedAssignments.length}
          icon={<CheckCircle2 size={22} />}
          color="green"
        />

        <StatCard
          title="Pending"
          value={pendingAssignments.length}
          icon={<Clock3 size={22} />}
          color="blue"
        />
      </section>

      {/* =====================================
          ASSIGNMENT LIST
      ===================================== */}

      <section className="mt-7">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Delivery Assignments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your currently assigned and previous deliveries.
          </p>
        </div>

        {assignments.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5">
            {assignments.map((booking) => (
              <AssignmentCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================
   ASSIGNMENT CARD
========================================= */

function AssignmentCard({ booking }: { booking: any }) {
  const isActive =
    booking.status === "Confirmed" ||
    booking.status === "Accepted" ||
    booking.status === "In Transit";

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md">
      {/* TOP */}

      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-bold text-slate-900">
              Booking #{booking.bookingId || booking.id}
            </h3>

            <StatusBadge status={booking.status} />
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Assigned delivery request
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isActive && (
            <Link
              href={`/driver/trips/${booking.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <Navigation size={17} />
              Manage Trip
            </Link>
          )}

          <Link
            href={`/bookings/${booking.id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Package size={17} />
            View Details
          </Link>
        </div>
      </div>

      {/* CONTENT */}

      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_1fr_1fr]">
        {/* CUSTOMER */}

        <div>
          <div className="flex items-center gap-2">
            <User size={17} className="text-orange-500" />

            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Customer
            </p>
          </div>

          <p className="mt-3 font-semibold text-slate-900">
            {booking.customerName || "Customer"}
          </p>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <Phone size={15} />

            <span>
              {booking.customerPhone || booking.phone || "Phone not available"}
            </span>
          </div>
        </div>

        {/* ROUTE */}

        <div>
          <div className="flex items-center gap-2">
            <MapPin size={17} className="text-orange-500" />

            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Delivery Route
            </p>
          </div>

          <div className="mt-3">
            <p className="text-xs font-medium text-slate-400">PICKUP</p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {booking.pickupLocation || "Not provided"}
            </p>
          </div>

          <div className="my-3 ml-1 h-4 border-l-2 border-dashed border-orange-300" />

          <div>
            <p className="text-xs font-medium text-slate-400">DESTINATION</p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {booking.deliveryLocation ||
                booking.dropLocation ||
                "Not provided"}
            </p>
          </div>
        </div>

        {/* TRIP DETAILS */}

        <div>
          <div className="flex items-center gap-2">
            <Truck size={17} className="text-orange-500" />

            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Trip Details
            </p>
          </div>

          <div className="mt-3 space-y-3">
            <div>
              <p className="text-xs text-slate-400">Vehicle</p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {booking.vehicleName ||
                  booking.vehicleType ||
                  "Vehicle not specified"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={15} className="text-slate-400" />

              <span className="text-sm text-slate-600">
                {booking.date || "Date not specified"}
              </span>
            </div>

            {booking.time && (
              <div className="flex items-center gap-2">
                <Clock3 size={15} className="text-slate-400" />

                <span className="text-sm text-slate-600">{booking.time}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}

      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-sm text-slate-500">Delivery Fare: </span>

          <span className="font-bold text-slate-900">
            ৳{Number(booking.price || 0).toLocaleString()}
          </span>
        </div>

        <p className="text-sm font-medium text-slate-500">
          Payment:{" "}
          <span
            className={
              booking.paymentStatus === "Paid"
                ? "text-green-600"
                : "text-orange-600"
            }
          >
            {booking.paymentStatus || "Unpaid"}
          </span>
        </p>
      </div>
    </article>
  );
}

/* =========================================
   STAT CARD
========================================= */

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "orange" | "green" | "blue";
}) {
  const colors = {
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div className={`rounded-xl p-3 ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
}

/* =========================================
   STATUS BADGE
========================================= */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Accepted: "bg-indigo-100 text-indigo-700",
    "In Transit": "bg-orange-100 text-orange-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

/* =========================================
   EMPTY STATE
========================================= */

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
        <Truck size={30} className="text-orange-500" />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-800">
        No assignments yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        You do not currently have any delivery assignments. New trips will
        appear here when an administrator assigns them to you.
      </p>
    </div>
  );
}
