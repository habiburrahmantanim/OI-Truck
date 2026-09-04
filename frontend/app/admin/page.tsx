"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  PackageCheck,
  Truck,
} from "lucide-react";

import { useBooking } from "@/context/BookingContext";

const activity = [
  ["BK-48291", "Dhaka to Chattogram", "In Transit", "12 min ago"],
  ["BK-48290", "Gazipur to Narayanganj", "Driver Assigned", "34 min ago"],
  ["BK-48289", "Mirpur to Uttara", "Delivered", "1 hr ago"],
  ["BK-48288", "Dhaka to Cumilla", "Confirmed", "2 hrs ago"],
];

export default function AdminDashboard() {
  const { bookings } = useBooking();

  const active = bookings.filter(
    (booking) => !["Completed", "Cancelled"].includes(booking.status),
  ).length;

  const delivered = bookings.filter(
    (booking) => booking.status === "Completed",
  ).length;

  const revenue = bookings
    .filter((booking) => booking.status !== "Cancelled")
    .reduce((sum, booking) => sum + Number(booking.price || 0), 0);

  const rows = bookings.length
    ? bookings.slice(0, 5).map((booking) => [
        booking.bookingId,
        `${booking.pickupLocation} to ${booking.deliveryLocation}`,
        booking.status,
        new Date(booking.createdAt).toLocaleDateString("en-BD", {
          month: "short",
          day: "numeric",
        }),
      ])
    : activity;

  return (
    <div className="mx-auto max-w-7xl">
      {/* HEADER */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            OPERATIONS OVERVIEW
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor logistics activity and fleet performance.
          </p>
        </div>

        <Link
          href="/admin/bookings"
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          View all bookings
          <ArrowUpRight size={17} />
        </Link>
      </div>

      {/* METRICS */}
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={CalendarDays}
          label="Total bookings"
          value={bookings.length}
          hint={`${active} currently active`}
          color="orange"
        />

        <Metric
          icon={Truck}
          label="Available trucks"
          value="24"
          hint="4 in maintenance"
          color="blue"
        />

        <Metric
          icon={PackageCheck}
          label="Delivered"
          value={delivered}
          hint="Completed deliveries"
          color="green"
        />

        <Metric
          icon={CircleDollarSign}
          label="Booking value"
          value={`BDT ${revenue.toLocaleString()}`}
          hint="Excludes cancelled bookings"
          color="violet"
        />
      </section>

      {/* MAIN CONTENT */}
      <section className="mt-7 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        {/* RECENT BOOKINGS */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-bold text-slate-900">Recent bookings</h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Latest delivery activity
              </p>
            </div>

            <Link
              href="/admin/bookings"
              className="text-sm font-semibold text-orange-600"
            >
              Manage
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-145 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Booking</th>
                  <th className="px-5 py-3 font-semibold">Route</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Updated</th>
                </tr>
              </thead>

              <tbody>
                {rows.map(([id, route, status, date]) => (
                  <tr key={id} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {id}
                    </td>

                    <td className="max-w-55 truncate px-5 py-4 text-slate-600">
                      {route}
                    </td>

                    <td className="px-5 py-4">
                      <Status status={status} />
                    </td>

                    <td className="px-5 py-4 text-slate-500">{date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FLEET STATUS */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-slate-900">Fleet status</h2>

          <p className="mt-1 text-sm text-slate-500">
            Vehicle availability today
          </p>

          <div className="mt-7 flex items-center justify-center">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-18 border-orange-500 border-b-slate-200 border-r-slate-200">
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900">24</p>
                <p className="text-xs text-slate-500">Available</p>
              </div>
            </div>
          </div>

          <div className="mt-7 space-y-3">
            <FleetLine
              color="bg-orange-500"
              label="Available"
              value="24 vehicles"
            />

            <FleetLine
              color="bg-blue-500"
              label="On delivery"
              value="17 vehicles"
            />

            <FleetLine
              color="bg-slate-300"
              label="Maintenance"
              value="4 vehicles"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Metric({
  icon: Icon,
  label,
  value,
  hint,
  color,
}: {
  icon: typeof Truck;
  label: string;
  value: string | number;
  hint: string;
  color: string;
}) {
  const styles: Record<string, string> = {
    orange: "bg-orange-100 text-orange-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    violet: "bg-violet-100 text-violet-600",
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>

        <span className={`rounded-lg p-2.5 ${styles[color]}`}>
          <Icon size={21} />
        </span>
      </div>

      <p className="mt-4 text-xs text-slate-500">{hint}</p>
    </article>
  );
}

function Status({ status }: { status: string }) {
  const style =
    status === "Delivered" || status === "Completed"
      ? "bg-green-100 text-green-700"
      : status === "In Transit"
        ? "bg-blue-100 text-blue-700"
        : status === "Cancelled"
          ? "bg-red-100 text-red-700"
          : "bg-amber-100 text-amber-700";

  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
}

function FleetLine({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-slate-600">
        <i className={`h-2.5 w-2.5 rounded-full ${color}`} />
        {label}
      </span>

      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}
