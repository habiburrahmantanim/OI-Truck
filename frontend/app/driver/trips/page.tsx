"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Navigation,
  Package,
  Phone,
  Play,
  Truck,
  User,
} from "lucide-react";

import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import { BookingStatus } from "@/types/booking";

export default function DriverTripsPage() {
  const { bookings, isLoaded, updateBookingStatus } = useBooking();
  const { user } = useAuth();

  const [filter, setFilter] = useState<
    "all" | "active" | "completed" | "cancelled"
  >("active");

  /* =========================================
     GET DRIVER BOOKINGS
  ========================================= */

  const driverBookings = useMemo(() => {
    if (!user?.id) return [];

    return bookings
      .filter((booking) => booking.driverId === user.id)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();

        return dateB - dateA;
      });
  }, [bookings, user?.id]);

  /* =========================================
     FILTER TRIPS
  ========================================= */

  const filteredTrips = useMemo(() => {
    if (filter === "all") return driverBookings;

    if (filter === "active") {
      return driverBookings.filter(
        (booking) =>
          booking.status === "Confirmed" ||
          booking.status === "Accepted" ||
          booking.status === "In Transit",
      );
    }

    if (filter === "completed") {
      return driverBookings.filter((booking) => booking.status === "Completed");
    }

    return driverBookings.filter((booking) => booking.status === "Cancelled");
  }, [driverBookings, filter]);

  /* =========================================
     STATISTICS
  ========================================= */

  const activeTrips = driverBookings.filter(
    (booking) =>
      booking.status === "Confirmed" ||
      booking.status === "Accepted" ||
      booking.status === "In Transit",
  ).length;

  const completedTrips = driverBookings.filter(
    (booking) => booking.status === "Completed",
  ).length;

  const cancelledTrips = driverBookings.filter(
    (booking) => booking.status === "Cancelled",
  ).length;

  /* =========================================
     UPDATE STATUS
  ========================================= */

  function handleStatusUpdate(id: string, status: BookingStatus) {
    updateBookingStatus(id, status);
  }

  /* =========================================
     LOADING
  ========================================= */

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading trips...
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
            My Trips
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your assigned deliveries and update trip progress.
          </p>
        </div>

        <Link
          href="/driver/assignments"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Package size={18} />
          View Assignments
        </Link>
      </div>

      {/* =====================================
          STATS
      ===================================== */}

      <section className="mt-7 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Active Trips"
          value={activeTrips}
          icon={<Truck size={22} />}
          color="orange"
        />

        <StatCard
          label="Completed"
          value={completedTrips}
          icon={<CheckCircle2 size={22} />}
          color="green"
        />

        <StatCard
          label="Cancelled"
          value={cancelledTrips}
          icon={<Clock3 size={22} />}
          color="red"
        />
      </section>

      {/* =====================================
          FILTERS
      ===================================== */}

      <section className="mt-7 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap gap-2">
          <FilterButton
            active={filter === "active"}
            onClick={() => setFilter("active")}
          >
            Active ({activeTrips})
          </FilterButton>

          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All ({driverBookings.length})
          </FilterButton>

          <FilterButton
            active={filter === "completed"}
            onClick={() => setFilter("completed")}
          >
            Completed ({completedTrips})
          </FilterButton>

          <FilterButton
            active={filter === "cancelled"}
            onClick={() => setFilter("cancelled")}
          >
            Cancelled ({cancelledTrips})
          </FilterButton>
        </div>
      </section>

      {/* =====================================
          TRIP LIST
      ===================================== */}

      <section className="mt-7">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">Delivery Trips</h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredTrips.length} trip
            {filteredTrips.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {filteredTrips.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="grid gap-5">
            {filteredTrips.map((booking) => (
              <TripCard
                key={booking.id}
                booking={booking}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================
   TRIP CARD
========================================= */

function TripCard({
  booking,
  onStatusUpdate,
}: {
  booking: any;
  onStatusUpdate: (id: string, status: BookingStatus) => void;
}) {
  const nextAction = getNextAction(booking.status);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}

      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-bold text-slate-900">
              Trip #{booking.bookingId || booking.id}
            </h3>

            <StatusBadge status={booking.status} />
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {booking.vehicleName || booking.vehicleType || "Delivery Vehicle"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/bookings/${booking.id}`}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Booking Details
          </Link>

          <Link
            href={`/tracking/${booking.id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-600 transition hover:bg-orange-100"
          >
            <Navigation size={16} />
            Tracking
          </Link>
        </div>
      </div>

      {/* CONTENT */}

      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_1.4fr_1fr]">
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

            {booking.customerPhone || booking.phone || "Phone not available"}
          </div>

          <div className="mt-4">
            <p className="text-xs text-slate-400">FARE</p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              ৳{Number(booking.price || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* ROUTE */}

        <div>
          <div className="flex items-center gap-2">
            <MapPin size={17} className="text-orange-500" />

            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Route
            </p>
          </div>

          <div className="mt-4">
            <div className="flex gap-3">
              <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-green-500" />

              <div>
                <p className="text-xs font-medium text-slate-400">PICKUP</p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {booking.pickupLocation || "Not provided"}
                </p>
              </div>
            </div>

            <div className="ml-[5px] h-8 border-l-2 border-dashed border-slate-300" />

            <div className="flex gap-3">
              <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-red-500" />

              <div>
                <p className="text-xs font-medium text-slate-400">
                  DESTINATION
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {booking.deliveryLocation ||
                    booking.dropLocation ||
                    "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SCHEDULE */}

        <div>
          <div className="flex items-center gap-2">
            <Clock3 size={17} className="text-orange-500" />

            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Schedule
            </p>
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-800">
            {booking.date || "Date not specified"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {booking.time || "Time not specified"}
          </p>

          <div className="mt-4">
            <p className="text-xs text-slate-400">PAYMENT</p>

            <p
              className={`mt-1 text-sm font-bold ${
                booking.paymentStatus === "Paid"
                  ? "text-green-600"
                  : "text-orange-600"
              }`}
            >
              {booking.paymentStatus || "Unpaid"}
            </p>
          </div>
        </div>
      </div>

      {/* STATUS ACTION */}

      <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-700">Trip Status</p>

          <p className="mt-1 text-xs text-slate-500">
            Update the status as you progress through the delivery.
          </p>
        </div>

        {nextAction ? (
          <button
            onClick={() => onStatusUpdate(booking.id, nextAction.status)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            {nextAction.icon === "play" && <Play size={17} />}

            {nextAction.icon === "truck" && <Truck size={17} />}

            {nextAction.icon === "check" && <CheckCircle2 size={17} />}

            {nextAction.label}

            <ArrowRight size={17} />
          </button>
        ) : (
          <p className="font-semibold text-slate-500">
            No further action available
          </p>
        )}
      </div>
    </article>
  );
}

/* =========================================
   NEXT ACTION
========================================= */

function getNextAction(status: BookingStatus) {
  switch (status) {
    case "Confirmed":
      return {
        label: "Accept Trip",
        status: "Accepted" as BookingStatus,
        icon: "play",
      };

    case "Accepted":
      return {
        label: "Start Trip",
        status: "In Transit" as BookingStatus,
        icon: "truck",
      };

    case "In Transit":
      return {
        label: "Complete Delivery",
        status: "Completed" as BookingStatus,
        icon: "check",
      };

    default:
      return null;
  }
}

/* =========================================
   FILTER BUTTON
========================================= */

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-orange-500 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

/* =========================================
   STAT CARD
========================================= */

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "orange" | "green" | "red";
}) {
  const colors = {
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div className={`rounded-xl p-3 ${colors[color]}`}>{icon}</div>
      </div>
    </article>
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
    "In Transit": "bg-orange-100 text-orange-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* =========================================
   EMPTY STATE
========================================= */

function EmptyState({
  filter,
}: {
  filter: "all" | "active" | "completed" | "cancelled";
}) {
  const messages = {
    all: "You do not have any trips yet.",
    active: "You do not have any active trips right now.",
    completed: "You have not completed any trips yet.",
    cancelled: "You do not have any cancelled trips.",
  };

  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
        <Truck size={30} className="text-orange-500" />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-800">No trips found</h3>

      <p className="mt-2 text-sm text-slate-500">{messages[filter]}</p>

      <Link
        href="/driver/assignments"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
      >
        <Package size={17} />
        View Assignments
      </Link>
    </div>
  );
}
