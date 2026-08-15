"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  Package,
  Search,
  Truck,
  XCircle,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { trucks } from "@/data/data";
import { Booking, useBookings } from "@/context/BookingContext";

const trackingSteps = [
  {
    title: "Booking Placed",
    description: "Your truck booking request has been received.",
    status: "Pending",
  },
  {
    title: "Booking Confirmed",
    description: "Your booking has been confirmed and assigned.",
    status: "Confirmed",
  },
  {
    title: "Truck In Transit",
    description: "Your truck is currently on the way.",
    status: "In Transit",
  },
  {
    title: "Delivery Completed",
    description: "Your cargo has been successfully delivered.",
    status: "Delivered",
  },
];

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const { bookings } = useBookings();

  const bookingFromUrl = searchParams.get("booking") || "";

  const [searchId, setSearchId] = useState(bookingFromUrl);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!bookingFromUrl) return;

    const booking = bookings.find(
      (item) => item.id.toLowerCase() === bookingFromUrl.toLowerCase(),
    );

    if (booking) {
      setSelectedBooking(booking);
      setSearched(true);
    }
  }, [bookingFromUrl, bookings]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchId.trim().toLowerCase();

    if (!query) {
      setSelectedBooking(null);
      setSearched(true);
      return;
    }

    const booking = bookings.find((item) => item.id.toLowerCase() === query);

    setSelectedBooking(booking || null);
    setSearched(true);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">
        {/* HERO */}
        <section className="bg-slate-900">
          <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 md:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <Truck size={32} />
            </div>

            <p className="mt-6 text-sm font-bold text-orange-400">
              TRACK YOUR DELIVERY
            </p>

            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Track Your Truck Booking
            </h1>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
              Enter your booking ID to check the current status of your truck
              and delivery.
            </p>

            {/* SEARCH FORM */}
            <form
              onSubmit={handleSearch}
              className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchId}
                  onChange={(event) => setSearchId(event.target.value)}
                  placeholder="Enter Booking ID (Example: TL-123456)"
                  className="w-full rounded-xl border border-white/10 bg-white px-4 py-4 pl-12 text-sm text-slate-900 outline-none ring-0"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-orange-500 px-7 py-4 font-bold text-white transition hover:bg-orange-600"
              >
                Track Now
              </button>
            </form>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
          {/* TRACKING RESULT */}
          {selectedBooking ? (
            <TrackingResult booking={selectedBooking} />
          ) : searched ? (
            <NotFound bookingId={searchId} />
          ) : (
            <InitialState />
          )}
        </div>
      </main>
    </>
  );
}

/* ==================================
   TRACKING RESULT
================================== */

