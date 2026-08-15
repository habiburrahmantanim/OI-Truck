"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Package,
  Phone,
  Tag,
  Truck,
  User,
  Weight,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { trucks } from "@/data/data";
import { useBookings } from "@/context/BookingContext";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const { addBooking } = useBookings();

  const truckFromUrl = searchParams.get("truck");

  const initialTruckId = useMemo(() => {
    const id = Number(truckFromUrl);

    const truckExists = trucks.some((truck) => truck.id === id);

    return truckExists ? id : trucks[0].id;
  }, [truckFromUrl]);

  const [vehicle, setVehicle] = useState<number>(initialTruckId);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [weight, setWeight] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    setVehicle(initialTruckId);
  }, [initialTruckId]);

  const selectedTruck = trucks.find((truck) => truck.id === vehicle);

  const baseFare = selectedTruck?.price || 0;
  const serviceFee = baseFare > 0 ? Math.round(baseFare * 0.05) : 0;

  const discount =
    promoCode.toUpperCase() === "TRUCK10" ? Math.round(baseFare * 0.1) : 0;

  const totalPrice = Math.max(0, baseFare + serviceFee - discount);

  function applyPromoCode() {
    if (!promoCode.trim()) {
      setPromoMessage("Please enter a promo code.");
      return;
    }

    if (promoCode.toUpperCase() === "TRUCK10") {
      setPromoMessage("Promo applied! You received 10% discount.");
    } else {
      setPromoMessage("Invalid promo code.");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !selectedTruck ||
      !customerName.trim() ||
      !phone.trim() ||
      !pickupLocation.trim() ||
      !deliveryLocation.trim() ||
      !pickupDate ||
      !cargoType.trim() ||
      !weight
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const newBooking = {
      id: `TL-${Date.now().toString().slice(-6)}`,
      customerName,
      phone,
      pickupLocation,
      deliveryLocation,
      pickupDate,
      pickupTime,
      cargoType,
      weight: Number(weight),

      truckId: selectedTruck.id,
      truckName: selectedTruck.name,
      truckCapacity: selectedTruck.capacity,

      baseFare,
      serviceFee,
      discount,
      totalPrice,

      status: "Pending" as const,
      createdAt: new Date().toISOString(),
    };

    addBooking(newBooking);

    setBookingId(newBooking.id);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 size={42} />
            </div>

            <p className="mt-6 text-sm font-bold text-orange-500">
              BOOKING SUCCESSFUL
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Your Truck Has Been Booked!
            </h1>

            <p className="mt-4 leading-7 text-slate-500">
              Your booking request has been created successfully. You can track
              your delivery using your booking ID.
            </p>

            <div className="mt-6 rounded-2xl bg-slate-100 p-5">
              <p className="text-xs font-bold text-slate-400">
                YOUR BOOKING ID
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {bookingId}
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link
                href={`/tracking?booking=${bookingId}`}
                className="rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white transition hover:bg-slate-800"
              >
                Track Booking
              </Link>

              <Link
                href="/bookings"
                className="rounded-xl bg-orange-500 px-5 py-3.5 font-semibold text-white transition hover:bg-orange-600"
              >
                My Bookings
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* HEADER */}
          <div className="mb-8">
            <p className="text-sm font-bold text-orange-500">TRUCK BOOKING</p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
              Book Your Truck
            </h1>

            <p className="mt-3 max-w-2xl text-slate-500">
              Select your truck, enter delivery details and confirm your
              booking.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
            {/* LEFT COLUMN */}
            <div className="space-y-6 lg:col-span-2">
              {/* CUSTOMER DETAILS */}
              <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
                <SectionTitle
                  icon={<User size={22} />}
                  title="Customer Details"
                  description="Enter your contact information."
                />

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <InputField
                    label="Full Name"
                    icon={<User size={18} />}
                    value={customerName}
                    onChange={setCustomerName}
                    placeholder="Enter your full name"
                    required
                  />

                  <InputField
                    label="Phone Number"
                    icon={<Phone size={18} />}
                    value={phone}
                    onChange={setPhone}
                    placeholder="01XXXXXXXXX"
                    type="tel"
                    required
                  />
                </div>
              </section>

              {/* PICKUP & DELIVERY */}
              <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
                <SectionTitle
                  icon={<MapPin size={22} />}
                  title="Pickup & Delivery"
                  description="Enter where your cargo will be collected and delivered."
                />

                <div className="mt-6 grid gap-5">
                  <InputField
                    label="Pickup Location"
                    icon={<MapPin size={18} />}
                    value={pickupLocation}
                    onChange={setPickupLocation}
                    placeholder="Example: Dhaka"
                    required
                  />

                  <InputField
                    label="Delivery Location"
                    icon={<MapPin size={18} />}
                    value={deliveryLocation}
                    onChange={setDeliveryLocation}
                    placeholder="Example: Chattogram"
                    required
                  />
                </div>
              </section>

              {/* PICKUP SCHEDULE */}
              <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
                <SectionTitle
                  icon={<CalendarDays size={22} />}
                  title="Pickup Schedule"
                  description="Choose your preferred pickup date and time."
                />

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <InputField
                    label="Pickup Date"
                    icon={<CalendarDays size={18} />}
                    value={pickupDate}
                    onChange={setPickupDate}
                    type="date"
                    required
                  />

                  <InputField
                    label="Pickup Time"
                    icon={<Clock size={18} />}
                    value={pickupTime}
                    onChange={setPickupTime}
                    type="time"
                  />
                </div>
              </section>

              {/* CARGO DETAILS */}
              <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
                <SectionTitle
                  icon={<Package size={22} />}
                  title="Cargo Details"
                  description="Tell us about the goods you want to transport."
                />

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <InputField
                    label="Cargo Type"
                    icon={<Package size={18} />}
                    value={cargoType}
                    onChange={setCargoType}
                    placeholder="Example: Furniture"
                    required
                  />

                  <InputField
                    label="Estimated Weight (KG)"
                    icon={<Weight size={18} />}
                    value={weight}
                    onChange={setWeight}
                    placeholder="Example: 500"
                    type="number"
                    required
                  />
                </div>

                {/* TRUCK CAPACITY WARNING */}
                {selectedTruck && weight && (
                  <CapacityWarning
                    weight={Number(weight)}
                    capacity={selectedTruck.capacity}
                  />
                )}
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <aside className="space-y-6">
              {/* SELECTED TRUCK PREVIEW */}
              {selectedTruck && (
                <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
                  <div className="relative h-44">
                    <Image
                      src={selectedTruck.image}
                      alt={selectedTruck.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <div className="absolute bottom-4 left-4">
                      <p className="text-sm font-medium text-white/80">
                        Selected Truck
                      </p>

                      <h2 className="text-xl font-bold text-white">
                        {selectedTruck.name}
                      </h2>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-400">
                          Capacity
                        </p>

                        <p className="mt-1 font-bold text-slate-800">
                          {selectedTruck.capacity}
                        </p>
                      </div>

                      <div className="rounded-xl bg-orange-100 px-3 py-2 text-sm font-bold text-orange-600">
                        {selectedTruck.category}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      {selectedTruck.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedTruck.idealFor.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* TRUCK SELECTION */}
              <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                <SectionTitle
                  icon={<Truck size={22} />}
                  title="Select Truck"
                  description="Choose the best vehicle for your cargo."
                />

                <div className="mt-5 space-y-3">
                  {trucks.map((truck) => (
                    <label
                      key={truck.id}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                        vehicle === truck.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-slate-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <input
                          type="radio"
                          name="truck"
                          checked={vehicle === truck.id}
                          onChange={() => setVehicle(truck.id)}
                          className="accent-orange-500"
                        />

                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-800">
                            {truck.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {truck.capacity}
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 font-bold text-orange-500">
                        ৳{truck.price.toLocaleString()}
                      </p>
                    </label>
                  ))}
                </div>
              </section>

              {/* PROMO CODE */}
              <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                <SectionTitle
                  icon={<Tag size={22} />}
                  title="Promo Code"
                  description="Use TRUCK10 for 10% off."
                />

                <div className="mt-5 flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(event) => {
                      setPromoCode(event.target.value);
                      setPromoMessage("");
                    }}
                    placeholder="Enter promo code"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />

                  <button
                    type="button"
                    onClick={applyPromoCode}
                    className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    Apply
                  </button>
                </div>

                {promoMessage && (
                  <p
                    className={`mt-3 text-sm font-medium ${
                      promoCode.toUpperCase() === "TRUCK10"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {promoMessage}
                  </p>
                )}
              </section>

              {/* BOOKING SUMMARY */}
              <section className="sticky top-24 rounded-2xl bg-slate-900 p-5 text-white shadow-sm sm:p-6">
                <h2 className="text-xl font-bold">Booking Summary</h2>

                <div className="mt-5 space-y-4 text-sm">
                  <SummaryRow
                    label="Truck"
                    value={selectedTruck?.name || "-"}
                  />

                  <SummaryRow
                    label="Capacity"
                    value={selectedTruck?.capacity || "-"}
                  />

                  <SummaryRow
                    label="Base Fare"
                    value={`৳${baseFare.toLocaleString()}`}
                  />

                  <SummaryRow
                    label="Service Fee (5%)"
                    value={`৳${serviceFee.toLocaleString()}`}
                  />

                  {discount > 0 && (
                    <SummaryRow
                      label="Discount"
                      value={`-৳${discount.toLocaleString()}`}
                      highlight
                    />
                  )}

                  <div className="border-t border-slate-700 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Total</span>

                      <span className="text-2xl font-bold text-orange-400">
                        ৳{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 font-bold text-white transition hover:bg-orange-600"
                >
                  Confirm Booking
                  <ChevronRight size={20} />
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                  By confirming, you agree to our booking terms and conditions.
                </p>
              </section>
            </aside>
          </form>
        </div>
      </main>
    </>
  );
}

/* ================= COMPONENTS ================= */

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SectionTitle({ icon, title, description }: SectionTitleProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-orange-100 p-3 text-orange-500">{icon}</div>

      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

function InputField({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: InputFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          min={type === "number" ? "1" : undefined}
          className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
        />
      </div>
    </label>
  );
}

function SummaryRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-400">{label}</span>

      <span
        className={
          highlight ? "font-bold text-green-400" : "font-semibold text-white"
        }
      >
        {value}
      </span>
    </div>
  );
}

function CapacityWarning({
  weight,
  capacity,
}: {
  weight: number;
  capacity: string;
}) {
  const capacityInTons = Number(capacity.replace(/[^0-9.]/g, ""));

  const capacityInKg = capacityInTons * 1000;

  if (!weight || weight <= 0 || !capacityInKg) {
    return null;
  }

  const isOverweight = weight > capacityInKg;

  return (
    <div
      className={`mt-5 rounded-xl border p-4 text-sm ${
        isOverweight
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-green-200 bg-green-50 text-green-700"
      }`}
    >
      {isOverweight ? (
        <>
          <strong>Weight exceeds truck capacity.</strong>
          <p className="mt-1">
            This truck supports up to {capacityInKg.toLocaleString()} KG. Please
            select a larger truck.
          </p>
        </>
      ) : (
        <>
          <strong>Weight is within truck capacity.</strong>
          <p className="mt-1">
            Maximum capacity: {capacityInKg.toLocaleString()} KG.
          </p>
        </>
      )}
    </div>
  );
}
