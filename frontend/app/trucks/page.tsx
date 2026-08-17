"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Package,
  Search,
  SlidersHorizontal,
  Truck,
  X,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { Truck as TruckType, trucks } from "@/data/data";

type SortOption = "default" | "price-low" | "price-high" | "name";

export default function TrucksPage() {
  const [search, setSearch] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const capacities = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(trucks.map((truck) => truck.capacity))),
    ];
  }, []);

  const filteredTrucks = useMemo(() => {
    let result = [...trucks];

    // SEARCH
    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter((truck) => {
        return (
          truck.name.toLowerCase().includes(query) ||
          truck.capacity.toLowerCase().includes(query) ||
          truck.category.toLowerCase().includes(query) ||
          truck.description.toLowerCase().includes(query)
        );
      });
    }

    // CAPACITY FILTER
    if (capacityFilter !== "All") {
      result = result.filter((truck) => truck.capacity === capacityFilter);
    }

    // SORT
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      default:
        break;
    }

    return result;
  }, [search, capacityFilter, sortBy]);

  function clearFilters() {
    setSearch("");
    setCapacityFilter("All");
    setSortBy("default");
  }

  const hasActiveFilters =
    search.trim() !== "" || capacityFilter !== "All" || sortBy !== "default";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">
        {/* HERO */}
        <section className="relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0 opacity-10">
            <Image
              src={trucks[5].image}
              alt="Truck"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
            <div className="max-w-3xl">
              <div className="flex w-fit items-center gap-2 rounded-full bg-orange-500/20 px-4 py-2 text-sm font-bold text-orange-400">
                <Truck size={17} />
                AVAILABLE VEHICLES
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Find the Perfect Truck for Your Delivery
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                From small local deliveries to heavy commercial cargo, choose
                the right vehicle based on your transportation needs.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="rounded-xl bg-white/10 px-4 py-3">
                  <p className="text-2xl font-bold text-orange-400">
                    {trucks.length}+
                  </p>

                  <p className="text-xs text-slate-400">Truck Options</p>
                </div>

                <div className="rounded-xl bg-white/10 px-4 py-3">
                  <p className="text-2xl font-bold text-orange-400">1–15</p>

                  <p className="text-xs text-slate-400">Ton Capacity</p>
                </div>

                <div className="rounded-xl bg-white/10 px-4 py-3">
                  <p className="text-2xl font-bold text-orange-400">24/7</p>

                  <p className="text-xs text-slate-400">Booking Available</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
          {/* PAGE TITLE */}
          <div className="mb-6">
            <p className="text-sm font-bold text-orange-500">OUR FLEET</p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Browse Available Trucks
            </h2>

            <p className="mt-2 text-slate-500">
              Compare vehicle capacity, features and estimated prices.
            </p>
          </div>

          {/* SEARCH AND FILTER */}
          <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row">
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
                  placeholder="Search truck, capacity or category..."
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* CAPACITY */}
              <div className="relative w-full lg:w-52">
                <Package
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={capacityFilter}
                  onChange={(event) => setCapacityFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                >
                  {capacities.map((capacity) => (
                    <option key={capacity} value={capacity}>
                      {capacity === "All" ? "All Capacities" : capacity}
                    </option>
                  ))}
                </select>
              </div>

              {/* SORT */}
              <div className="relative w-full lg:w-56">
                <SlidersHorizontal
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as SortOption)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                >
                  <option value="default">Default Sorting</option>

                  <option value="price-low">Price: Low to High</option>

                  <option value="price-high">Price: High to Low</option>

                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* RESULTS */}
            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-900">
                  {filteredTrucks.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-900">
                  {trucks.length}
                </span>{" "}
                trucks
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex w-fit items-center gap-2 text-sm font-bold text-orange-500 transition hover:text-orange-600"
                >
                  <X size={17} />
                  Clear Filters
                </button>
              )}
            </div>
          </section>

          {/* TRUCK CARDS */}
          {filteredTrucks.length > 0 ? (
            <section className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredTrucks.map((truck) => (
                <TruckCard key={truck.id} truck={truck} />
              ))}
            </section>
          ) : (
            <section className="mt-8 rounded-3xl bg-white px-5 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                <Truck size={38} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                No Trucks Found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-slate-500">
                No trucks match your current search or filter. Try changing your
                search criteria.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-orange-500 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-600"
              >
                Clear Filters
              </button>
            </section>
          )}

          {/* BOTTOM CTA */}
          <section className="mt-12 overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold text-orange-400">
                  READY TO MOVE?
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Book Your Truck in Just a Few Steps
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                  Select your preferred truck, enter pickup and delivery
                  information, and confirm your booking.
                </p>
              </div>

              <Link
                href="/booking"
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-4 font-bold text-white transition hover:bg-orange-600"
              >
                Book a Truck
                <ArrowRight size={20} />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function TruckCard({ truck }: { truck: TruckType }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* IMAGE */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={truck.image}
          alt={truck.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm">
            {truck.category}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
          <Truck size={20} />

          <span className="text-sm font-bold">{truck.capacity} Capacity</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{truck.name}</h2>

            <p className="mt-1 text-sm font-semibold text-orange-500">
              Up to {truck.capacity}
            </p>
          </div>

          <div className="rounded-xl bg-orange-100 p-2.5 text-orange-500">
            <Truck size={20} />
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-500">
          {truck.description}
        </p>

        {/* IDEAL FOR */}
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Ideal For
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {truck.idealFor.slice(0, 3).map((item) => (
              <span
                key={item}
                className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-5 space-y-2 border-t border-slate-100 pt-5">
          {truck.idealFor.slice(0, 3).map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2.5 text-sm text-slate-600"
            >
              <CheckCircle2 size={17} className="shrink-0 text-green-500" />

              {feature}
            </div>
          ))}
        </div>

        {/* PRICE */}
        <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Starting From
            </p>

            <p className="mt-1 text-3xl font-bold text-orange-500">
              ৳{truck.price.toLocaleString()}
            </p>
          </div>

          <p className="pb-1 text-xs text-slate-400">Estimated fare</p>
        </div>

        {/* BOOK BUTTON */}
        <Link
          href={`/booking?truck=${truck.id}`}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 font-bold text-white transition hover:bg-orange-500"
        >
          Select & Book
          <ArrowRight size={18} />
        </Link>
      </div>
    </article>
  );
}
