"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Eye,
  Search,
  Trash2,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";

import { useDrivers } from "@/context/DriverContext";
import { Driver, DriverStatus } from "@/types/driver";

export default function AdminDriversPage() {
  const {
    drivers,
    isLoaded,
    updateDriverStatus,
    updateDriverAvailability,
    deleteDriver,
  } = useDrivers();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DriverStatus>("all");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const filteredDrivers = drivers.filter((driver) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      driver.name.toLowerCase().includes(searchText) ||
      driver.email.toLowerCase().includes(searchText) ||
      driver.phone.toLowerCase().includes(searchText) ||
      driver.vehicleNumber.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || driver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingDrivers = drivers.filter(
    (driver) => driver.status === "pending",
  ).length;

  const approvedDrivers = drivers.filter(
    (driver) => driver.status === "approved",
  ).length;

  const suspendedDrivers = drivers.filter(
    (driver) => driver.status === "suspended",
  ).length;

  function approveDriver(id: string) {
    updateDriverStatus(id, "approved");
  }

  function rejectDriver(id: string) {
    updateDriverStatus(id, "rejected");
  }

  function suspendDriver(id: string) {
    updateDriverStatus(id, "suspended");
    updateDriverAvailability(id, "offline");
  }

  function removeDriver(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this driver?",
    );

    if (confirmed) {
      deleteDriver(id);

      if (selectedDriver?.id === id) {
        setSelectedDriver(null);
      }
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

          <p className="mt-4 font-medium text-slate-500">Loading drivers...</p>
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
            Review driver applications and manage your delivery workforce.
          </p>
        </div>
      </div>

      {/* STATISTICS */}
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Drivers"
          value={drivers.length}
          description="All registered drivers"
          color="blue"
        />

        <StatCard
          label="Pending Approval"
          value={pendingDrivers}
          description="Waiting for review"
          color="orange"
        />

        <StatCard
          label="Approved"
          value={approvedDrivers}
          description="Active driver accounts"
          color="green"
        />

        <StatCard
          label="Suspended"
          value={suspendedDrivers}
          description="Currently restricted"
          color="red"
        />
      </section>

      {/* FILTERS */}
      <section className="mt-7 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          {/* SEARCH */}
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, phone or vehicle..."
              className="w-full rounded-lg border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | DriverStatus)
            }
            className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </section>

      {/* DRIVERS TABLE */}
      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-900">Driver List</h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredDrivers.length} driver
            {filteredDrivers.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {filteredDrivers.length === 0 ? (
          <div className="py-16 text-center">
            <UserX size={42} className="mx-auto text-slate-300" />

            <h3 className="mt-4 font-bold text-slate-800">No drivers found</h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Driver</th>
                  <th className="px-5 py-4 font-semibold">Contact</th>
                  <th className="px-5 py-4 font-semibold">Vehicle</th>
                  <th className="px-5 py-4 font-semibold">Experience</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Availability</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr
                    key={driver.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    {/* DRIVER */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {driver.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {driver.email}
                        </p>
                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="px-5 py-4 text-slate-600">{driver.phone}</td>

                    {/* VEHICLE */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-700">
                        {driver.vehicleType}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {driver.vehicleNumber}
                      </p>
                    </td>

                    {/* EXPERIENCE */}
                    <td className="px-5 py-4 text-slate-600">
                      {driver.experienceYears} years
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <StatusBadge status={driver.status} />
                    </td>

                    {/* AVAILABILITY */}
                    <td className="px-5 py-4">
                      <AvailabilityBadge availability={driver.availability} />
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDriver(driver)}
                          title="View Driver"
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                        >
                          <Eye size={17} />
                        </button>

                        {driver.status === "pending" && (
                          <>
                            <button
                              onClick={() => approveDriver(driver.id)}
                              title="Approve Driver"
                              className="rounded-lg bg-green-100 p-2 text-green-700 transition hover:bg-green-200"
                            >
                              <CheckCircle2 size={17} />
                            </button>

                            <button
                              onClick={() => rejectDriver(driver.id)}
                              title="Reject Driver"
                              className="rounded-lg bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
                            >
                              <XCircle size={17} />
                            </button>
                          </>
                        )}

                        {driver.status === "approved" && (
                          <button
                            onClick={() => suspendDriver(driver.id)}
                            title="Suspend Driver"
                            className="rounded-lg bg-amber-100 p-2 text-amber-700 transition hover:bg-amber-200"
                          >
                            <UserX size={17} />
                          </button>
                        )}

                        <button
                          onClick={() => removeDriver(driver.id)}
                          title="Delete Driver"
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

      {/* DRIVER DETAILS MODAL */}
      {selectedDriver && (
        <DriverModal
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
          onApprove={() => {
            approveDriver(selectedDriver.id);

            setSelectedDriver({
              ...selectedDriver,
              status: "approved",
            });
          }}
          onReject={() => {
            rejectDriver(selectedDriver.id);

            setSelectedDriver({
              ...selectedDriver,
              status: "rejected",
            });
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
  color,
}: {
  label: string;
  value: number;
  description: string;
  color: "blue" | "orange" | "green" | "red";
}) {
  const colors = {
    blue: "border-blue-200 bg-blue-50",
    orange: "border-orange-200 bg-orange-50",
    green: "border-green-200 bg-green-50",
    red: "border-red-200 bg-red-50",
  };

  return (
    <article className={`rounded-lg border p-5 ${colors[color]}`}>
      <p className="text-sm font-medium text-slate-600">{label}</p>

      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>

      <p className="mt-3 text-xs text-slate-500">{description}</p>
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
      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ================= AVAILABILITY BADGE ================= */

function AvailabilityBadge({
  availability,
}: {
  availability: "available" | "busy" | "offline";
}) {
  const styles = {
    available: "bg-green-100 text-green-700",
    busy: "bg-blue-100 text-blue-700",
    offline: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[availability]}`}
    >
      {availability}
    </span>
  );
}

/* ================= DRIVER MODAL ================= */

function DriverModal({
  driver,
  onClose,
  onApprove,
  onReject,
}: {
  driver: Driver;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <p className="text-sm font-semibold text-orange-600">
              DRIVER DETAILS
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {driver.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <XCircle size={22} />
          </button>
        </div>

        {/* DETAILS */}
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <Detail label="Email" value={driver.email} />
          <Detail label="Phone" value={driver.phone} />
          <Detail label="License Number" value={driver.licenseNumber} />
          <Detail label="License Expiry" value={driver.licenseExpiry} />
          <Detail label="Vehicle Type" value={driver.vehicleType} />
          <Detail label="Vehicle Number" value={driver.vehicleNumber} />
          <Detail
            label="Experience"
            value={`${driver.experienceYears} years`}
          />
          <Detail
            label="Documents"
            value={driver.documentsSubmitted ? "Submitted" : "Not Submitted"}
          />
          <Detail label="Rating" value={`${driver.rating.toFixed(1)} / 5`} />
          <Detail label="Total Trips" value={driver.totalTrips.toString()} />
        </div>

        {/* ACTIONS */}
        {driver.status === "pending" && (
          <div className="flex gap-3 border-t border-slate-100 p-5">
            <button
              onClick={onReject}
              className="flex-1 rounded-xl bg-red-100 px-4 py-3 font-semibold text-red-700 transition hover:bg-red-200"
            >
              Reject
            </button>

            <button
              onClick={onApprove}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              <UserCheck size={18} />
              Approve Driver
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 break-words font-medium text-slate-800">{value}</p>
    </div>
  );
}
