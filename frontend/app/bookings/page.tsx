"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useBooking } from "@/context/BookingContext";
import RouteGuard from "@/components/auth/RouteGuard";

export default function MyBookingsPage() {
  return (
    <RouteGuard role="customer">
      <MyBookingsContent />
    </RouteGuard>
  );
}

function MyBookingsContent() {
  const router = useRouter();

  const { bookings, isLoaded } = useBooking();

  /* ========================================
     LOADING
  ======================================== */

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="mt-4 text-sm text-gray-500">
              Loading your bookings...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* =================================
            HEADER
        ================================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>

            <p className="mt-2 text-gray-500">
              Manage and track all your truck bookings.
            </p>
          </div>

          <button
            onClick={() => router.push("/trucks")}
            className="w-fit rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            + Book a Truck
          </button>
        </div>

        {/* =================================
            EMPTY STATE
        ================================= */}

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
              🚚
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              No bookings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              You haven't booked a truck yet. Find the right truck for your
              delivery and make your first booking.
            </p>

            <button
              onClick={() => router.push("/trucks")}
              className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              Book a Truck
            </button>
          </div>
        ) : (
          /* =================================
             BOOKING LIST
          ================================= */

          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="p-5 sm:p-6">
                  {/* =================================
                      TOP
                  ================================= */}

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Booking ID</p>

                      <h2 className="mt-1 text-lg font-bold text-gray-900">
                        #{booking.id}
                      </h2>

                      {booking.createdAt && (
                        <p className="mt-1 text-xs text-gray-400">
                          {formatDate(booking.createdAt)}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <BookingStatus status={booking.status} />

                      <PaymentStatus
                        status={booking.paymentStatus ?? "Unpaid"}
                      />
                    </div>
                  </div>

                  <div className="my-6 h-px bg-gray-100" />

                  {/* =================================
                      BOOKING INFORMATION
                  ================================= */}

                  <div className="grid gap-6 md:grid-cols-3">
                    {/* Pickup */}

                    <div>
                      <p className="text-sm text-gray-500">Pickup</p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {booking.pickupLocation}
                      </p>
                    </div>

                    {/* Destination */}

                    <div>
                      <p className="text-sm text-gray-500">Destination</p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {booking.deliveryLocation}
                      </p>
                    </div>

                    {/* Vehicle */}

                    <div>
                      <p className="text-sm text-gray-500">Vehicle</p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {booking.vehicleType}
                      </p>
                    </div>
                  </div>

                  {/* =================================
                      BOTTOM
                  ================================= */}

                  <div className="mt-6 flex flex-col gap-5 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    {/* Fare */}

                    <div>
                      <p className="text-sm text-gray-500">Total Fare</p>

                      <p className="text-xl font-bold text-gray-900">
                        ৳{Number(booking.price || 0).toLocaleString()}
                      </p>
                    </div>

                    {/* Buttons */}

                    <div className="flex flex-col gap-3 sm:flex-row">
                      {/* Details */}

                      <button
                        onClick={() => router.push(`/bookings/${booking.id}`)}
                        className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                      >
                        View Details
                      </button>

                      {/* Pay */}

                      {booking.paymentStatus !== "Paid" &&
                        booking.status !== "Cancelled" && (
                          <button
                            onClick={() =>
                              router.push(`/payment/${booking.id}`)
                            }
                            className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                          >
                            Pay Now
                          </button>
                        )}

                      {/* Track */}

                      {(booking.status === "Confirmed" ||
                        booking.status === "Accepted" ||
                        booking.status === "In Transit") && (
                        <button
                          onClick={() => router.push(`/tracking/${booking.id}`)}
                          className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                          Track Truck
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* ============================================
   BOOKING STATUS
============================================ */

function BookingStatus({ status }: { status: string }) {
  const statusConfig: Record<
    string,
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

  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-4 py-2 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

/* ============================================
   PAYMENT STATUS
============================================ */

function PaymentStatus({ status }: { status: string }) {
  const statusConfig: Record<
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

  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-4 py-2 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

/* ============================================
   DATE FORMAT
============================================ */

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
}
