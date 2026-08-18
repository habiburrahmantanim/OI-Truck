"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  Plus,
  Search,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import { useTrucks } from "@/context/TruckContext";
import { Truck as TruckType } from "@/types/truck";

export default function AdminTrucksPage() {
  const {
    trucks,
    isLoaded,
    addTruck,
    updateTruck,
    deleteTruck,
    updateTruckAvailability,
  } = useTrucks();

  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "all" | "available" | "unavailable"
  >("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<TruckType | null>(null);

  const filteredTrucks = useMemo(() => {
    return trucks.filter((truck) => {
      const matchesSearch =
        truck.name.toLowerCase().includes(search.toLowerCase()) ||
        truck.category.toLowerCase().includes(search.toLowerCase()) ||
        truck.capacity.toLowerCase().includes(search.toLowerCase());

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && truck.available) ||
        (availabilityFilter === "unavailable" && !truck.available);

      return matchesSearch && matchesAvailability;
    });
  }, [trucks, search, availabilityFilter]);

  const availableCount = trucks.filter((truck) => truck.available).length;
  const unavailableCount = trucks.filter((truck) => !truck.available).length;

  function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this truck?",
    );

    if (confirmed) {
      deleteTruck(id);
    }
  }

  function handleEdit(truck: TruckType) {
    setEditingTruck(truck);
    setIsModalOpen(true);
  }

  function handleAdd() {
    setEditingTruck(null);
    setIsModalOpen(true);
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          <p className="mt-4 font-medium text-slate-500">Loading trucks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            FLEET MANAGEMENT
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Trucks
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Add, update and manage your available delivery vehicles.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <Plus size={18} />
          Add Truck
        </button>
      </div>

      {/* STATS */}
      <section className="mt-7 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Trucks"
          value={trucks.length}
          description="All registered vehicles"
          icon={<Truck size={22} />}
          color="blue"
        />

        <StatCard
          label="Available"
          value={availableCount}
          description="Ready for booking"
          icon={<CheckCircle2 size={22} />}
          color="green"
        />

        <StatCard
          label="Unavailable"
          value={unavailableCount}
          description="Currently unavailable"
          icon={<X size={22} />}
          color="orange"
        />
      </section>

      {/* FILTER */}
      <section className="mt-7 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search trucks by name, category or capacity..."
              className="w-full rounded-lg border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <select
            value={availabilityFilter}
            onChange={(event) =>
              setAvailabilityFilter(
                event.target.value as "all" | "available" | "unavailable",
              )
            }
            className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-500"
          >
            <option value="all">All Trucks</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </section>

      {/* TABLE */}
      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">Fleet List</h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredTrucks.length} truck
              {filteredTrucks.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {filteredTrucks.length === 0 ? (
          <div className="py-16 text-center">
            <Truck size={45} className="mx-auto text-slate-300" />

            <h3 className="mt-4 font-bold text-slate-800">No trucks found</h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Truck</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Capacity</th>
                  <th className="px-5 py-4 font-semibold">Base Price</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTrucks.map((truck) => (
                  <tr
                    key={truck.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {truck.name}
                        </p>

                        <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                          {truck.description}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {truck.category}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-700">
                      {truck.capacity}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-800">
                      BDT {truck.price.toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          updateTruckAvailability(truck.id, !truck.available)
                        }
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          truck.available
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {truck.available ? "Available" : "Unavailable"}
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(truck)}
                          title="Edit Truck"
                          className="rounded-lg border border-slate-200 p-2 text-blue-600 transition hover:bg-blue-50"
                        >
                          <Edit3 size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(truck.id)}
                          title="Delete Truck"
                          className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isModalOpen && (
        <TruckModal
          truck={editingTruck}
          trucks={trucks}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTruck(null);
          }}
          onSave={(truck) => {
            if (editingTruck) {
              updateTruck(truck);
            } else {
              addTruck(truck);
            }

            setIsModalOpen(false);
            setEditingTruck(null);
          }}
        />
      )}
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  label,
  value,
  description,
  icon,
  color,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "orange";
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div className={`rounded-lg p-3 ${colors[color]}`}>{icon}</div>
      </div>

      <p className="mt-4 text-xs text-slate-500">{description}</p>
    </article>
  );
}

/* ================= ADD / EDIT MODAL ================= */

function TruckModal({
  truck,
  trucks,
  onClose,
  onSave,
}: {
  truck: TruckType | null;
  trucks: TruckType[];
  onClose: () => void;
  onSave: (truck: TruckType) => void;
}) {
  const [name, setName] = useState(truck?.name || "");
  const [image, setImage] = useState(truck?.image || "/images/truck.jpg");
  const [capacity, setCapacity] = useState(truck?.capacity || "");
  const [price, setPrice] = useState(truck?.price.toString() || "");
  const [category, setCategory] = useState(truck?.category || "");
  const [description, setDescription] = useState(truck?.description || "");
  const [idealFor, setIdealFor] = useState(truck?.idealFor.join(", ") || "");
  const [available, setAvailable] = useState(truck?.available ?? true);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !name.trim() ||
      !capacity.trim() ||
      !price ||
      !category.trim() ||
      !description.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const newTruck: TruckType = {
      id: truck?.id || Date.now(),
      name: name.trim(),
      image: image.trim() || "/images/truck.jpg",
      capacity: capacity.trim(),
      price: Number(price),
      category: category.trim(),
      description: description.trim(),
      idealFor: idealFor
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      available,
    };

    onSave(newTruck);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <p className="text-sm font-semibold text-orange-600">
              FLEET MANAGEMENT
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {truck ? "Edit Truck" : "Add New Truck"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Truck Name"
              value={name}
              onChange={setName}
              placeholder="Example: Pickup Truck 1T"
              required
            />

            <Field
              label="Category"
              value={category}
              onChange={setCategory}
              placeholder="Example: Pickup"
              required
            />

            <Field
              label="Capacity"
              value={capacity}
              onChange={setCapacity}
              placeholder="Example: 1 Ton"
              required
            />

            <Field
              label="Base Price"
              value={price}
              onChange={setPrice}
              placeholder="Example: 2500"
              type="number"
              required
            />
          </div>

          <div className="mt-5">
            <Field
              label="Image Path"
              value={image}
              onChange={setImage}
              placeholder="/trucks/pickup.jpg"
            />
          </div>

          <div className="mt-5">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Description <span className="text-red-500">*</span>
              </span>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter truck description"
                rows={4}
                required
                className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </label>
          </div>

          <div className="mt-5">
            <Field
              label="Ideal For"
              value={idealFor}
              onChange={setIdealFor}
              placeholder="Furniture, Goods, Moving"
            />

            <p className="mt-1 text-xs text-slate-400">
              Separate multiple items with commas.
            </p>
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={available}
              onChange={(event) => setAvailable(event.target.checked)}
              className="h-4 w-4 accent-orange-500"
            />

            <div>
              <p className="font-semibold text-slate-800">Truck Available</p>

              <p className="text-xs text-slate-500">
                This truck can currently receive bookings.
              </p>
            </div>
          </label>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
            >
              {truck ? "Save Changes" : "Add Truck"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= FIELD ================= */

function Field({
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
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        min={type === "number" ? "0" : undefined}
        className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
      />
    </label>
  );
}
