"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  MapPin,
  Package,
  Search,
  Truck,
  XCircle,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { trucks } from "@/data/data";
import { useBookings } from "@/context/BookingContext";
import type { BookingStatus } from "@/types/booking";

type FilterStatus =
  | "All"
  | "Pending"
  | "Confirmed"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

export default function BookingsPage() {
  const { bookings, cancelBooking } = useBookings();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");

  const filteredBookings = bookings.filter((booking) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query ||
      booking.id.toLowerCase().includes(query) ||
      booking.truckName.toLowerCase().includes(query) ||
      booking.pickupLocation.toLowerCase().includes(query) ||
      booking.deliveryLocation.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getTruckImage = (truckId: number) => {
    return (
      trucks.find((truck) => truck.id === truckId)?.image || trucks[0].image
    );
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">
        {/* HERO */}
        <section className="bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
            <p className="text-sm font-bold text-orange-400">YOUR DELIVERIES</p>

            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              My Bookings
            </h1>

            <p className="mt-3 max-w-2xl text-slate-300">
              View, manage and track all your truck bookings in one place.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <StatCard value={bookings.length} label="Total Bookings" />

              <StatCard
                value={
                  bookings.filter((booking) => booking.status === "Pending")
                    .length
                }
                label="Pending"
              />

              <StatCard
                value={
                  bookings.filter((booking) => booking.status === "In Transit")
                    .length
                }
                label="In Transit"
              />

              <StatCard
                value={
                  bookings.filter((booking) => booking.status === "Delivered")
                    .length
                }
                label="Delivered"
              />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10">
          {/* SEARCH + FILTER */}
          {bookings.length > 0 && (
            <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 md:flex-row">
                {/* SEARCH */}
                <div className="relative flex-1">
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search booking ID, truck or location..."
                    className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                {/* STATUS FILTER */}
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as FilterStatus)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-900">
                  {filteredBookings.length}
                </span>{" "}
                booking
                {filteredBookings.length !== 1 ? "s" : ""}
              </p>
            </section>
          )}

          {/* BOOKINGS */}
          {bookings.length === 0 ? (
            <EmptyState />
          ) : filteredBookings.length === 0 ? (
            <NoResults
              clearSearch={() => {
                setSearch("");
                setStatusFilter("All");
              }}
            />
          ) : (
            <section className="mt-6 space-y-5">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  image={getTruckImage(booking.truckId)}
                  onCancel={() => {
                    const confirmed = window.confirm(
                      `Are you sure you want to cancel booking ${booking.id}?`,
                    );

                    if (confirmed) {
                      cancelBooking(booking.id);
                    }
                  }}
                />
              ))}
            </section>
          )}
        </div>
      </main>
    </>
  );
}

/* =========================
   BOOKING CARD
========================= */

interface BookingCardProps {
  booking: {
    id: string;
    customerName: string;
    phone: string;
    pickupLocation: string;
    deliveryLocation: string;
    pickupDate: string;
    pickupTime: string;
    cargoType: string;
    weight: number;
    truckId: number;
    truckName: string;
    truckCapacity: string;
    baseFare: number;
    serviceFee: number;
    discount: number;
    totalPrice: number;
    status: BookingStatus;
    createdAt: string;
  };
  image: string;
  onCancel: () => void;
}

