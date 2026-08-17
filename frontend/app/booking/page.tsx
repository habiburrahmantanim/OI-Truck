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

    return truckExists ? id : (trucks[0]?.id ?? 0);
  }, [truckFromUrl]);

  const [vehicle, setVehicle] = useState(initialTruckId);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [weight, setWeight] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    setVehicle(initialTruckId);
  }, [initialTruckId]);

  const selectedTruck = trucks.find((truck) => truck.id === vehicle);

  const baseFare = selectedTruck?.price ?? 0;
  const serviceFee = Math.round(baseFare * 0.05);

  const discount = promoApplied ? Math.round(baseFare * 0.1) : 0;

  const totalPrice = Math.max(0, baseFare + serviceFee - discount);

  // Converts values like "1 Ton", "2.5 Ton" to KG.
  const capacityInKg = useMemo(() => {
    if (!selectedTruck?.capacity) return 0;

    const number = Number(selectedTruck.capacity.replace(/[^0-9.]/g, ""));

    const lowerCapacity = selectedTruck.capacity.toLowerCase();

    if (lowerCapacity.includes("kg")) {
      return number;
    }

    return number * 1000;
  }, [selectedTruck]);

  const weightNumber = Number(weight) || 0;

  const isOverweight =
    weightNumber > 0 && capacityInKg > 0 && weightNumber > capacityInKg;

  function applyPromoCode() {
    const code = promoCode.trim().toUpperCase();

    if (!code) {
      setPromoApplied(false);
      setPromoMessage("Please enter a promo code.");
      return;
    }

    if (code === "TRUCK10") {
      setPromoApplied(true);
      setPromoMessage("Promo applied! You received 10% discount.");
    } else {
      setPromoApplied(false);
      setPromoMessage("Invalid promo code.");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedTruck) {
      alert("Please select a truck.");
      return;
    }

    if (
      !customerName.trim() ||
      !phone.trim() ||
      !pickupLocation.trim() ||
      !deliveryLocation.trim() ||
      !pickupDate ||
      !pickupTime ||
      !cargoType.trim() ||
      !weightNumber
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (isOverweight) {
      alert(
        `Cargo weight exceeds this truck capacity of ${capacityInKg.toLocaleString()} KG.`,
      );
      return;
    }

    const newBooking = {
      id: `TL-${Date.now().toString().slice(-8)}`,
      bookingId: `TL-${Date.now().toString().slice(-8)}`,

      customerName: customerName.trim(),
      phone: phone.trim(),
      customerPhone: phone.trim(),

      pickupLocation: pickupLocation.trim(),
      deliveryLocation: deliveryLocation.trim(),
      dropLocation: deliveryLocation.trim(),

      pickupDate,
      pickupTime,

      cargoType: cargoType.trim(),
      weight: weightNumber,

      truckId: selectedTruck.id,
      truckName: selectedTruck.name,
      truckCapacity: selectedTruck.capacity,

      baseFare,
      serviceFee,
      discount,
      totalPrice,
      estimatedFare: totalPrice,

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
            {/* LEFT SIDE */}
            <div className="space-y-6 lg:col-span-2">
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
                    required
                  />
                </div>
              </section>

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

                <CapacityWarning
                  weight={weightNumber}
                  capacityInKg={capacityInKg}
                />
              </section>
            </div>

            {/* RIGHT SIDE */}
            <aside className="space-y-6">
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

                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                    <div className="absolute bottom-4 left-4">
                      <p className="text-sm text-white/80">Selected Truck</p>

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

                      <span className="rounded-xl bg-orange-100 px-3 py-2 text-sm font-bold text-orange-600">
                        {selectedTruck.category}
                      </span>
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

              <section className="rounded-2xl bg-white p-5 shadow-sm">
                <SectionTitle
                  icon={<Truck size={22} />}
                  title="Select Truck"
                  description="Choose the best vehicle."
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
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="truck"
                          checked={vehicle === truck.id}
                          onChange={() => setVehicle(truck.id)}
                          className="accent-orange-500"
                        />

                        <div>
                          <p className="font-bold text-slate-800">
                            {truck.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {truck.capacity}
                          </p>
                        </div>
                      </div>

                      <p className="font-bold text-orange-500">
                        ৳{truck.price.toLocaleString()}
                      </p>
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-white p-5 shadow-sm">
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
                      setPromoApplied(false);
                      setPromoMessage("");
                    }}
                    placeholder="Promo code"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none focus:border-orange-500"
                  />

                  <button
                    type="button"
                    onClick={applyPromoCode}
                    className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
                  >
                    Apply
                  </button>
                </div>

                {promoMessage && (
                  <p
                    className={`mt-3 text-sm font-medium ${
                      promoApplied ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {promoMessage}
                  </p>
                )}
              </section>

              <section className="sticky top-24 rounded-2xl bg-slate-900 p-5 text-white shadow-sm">
                <h2 className="text-xl font-bold">Booking Summary</h2>

                <div className="mt-5 space-y-4 text-sm">
                  <SummaryRow
                    label="Truck"
                    value={selectedTruck?.name ?? "-"}
                  />

                  <SummaryRow
                    label="Capacity"
                    value={selectedTruck?.capacity ?? "-"}
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
                  disabled={isOverweight}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Confirm Booking
                  <ChevronRight size={20} />
                </button>
              </section>
            </aside>
          </form>
        </div>
      </main>
    </>
  );
}

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
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

function InputField({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

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
  capacityInKg,
}: {
  weight: number;
  capacityInKg: number;
}) {
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
      <strong>
        {isOverweight
          ? "Weight exceeds truck capacity."
          : "Weight is within truck capacity."}
      </strong>

      <p className="mt-1">
        Maximum capacity: {capacityInKg.toLocaleString()} KG.
      </p>
    </div>
  );
}
