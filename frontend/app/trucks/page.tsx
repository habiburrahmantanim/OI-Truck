"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Search, Truck as TruckIcon, SlidersHorizontal } from "lucide-react";

import Navbar from "@/components/Navbar";
import { useTruck } from "@/context/TruckContext";


export default function TrucksPage() {
  const router = useRouter();

  const { trucks, loading, error } = useTruck();

  const [search, setSearch] = useState("");

  const [capacityFilter, setCapacityFilter] = useState("All");

  const [sortBy, setSortBy] = useState("default");

  const filteredTrucks = useMemo(() => {
    let result = [...trucks];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (truck) =>
          truck.name.toLowerCase().includes(query) ||
          truck.category.toLowerCase().includes(query) ||
          truck.capacity.toLowerCase().includes(query),
      );
    }

    // Capacity filter
    if (capacityFilter !== "All") {
      result = result.filter((truck) => truck.capacity === capacityFilter);
    }

    // Sorting
    if (sortBy === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [trucks, search, capacityFilter, sortBy]);

  const capacities = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(trucks.map((truck) => truck.capacity))),
    ];
  }, [trucks]);

  const handleBook = (truckId: number) => {
    router.push(`/booking?truck=${truckId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <TruckIcon className="h-8 w-8" />

            <h1 className="text-3xl font-bold text-gray-900">
              Available Trucks
            </h1>
          </div>

          <p className="mt-2 text-gray-600">
            Choose the right truck for your transportation needs.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-xl bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search trucks..."
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-gray-900"
              />
            </div>

            {/* Capacity */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <select
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-gray-900"
              >
                {capacities.map((capacity) => (
                  <option key={capacity} value={capacity}>
                    {capacity}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-900"
            >
              <option value="default">Sort by</option>

              <option value="low">Price: Low to High</option>

              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <p className="text-gray-600">Loading trucks...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-medium">Failed to load trucks</p>

            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredTrucks.length === 0 && (
          <div className="rounded-xl bg-white py-20 text-center shadow-sm">
            <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />

            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              No trucks found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing your search or filter.
            </p>
          </div>
        )}

        {/* Truck Grid */}
        {!loading && !error && filteredTrucks.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTrucks.map((truck) => (
              <div
                key={truck.id}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="h-52 bg-gray-100">
                  {truck.image ? (
                    <img
                      src={truck.image}
                      alt={truck.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <TruckIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h2 className="text-xl font-bold text-gray-900">
                      {truck.name}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        truck.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {truck.available ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">{truck.category}</p>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Capacity:</strong> {truck.capacity}
                    </p>

                    {truck.description && <p>{truck.description}</p>}
                  </div>

                  {/* Ideal For */}
                  {truck.idealFor.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {truck.idealFor.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price */}
                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>

                      <p className="text-2xl font-bold text-gray-900">
                        ৳{truck.price.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleBook(truck.id)}
                      disabled={!truck.available}
                      className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      {truck.available ? "Select & Book" : "Unavailable"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
