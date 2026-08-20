"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import { useBooking } from "@/context/BookingContext";

export default function TrackingPage() {
  const router = useRouter();
  const params = useParams();

  const { bookings, isLoaded } = useBooking();

  const [bookingId, setBookingId] = useState("");
  const [progress, setProgress] = useState(45);

  /* =========================================
     GET BOOKING ID
  ========================================= */

  useEffect(() => {
    if (!params?.id) return;

    const id = Array.isArray(params.id) ? params.id[0] : String(params.id);

    setBookingId(id);
  }, [params]);

  /* =========================================
     FIND BOOKING
  ========================================= */

  const booking = bookings.find(
    (item) =>
      String(item.id) === bookingId || String(item.bookingId) === bookingId,
  );

  /* =========================================
     SIMULATED LIVE PROGRESS
  ========================================= */

  useEffect(() => {
    if (!booking) return;

    if (booking.status !== "In Transit") {
      return;
    }

    const interval = setInterval(() => {
      setProgress((previous) => {
        if (previous >= 95) {
          return previous;
        }

        return previous + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [booking]);

  /* =========================================
     STATUS
  ========================================= */

  const statusText = useMemo(() => {
    if (!booking) return "Loading";

    switch (booking.status) {
      case "Pending":
        return "Booking Pending";

      case "Confirmed":
        return "Booking Confirmed";

      case "Accepted":
        return "Driver Accepted";

      case "In Transit":
        return "Truck is on the way";

      case "Completed":
        return "Delivery Completed";

      case "Cancelled":
        return "Booking Cancelled";

      default:
        return booking.status;
    }
  }, [booking]);

  /* =========================================
     LOADING
  ========================================= */

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-5xl px-4 py-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="mt-4 text-sm text-gray-500">
              Loading tracking information...
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================
     NOT FOUND
  ========================================= */

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
              🚚
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Booking Not Found
            </h1>

            <p className="mt-2 text-gray-500">
              We couldn't find booking #{bookingId}.
            </p>

            <button
              onClick={() => router.push("/bookings")}
              className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              Back to My Bookings
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================
     COMPLETED
  ========================================= */

  const isCompleted = booking.status === "Completed";

  /* =========================================
     CANCELLED
  ========================================= */

  const isCancelled = booking.status === "Cancelled";

  /* =========================================
     CAN TRACK
  ========================================= */

  const canTrack =
    booking.status === "Confirmed" ||
    booking.status === "Accepted" ||
    booking.status === "In Transit" ||
    booking.status === "Completed";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8">
          <button
            onClick={() => router.push(`/bookings/${booking.id}`)}
            className="mb-5 text-sm font-semibold text-gray-500 transition hover:text-black"
          >
            ← Back to Booking Details
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Truck Tracking</p>

              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                #{booking.id}
              </h1>
            </div>

            <div
              className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                isCompleted
                  ? "bg-green-100 text-green-700"
                  : isCancelled
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
              }`}
            >
              {statusText}
            </div>
          </div>
        </div>

        {!canTrack && !isCancelled && (
          <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
            <p className="font-semibold text-yellow-800">
              Tracking will become available once your booking is confirmed.
            </p>

            <p className="mt-1 text-sm text-yellow-700">
              Your current booking status is <strong>{booking.status}</strong>.
            </p>
          </div>
        )}

        {isCancelled && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-800">
              This booking has been cancelled.
            </p>

            <p className="mt-1 text-sm text-red-700">
              Truck tracking is unavailable for cancelled bookings.
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* =====================================
              LEFT / MAP AREA
          ===================================== */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
            {/* MAP HEADER */}

            <div className="flex flex-col gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Live Truck Location
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Simulated tracking view
                </p>
              </div>

              {booking.status === "In Transit" && (
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
                  Live
                </div>
              )}
            </div>

            {/* MAP */}

            <div className="relative h-[420px] overflow-hidden bg-gray-100">
              {/* ROAD LINES */}

              <div className="absolute left-[12%] top-[48%] h-1 w-[76%] rounded-full bg-gray-300" />

              <div className="absolute left-[12%] top-[48%] h-1 w-[76%] -rotate-12 rounded-full border-t-2 border-dashed border-gray-400" />

              {/* PICKUP */}

              <div className="absolute left-[8%] top-[57%] flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl text-white shadow-lg">
                  📍
                </div>

                <div className="mt-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold shadow">
                  Pickup
                </div>
              </div>

              {/* TRUCK */}

              <div
                className="absolute top-[39%] transition-all duration-1000"
                style={{
                  left: `${Math.min(Math.max(progress, 15), 80)}%`,
                }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl text-white shadow-xl">
                  🚚
                </div>

                {booking.status === "In Transit" && (
                  <div className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 animate-ping rounded-full bg-green-500" />
                )}
              </div>

              {/* DESTINATION */}

              <div className="absolute right-[8%] top-[27%] flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-xl text-white shadow-lg">
                  🏁
                </div>

                <div className="mt-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold shadow">
                  Destination
                </div>
              </div>

              {/* MAP LABEL */}

              <div className="absolute bottom-5 left-5 rounded-xl bg-white/95 p-4 shadow-md backdrop-blur">
                <p className="text-xs text-gray-500">Current Status</p>

                <p className="mt-1 font-bold text-gray-900">{statusText}</p>
              </div>
            </div>

            {/* PROGRESS */}

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Delivery Progress</p>

                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {isCompleted ? "100%" : `${Math.round(progress)}%`}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Estimated arrival</p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {isCompleted ? "Delivered" : booking.time || "Today"}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-black transition-all duration-1000"
                  style={{
                    width: `${isCompleted ? 100 : progress}%`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* =====================================
              RIGHT SIDEBAR
          ===================================== */}

          <aside className="space-y-6">
            {/* TRUCK */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Truck Information
              </h2>

              <div className="mt-5 space-y-4">
                <InfoItem
                  label="Vehicle"
                  value={booking.vehicleName || booking.vehicleType}
                />

                <InfoItem label="Type" value={booking.vehicleType} />

                <InfoItem
                  label="Truck Number"
                  value={booking.truckNumber || "Not assigned"}
                />

                <InfoItem
                  label="Capacity"
                  value={booking.truckCapacity || "Not specified"}
                />
              </div>
            </section>

            {/* DRIVER */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Driver</h2>

              {booking.driverName || booking.driverPhone ? (
                <div className="mt-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                      👨‍✈️
                    </div>

                    <div>
                      <p className="font-bold text-gray-900">
                        {booking.driverName || "Driver"}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {booking.driverPhone || "Phone unavailable"}
                      </p>
                    </div>
                  </div>

                  {booking.driverPhone && (
                    <a
                      href={`tel:${booking.driverPhone}`}
                      className="mt-5 block w-full rounded-xl border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                    >
                      📞 Call Driver
                    </a>
                  )}
                </div>
              ) : (
                <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                  Driver has not been assigned yet.
                </div>
              )}
            </section>

            {/* ROUTE */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Delivery Route
              </h2>

              <div className="mt-5 space-y-5">
                <div className="flex gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-green-500" />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Pickup
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {booking.pickupLocation}
                    </p>
                  </div>
                </div>

                <div className="ml-1.5 h-6 border-l border-dashed border-gray-300" />

                <div className="flex gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-red-500" />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Destination
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {booking.deliveryLocation}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* BACK BUTTON */}

            <button
              onClick={() => router.push(`/bookings/${booking.id}`)}
              className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              View Booking Details
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ============================================
   INFO ITEM
============================================ */

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-gray-900">{value}</p>
    </div>
  );
}
