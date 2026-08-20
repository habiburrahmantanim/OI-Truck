"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Navigation,
  Star,
  Truck,
  User,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useDrivers } from "@/context/DriverContext";
import { useBooking } from "@/context/BookingContext";

export default function DriverDashboardPage() {
  const { user, isLoaded: authLoaded } = useAuth();

  const {
    drivers,
    isLoaded: driversLoaded,
    updateDriverAvailability,
  } = useDrivers();

  const { bookings, isLoaded: bookingsLoaded } = useBooking();

  const driver = useMemo(() => {
    if (!user) return undefined;

    return drivers.find(
      (item) =>
        item.userId === user.id ||
        item.email.toLowerCase() === user.email.toLowerCase(),
    );
  }, [drivers, user]);

  const driverBookings = useMemo(() => {
    if (!driver) return [];

    return bookings.filter(
      (booking) =>
        booking.driverId === driver.id || booking.driverPhone === driver.phone,
    );
  }, [bookings, driver]);

  const activeTrips = driverBookings.filter(
    (booking) =>
      booking.status === "Confirmed" ||
      booking.status === "Accepted" ||
      booking.status === "In Transit",
  );

  const completedTrips = driverBookings.filter(
    (booking) => booking.status === "Completed",
  );

  const cancelledTrips = driverBookings.filter(
    (booking) => booking.status === "Cancelled",
  );

  const pendingAssignments = driverBookings.filter(
    (booking) => booking.status === "Pending" || booking.status === "Confirmed",
  );

  const currentTrip =
    driverBookings.find((booking) => booking.status === "In Transit") ||
    driverBookings.find((booking) => booking.status === "Accepted") ||
    driverBookings.find((booking) => booking.status === "Confirmed");

  const recentTrips = [...driverBookings]
    .sort((a, b) => {
      const first = new Date(a.createdAt || 0).getTime();
      const second = new Date(b.createdAt || 0).getTime();

      return second - first;
    })
    .slice(0, 5);

  const totalEarnings =
    driver?.totalEarnings ||
    completedTrips.reduce(
      (total, booking) => total + Number(booking.price || 0),
      0,
    );

  const loading = !authLoaded || !driversLoaded || !bookingsLoaded;

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading driver dashboard...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================
     DRIVER NOT REGISTERED
  ========================================= */

  if (!user || !driver) {
    return (
      <div className="mx-auto max-w-3xl py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-100">
            <Truck size={38} className="text-orange-600" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Driver Profile Required
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            You have not completed your driver registration yet. Register as a
            driver to receive assignments and manage your trips.
          </p>

          <Link
            href="/driver/register"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Register as Driver
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================
     DRIVER NOT APPROVED
  ========================================= */

  if (driver.status !== "approved") {
    return (
      <div className="mx-auto max-w-3xl py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-yellow-100">
            <Clock3 size={38} className="text-yellow-600" />
          </div>

          <StatusBadge status={driver.status} />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            {driver.status === "pending"
              ? "Your Driver Application Is Under Review"
              : driver.status === "rejected"
                ? "Driver Application Was Rejected"
                : "Driver Account Is Suspended"}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            {driver.status === "pending"
              ? "Your information and documents are being reviewed. You will be able to access trips after approval."
              : driver.status === "rejected"
                ? "Your driver registration could not be approved. Please contact the administrator for more information."
                : "Your driver account is currently suspended. Please contact the administrator."}
          </p>

          <Link
            href="/driver/profile"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <User size={17} />
            View Driver Profile
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================
     DASHBOARD
  ========================================= */

  return (
    <div className="mx-auto max-w-7xl">
      {/* =====================================
          HEADER
      ===================================== */}

      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            DRIVER DASHBOARD
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome back, {driver.name.split(" ")[0]} 👋
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your assignments, trips, earnings and availability.
          </p>
        </div>

        {/* AVAILABILITY */}

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Availability
              </p>

              <p className="mt-1 text-sm font-bold capitalize text-slate-800">
                {driver.availability}
              </p>
            </div>

            <select
              value={driver.availability}
              onChange={(event) =>
                updateDriverAvailability(
                  driver.id,
                  event.target.value as "available" | "busy" | "offline",
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold capitalize text-slate-700 outline-none focus:border-orange-500"
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </section>

      {/* =====================================
          STATUS BAR
      ===================================== */}

      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
              {driver.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-slate-900">{driver.name}</h2>

                <StatusBadge status={driver.status} />
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {driver.vehicleType} • {driver.vehicleNumber}
              </p>
            </div>
          </div>

          <Link
            href="/driver/profile"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <User size={17} />
            View Profile
          </Link>
        </div>
      </section>

      {/* =====================================
          STATISTICS
      ===================================== */}

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Trips"
          value={driver.totalTrips || driverBookings.length}
          icon={<BriefcaseBusiness size={22} />}
          color="orange"
          description="All assigned trips"
        />

        <StatCard
          label="Active Trips"
          value={activeTrips.length}
          icon={<Navigation size={22} />}
          color="blue"
          description="Currently active"
        />

        <StatCard
          label="Completed"
          value={completedTrips.length}
          icon={<CheckCircle2 size={22} />}
          color="green"
          description="Successfully delivered"
        />

        <StatCard
          label="Total Earnings"
          value={`৳${Number(totalEarnings).toLocaleString()}`}
          icon={<BadgeDollarSign size={22} />}
          color="violet"
          description="From completed trips"
        />
      </section>

      {/* =====================================
          SECONDARY STATS
      ===================================== */}

      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SmallStat
          label="Pending Assignments"
          value={pendingAssignments.length}
          icon={<Clock3 size={18} />}
        />

        <SmallStat
          label="Cancelled Trips"
          value={cancelledTrips.length}
          icon={<CalendarDays size={18} />}
        />

        <SmallStat
          label="Driver Rating"
          value={`${Number(driver.rating || 0).toFixed(1)} / 5`}
          icon={<Star size={18} />}
        />
      </section>

      {/* =====================================
          CURRENT TRIP
      ===================================== */}

      <section className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Current Trip</h2>

            <p className="mt-1 text-sm text-slate-500">
              Your currently active or latest assigned trip.
            </p>
          </div>

          <Link
            href="/driver/assignments"
            className="inline-flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            All Assignments
            <ArrowRight size={16} />
          </Link>
        </div>

        {currentTrip ? (
          <CurrentTripCard booking={currentTrip} />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <Truck size={38} className="mx-auto text-slate-300" />

            <h3 className="mt-4 font-bold text-slate-800">
              No active trip right now
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              New assignments will appear here when they are assigned to you.
            </p>

            <Link
              href="/driver/assignments"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
            >
              Check Assignments
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* =====================================
          QUICK ACTIONS + RECENT TRIPS
      ===================================== */}

      <section className="mt-7 grid gap-7 lg:grid-cols-[0.9fr_1.6fr]">
        {/* QUICK ACTIONS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>

          <p className="mt-1 text-sm text-slate-500">
            Access your driver tools quickly.
          </p>

          <div className="mt-5 space-y-3">
            <QuickAction
              href="/driver/assignments"
              icon={<BriefcaseBusiness size={20} />}
              title="Assignments"
              description="View assigned bookings"
            />

            <QuickAction
              href="/driver/trips"
              icon={<Truck size={20} />}
              title="My Trips"
              description="Manage current and completed trips"
            />

            <QuickAction
              href="/driver/earnings"
              icon={<BadgeDollarSign size={20} />}
              title="Earnings"
              description="View trip earnings and history"
            />

            <QuickAction
              href="/driver/profile"
              icon={<User size={20} />}
              title="My Profile"
              description="View your driver information"
            />
          </div>
        </div>

        {/* RECENT TRIPS */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-bold text-slate-900">Recent Trips</h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest assigned bookings.
              </p>
            </div>

            <Link
              href="/driver/trips"
              className="text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              View All
            </Link>
          </div>

          {recentTrips.length === 0 ? (
            <div className="py-14 text-center">
              <BriefcaseBusiness size={38} className="mx-auto text-slate-300" />

              <h3 className="mt-3 font-bold text-slate-700">No trips yet</h3>

              <p className="mt-1 text-sm text-slate-500">
                Your assigned trips will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentTrips.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate-900">
                        #{booking.bookingId || booking.id}
                      </p>

                      <BookingStatusBadge status={booking.status} />
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={15} className="shrink-0 text-green-600" />

                        <span className="truncate">
                          {booking.pickupLocation}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Navigation
                          size={15}
                          className="shrink-0 text-orange-500"
                        />

                        <span className="truncate">
                          {booking.deliveryLocation}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-bold text-slate-900">
                      ৳{Number(booking.price || 0).toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {booking.vehicleName || booking.vehicleType}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* =========================================
   CURRENT TRIP CARD
========================================= */

function CurrentTripCard({ booking }: { booking: any }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm">
      <div className="border-b border-orange-100 bg-orange-50 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
              Active Assignment
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900">
              Booking #{booking.bookingId || booking.id}
            </h3>
          </div>

          <BookingStatusBadge status={booking.status} />
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <LocationItem
            label="Pickup Location"
            value={booking.pickupLocation}
            icon={<MapPin size={20} className="text-green-600" />}
          />

          <LocationItem
            label="Delivery Location"
            value={booking.deliveryLocation}
            icon={<Navigation size={20} className="text-orange-500" />}
          />
        </div>

        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
          <InfoItem label="Customer" value={booking.customerName} />

          <InfoItem
            label="Vehicle"
            value={booking.vehicleName || booking.vehicleType}
          />

          <InfoItem
            label="Trip Fare"
            value={`৳${Number(booking.price || 0).toLocaleString()}`}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
          <Link
            href={`/bookings/${booking.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            View Booking Details
            <ArrowRight size={17} />
          </Link>

          <Link
            href={`/tracking/${booking.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <Navigation size={17} />
            Open Tracking
          </Link>
        </div>
      </div>
    </div>
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
  description,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: "orange" | "blue" | "green" | "violet";
  description: string;
}) {
  const colors = {
    orange: "bg-orange-100 text-orange-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    violet: "bg-violet-100 text-violet-600",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>

        <div className={`rounded-xl p-3 ${colors[color]}`}>{icon}</div>
      </div>

      <p className="mt-4 text-xs text-slate-500">{description}</p>
    </article>
  );
}

/* =========================================
   SMALL STAT
========================================= */

function SmallStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">{icon}</div>

      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>

        <p className="mt-1 font-bold text-slate-900">{value}</p>
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
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-orange-200 hover:bg-orange-50"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600 transition group-hover:bg-orange-100 group-hover:text-orange-600">
          {icon}
        </div>

        <div>
          <p className="font-bold text-slate-800">{title}</p>

          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
      </div>

      <ArrowRight
        size={18}
        className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-600"
      />
    </Link>
  );
}

/* =========================================
   LOCATION ITEM
========================================= */

function LocationItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 shrink-0">{icon}</div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 font-semibold leading-6 text-slate-800">{value}</p>
      </div>
    </div>
  );
}

/* =========================================
   INFO ITEM
========================================= */

function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-800">
        {value || "Not provided"}
      </p>
    </div>
  );
}

/* =========================================
   DRIVER STATUS BADGE
========================================= */

function StatusBadge({
  status,
}: {
  status: "pending" | "approved" | "rejected" | "suspended";
}) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    suspended: "bg-slate-200 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* =========================================
   BOOKING STATUS BADGE
========================================= */

function BookingStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Accepted: "bg-indigo-100 text-indigo-700",
    "In Transit": "bg-purple-100 text-purple-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}
