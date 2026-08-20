"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useBooking } from "@/context/BookingContext";
import { useDrivers } from "@/context/DriverContext";

import { Booking, BookingStatus } from "@/types/booking";

export default function AdminBookingsPage() {
  const router = useRouter();

  const {
    bookings,
    isLoaded: bookingsLoaded,
    updateBookingStatus,
    updateBooking,
    deleteBooking,
  } = useBooking();

  const { drivers, isLoaded: driversLoaded } = useDrivers();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<"All" | BookingStatus>(
    "All",
  );

  /* =========================================
     LOADING
  ========================================= */

  const isLoaded = bookingsLoaded && driversLoaded;

  /* =========================================
     FILTER BOOKINGS
  ========================================= */

  const filteredBookings = useMemo(() => {
    const query = search.toLowerCase().trim();

    return bookings.filter((booking) => {
      const searchableText = [
        booking.id,
        booking.bookingId,
        booking.customerName,
        booking.customerPhone,
        booking.phone,
        booking.customerEmail,
        booking.pickupLocation,
        booking.deliveryLocation,
        booking.dropLocation,
        booking.vehicleType,
        booking.vehicleName,
        booking.truckNumber,
        booking.driverName,
        booking.driverPhone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = query === "" || searchableText.includes(query);

      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  /* =========================================
     STATISTICS
  ========================================= */

  const totalBookings = bookings.length;

  const pending = bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;

  const confirmed = bookings.filter(
    (booking) =>
      booking.status === "Confirmed" || booking.status === "Accepted",
  ).length;

  const inTransit = bookings.filter(
    (booking) => booking.status === "In Transit",
  ).length;

  const completed = bookings.filter(
    (booking) => booking.status === "Completed",
  ).length;

  const cancelled = bookings.filter(
    (booking) => booking.status === "Cancelled",
  ).length;

  const paid = bookings.filter(
    (booking) => booking.paymentStatus === "Paid",
  ).length;

  const revenue = bookings
    .filter((booking) => booking.paymentStatus === "Paid")
    .reduce((sum, booking) => sum + Number(booking.price || 0), 0);

  /* =========================================
     STATUS UPDATE
  ========================================= */

  function handleStatusChange(id: string, status: BookingStatus) {
    updateBookingStatus(id, status);
  }

  /* =========================================
     DRIVER UPDATE
  ========================================= */

  function handleDriverUpdate(bookingId: string, driverId: string) {
    const booking = bookings.find((item) => item.id === bookingId);

    if (!booking) return;

    const driver = drivers.find((item) => item.id === driverId);

    if (!driver) {
      updateBooking({
        ...booking,
        driverId: undefined,
        driverName: undefined,
        driverPhone: undefined,
      });

      return;
    }

    updateBooking({
      ...booking,
      driverId: driver.id,
      driverName: driver.name,
      driverPhone: driver.phone,
    });
  }

  /* =========================================
     REMOVE DRIVER
  ========================================= */

  function handleRemoveDriver(bookingId: string) {
    const booking = bookings.find((item) => item.id === bookingId);

    if (!booking) return;

    updateBooking({
      ...booking,
      driverId: undefined,
      driverName: undefined,
      driverPhone: undefined,
    });
  }

  /* =========================================
     DELETE
  ========================================= */

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?",
    );

    if (!confirmed) return;

    deleteBooking(id);
  }

  /* =========================================
     LOADING SCREEN
  ========================================= */

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="mt-4 text-sm text-gray-500">Loading bookings...</p>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="mb-5 inline-flex items-center text-sm font-semibold text-gray-500 transition hover:text-black"
          >
            ← Back to Admin Dashboard
          </button>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Administration
              </p>

              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                Booking Management
              </h1>

              <p className="mt-2 text-gray-500">
                Manage customer bookings, payments, drivers and delivery status.
              </p>
            </div>

            <div className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white">
              {totalBookings} Total Bookings
            </div>
          </div>
        </div>

        {/* =====================================
            STATISTICS
        ===================================== */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total" value={totalBookings} icon="📦" />

          <StatCard title="Pending" value={pending} icon="⏳" />

          <StatCard title="In Transit" value={inTransit} icon="🚚" />

          <StatCard title="Completed" value={completed} icon="✅" />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Confirmed" value={confirmed} icon="📋" />

          <StatCard title="Paid" value={paid} icon="💳" />

          <StatCard title="Cancelled" value={cancelled} icon="❌" />

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Revenue</p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              ৳{revenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* =====================================
            SEARCH / FILTER
        ===================================== */}

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div>
              <label
                htmlFor="booking-search"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Search
              </label>

              <input
                id="booking-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Booking ID, customer, phone, pickup, destination..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="status-filter"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Status
              </label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "All" | BookingStatus)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
              >
                <option value="All">All Statuses</option>

                <option value="Pending">Pending</option>

                <option value="Confirmed">Confirmed</option>

                <option value="Accepted">Accepted</option>

                <option value="In Transit">In Transit</option>

                <option value="Completed">Completed</option>

                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </section>

        {/* =====================================
            RESULTS
        ===================================== */}

        <div className="mt-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">All Bookings</h2>

            <p className="mt-1 text-sm text-gray-500">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
          </div>

          {filteredBookings.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-5">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  drivers={drivers}
                  onStatusChange={handleStatusChange}
                  onDriverUpdate={handleDriverUpdate}
                  onRemoveDriver={handleRemoveDriver}
                  onDelete={handleDelete}
                  onDetails={() => router.push(`/bookings/${booking.id}`)}
                  onTracking={() => router.push(`/tracking/${booking.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   BOOKING CARD
========================================================= */

function BookingCard({
  booking,
  drivers,
  onStatusChange,
  onDriverUpdate,
  onRemoveDriver,
  onDelete,
  onDetails,
  onTracking,
}: {
  booking: Booking;

  drivers: {
    id: string;
    name: string;
    phone: string;
    vehicleType: string;
    vehicleNumber: string;
    status: string;
    availability: string;
  }[];

  onStatusChange: (id: string, status: BookingStatus) => void;

  onDriverUpdate: (bookingId: string, driverId: string) => void;

  onRemoveDriver: (bookingId: string) => void;

  onDelete: (id: string) => void;

  onDetails: () => void;

  onTracking: () => void;
}) {
  const [selectedDriver, setSelectedDriver] = useState(booking.driverId || "");

  const [saved, setSaved] = useState(false);

  const assignedDriver = drivers.find(
    (driver) => driver.id === booking.driverId,
  );

  const availableDrivers = drivers.filter(
    (driver) =>
      driver.status === "approved" && driver.availability === "available",
  );

  function saveDriver() {
    if (!selectedDriver) {
      onRemoveDriver(booking.id);

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);

      return;
    }

    onDriverUpdate(booking.id, selectedDriver);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  function removeDriver() {
    setSelectedDriver("");

    onRemoveDriver(booking.id);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="p-5 sm:p-6">
        {/* =====================================
            TOP
        ===================================== */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">
                #{booking.bookingId || booking.id}
              </h3>

              <StatusBadge status={booking.status} />

              <PaymentBadge status={booking.paymentStatus || "Unpaid"} />
            </div>

            <p className="mt-2 font-semibold text-gray-900">
              {booking.customerName || "Customer"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {booking.customerPhone || booking.phone || "No phone number"}
            </p>

            {booking.customerEmail && (
              <p className="mt-1 text-sm text-gray-500">
                {booking.customerEmail}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onDetails}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              View Details
            </button>

            {(booking.status === "Confirmed" ||
              booking.status === "Accepted" ||
              booking.status === "In Transit" ||
              booking.status === "Completed") && (
              <button
                type="button"
                onClick={onTracking}
                className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Track
              </button>
            )}
          </div>
        </div>

        <div className="my-6 h-px bg-gray-100" />

        {/* =====================================
            BOOKING INFORMATION
        ===================================== */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Pickup" value={booking.pickupLocation} />

          <Info label="Destination" value={booking.deliveryLocation} />

          <Info
            label="Vehicle"
            value={booking.vehicleName || booking.vehicleType}
          />

          <Info
            label="Total Fare"
            value={`৳${Number(booking.price || 0).toLocaleString()}`}
          />
        </div>

        {/* =====================================
            EXTRA BOOKING INFORMATION
        ===================================== */}

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Date" value={booking.date} />

          <Info label="Time" value={booking.time} />

          <Info label="Truck Number" value={booking.truckNumber} />

          <Info label="Capacity" value={booking.truckCapacity} />
        </div>

        {/* =====================================
            STATUS + PAYMENT
        ===================================== */}

        <div className="mt-6 grid gap-4 border-t border-gray-100 pt-6 lg:grid-cols-2">
          <div>
            <label
              htmlFor={`status-${booking.id}`}
              className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400"
            >
              Update Booking Status
            </label>

            <select
              id={`status-${booking.id}`}
              value={booking.status}
              onChange={(event) =>
                onStatusChange(booking.id, event.target.value as BookingStatus)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-black"
            >
              <option value="Pending">Pending</option>

              <option value="Confirmed">Confirmed</option>

              <option value="Accepted">Accepted</option>

              <option value="In Transit">In Transit</option>

              <option value="Completed">Completed</option>

              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Payment Status
            </label>

            <div className="flex h-[46px] items-center rounded-xl border border-gray-200 bg-gray-50 px-4">
              <PaymentBadge status={booking.paymentStatus || "Unpaid"} />
            </div>
          </div>
        </div>

        {/* =====================================
            DRIVER ASSIGNMENT
        ===================================== */}

        <div className="mt-6 rounded-2xl bg-gray-50 p-5">
          <div className="mb-4">
            <h4 className="font-bold text-gray-900">Driver Assignment</h4>

            <p className="mt-1 text-sm text-gray-500">
              Assign an approved and available driver to this booking.
            </p>
          </div>

          {/* CURRENT DRIVER */}

          {assignedDriver && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                    Currently Assigned
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    {assignedDriver.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    {assignedDriver.phone}
                  </p>

                  <p className="text-sm text-gray-600">
                    {assignedDriver.vehicleType} •{" "}
                    {assignedDriver.vehicleNumber}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeDriver}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Remove Driver
                </button>
              </div>
            </div>
          )}

          {/* DRIVER SELECT */}

          <div>
            <label
              htmlFor={`driver-${booking.id}`}
              className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400"
            >
              Select Driver
            </label>

            <select
              id={`driver-${booking.id}`}
              value={selectedDriver}
              onChange={(event) => setSelectedDriver(event.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
            >
              <option value="">Select a driver</option>

              {availableDrivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} — {driver.phone} — {driver.vehicleNumber}
                </option>
              ))}
            </select>

            {availableDrivers.length === 0 && (
              <p className="mt-2 text-sm text-orange-600">
                No approved and available drivers found.
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={saveDriver}
              className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Assign / Update Driver
            </button>

            {saved && (
              <span className="text-sm font-semibold text-green-600">
                ✓ Driver information saved
              </span>
            )}
          </div>
        </div>

        {/* =====================================
            NOTES
        ===================================== */}

        {booking.notes && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Customer Notes
            </p>

            <p className="mt-2 text-sm text-gray-700">{booking.notes}</p>
          </div>
        )}

        {/* =====================================
            BOTTOM
        ===================================== */}

        <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-500">
            {booking.driverName ? (
              <span>
                Driver:{" "}
                <strong className="text-gray-900">{booking.driverName}</strong>
              </span>
            ) : (
              <span>No driver assigned</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onDelete(booking.id)}
            className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Delete Booking
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
        📦
      </div>

      <h2 className="mt-5 text-xl font-bold text-gray-900">
        No bookings found
      </h2>

      <p className="mt-2 text-gray-500">Try changing your search or filter.</p>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {value.toLocaleString()}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INFO
========================================================= */

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }: { status: BookingStatus }) {
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
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${item.className}`}
    >
      {item.label}
    </span>
  );
}

/* =========================================================
   PAYMENT BADGE
========================================================= */

function PaymentBadge({ status }: { status: string }) {
  const config: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    Unpaid: {
      label: "Unpaid",
      className: "bg-orange-100 text-orange-800",
    },

    Pending: {
      label: "Payment Pending",
      className: "bg-yellow-100 text-yellow-800",
    },

    Paid: {
      label: "Paid",
      className: "bg-green-100 text-green-800",
    },

    Failed: {
      label: "Failed",
      className: "bg-red-100 text-red-800",
    },

    Refunded: {
      label: "Refunded",
      className: "bg-gray-100 text-gray-700",
    },
  };

  const item = config[status] || {
    label: status,
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${item.className}`}
    >
      {item.label}
    </span>
  );
}
