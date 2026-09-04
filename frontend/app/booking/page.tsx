"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import { useBooking } from "@/context/BookingContext";
import RouteGuard from "@/components/auth/RouteGuard";

export default function BookingPage() {
  return (
    <RouteGuard role="customer" redirectTo="/login">
      <BookingContent />
    </RouteGuard>
  );
}

function BookingContent() {
  const router = useRouter();

  const { addBooking } = useBooking();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [pickupLocation, setPickupLocation] = useState("");

  const [deliveryLocation, setDeliveryLocation] = useState("");

  const [vehicleType, setVehicleType] = useState("Small Truck");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [price, setPrice] = useState("5000");

  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* =========================================
     SUBMIT BOOKING
  ========================================= */

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    /* -----------------------------
       VALIDATION
    ----------------------------- */

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!pickupLocation.trim()) {
      setError("Please enter pickup location.");
      return;
    }

    if (!deliveryLocation.trim()) {
      setError("Please enter delivery location.");
      return;
    }

    if (!date) {
      setError("Please select a pickup date.");
      return;
    }

    if (!time) {
      setError("Please select a pickup time.");
      return;
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Please enter a valid fare.");
      return;
    }

    setSubmitting(true);

    try {
      const booking = await addBooking({
        customer_name: customerName.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim() || undefined,
        pickup_location: pickupLocation.trim(),
        delivery_location: deliveryLocation.trim(),
        vehicle_type: vehicleType,
        booking_date: date,
        booking_time: time,
        notes: notes.trim() || undefined,
        price: numericPrice,
      });

      router.push(`/bookings/${booking.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create booking.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* =================================
            HEADER
        ================================= */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/trucks")}
            className="mb-4 text-sm font-semibold text-gray-500 hover:text-black"
          >
            ← Back to Trucks
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Book a Truck</h1>

          <p className="mt-2 text-gray-500">
            Enter your delivery information to create a booking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
          {/* =================================
              FORM
          ================================= */}

          <div className="space-y-6 lg:col-span-2">
            {/* CUSTOMER */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Customer Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InputField
                  label="Full Name"
                  value={customerName}
                  onChange={setCustomerName}
                  placeholder="Enter your full name"
                  required
                />

                <InputField
                  label="Phone Number"
                  value={phone}
                  onChange={setPhone}
                  placeholder="01XXXXXXXXX"
                  type="tel"
                  required
                />

                <div className="sm:col-span-2">
                  <InputField
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    type="email"
                  />
                </div>
              </div>
            </section>

            {/* ROUTE */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Delivery Route
              </h2>

              <div className="mt-6 space-y-5">
                <InputField
                  label="Pickup Location"
                  value={pickupLocation}
                  onChange={setPickupLocation}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  required
                />

                <InputField
                  label="Delivery Location"
                  value={deliveryLocation}
                  onChange={setDeliveryLocation}
                  placeholder="e.g. Uttara, Dhaka"
                  required
                />
              </div>
            </section>

            {/* VEHICLE */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Vehicle</h2>

              <div className="mt-6">
                <label className="text-sm font-semibold text-gray-700">
                  Vehicle Type
                </label>

                <select
                  value={vehicleType}
                  onChange={(event) => setVehicleType(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
                >
                  <option value="Small Truck">Small Truck</option>

                  <option value="Medium Truck">Medium Truck</option>

                  <option value="Large Truck">Large Truck</option>

                  <option value="Covered Van">Covered Van</option>

                  <option value="Pickup Truck">Pickup Truck</option>
                </select>
              </div>
            </section>

            {/* SCHEDULE */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Pickup Schedule
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Pickup Date
                  </label>

                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Pickup Time
                  </label>

                  <input
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    required
                  />
                </div>
              </div>
            </section>

            {/* NOTES */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Additional Notes
              </h2>

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Any special instructions for the driver..."
                rows={4}
                className="mt-5 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </section>
          </div>

          {/* =================================
              SUMMARY
          ================================= */}

          <aside>
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Booking Summary
              </h2>

              <div className="mt-6 space-y-5">
                <SummaryItem label="Vehicle" value={vehicleType} />

                <SummaryItem
                  label="Pickup"
                  value={pickupLocation || "Not selected"}
                />

                <SummaryItem
                  label="Destination"
                  value={deliveryLocation || "Not selected"}
                />

                <SummaryItem label="Date" value={date || "Not selected"} />

                <SummaryItem label="Time" value={time || "Not selected"} />

                <div className="border-t border-gray-100 pt-5">
                  <label className="text-sm font-semibold text-gray-700">
                    Estimated Fare
                  </label>

                  <div className="mt-2 flex items-center rounded-xl border border-gray-300">
                    <span className="px-4 text-gray-500">৳</span>

                    <input
                      type="number"
                      min="1"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      className="w-full rounded-xl px-2 py-3 font-semibold outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-black px-5 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Creating Booking..." : "Confirm Booking"}
                </button>

                <p className="text-center text-xs leading-5 text-gray-400">
                  You can pay for your booking after it has been created.
                </p>
              </div>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}

/* ============================================
   INPUT FIELD
============================================ */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
      />
    </div>
  );
}

/* ============================================
   SUMMARY ITEM
============================================ */

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 wrap-break-word text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}
