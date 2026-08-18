"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useBooking } from "@/context/BookingContext";

export default function MyBookingsPage() {
  const router = useRouter();
  const { bookings } = useBooking();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>

          <p className="mt-2 text-gray-500">
            Manage and track all your truck bookings.
          </p>
        </div>

        {/* Empty */}
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
          <div className="space-y-5">
            {bookings.map((booking) => {
              const status = String(booking.status).toLowerCase();

              const canTrack =
                status === "confirmed" ||
                status === "accepted" ||
                status === "in-transit" ||
                status === "in transit" ||
                status === "in progress";

              return (
                <div
                  key={booking.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="p-5 sm:p-6">
                    {/* Header */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Booking ID</p>

                        <h2 className="mt-1 text-lg font-bold text-gray-900">
                          #{booking.id}
                        </h2>
                      </div>

                      <BookingStatus status={String(booking.status)} />
                    </div>

                    <div className="my-6 h-px bg-gray-100" />

                    {/* Information */}

                    <div className="grid gap-6 md:grid-cols-3">
                      <Info
                        label="Pickup"
                        value={String(booking.pickupLocation)}
                      />

                      <Info
                        label="Destination"
                        value={String(booking.deliveryLocation)}
                      />

                      <Info
                        label="Vehicle"
                        value={String(booking.vehicleType)}
                      />
                    </div>

                    {/* Bottom */}

                    <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Fare</p>

                        <p className="text-xl font-bold text-gray-900">
                          ৳{Number(booking.price).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          onClick={() => router.push(`/bookings/${booking.id}`)}
                          className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                        >
                          View Details
                        </button>

                        {canTrack && (
                          <button
                            onClick={() =>
                              router.push(`/tracking/${booking.id}`)
                            }
                            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                          >
                            Track Truck
                          </button>
                        )}

                        <button
                          onClick={() => router.push(`/payment/${booking.id}`)}
                          className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

/* =========================================
   INFO
========================================= */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-1 font-semibold text-gray-900">{value}</p>
    </div>
  );
}

/* =========================================
   STATUS
========================================= */

function BookingStatus({ status }: { status: string }) {
  const normalized = status.toLowerCase();

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

    completed: {
      label: "Completed",
      className: "bg-green-100 text-green-800",
    },

    cancelled: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800",
    },
  };

  const config = statusConfig[normalized] ?? {
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
