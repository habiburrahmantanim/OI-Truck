"use client";

import Link from "next/link";
import {
  Check,
  Clock,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
  Weight,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useBookings } from "@/context/BookingContext";
import { useDrivers } from "@/context/DriverContext";

export default function DriverAssignmentsPage() {
  const { user, isLoaded: authLoaded } = useAuth();
  const {
    bookings,
    isLoaded: bookingsLoaded,
    updateBookingStatus,
  } = useBookings();
  const { drivers, isLoaded: driversLoaded } = useDrivers();

  if (!authLoaded || !bookingsLoaded || !driversLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Loading assignments...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Please log in first
        </h1>

        <p className="mt-2 text-slate-500">
          You need to log in to view your assignments.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const driver = drivers.find((item) => item.userId === user.id);

  if (!driver) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <Truck size={30} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Driver Profile Not Found
        </h1>

        <p className="mt-2 text-slate-500">
          Your account is not connected to a driver profile yet.
        </p>

        <Link
          href="/driver/register"
          className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Complete Driver Registration
        </Link>
      </div>
    );
  }

  const assignments = bookings.filter(
    (booking) =>
      booking.driverId === driver.id &&
      [
        "Driver Assigned",
        "Assigned",
        "On the Way",
        "Picked Up",
        "In Transit",
      ].includes(booking.status),
  );

  const pendingAssignments = assignments.filter(
    (booking) =>
      booking.status === "Driver Assigned" || booking.status === "Assigned",
  );

  const activeAssignments = assignments.filter((booking) =>
    ["On the Way", "Picked Up", "In Transit"].includes(booking.status),
  );

  function acceptAssignment(bookingId: string) {
    updateBookingStatus(bookingId, "On the Way");
  }

  function rejectAssignment(bookingId: string) {
    updateBookingStatus(bookingId, "Cancelled");
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">DRIVER PORTAL</p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            My Assignments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review and manage your assigned delivery jobs.
          </p>
        </div>

        <Link
          href="/driver/trips"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
        >
          <Truck size={18} />
          View My Trips
        </Link>
      </div>

      {/* STATISTICS */}
      <section className="mt-7 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Assignments"
          value={assignments.length}
          icon={<Package size={22} />}
          color="orange"
        />

        <StatCard
          label="Waiting for Response"
          value={pendingAssignments.length}
          icon={<Clock size={22} />}
          color="amber"
        />

        <StatCard
          label="Active Deliveries"
          value={activeAssignments.length}
          icon={<Truck size={22} />}
          color="blue"
        />
      </section>

      {/* PENDING ASSIGNMENTS */}
      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">New Assignments</h2>

          <p className="mt-1 text-sm text-slate-500">
            Accept or reject new delivery assignments.
          </p>
        </div>

        {pendingAssignments.length === 0 ? (
          <EmptyState message="You don't have any new assignments." />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {pendingAssignments.map((booking) => (
              <AssignmentCard
                key={booking.id}
                booking={booking}
                onAccept={() => acceptAssignment(booking.id)}
                onReject={() => rejectAssignment(booking.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ACTIVE ASSIGNMENTS */}
      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Active Deliveries
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Continue managing your current delivery jobs.
          </p>
        </div>

        {activeAssignments.length === 0 ? (
          <EmptyState message="You don't have any active deliveries." />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {activeAssignments.map((booking) => (
              <ActiveAssignmentCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================
   ASSIGNMENT CARD
========================= */

function AssignmentCard({
  booking,
  onAccept,
  onReject,
}: {
  booking: any;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between border-b border-slate-100 p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Booking ID
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {booking.bookingId || booking.id}
          </h3>
        </div>

        <StatusBadge status={booking.status} />
      </div>

      <div className="space-y-5 p-5">
        {/* ROUTE */}
        <div className="relative space-y-5 border-l-2 border-dashed border-slate-200 pl-5">
          <div className="relative">
            <span className="absolute -left-7.75 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 ring-4 ring-white" />

            <p className="text-xs font-bold uppercase text-slate-400">Pickup</p>

            <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800">
              <MapPin size={17} className="text-green-600" />
              {booking.pickupLocation}
            </p>
          </div>

          <div className="relative">
            <span className="absolute -left-7.75 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 ring-4 ring-white" />

            <p className="text-xs font-bold uppercase text-slate-400">
              Delivery
            </p>

            <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800">
              <MapPin size={17} className="text-orange-600" />
              {booking.deliveryLocation || booking.dropLocation}
            </p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
          <Detail
            icon={<User size={17} />}
            label="Customer"
            value={booking.customerName}
          />

          <Detail
            icon={<Phone size={17} />}
            label="Phone"
            value={booking.customerPhone || booking.phone}
          />

          <Detail
            icon={<Package size={17} />}
            label="Cargo"
            value={booking.cargoType}
          />

          <Detail
            icon={<Weight size={17} />}
            label="Weight"
            value={`${booking.weight} KG`}
          />

          <Detail
            icon={<Truck size={17} />}
            label="Truck"
            value={booking.truckName}
          />

          <Detail
            icon={<Clock size={17} />}
            label="Pickup"
            value={`${booking.pickupDate} ${booking.pickupTime || ""}`}
          />
        </div>

        {/* FARE */}
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-400">
            Estimated Fare
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            BDT{" "}
            {(
              booking.estimatedFare ||
              booking.totalPrice ||
              0
            ).toLocaleString()}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onReject}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-100"
          >
            <X size={18} />
            Reject
          </button>

          <button
            onClick={onAccept}
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            <Check size={18} />
            Accept Job
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================
   ACTIVE ASSIGNMENT
========================= */

function ActiveAssignmentCard({ booking }: { booking: any }) {
  const { updateBookingStatus } = useBookings();

  function nextStatus() {
    if (booking.status === "On the Way") {
      updateBookingStatus(booking.id, "Picked Up");
    }

    if (booking.status === "Picked Up") {
      updateBookingStatus(booking.id, "In Transit");
    }

    if (booking.status === "In Transit") {
      updateBookingStatus(booking.id, "Delivered");
    }
  }

  const buttonText =
    booking.status === "On the Way"
      ? "Confirm Pickup"
      : booking.status === "Picked Up"
        ? "Start Delivery"
        : "Complete Delivery";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {booking.bookingId || booking.id}
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {booking.pickupLocation}
          </h3>

          <p className="mt-1 text-sm text-slate-400">to</p>

          <h3 className="text-lg font-bold text-slate-900">
            {booking.deliveryLocation || booking.dropLocation}
          </h3>
        </div>

        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-6 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
        <Detail
          icon={<Package size={17} />}
          label="Cargo"
          value={booking.cargoType}
        />

        <Detail
          icon={<Weight size={17} />}
          label="Weight"
          value={`${booking.weight} KG`}
        />

        <Detail
          icon={<User size={17} />}
          label="Customer"
          value={booking.customerName}
        />

        <Detail
          icon={<Phone size={17} />}
          label="Phone"
          value={booking.customerPhone || booking.phone}
        />
      </div>

      <button
        onClick={nextStatus}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 font-semibold text-white transition hover:bg-slate-800"
      >
        <Truck size={18} />
        {buttonText}
      </button>
    </article>
  );
}

/* =========================
   SMALL COMPONENTS
========================= */

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "orange" | "amber" | "blue";
}) {
  const colors = {
    orange: "bg-orange-100 text-orange-600",
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div className={`rounded-xl p-3 ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>

        <p className="truncate text-sm font-semibold text-slate-700">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Driver Assigned": "bg-amber-100 text-amber-700",
    Assigned: "bg-amber-100 text-amber-700",
    "On the Way": "bg-blue-100 text-blue-700",
    "Picked Up": "bg-violet-100 text-violet-700",
    "In Transit": "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
      <Truck size={38} className="mx-auto text-slate-300" />

      <h3 className="mt-4 text-lg font-bold text-slate-800">
        No Assignments Found
      </h3>

      <p className="mt-2 text-sm text-slate-500">{message}</p>
    </div>
  );
}
