"use client";

import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useBooking } from "@/context/BookingContext";

export default function TrackingPage() {
  const router = useRouter();
  const params = useParams();

  const { bookings } = useBooking();

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
              📍
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Booking Not Found
            </h1>

            <p className="mt-2 text-gray-500">
              We could not find the booking associated with this tracking
              request.
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

  const normalizedStatus = String(booking.status).toLowerCase();

  const isCancelled = normalizedStatus === "cancelled";

  const isCompleted = normalizedStatus === "completed";

  const isInTransit =
    normalizedStatus === "in-transit" ||
    normalizedStatus === "in transit" ||
    normalizedStatus === "in progress";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* --------------------------------
            HEADER
        -------------------------------- */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => router.push(`/bookings/${booking.id}`)}
              className="mb-3 text-sm font-semibold text-gray-500 transition hover:text-black"
            >
              ← Back to Booking
            </button>

            <h1 className="text-3xl font-bold text-gray-900">
              Track Your Truck
            </h1>

            <p className="mt-1 text-gray-500">Booking #{booking.id}</p>
          </div>

          <StatusBadge status={booking.status} />
        </div>

        {/* --------------------------------
            MAIN GRID
        -------------------------------- */}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* =====================================
              MAP
          ===================================== */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
            <div className="relative h-[520px] overflow-hidden bg-gray-200">
              {/* Map Background */}

              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.65)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.65)_1px,transparent_1px)] bg-[size:60px_60px]" />

              {/* Roads */}

              <div className="absolute left-0 right-0 top-[35%] h-5 rotate-[-8deg] bg-white shadow-sm" />

              <div className="absolute left-[-10%] right-[-10%] top-[65%] h-6 rotate-[12deg] bg-white shadow-sm" />

              <div className="absolute bottom-0 left-[40%] top-0 w-5 rotate-[8deg] bg-white shadow-sm" />

              <div className="absolute bottom-0 left-[68%] top-0 w-4 rotate-[-15deg] bg-white shadow-sm" />

              {/* Route Line */}

              <div className="absolute left-[20%] top-[68%] h-[3px] w-[58%] rotate-[-25deg] origin-left bg-black" />

              {/* Pickup Marker */}

              <div className="absolute left-[18%] top-[70%]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
                  ●
                </div>

                <div className="mt-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold shadow-md">
                  Pickup
                </div>
              </div>

              {/* Truck Marker */}

              <div className="absolute left-[48%] top-[50%]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl text-white shadow-xl ring-4 ring-white">
                  🚚
                </div>

                <div className="mt-2 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white shadow-md">
                  Your Truck
                </div>
              </div>

              {/* Destination Marker */}

              <div className="absolute right-[17%] top-[30%]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
                  ●
                </div>

                <div className="mt-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold shadow-md">
                  Destination
                </div>
              </div>

              {/* Map Label */}

              <div className="absolute left-4 top-4 rounded-xl bg-white/95 px-4 py-3 shadow-md">
                <p className="text-xs text-gray-500">Live Tracking</p>

                <p className="mt-1 font-semibold text-gray-900">
                  {isCompleted
                    ? "Trip Completed"
                    : isCancelled
                      ? "Trip Cancelled"
                      : isInTransit
                        ? "Truck is on the way"
                        : "Waiting for trip to start"}
                </p>
              </div>

              {/* Map Controls */}

              <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-xl bg-white shadow-md">
                <button
                  className="flex h-11 w-11 items-center justify-center text-lg hover:bg-gray-100"
                  aria-label="Zoom in"
                >
                  +
                </button>

                <div className="h-px bg-gray-200" />

                <button
                  className="flex h-11 w-11 items-center justify-center text-lg hover:bg-gray-100"
                  aria-label="Zoom out"
                >
                  −
                </button>
              </div>
            </div>

            {/* Route Details */}

            <div className="border-t border-gray-100 p-5">
              <div className="grid gap-5 md:grid-cols-2">
                <LocationCard
                  type="Pickup"
                  location={String(booking.pickupLocation)}
                  icon="🟢"
                />

                <LocationCard
                  type="Destination"
                  location={String(booking.deliveryLocation)}
                  icon="🔴"
                />
              </div>
            </div>
          </section>

          {/* =====================================
              SIDEBAR
          ===================================== */}

          <aside className="space-y-6">
            {/* Current Status */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Current Status</p>

              <div className="mt-3">
                <StatusBadge status={booking.status} />
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                {isCancelled
                  ? "This trip has been cancelled."
                  : isCompleted
                    ? "This trip has been completed successfully."
                    : isInTransit
                      ? "Your truck is currently travelling to the destination."
                      : "Your booking is waiting for the trip to begin."}
              </p>
            </section>

            {/* ETA */}

            {!isCompleted && !isCancelled && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Estimated Arrival</p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">--:--</h2>

                <p className="mt-1 text-sm text-gray-500">
                  ETA will be updated when live GPS tracking is connected.
                </p>
              </section>
            )}

            {/* Driver */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Driver</h2>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                  👨‍✈️
                </div>

                <div>
                  <p className="font-semibold text-gray-900">Driver Assigned</p>

                  <p className="mt-1 text-sm text-gray-500">
                    Driver information will appear here.
                  </p>
                </div>
              </div>

              <button
                disabled
                className="mt-5 w-full cursor-not-allowed rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-400"
              >
                Contact Driver
              </button>
            </section>

            {/* Vehicle */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Vehicle</h2>

              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Vehicle Type</p>

                <p className="mt-1 font-semibold text-gray-900">
                  {String(booking.vehicleType)}
                </p>
              </div>
            </section>

            {/* Booking */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Booking</h2>

              <div className="mt-5 space-y-4">
                <DetailRow label="Booking ID" value={`#${booking.id}`} />

                <DetailRow
                  label="Fare"
                  value={`৳${Number(booking.price).toLocaleString()}`}
                />
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ============================================
   STATUS BADGE
============================================ */

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",

    confirmed: "bg-blue-100 text-blue-800",

    accepted: "bg-blue-100 text-blue-800",

    "in-transit": "bg-purple-100 text-purple-800",

    "in transit": "bg-purple-100 text-purple-800",

    "in progress": "bg-purple-100 text-purple-800",

    completed: "bg-green-100 text-green-800",

    cancelled: "bg-red-100 text-red-800",
  };

  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    accepted: "Accepted",
    "in-transit": "In Transit",
    "in transit": "In Transit",
    "in progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
        styles[normalized] ?? "bg-gray-100 text-gray-800"
      }`}
    >
      {labels[normalized] ?? status}
    </span>
  );
}

/* ============================================
   LOCATION CARD
============================================ */

function LocationCard({
  type,
  location,
  icon,
}: {
  type: string;
  location: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>

        <p className="text-sm text-gray-500">{type}</p>
      </div>

      <p className="mt-2 font-semibold text-gray-900">{location}</p>
    </div>
  );
}

/* ============================================
   DETAIL ROW
============================================ */

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-gray-500">{label}</span>

      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
