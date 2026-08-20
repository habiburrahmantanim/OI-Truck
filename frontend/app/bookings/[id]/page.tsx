"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import { useBooking } from "@/context/BookingContext";
import { BookingStatus } from "@/types/booking";
import RouteGuard from "@/components/auth/RouteGuard";

export default function BookingDetailsPage() {
  return (
    <RouteGuard role="customer">
      <BookingDetailsContent />
    </RouteGuard>
  );
}

function BookingDetailsContent() {
  const router = useRouter();
  const params = useParams();

  const { bookings, isLoaded, cancelBooking } = useBooking();

  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    if (!params?.id) return;

    const id = Array.isArray(params.id) ? params.id[0] : String(params.id);

    setBookingId(id);
  }, [params]);

  const booking = bookings.find(
    (item) =>
      String(item.id) === bookingId || String(item.bookingId) === bookingId,
  );

  /* =========================================
     LOADING
  ========================================= */

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="mt-4 text-sm text-gray-500">Loading booking...</p>
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
              className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
            >
              Back to My Bookings
            </button>
          </div>
        </main>
      </div>
    );
  }

  const price = Number(booking.price || 0);

  const isPaid = booking.paymentStatus === "Paid";

  const canTrack =
    booking.status === "Confirmed" ||
    booking.status === "Accepted" ||
    booking.status === "In Transit";

  const canCancel =
    booking.status === "Pending" || booking.status === "Confirmed";

  /* =========================================
     CANCEL
  ========================================= */

  function handleCancel() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) return;

    cancelBooking(booking.id);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8">
          <button
            onClick={() => router.push("/bookings")}
            className="mb-5 text-sm font-semibold text-gray-500 hover:text-black"
          >
            ← Back to My Bookings
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Booking Details</p>

              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                #{booking.id}
              </h1>
            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <BookingStatus status={booking.status} />

              <PaymentBadge status={booking.paymentStatus ?? "Unpaid"} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* =====================================
              MAIN CONTENT
          ===================================== */}

          <div className="space-y-6 lg:col-span-2">
            {/* =================================
                ROUTE
            ================================= */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Delivery Route
              </h2>

              <div className="mt-7 space-y-6">
                {/* Pickup */}

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg">
                      📍
                    </div>

                    <div className="mt-2 h-12 w-px bg-gray-200" />
                  </div>

                  <div className="pt-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Pickup Location
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {booking.pickupLocation}
                    </p>
                  </div>
                </div>

                {/* Destination */}

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-lg">
                    🏁
                  </div>

                  <div className="pt-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Destination
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {booking.deliveryLocation}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================
                VEHICLE
            ================================= */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Vehicle Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InfoItem label="Vehicle Type" value={booking.vehicleType} />

                <InfoItem
                  label="Vehicle Name"
                  value={booking.vehicleName || booking.vehicleType}
                />

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

            {/* =================================
                SCHEDULE
            ================================= */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Schedule</h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InfoItem
                  label="Pickup Date"
                  value={booking.date || "Not specified"}
                />

                <InfoItem
                  label="Pickup Time"
                  value={booking.time || "Not specified"}
                />
              </div>
            </section>

            {/* =================================
                CUSTOMER
            ================================= */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Customer Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InfoItem
                  label="Name"
                  value={booking.customerName || "Not provided"}
                />

                <InfoItem
                  label="Phone"
                  value={
                    booking.customerPhone || booking.phone || "Not provided"
                  }
                />

                <InfoItem
                  label="Email"
                  value={booking.customerEmail || "Not provided"}
                />
              </div>
            </section>

            {/* =================================
                DRIVER
            ================================= */}

            {(booking.driverName || booking.driverPhone) && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  Driver Information
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <InfoItem
                    label="Driver"
                    value={booking.driverName || "Not assigned"}
                  />

                  <InfoItem
                    label="Phone"
                    value={booking.driverPhone || "Not available"}
                  />
                </div>
              </section>
            )}

            {/* =================================
                NOTES
            ================================= */}

            {booking.notes && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  Additional Notes
                </h2>

                <p className="mt-4 leading-7 text-gray-600">{booking.notes}</p>
              </section>
            )}
          </div>

          {/* =====================================
              SIDEBAR
          ===================================== */}

          <aside className="space-y-6">
            {/* =================================
                FARE
            ================================= */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Fare Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Fare</span>

                  <span className="font-semibold">
                    ৳{Number(booking.estimatedFare || price).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Total Fare</span>

                  {booking.paymentStatus === "Paid" ? (
                    <span className="font-bold text-green-600">✓ Paid</span>
                  ) : (
                    <span className="font-bold">৳{price.toLocaleString()}</span>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Total</span>

                    <span className="text-2xl font-bold text-gray-900">
                      ৳{price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================
                PAYMENT
            ================================= */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Payment</h2>

              <div className="mt-5">
                <PaymentBadge status={booking.paymentStatus ?? "Unpaid"} />
              </div>

              {booking.paymentMethod && (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Method
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {booking.paymentMethod}
                  </p>
                </div>
              )}

              {booking.paymentId && (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Payment ID
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                    {booking.paymentId}
                  </p>
                </div>
              )}

              {!isPaid && booking.status !== "Cancelled" && (
                <button
                  onClick={() => router.push(`/payment/${booking.id}`)}
                  className="mt-6 w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Pay Now
                </button>
              )}

              {isPaid && (
                <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
                  ✓ Payment completed successfully.
                </div>
              )}
            </section>

            {/* =================================
                ACTIONS
            ================================= */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Actions</h2>

              <div className="mt-5 space-y-3">
                {canTrack && (
                  <button
                    onClick={() => router.push(`/tracking/${booking.id}`)}
                    className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
                  >
                    🚚 Track Truck
                  </button>
                )}

                {canCancel && (
                  <button
                    onClick={handleCancel}
                    className="w-full rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </section>
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

/* ============================================
   BOOKING STATUS
============================================ */

function BookingStatus({ status }: { status: BookingStatus }) {
  const config: Record<
    BookingStatus,
    {
      label: string;
      className: string;
    }
  > = {
    Pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800",
    },

    Confirmed: {
      label: "Confirmed",
      className: "bg-blue-100 text-blue-800",
    },

    Accepted: {
      label: "Accepted",
      className: "bg-indigo-100 text-indigo-800",
    },

    "In Transit": {
      label: "In Transit",
      className: "bg-purple-100 text-purple-800",
    },

    Completed: {
      label: "Completed",
      className: "bg-green-100 text-green-800",
    },

    Cancelled: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800",
    },
  };

  const item = config[status];

  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold ${item.className}`}
    >
      {item.label}
    </span>
  );
}

/* ============================================
   PAYMENT BADGE
============================================ */

function PaymentBadge({ status }: { status: string }) {
  const config: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    Unpaid: {
      label: "Payment Unpaid",
      className: "bg-orange-100 text-orange-800",
    },

    Pending: {
      label: "Payment Pending",
      className: "bg-yellow-100 text-yellow-800",
    },

    Paid: {
      label: "Payment Paid",
      className: "bg-green-100 text-green-800",
    },

    Failed: {
      label: "Payment Failed",
      className: "bg-red-100 text-red-800",
    },

    Refunded: {
      label: "Refunded",
      className: "bg-gray-100 text-gray-700",
    },
  };

  const item = config[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold ${item.className}`}
    >
      {item.label}
    </span>
  );
}