function BookingCard({ booking, image, onCancel }: BookingCardProps) {
  const canCancel =
    booking.status === "Pending" || booking.status === "Confirmed";

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md">
      <div className="grid lg:grid-cols-[260px_1fr]">
        {/* TRUCK IMAGE */}
        <div className="relative min-h-52 lg:min-h-full">
          <Image
            src={image}
            alt={booking.truckName}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 260px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs font-medium text-white/75">
              Selected Vehicle
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              {booking.truckName}
            </h2>

            <p className="mt-1 text-sm text-orange-300">
              Capacity: {booking.truckCapacity}
            </p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="p-5 sm:p-6">
          {/* TOP */}
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Booking ID
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-900">
                {booking.id}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Booked on{" "}
                {new Date(booking.createdAt).toLocaleDateString("en-BD", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <StatusBadge status={booking.status} />
          </div>

          {/* ROUTE */}
          <div className="mt-6">
            <p className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-400">
              Delivery Route
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              <LocationItem
                label="Pickup"
                location={booking.pickupLocation}
                type="pickup"
              />

              <LocationItem
                label="Delivery"
                location={booking.deliveryLocation}
                type="delivery"
              />
            </div>
          </div>

          {/* INFORMATION */}
          <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 xl:grid-cols-4">
            <InfoItem
              icon={<CalendarDays size={19} />}
              label="Pickup Date"
              value={
                booking.pickupDate
                  ? new Date(
                      `${booking.pickupDate}T00:00:00`,
                    ).toLocaleDateString("en-BD", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Not selected"
              }
            />

            <InfoItem
              icon={<Clock size={19} />}
              label="Pickup Time"
              value={booking.pickupTime || "Flexible"}
            />

            <InfoItem
              icon={<Package size={19} />}
              label="Cargo"
              value={`${booking.cargoType} • ${booking.weight.toLocaleString()} KG`}
            />

            <InfoItem
              icon={<Truck size={19} />}
              label="Total Price"
              value={`৳${booking.totalPrice.toLocaleString()}`}
              price
            />
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">Fare:</span> Base ৳
              {booking.baseFare.toLocaleString()}
              {booking.discount > 0 && (
                <> • Discount ৳{booking.discount.toLocaleString()}</>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/tracking?booking=${booking.id}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Track Booking
                <ChevronRight size={18} />
              </Link>

              {canCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  <XCircle size={18} />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================
   STATUS BADGE
========================= */

function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    "In Transit": "bg-purple-100 text-purple-700 border-purple-200",
    Delivered: "bg-green-100 text-green-700 border-green-200",
    Cancelled: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span
      className={`w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${
        statusStyles[status] || "border-slate-200 bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

/* =========================
   LOCATION ITEM
========================= */

function LocationItem({
  label,
  location,
  type,
}: {
  label: string;
  location: string;
  type: "pickup" | "delivery";
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          type === "pickup"
            ? "bg-orange-100 text-orange-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        <MapPin size={20} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words font-semibold text-slate-800">
          {location}
        </p>
      </div>
    </div>
  );
}

/* =========================
   INFO ITEM
========================= */

function InfoItem({
  icon,
  label,
  value,
  price = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  price?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          price
            ? "bg-orange-100 text-orange-600"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1 truncate text-sm font-bold ${
            price ? "text-orange-600" : "text-slate-800"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-28 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
      <p className="text-2xl font-bold text-orange-400">{value}</p>

      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}

/* =========================
   EMPTY STATE
========================= */

function EmptyState() {
  return (
    <section className="mt-6 rounded-3xl bg-white px-5 py-16 text-center shadow-sm sm:py-24">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
        <Truck size={38} />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        No Bookings Yet
      </h2>

      <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
        You haven't booked a truck yet. Browse our available vehicles and start
        your first delivery.
      </p>

      <Link
        href="/trucks"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white transition hover:bg-orange-600"
      >
        Browse Trucks
        <ChevronRight size={19} />
      </Link>
    </section>
  );
}

/* =========================
   NO SEARCH RESULTS
========================= */

function NoResults({ clearSearch }: { clearSearch: () => void }) {
  return (
    <section className="mt-6 rounded-3xl bg-white px-5 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Search size={30} />
      </div>

      <h2 className="mt-5 text-xl font-bold text-slate-900">
        No Matching Bookings
      </h2>

      <p className="mt-2 text-slate-500">
        Try changing your search or status filter.
      </p>

      <button
        type="button"
        onClick={clearSearch}
        className="mt-6 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
      >
        Clear Search
      </button>
    </section>
  );
}
