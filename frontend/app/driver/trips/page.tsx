"use client";

import {
  CheckCircle2,
  CircleDollarSign,
  Clock,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useBookings } from "@/context/BookingContext";
import { useDrivers } from "@/context/DriverContext";

const DRIVER_COMMISSION_RATE = 0.78;

export default function DriverTripsPage() {
  const { user, isLoaded: authLoaded } = useAuth();
  const { bookings, isLoaded: bookingsLoaded } = useBookings();
  const { drivers, isLoaded: driversLoaded } = useDrivers();

  if (!authLoaded || !bookingsLoaded || !driversLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Loading trips...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <Truck size={40} className="mx-auto text-orange-500" />

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Please log in
        </h1>

        <p className="mt-2 text-slate-500">Log in to view your trips.</p>
      </div>
    );
  }

  const driver = drivers.find((item) => item.userId === user.id);

  if (!driver) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <Truck size={40} className="mx-auto text-orange-500" />

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Driver Profile Not Found
        </h1>

        <p className="mt-2 text-slate-500">
          Your account is not connected to a driver profile.
        </p>
      </div>
    );
  }

  const myTrips = bookings.filter((booking) => booking.driverId === driver.id);

  const activeTrips = myTrips.filter((booking) =>
    ["On the Way", "Picked Up", "In Transit"].includes(booking.status),
  );

  const completedTrips = myTrips.filter(
    (booking) => booking.status === "Delivered",
  );

  const cancelledTrips = myTrips.filter(
    (booking) => booking.status === "Cancelled",
  );

  const totalEarnings = completedTrips.reduce((total, booking) => {
    const fare = booking.estimatedFare || booking.totalPrice || 0;

    return total + fare * DRIVER_COMMISSION_RATE;
  }, 0);

  const totalTripValue = completedTrips.reduce((total, booking) => {
    return total + (booking.estimatedFare || booking.totalPrice || 0);
  }, 0);

  return (
    <div className="mx-auto max-w-7xl">
      {/* HEADER */}
      <div>
        <p className="text-sm font-semibold text-orange-600">DRIVER PORTAL</p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          My Trips
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Track your active deliveries and completed trip history.
        </p>
      </div>

      {/* STATISTICS */}
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Trips"
          value={activeTrips.length}
          icon={<Truck size={22} />}
          iconClass="bg-blue-100 text-blue-600"
        />

        <StatCard
          label="Completed"
          value={completedTrips.length}
          icon={<CheckCircle2 size={22} />}
          iconClass="bg-green-100 text-green-600"
        />

        <StatCard
          label="Cancelled"
          value={cancelledTrips.length}
          icon={<XCircle size={22} />}
          iconClass="bg-red-100 text-red-600"
        />

        <StatCard
          label="Total Earnings"
          value={`BDT ${totalEarnings.toLocaleString()}`}
          icon={<CircleDollarSign size={22} />}
          iconClass="bg-orange-100 text-orange-600"
        />
      </section>

      {/* ACTIVE TRIPS */}
      <section className="mt-9">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Active Trips</h2>

            <p className="mt-1 text-sm text-slate-500">
              Deliveries currently in progress.
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
            {activeTrips.length} Active
          </span>
        </div>

        {activeTrips.length === 0 ? (
          <EmptyState
            icon={<Truck size={38} />}
            title="No Active Trips"
            message="You don't have any deliveries in progress."
          />
        ) : (
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {activeTrips.map((booking) => (
              <TripCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>

      {/* COMPLETED TRIPS */}
      <section className="mt-10">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Completed Trips</h2>

          <p className="mt-1 text-sm text-slate-500">
            Your successfully delivered orders.
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {completedTrips.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Package size={36} className="mx-auto text-slate-300" />

              <p className="mt-3 font-semibold text-slate-700">
                No completed trips yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your completed deliveries will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Booking</th>
                    <th className="px-5 py-4 font-semibold">Route</th>
                    <th className="px-5 py-4 font-semibold">Customer</th>
                    <th className="px-5 py-4 font-semibold">Fare</th>
                    <th className="px-5 py-4 font-semibold">Your Earnings</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {completedTrips.map((booking) => {
                    const fare =
                      booking.estimatedFare || booking.totalPrice || 0;

                    const earnings = fare * DRIVER_COMMISSION_RATE;

                    return (
                      <tr
                        key={booking.id}
                        className="border-t border-slate-100"
                      >
                        <td className="px-5 py-4 font-semibold text-slate-800">
                          {booking.bookingId || booking.id}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-700">
                            {booking.pickupLocation}
                          </p>

                          <p className="text-xs text-slate-400">
                            → {booking.deliveryLocation || booking.dropLocation}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {booking.customerName}
                        </td>

                        <td className="px-5 py-4 font-semibold text-slate-700">
                          BDT {fare.toLocaleString()}
                        </td>

                        <td className="px-5 py-4 font-bold text-green-600">
                          BDT {earnings.toLocaleString()}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={booking.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {completedTrips.length > 0 && (
          <div className="mt-4 flex justify-end">
            <div className="rounded-xl bg-slate-900 px-5 py-4 text-right text-white">
              <p className="text-xs text-slate-400">
                Total Completed Trip Value
              </p>

              <p className="mt-1 text-xl font-bold">
                BDT {totalTripValue.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function StatCard({
  label,
  value,
  icon,
  iconClass,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>

        <div className={`rounded-xl p-3 ${iconClass}`}>{icon}</div>
      </div>
    </article>
  );
}

function TripCard({ booking }: { booking: any }) {
  const fare = booking.estimatedFare || booking.totalPrice || 0;

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

          <p className="my-1 text-sm text-slate-400">to</p>

          <h3 className="text-lg font-bold text-slate-900">
            {booking.deliveryLocation || booking.dropLocation}
          </h3>
        </div>

        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
        <TripDetail
          icon={<Package size={17} />}
          label="Cargo"
          value={booking.cargoType}
        />

        <TripDetail
          icon={<Clock size={17} />}
          label="Pickup Date"
          value={booking.pickupDate}
        />

        <TripDetail
          icon={<MapPin size={17} />}
          label="Truck"
          value={booking.truckName}
        />

        <TripDetail
          icon={<CircleDollarSign size={17} />}
          label="Fare"
          value={`BDT ${fare.toLocaleString()}`}
        />
      </div>
    </article>
  );
}

function TripDetail({
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

      <div>
        <p className="text-xs text-slate-400">{label}</p>

        <p className="mt-1 text-sm font-semibold text-slate-700">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "On the Way": "bg-blue-100 text-blue-700",
    "Picked Up": "bg-violet-100 text-violet-700",
    "In Transit": "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function EmptyState({
  icon,
  title,
  message,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
      <div className="text-slate-300">{icon}</div>

      <h3 className="mt-4 text-lg font-bold text-slate-800">{title}</h3>

      <p className="mt-2 text-sm text-slate-500">{message}</p>
    </div>
  );
}
