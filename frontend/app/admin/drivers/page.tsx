"use client";

import { useMemo, useState } from "react";
import {
  Car,
  CheckCircle2,
  Clock3,
  Search,
  ShieldAlert,
  Trash2,
  UserCheck,
  UserRound,
  UserX,
  XCircle,
} from "lucide-react";

import { useDrivers } from "@/context/DriverContext";
import { Driver, DriverAvailability, DriverStatus } from "@/types/driver";

type StatusFilter = "all" | DriverStatus;

export default function AdminDriversPage() {
  const {
    drivers,
    isLoaded,
    updateDriverStatus,
    updateDriverAvailability,
    deleteDriver,
  } = useDrivers();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const query = search.toLowerCase();

      const matchesSearch =
        driver.name.toLowerCase().includes(query) ||
        driver.email.toLowerCase().includes(query) ||
        driver.phone.includes(search) ||
        driver.vehicleNumber.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || driver.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [drivers, search, statusFilter]);

  const pendingDrivers = drivers.filter(
    (driver) => driver.status === "pending",
  ).length;

  const approvedDrivers = drivers.filter(
    (driver) => driver.status === "approved",
  ).length;

  const suspendedDrivers = drivers.filter(
    (driver) => driver.status === "suspended",
  ).length;

  function handleApprove(driver: Driver) {
    updateDriverStatus(driver.id, "approved");

    if (driver.availability === "offline") {
      updateDriverAvailability(driver.id, "available");
    }
  }

  function handleReject(driver: Driver) {
    updateDriverStatus(driver.id, "rejected");
    updateDriverAvailability(driver.id, "offline");
  }

  function handleSuspend(driver: Driver) {
    updateDriverStatus(driver.id, "suspended");
    updateDriverAvailability(driver.id, "offline");
  }

  function handleAvailabilityChange(
    driver: Driver,
    availability: DriverAvailability,
  ) {
    if (driver.status !== "approved") {
      alert("Only approved drivers can change availability.");
      return;
    }

    updateDriverAvailability(driver.id, availability);
  }

  function handleDelete(driver: Driver) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${driver.name}?`,
    );

    if (!confirmed) return;

    deleteDriver(driver.id);
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading drivers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            DRIVER MANAGEMENT
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Drivers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review driver applications and manage your delivery team.
          </p>
        </div>

        <div className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-600">
          Total Drivers:{" "}
          <span className="font-bold text-slate-900">{drivers.length}</span>
        </div>
      </div>

      {/* STATS */}
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<UserRound size={22} />}
          label="Total Drivers"
          value={drivers.length}
          color="orange"
        />

        <StatCard
          icon={<Clock3 size={22} />}
          label="Pending Approval"
          value={pendingDrivers}
          color="amber"
        />

        <StatCard
          icon={<UserCheck size={22} />}
          label="Approved"
          value={approvedDrivers}
          color="green"
        />

        <StatCard
          icon={<ShieldAlert size={22} />}
          label="Suspended"
          value={suspendedDrivers}
          color="red"
        />
      </section>

      {/* SEARCH + FILTER */}
      <section className="mt-7 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search driver, email, phone or vehicle..."
              className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-orange-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </section>

      {/* DRIVERS TABLE */}
      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">Driver Applications</h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredDrivers.length} driver(s) found
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Driver</th>
                <th className="px-5 py-4 font-semibold">Contact</th>
                <th className="px-5 py-4 font-semibold">Vehicle</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Availability</th>
                <th className="px-5 py-4 font-semibold">Trips</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDrivers.map((driver) => (
                <tr
                  key={driver.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  {/* DRIVER */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
                        {driver.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {driver.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          License: {driver.licenseNumber}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* CONTACT */}
                  <td className="px-5 py-4">
                    <p className="text-slate-700">{driver.email}</p>

                    <p className="mt-1 text-xs text-slate-500">
                      {driver.phone}
                    </p>
                  </td>

                  {/* VEHICLE */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Car size={17} className="text-slate-400" />

                      <div>
                        <p className="font-medium text-slate-700">
                          {driver.vehicleType}
                        </p>

                        <p className="text-xs text-slate-500">
                          {driver.vehicleNumber}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">
                    <StatusBadge status={driver.status} />
                  </td>

                  {/* AVAILABILITY */}
                  <td className="px-5 py-4">
                    <select
                      value={driver.availability}
                      disabled={driver.status !== "approved"}
                      onChange={(event) =>
                        handleAvailabilityChange(
                          driver,
                          event.target.value as DriverAvailability,
                        )
                      }
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold capitalize text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="offline">Offline</option>
                    </select>
                  </td>

                  {/* TRIPS */}
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {driver.totalTrips}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Rating: {driver.rating.toFixed(1)}
                    </p>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {driver.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(driver)}
                            className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-600 hover:bg-green-100"
                          >
                            <CheckCircle2 size={14} />
                            Approve
                          </button>

                          <button
                            onClick={() => handleReject(driver)}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </>
                      )}

                      {driver.status === "approved" && (
                        <button
                          onClick={() => handleSuspend(driver)}
                          className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100"
                        >
                          <UserX size={14} />
                          Suspend
                        </button>
                      )}

                      {driver.status === "suspended" && (
                        <button
                          onClick={() => handleApprove(driver)}
                          className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-600 hover:bg-green-100"
                        >
                          <UserCheck size={14} />
                          Reactivate
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(driver)}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDrivers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <UserRound size={40} className="mx-auto text-slate-300" />

                    <h3 className="mt-3 font-bold text-slate-700">
                      No drivers found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "orange" | "amber" | "green" | "red";
}) {
  const colors = {
    orange: "bg-orange-100 text-orange-600",
    amber: "bg-amber-100 text-amber-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>

        <div className={`rounded-lg p-2.5 ${colors[color]}`}>{icon}</div>
      </div>
    </article>
  );
}

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }: { status: DriverStatus }) {
  const styles: Record<DriverStatus, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    suspended: "bg-slate-200 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