function TrackingResult({ booking }: { booking: Booking }) {
  const truck = trucks.find((item) => item.id === booking.truckId);

  const currentStepIndex = getCurrentStepIndex(booking.status);

  return (
    <div className="space-y-6">
      {/* BOOKING HEADER */}
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="grid md:grid-cols-[240px_1fr]">
          {/* IMAGE */}
          <div className="relative min-h-52">
            <Image
              src={truck?.image || trucks[0].image}
              alt={booking.truckName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 240px"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4">
              <p className="text-xs text-white/70">Your Vehicle</p>

              <h2 className="text-xl font-bold text-white">
                {booking.truckName}
              </h2>
            </div>
          </div>

          {/* DETAILS */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Booking ID
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {booking.id}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Created{" "}
                  {new Date(booking.createdAt).toLocaleDateString("en-BD", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <BookingStatus status={booking.status} />
            </div>

            {/* ROUTE */}
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <LocationCard
                label="Pickup Location"
                location={booking.pickupLocation}
                type="pickup"
              />

              <LocationCard
                label="Delivery Location"
                location={booking.deliveryLocation}
                type="delivery"
              />
            </div>

            {/* EXTRA INFO */}
            <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
              <InfoBox
                icon={<CalendarDays size={19} />}
                label="Pickup Date"
                value={
                  booking.pickupDate
                    ? new Date(
                        `${booking.pickupDate}T00:00:00`,
                      ).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                      })
                    : "Not selected"
                }
              />

              <InfoBox
                icon={<Clock size={19} />}
                label="Pickup Time"
                value={booking.pickupTime || "Flexible"}
              />

              <InfoBox
                icon={<Package size={19} />}
                label="Cargo"
                value={`${booking.weight.toLocaleString()} KG`}
              />

              <InfoBox
                icon={<Truck size={19} />}
                label="Truck Capacity"
                value={booking.truckCapacity}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CANCELLED BOOKING */}
      {booking.status === "Cancelled" ? (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <XCircle size={34} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-red-700">
            Booking Cancelled
          </h2>

          <p className="mx-auto mt-3 max-w-lg leading-7 text-red-600">
            This booking has been cancelled and will no longer continue through
            the delivery process.
          </p>
        </section>
      ) : (
        /* TRACKING TIMELINE */
        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-orange-500">
                DELIVERY STATUS
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Tracking Progress
              </h2>
            </div>

            <p className="text-sm text-slate-500">
              Current status:{" "}
              <span className="font-bold text-slate-900">{booking.status}</span>
            </p>
          </div>

          <div className="mt-8">
            {trackingSteps.map((step, index) => {
              const completed = index <= currentStepIndex;
              const current = index === currentStepIndex;

              return (
                <div
                  key={step.status}
                  className="relative flex gap-4 pb-8 last:pb-0"
                >
                  {/* LINE */}
                  {index !== trackingSteps.length - 1 && (
                    <div
                      className={`absolute left-4.75 top-10 h-[calc(100%-20px)] w-0.5 ${
                        index < currentStepIndex
                          ? "bg-green-500"
                          : "bg-slate-200"
                      }`}
                    />
                  )}

                  {/* ICON */}
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      completed
                        ? current
                          ? "bg-orange-500 text-white ring-4 ring-orange-100"
                          : "bg-green-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <Circle size={20} />
                    )}
                  </div>

                  {/* TEXT */}
                  <div className="pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`font-bold ${
                          completed ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </h3>

                      {current && (
                        <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-600">
                          CURRENT
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-1 text-sm leading-6 ${
                        completed ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* BOOKING SUMMARY */}
      <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-bold text-orange-400">PAYMENT SUMMARY</p>

        <h2 className="mt-2 text-2xl font-bold">Booking Fare Details</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FareItem
            label="Base Fare"
            value={`৳${booking.baseFare.toLocaleString()}`}
          />

          <FareItem
            label="Service Fee"
            value={`৳${booking.serviceFee.toLocaleString()}`}
          />

          <FareItem
            label="Discount"
            value={`-৳${booking.discount.toLocaleString()}`}
            green
          />

          <FareItem
            label="Total Paid"
            value={`৳${booking.totalPrice.toLocaleString()}`}
            total
          />
        </div>
      </section>
    </div>
  );
}

/* ==================================
   STATUS HELPERS
================================== */

function getCurrentStepIndex(status: string) {
  const statusIndex: Record<string, number> = {
    Pending: 0,
    Confirmed: 1,
    "In Transit": 2,
    Delivered: 3,
  };

  return statusIndex[status] ?? 0;
}

function BookingStatus({ status }: { status: Booking["status"] }) {
  const styles: Record<Booking["status"], string> = {
    Pending: "border-amber-200 bg-amber-100 text-amber-700",
    Confirmed: "border-blue-200 bg-blue-100 text-blue-700",
    "In Transit": "border-purple-200 bg-purple-100 text-purple-700",
    Delivered: "border-green-200 bg-green-100 text-green-700",
    Cancelled: "border-red-200 bg-red-100 text-red-700",
  };

  return (
    <span
      className={`w-fit rounded-full border px-4 py-2 text-sm font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ==================================
   SMALL COMPONENTS
================================== */

function LocationCard({
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
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          type === "pickup"
            ? "bg-orange-100 text-orange-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        <MapPin size={21} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 wrap-break-word font-semibold text-slate-800">
          {location}
        </p>
      </div>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-bold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function FareItem({
  label,
  value,
  green = false,
  total = false,
}: {
  label: string;
  value: string;
  green?: boolean;
  total?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${total ? "bg-orange-500" : "bg-white/10"}`}
    >
      <p
        className={`text-xs font-bold uppercase tracking-wide ${
          total ? "text-white/70" : "text-slate-400"
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-bold ${
          total ? "text-white" : green ? "text-green-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ==================================
   EMPTY STATES
================================== */

function InitialState() {
  return (
    <section className="rounded-3xl bg-white px-5 py-16 text-center shadow-sm sm:py-24">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
        <Search size={36} />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        Enter Your Booking ID
      </h2>

      <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
        Enter the booking ID you received after confirming your truck booking to
        view its delivery status.
      </p>
    </section>
  );
}

function NotFound({ bookingId }: { bookingId: string }) {
  return (
    <section className="rounded-3xl bg-white px-5 py-16 text-center shadow-sm sm:py-20">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500">
        <XCircle size={38} />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        Booking Not Found
      </h2>

      <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
        We couldn't find a booking with ID{" "}
        <span className="font-bold text-slate-800">
          {bookingId || "provided"}
        </span>
        . Please check the ID and try again.
      </p>
    </section>
  );
}
