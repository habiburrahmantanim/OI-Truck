"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Menu,
  Package,
  Search,
  ShieldCheck,
  Star,
  Truck,
  Users,
  X,
  Zap,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { trucks } from "@/data/data";

export default function HomePage() {
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");

  function handleFindTruck() {
    if (!pickup.trim() || !delivery.trim()) {
      alert("Please enter both pickup and delivery locations.");
      return;
    }

    window.location.href = `/trucks?pickup=${encodeURIComponent(
      pickup,
    )}&delivery=${encodeURIComponent(delivery)}`;
  }

  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-slate-50">
        {/* ================= HERO ================= */}
        <section className="relative bg-slate-900">
          <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-900 to-orange-950" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:py-24">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
                <Zap size={16} />
                Fast & Reliable Truck Booking
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Move Your Goods
                <span className="block text-orange-400">
                  Anywhere, Anytime.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Book reliable trucks for your business or personal deliveries.
                Choose the right vehicle, confirm your booking and track your
                delivery easily.
              </p>

              {/* SEARCH BOX */}
              <div className="mt-8 rounded-2xl bg-white p-4 shadow-2xl sm:p-5">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="relative">
                    <MapPin
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                    />

                    <input
                      type="text"
                      value={pickup}
                      onChange={(event) => setPickup(event.target.value)}
                      placeholder="Pickup location"
                      className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                    />
                  </div>

                  <div className="relative">
                    <MapPin
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500"
                    />

                    <input
                      type="text"
                      value={delivery}
                      onChange={(event) => setDelivery(event.target.value)}
                      placeholder="Delivery location"
                      className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <button
                  onClick={handleFindTruck}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 font-bold text-white transition hover:bg-orange-600"
                >
                  <Search size={19} />
                  Find Available Trucks
                </button>
              </div>

              {/* TRUST */}
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" />
                  Easy Booking
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" />
                  Secure Service
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" />
                  Track Delivery
                </div>
              </div>
            </div>

            {/* RIGHT HERO VISUAL */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-orange-500/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-800 shadow-2xl">
                <div className="relative h-80 sm:h-105">
                  <Image
                    src={trucks[0].image}
                    alt="Truck delivery"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
                          <Truck size={25} />
                        </div>

                        <div>
                          <p className="text-sm text-slate-300">
                            Ready for delivery
                          </p>

                          <p className="font-bold text-white">
                            Find the perfect truck for your cargo
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-3 rounded-2xl bg-white p-4 shadow-xl sm:-left-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <CheckCircle2 size={22} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Simple Process</p>
                    <p className="font-bold text-slate-900">Book in Minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-200 md:grid-cols-4 md:divide-y-0">
            <Stat
              value="500+"
              label="Available Trucks"
              icon={<Truck size={24} />}
            />
            <Stat
              value="10K+"
              label="Successful Deliveries"
              icon={<Package size={24} />}
            />
            <Stat
              value="24/7"
              label="Booking Support"
              icon={<Clock3 size={24} />}
            />
            <Stat
              value="98%"
              label="Customer Satisfaction"
              icon={<Star size={24} />}
            />
          </div>
        </section>

        {/* ================= POPULAR TRUCKS ================= */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <SectionHeading
            eyebrow="OUR VEHICLES"
            title="Choose the Right Truck"
            description="From small pickups to heavy cargo trucks, find a vehicle that matches your delivery needs."
            action={
              <Link
                href="/trucks"
                className="hidden items-center gap-2 font-bold text-orange-500 hover:text-orange-600 sm:flex"
              >
                View All Trucks
                <ArrowRight size={18} />
              </Link>
            }
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trucks.slice(0, 6).map((truck) => (
              <article
                key={truck.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={truck.image}
                    alt={truck.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow">
                    {truck.category}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {truck.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Capacity: {truck.capacity}
                      </p>
                    </div>

                    <Truck size={22} className="shrink-0 text-orange-500" />
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                    {truck.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Starting from</p>
                      <p className="text-lg font-bold text-orange-500">
                        ৳{truck.price.toLocaleString()}
                      </p>
                    </div>

                    <Link
                      href={`/booking?truck=${truck.id}`}
                      className="flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500"
                    >
                      Book
                      <ChevronRight size={17} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Link
            href="/trucks"
            className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3.5 font-bold text-slate-800 transition hover:border-orange-500 hover:text-orange-500 sm:hidden"
          >
            View All Trucks
            <ArrowRight size={18} />
          </Link>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
            <SectionHeading
              eyebrow="SIMPLE PROCESS"
              title="How Truck Booking Works"
              description="Book your delivery in just a few simple steps."
            />

            <div className="relative mt-12 grid gap-8 md:grid-cols-3">
              <ProcessStep
                number="01"
                icon={<MapPin size={28} />}
                title="Enter Your Locations"
                description="Tell us where your goods should be picked up and delivered."
              />

              <ProcessStep
                number="02"
                icon={<Truck size={28} />}
                title="Choose Your Truck"
                description="Select the right vehicle based on your cargo and capacity requirements."
              />

              <ProcessStep
                number="03"
                icon={<CheckCircle2 size={28} />}
                title="Confirm & Track"
                description="Confirm your booking and track the progress of your delivery."
              />
            </div>
          </div>
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold text-orange-500">
                WHY CHOOSE TRUCK LAGBE?
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                A Better Way to Move Your Goods
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-slate-500">
                Our platform makes truck booking simple, fast and convenient.
                Everything you need to manage your delivery is available in one
                place.
              </p>

              <div className="mt-8 space-y-5">
                <Feature
                  icon={<Zap size={22} />}
                  title="Fast Booking"
                  description="Find and book a suitable truck in just a few minutes."
                />

                <Feature
                  icon={<ShieldCheck size={22} />}
                  title="Reliable Service"
                  description="A simple and transparent booking experience for your deliveries."
                />

                <Feature
                  icon={<MapPin size={22} />}
                  title="Easy Tracking"
                  description="Check your booking and delivery progress anytime."
                />

                <Feature
                  icon={<Users size={22} />}
                  title="Multiple Truck Options"
                  description="Choose from different trucks for small, medium and large cargo."
                />
              </div>

              <Link
                href="/trucks"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white transition hover:bg-orange-600"
              >
                Explore Trucks
                <ArrowRight size={19} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-900 p-7 text-white sm:translate-y-8">
                <Truck size={35} className="text-orange-400" />

                <h3 className="mt-8 text-2xl font-bold">Right Truck</h3>

                <p className="mt-3 leading-7 text-slate-400">
                  Select a vehicle according to your cargo size and weight.
                </p>
              </div>

              <div className="rounded-3xl bg-orange-500 p-7 text-white">
                <Clock3 size={35} />

                <h3 className="mt-8 text-2xl font-bold">Save Time</h3>

                <p className="mt-3 leading-7 text-orange-100">
                  Complete your booking online without unnecessary
                  complications.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-7 shadow-sm">
                <Package size={35} className="text-orange-500" />

                <h3 className="mt-8 text-2xl font-bold text-slate-900">
                  Manage Cargo
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  Enter cargo details and choose a truck with suitable capacity.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-100 p-7">
                <Search size={35} className="text-slate-800" />

                <h3 className="mt-8 text-2xl font-bold text-slate-900">
                  Easy Access
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  Search, filter and manage all your bookings from one platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="px-4 pb-16 sm:px-6 md:pb-20">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 sm:px-10 md:py-16">
            <div className="relative">
              <div className="absolute -right-20 -top-32 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />

              <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div>
                  <p className="text-sm font-bold text-orange-400">
                    READY TO MOVE?
                  </p>

                  <h2 className="mt-3 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
                    Book the Right Truck for Your Next Delivery
                  </h2>

                  <p className="mt-4 max-w-xl leading-7 text-slate-300">
                    Browse available trucks and start your booking today.
                  </p>
                </div>

                <Link
                  href="/trucks"
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-7 py-4 font-bold text-white transition hover:bg-orange-600"
                >
                  Browse Trucks
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/* ================= COMPONENTS ================= */

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        <p className="text-sm font-bold text-orange-500">{eyebrow}</p>

        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          {title}
        </h2>

        <p className="mt-4 leading-7 text-slate-500">{description}</p>
      </div>

      {action}
    </div>
  );
}

function Stat({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 p-5 sm:p-7">
      <div className="text-orange-500">{icon}</div>

      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">{label}</p>
      </div>
    </div>
  );
}

function ProcessStep({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8">
      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
          {icon}
        </div>

        <span className="text-3xl font-bold text-slate-200">{number}</span>
      </div>

      <h3 className="mt-7 text-xl font-bold text-slate-900">{title}</h3>

      <p className="mt-3 leading-7 text-slate-500">{description}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>

        <p className="mt-1 leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}
