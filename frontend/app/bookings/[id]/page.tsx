"use client";

import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useBooking } from "@/context/BookingContext";

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const { bookings, cancelBooking } = useBooking();

  const bookingId = Array.isArray(params.id) ? params.id[0] : String(params.id);

  const booking = bookings.find((item) => String(item.id) === bookingId);

  /* --------------------------------
     BOOKING NOT FOUND
  -------------------------------- */

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
              🚚
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Booking Not Found
            </h1>

            <p className="mt-2 text-gray-500">
              We could not find this booking.
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

  /* --------------------------------
     STATUS HELPERS
  -------------------------------- */

  const normalizedStatus = String(booking.status).toLowerCase();

  const isCancelled = normalizedStatus === "cancelled";

  const isCompleted = normalizedStatus === "completed";

  const isConfirmed =
    normalizedStatus === "confirmed" || normalizedStatus === "accepted";

  const isInTransit =
    normalizedStatus === "in-transit" ||
    normalizedStatus === "in transit" ||
    normalizedStatus === "in_progress" ||
    normalizedStatus === "in progress";

  const canTrack = !isCancelled && !isCompleted && (isConfirmed || isInTransit);

  const canCancel = !isCancelled && !isCompleted;

  /* --------------------------------
     CANCEL BOOKING
  -------------------------------- */

  function handleCancel() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) {
      return;
    }

    cancelBooking(booking.id);

    alert("Booking cancelled successfully.");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}

        <button
          onClick={() => router.push("/bookings")}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-black"
        >
          ← Back to My Bookings
        </button>

        {/* Header */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">Booking ID</p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              #{booking.id}
            </h1>
          </div>

          <BookingStatus status={booking.status} />
        </div>

        {/* Main Grid */}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* =====================================
              LEFT COLUMN
          ===================================== */}

          <div className="space-y-6 lg:col-span-2">
            {/* Trip Information */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Trip Information
              </h2>

              <div className="mt-6">
                {/* Pickup */}

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <span className="text-lg">●</span>
                    </div>

                    <div className="h-12 w-px bg-gray-200" />
                  </div>

                  <div className="pb-6">
                    <p className="text-sm text-gray-500">Pickup Location</p>

                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {booking.pickupLocation}
                    </p>
                  </div>
                </div>

                {/* Destination */}

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700">
                    <span className="text-lg">●</span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Delivery Location</p>

                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {booking.deliveryLocation}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Vehicle Information */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Vehicle Information
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  label="Vehicle Type"
                  value={String(booking.vehicleType)}
                />

                <InfoCard label="Booking ID" value={`#${booking.id}`} />

                <InfoCard
                  label="Pickup"
                  value={String(booking.pickupLocation)}
                />

                <InfoCard
                  label="Destination"
                  value={String(booking.deliveryLocation)}
                />
              </div>
            </section>

            {/* Booking Status */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Booking Status
              </h2>

              <div className="mt-6">
                <StatusTimeline status={String(booking.status)} />
              </div>
            </section>
          </div>

          {/* =====================================
              RIGHT COLUMN
          ===================================== */}

          <aside className="space-y-6">
            {/* Fare Summary */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Fare Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Truck Fare</span>

                  <span className="font-semibold text-gray-900">
                    ৳{Number(booking.price).toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total</span>

                    <span className="text-2xl font-bold text-gray-900">
                      ৳{Number(booking.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Current Status */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Current Status
              </h2>

              <div className="mt-4">
                <BookingStatus status={booking.status} />
              </div>
            </section>

            {/* Track Truck */}

            {canTrack && (
              <section className="rounded-2xl bg-black p-6 text-white shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl">
                  📍
                </div>

                <h2 className="mt-4 text-lg font-bold">Track Your Truck</h2>

                <p className="mt-2 text-sm leading-6 text-gray-300">
                  Track your truck and monitor your delivery progress in real
                  time.
                </p>

                <button
                  onClick={() => router.push(`/tracking/${booking.id}`)}
                  className="mt-5 w-full rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-gray-100"
                >
                  Track Truck
                </button>
              </section>
            )}

            {/* Payment */}

            {!isCancelled && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">Payment</h2>

                <p className="mt-2 text-sm text-gray-500">
                  Complete payment for this booking.
                </p>

                <button
                  onClick={() => router.push(`/payment/${booking.id}`)}
                  className="mt-5 w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
                >
                  Make Payment
                </button>
              </section>
            )}

            {/* Cancel Booking */}

            {canCancel && (
              <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">
                  Cancel Booking
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  You can cancel this booking if you no longer need the truck.
                </p>

                <button
                  onClick={handleCancel}
                  className="mt-5 w-full rounded-xl border border-red-300 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Cancel Booking
                </button>
              </section>
            )}

            {/* Back */}

            <button
              onClick={() => router.push("/bookings")}
              className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-800 transition hover:bg-gray-50"
            >
              View All Bookings
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ============================================
   BOOKING STATUS
============================================ */

function BookingStatus({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  const statusConfig: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800",
    },

    confirmed: {
      label: "Confirmed",
      className: "bg-blue-100 text-blue-800",
    },

    accepted: {
      label: "Accepted",
      className: "bg-blue-100 text-blue-800",
    },

    "in-transit": {
      label: "In Transit",
      className: "bg-purple-100 text-purple-800",
    },

    "in transit": {
      label: "In Transit",
      className: "bg-purple-100 text-purple-800",
    },

    "in progress": {
      label: "In Progress",
      className: "bg-purple-100 text-purple-800",
    },

    completed: {
      label: "Completed",
      className: "bg-green-100 text-green-800",
    },

    cancelled: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800",
    },
  };

  const config = statusConfig[normalizedStatus] ?? {
    label: status,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

/* ============================================
   STATUS TIMELINE
============================================ */

function StatusTimeline({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "cancelled") {
    return (
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
          ✕
        </div>

        <div>
          <h3 className="font-semibold text-red-600">Booking Cancelled</h3>

          <p className="mt-1 text-sm text-gray-500">
            This booking has been cancelled.
          </p>
        </div>
      </div>
    );
  }

  const confirmed =
    normalizedStatus === "confirmed" ||
    normalizedStatus === "accepted" ||
    normalizedStatus === "in-transit" ||
    normalizedStatus === "in transit" ||
    normalizedStatus === "in progress" ||
    normalizedStatus === "completed";

  const inTransit =
    normalizedStatus === "in-transit" ||
    normalizedStatus === "in transit" ||
    normalizedStatus === "in progress" ||
    normalizedStatus === "completed";

  const completed = normalizedStatus === "completed";

  const steps = [
    {
      title: "Booking Created",
      description: "Your booking request has been created.",
      active: true,
    },
    {
      title: "Booking Confirmed",
      description: "Your booking has been accepted.",
      active: confirmed,
    },
    {
      title: "Trip Started",
      description: "The truck is on its way.",
      active: inTransit,
    },
    {
      title: "Completed",
      description: "Your delivery has been completed.",
      active: completed,
    },
  ];

  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <div key={step.title} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                step.active
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {step.active ? "✓" : index + 1}
            </div>

            {index < steps.length - 1 && (
              <div
                className={`mt-2 h-8 w-px ${
                  step.active ? "bg-black" : "bg-gray-200"
                }`}
              />
            )}
          </div>

          <div>
            <h3
              className={`font-semibold ${
                step.active ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {step.title}
            </h3>

            <p className="mt-1 text-sm text-gray-500">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================
   INFO CARD
============================================ */

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-1 break-words font-semibold text-gray-900">{value}</p>
    </div>
  );
}
