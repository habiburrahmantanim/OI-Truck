"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  Eye,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

import { useDrivers } from "@/context/DriverContext";
import { useAuth } from "@/context/AuthContext";
import {
  Driver,
  DriverAvailability,
  DriverStatus,
} from "@/types/driver";

export default function AdminDriversPage() {
  const {
    drivers,
    isLoaded,
    addDriver,
    updateDriver,
    updateDriverStatus,
    updateDriverAvailability,
    deleteDriver,
  } = useDrivers();

  const { getUsersByRole, updateUser } = useAuth();

  // Driver accounts registered through /driver/register that are awaiting
  // admin approval (inactive driver Users). Approving activates login.
  const pendingDriverUsers = getUsersByRole("driver").filter(
    (item) => !item.isActive,
  );

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | DriverStatus
  >("all");

  const [availabilityFilter, setAvailabilityFilter] = useState<
    "all" | DriverAvailability
  >("all");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const [viewingDriver, setViewingDriver] = useState<Driver | null>(null);

  /* =========================================
     FILTER DRIVERS
  ========================================= */

  const filteredDrivers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return drivers.filter((driver) => {
      const matchesSearch =
        query === "" ||
        driver.name.toLowerCase().includes(query) ||
        driver.email.toLowerCase().includes(query) ||
        driver.phone.toLowerCase().includes(query) ||
        driver.licenseNumber.toLowerCase().includes(query) ||
        driver.vehicleNumber.toLowerCase().includes(query) ||
        driver.vehicleType.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        driver.status === statusFilter;

      const matchesAvailability =
        availabilityFilter === "all" ||
        driver.availability === availabilityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAvailability
      );
    });
  }, [
    drivers,
    search,
    statusFilter,
    availabilityFilter,
  ]);

  /* =========================================
     STATISTICS
  ========================================= */

  const totalDrivers = drivers.length;

  const pendingDrivers = drivers.filter(
    (driver) => driver.status === "pending",
  ).length;

  const approvedDrivers = drivers.filter(
    (driver) => driver.status === "approved",
  ).length;

  const rejectedDrivers = drivers.filter(
    (driver) => driver.status === "rejected",
  ).length;

  const suspendedDrivers = drivers.filter(
    (driver) => driver.status === "suspended",
  ).length;

  const availableDrivers = drivers.filter(
    (driver) => driver.availability === "available",
  ).length;

  const busyDrivers = drivers.filter(
    (driver) => driver.availability === "busy",
  ).length;

  const offlineDrivers = drivers.filter(
    (driver) => driver.availability === "offline",
  ).length;

  const totalTrips = drivers.reduce(
    (sum, driver) => sum + Number(driver.totalTrips || 0),
    0,
  );

  const totalEarnings = drivers.reduce(
    (sum, driver) => sum + Number(driver.totalEarnings || 0),
    0,
  );

  /* =========================================
     ADD DRIVER
  ========================================= */

  function handleAddDriver() {
    setEditingDriver(null);
    setIsModalOpen(true);
  }

  /* =========================================
     EDIT DRIVER
  ========================================= */

  function handleEditDriver(driver: Driver) {
    setEditingDriver(driver);
    setIsModalOpen(true);
  }

  /* =========================================
     SAVE DRIVER
  ========================================= */

  function handleSaveDriver(driver: Driver) {
    if (editingDriver) {
      updateDriver(driver);
    } else {
      addDriver(driver);
    }

    setIsModalOpen(false);
    setEditingDriver(null);
  }

  /* =========================================
     DELETE DRIVER
  ========================================= */

  function handleDeleteDriver(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this driver?",
    );

    if (!confirmed) return;

    deleteDriver(id);
  }

  /* =========================================
     STATUS
  ========================================= */

  function handleStatusChange(
    id: string,
    status: DriverStatus,
  ) {
    updateDriverStatus(id, status);
  }

  /* =========================================
     AVAILABILITY
  ========================================= */

  function handleAvailabilityChange(
    id: string,
    availability: DriverAvailability,
  ) {
    updateDriverAvailability(id, availability);
  }

  /* =========================================
     LOADING
  ========================================= */

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

          <p className="mt-4 font-medium text-slate-500">
            Loading drivers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            DRIVER MANAGEMENT
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Drivers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage driver accounts, approvals, availability and performance.
          </p>
        </div>

        <button
          onClick={handleAddDriver}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <Plus size={18} />

          Add Driver
        </button>
      </div>

      {/* =====================================
          PENDING DRIVER APPROVALS
      ===================================== */}

      {pendingDriverUsers.length > 0 && (
        <section className="mt-7 overflow-hidden rounded-lg border border-orange-200 bg-white">
          <div className="border-b border-orange-100 bg-orange-50 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Pending Driver Approvals
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {pendingDriverUsers.length} driver account
              {pendingDriverUsers.length !== 1 ? "s" : ""} awaiting approval.
              Approve an account to let the driver log in.
            </p>
          </div>

          <ul className="divide-y divide-slate-100">
            {pendingDriverUsers.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-800">{item.name}</p>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.email} • {item.phone}
                  </p>
                </div>

                <button
                  onClick={() => updateUser({ ...item, isActive: true })}
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  <UserCheck size={17} />
                  Approve
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* =====================================
          MAIN STATISTICS
      ===================================== */}

      <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Drivers"
          value={totalDrivers}
          description="All registered drivers"
          icon={<UserCheck size={22} />}
          color="blue"
        />

        <StatCard
          label="Pending"
          value={pendingDrivers}
          description="Waiting for approval"
          icon={<ShieldCheck size={22} />}
          color="orange"
        />

        <StatCard
          label="Approved"
          value={approvedDrivers}
          description="Approved drivers"
          icon={<CheckCircle2 size={22} />}
          color="green"
        />

        <StatCard
          label="Suspended"
          value={suspendedDrivers}
          description="Currently suspended"
          icon={<UserX size={22} />}
          color="red"
        />
      </section>

      {/* =====================================
          AVAILABILITY STATISTICS
      ===================================== */}

      <section className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Available"
          value={availableDrivers}
          description="Ready for trips"
          icon={<CheckCircle2 size={22} />}
          color="green"
        />

        <StatCard
          label="Busy"
          value={busyDrivers}
          description="Currently on a trip"
          icon={<UserCheck size={22} />}
          color="blue"
        />

        <StatCard
          label="Offline"
          value={offlineDrivers}
          description="Currently offline"
          icon={<UserX size={22} />}
          color="gray"
        />
      </section>

      {/* =====================================
          PERFORMANCE SUMMARY
      ===================================== */}

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">
            Total Trips
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totalTrips.toLocaleString()}
          </p>

          <p className="mt-3 text-xs text-slate-500">
            Completed trips across all drivers
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">
            Total Driver Earnings
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            ৳{totalEarnings.toLocaleString()}
          </p>

          <p className="mt-3 text-xs text-slate-500">
            Combined recorded driver earnings
          </p>
        </div>
      </section>

      {/* =====================================
          SEARCH / FILTER
      ===================================== */}

      <section className="mt-7 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_200px_200px]">
          {/* SEARCH */}

          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, phone, email, license or vehicle..."
              className="w-full rounded-lg border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "all" | DriverStatus,
              )
            }
            className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* AVAILABILITY */}

          <select
            value={availabilityFilter}
            onChange={(event) =>
              setAvailabilityFilter(
                event.target.value as
                  | "all"
                  | DriverAvailability,
              )
            }
            className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-orange-500"
          >
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </section>

      {/* =====================================
          DRIVER TABLE
      ===================================== */}

      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">
              Driver List
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredDrivers.length} driver
              {filteredDrivers.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="text-xs font-medium text-slate-400">
            {approvedDrivers} approved
          </div>
        </div>

        {filteredDrivers.length === 0 ? (
          <div className="py-16 text-center">
            <UserX
              size={45}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-bold text-slate-800">
              No drivers found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Driver
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Contact
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Vehicle
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Availability
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Performance
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Actions
                  </th>
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
                      <div>
                        <p className="font-semibold text-slate-800">
                          {driver.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          ID: {driver.id}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {driver.experienceYears} years experience
                        </p>
                      </div>
                    </td>

                    {/* CONTACT */}

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-700">
                        {driver.phone}
                      </p>

                      <p className="mt-1 max-w-[200px] truncate text-xs text-slate-500">
                        {driver.email}
                      </p>
                    </td>

                    {/* VEHICLE */}

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-700">
                        {driver.vehicleType}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {driver.vehicleNumber}
                      </p>
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <select
                        value={driver.status}
                        onChange={(event) =>
                          handleStatusChange(
                            driver.id,
                            event.target.value as DriverStatus,
                          )
                        }
                        className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${getStatusClass(
                          driver.status,
                        )}`}
                      >
                        <option value="pending">
                          Pending
                        </option>

                        <option value="approved">
                          Approved
                        </option>

                        <option value="rejected">
                          Rejected
                        </option>

                        <option value="suspended">
                          Suspended
                        </option>
                      </select>
                    </td>

                    {/* AVAILABILITY */}

                    <td className="px-5 py-4">
                      <select
                        value={driver.availability}
                        onChange={(event) =>
                          handleAvailabilityChange(
                            driver.id,
                            event.target
                              .value as DriverAvailability,
                          )
                        }
                        className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${getAvailabilityClass(
                          driver.availability,
                        )}`}
                      >
                        <option value="available">
                          Available
                        </option>

                        <option value="busy">
                          Busy
                        </option>

                        <option value="offline">
                          Offline
                        </option>
                      </select>
                    </td>

                    {/* PERFORMANCE */}

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          ⭐{" "}
                          {Number(driver.rating || 0).toFixed(1)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {driver.totalTrips || 0} trips
                        </p>
                      </div>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setViewingDriver(driver)
                          }
                          title="View Driver"
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          onClick={() =>
                            handleEditDriver(driver)
                          }
                          title="Edit Driver"
                          className="rounded-lg border border-slate-200 p-2 text-blue-600 transition hover:bg-blue-50"
                        >
                          <Edit3 size={17} />
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteDriver(driver.id)
                          }
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

      {/* =====================================
          ADD / EDIT MODAL
      ===================================== */}

      {isModalOpen && (
        <DriverModal
          driver={editingDriver}
          onClose={() => {
            setIsModalOpen(false);
            setEditingDriver(null);
          }}
          onSave={handleSaveDriver}
        />
      )}

      {/* =====================================
          VIEW DRIVER MODAL
      ===================================== */}

      {viewingDriver && (
        <DriverDetailsModal
          driver={viewingDriver}
          onClose={() => setViewingDriver(null)}
        />
      )}
    </div>
  );
}

/* ============================================
   STAT CARD
============================================ */

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
  color:
    | "blue"
    | "green"
    | "orange"
    | "red"
    | "gray";
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
    gray: "bg-slate-100 text-slate-600",
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value.toLocaleString()}
          </p>
        </div>

        <div
          className={`rounded-lg p-3 ${colors[color]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        {description}
      </p>
    </article>
  );
}

/* ============================================
   STATUS CLASS
============================================ */

function getStatusClass(status: DriverStatus) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "approved":
      return "bg-green-100 text-green-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    case "suspended":
      return "bg-slate-200 text-slate-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

/* ============================================
   AVAILABILITY CLASS
============================================ */

function getAvailabilityClass(
  availability: DriverAvailability,
) {
  switch (availability) {
    case "available":
      return "bg-green-100 text-green-700";

    case "busy":
      return "bg-blue-100 text-blue-700";

    case "offline":
      return "bg-slate-100 text-slate-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

/* ============================================
   ADD / EDIT DRIVER MODAL
============================================ */

function DriverModal({
  driver,
  onClose,
  onSave,
}: {
  driver: Driver | null;
  onClose: () => void;
  onSave: (driver: Driver) => void;
}) {
  const [name, setName] = useState(driver?.name || "");

  const [email, setEmail] = useState(
    driver?.email || "",
  );

  const [phone, setPhone] = useState(
    driver?.phone || "",
  );

  const [licenseNumber, setLicenseNumber] = useState(
    driver?.licenseNumber || "",
  );

  const [licenseExpiry, setLicenseExpiry] = useState(
    driver?.licenseExpiry || "",
  );

  const [nationalId, setNationalId] = useState(
    driver?.nationalId || "",
  );

  const [vehicleType, setVehicleType] = useState(
    driver?.vehicleType || "",
  );

  const [vehicleNumber, setVehicleNumber] = useState(
    driver?.vehicleNumber || "",
  );

  const [experienceYears, setExperienceYears] =
    useState(
      driver?.experienceYears?.toString() || "0",
    );

  const [status, setStatus] = useState<DriverStatus>(
    driver?.status || "pending",
  );

  const [availability, setAvailability] =
    useState<DriverAvailability>(
      driver?.availability || "offline",
    );

  const [rating, setRating] = useState(
    driver?.rating?.toString() || "0",
  );

  const [totalTrips, setTotalTrips] = useState(
    driver?.totalTrips?.toString() || "0",
  );

  const [totalEarnings, setTotalEarnings] = useState(
    driver?.totalEarnings?.toString() || "0",
  );

  const [documentsSubmitted, setDocumentsSubmitted] =
    useState(driver?.documentsSubmitted ?? false);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !licenseNumber.trim() ||
      !licenseExpiry.trim() ||
      !vehicleType.trim() ||
      !vehicleNumber.trim()
    ) {
      alert("Please fill in all required fields.");

      return;
    }

    const newDriver: Driver = {
      id: driver?.id || `DRV-${Date.now()}`,

      userId:
        driver?.userId || `USER-${Date.now()}`,

      name: name.trim(),

      email: email.trim(),

      phone: phone.trim(),

      licenseNumber: licenseNumber.trim(),

      licenseExpiry: licenseExpiry.trim(),

      nationalId: nationalId.trim() || undefined,

      vehicleType: vehicleType.trim(),

      vehicleNumber: vehicleNumber.trim(),

      experienceYears:
        Number(experienceYears) || 0,

      status,

      availability,

      rating: Number(rating) || 0,

      totalTrips: Number(totalTrips) || 0,

      totalEarnings: Number(totalEarnings) || 0,

      documentsSubmitted,

      createdAt:
        driver?.createdAt ||
        new Date().toISOString(),
    };

    onSave(newDriver);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
          <div>
            <p className="text-sm font-semibold text-orange-600">
              DRIVER MANAGEMENT
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {driver
                ? "Edit Driver"
                : "Add New Driver"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={22} />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6"
        >
          {/* PERSONAL INFORMATION */}

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Personal Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Basic driver account information.
            </p>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              label="Driver Name"
              value={name}
              onChange={setName}
              placeholder="Example: Rahim Ahmed"
              required
            />

            <Field
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="driver@example.com"
              type="email"
              required
            />

            <Field
              label="Phone"
              value={phone}
              onChange={setPhone}
              placeholder="01XXXXXXXXX"
              type="tel"
              required
            />

            <Field
              label="National ID"
              value={nationalId}
              onChange={setNationalId}
              placeholder="NID number"
            />
          </div>

          {/* LICENSE */}

          <div className="mt-8 border-t border-slate-100 pt-6">
            <h3 className="text-base font-bold text-slate-900">
              License Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Driver license information.
            </p>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              label="License Number"
              value={licenseNumber}
              onChange={setLicenseNumber}
              placeholder="DL-XXXXXXXX"
              required
            />

            <Field
              label="License Expiry"
              value={licenseExpiry}
              onChange={setLicenseExpiry}
              type="date"
              required
            />
          </div>

          {/* VEHICLE */}

          <div className="mt-8 border-t border-slate-100 pt-6">
            <h3 className="text-base font-bold text-slate-900">
              Vehicle Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Vehicle assigned to this driver.
            </p>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              label="Vehicle Type"
              value={vehicleType}
              onChange={setVehicleType}
              placeholder="Example: Pickup Truck"
              required
            />

            <Field
              label="Vehicle Number"
              value={vehicleNumber}
              onChange={setVehicleNumber}
              placeholder="DHAKA-METRO-TA-1234"
              required
            />

            <Field
              label="Experience Years"
              value={experienceYears}
              onChange={setExperienceYears}
              type="number"
              placeholder="5"
            />
          </div>

          {/* ACCOUNT STATUS */}

          <div className="mt-8 border-t border-slate-100 pt-6">
            <h3 className="text-base font-bold text-slate-900">
              Account Status
            </h3>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Driver Status
                </span>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as DriverStatus,
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="approved">
                    Approved
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>

                  <option value="suspended">
                    Suspended
                  </option>
                </select>
              </label>
            </div>

            <div>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Availability
                </span>

                <select
                  value={availability}
                  onChange={(event) =>
                    setAvailability(
                      event.target
                        .value as DriverAvailability,
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                >
                  <option value="available">
                    Available
                  </option>

                  <option value="busy">
                    Busy
                  </option>

                  <option value="offline">
                    Offline
                  </option>
                </select>
              </label>
            </div>
          </div>

          {/* PERFORMANCE */}

          <div className="mt-8 border-t border-slate-100 pt-6">
            <h3 className="text-base font-bold text-slate-900">
              Performance
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Driver performance information.
            </p>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <Field
              label="Rating"
              value={rating}
              onChange={setRating}
              type="number"
              placeholder="4.8"
            />

            <Field
              label="Total Trips"
              value={totalTrips}
              onChange={setTotalTrips}
              type="number"
              placeholder="100"
            />

            <Field
              label="Total Earnings"
              value={totalEarnings}
              onChange={setTotalEarnings}
              type="number"
              placeholder="100000"
            />
          </div>

          {/* DOCUMENTS */}

          <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={documentsSubmitted}
              onChange={(event) =>
                setDocumentsSubmitted(
                  event.target.checked,
                )
              }
              className="h-4 w-4 accent-orange-500"
            />

            <div>
              <p className="font-semibold text-slate-800">
                Documents Submitted
              </p>

              <p className="text-xs text-slate-500">
                Mark this if all required driver documents
                have been submitted.
              </p>
            </div>
          </label>

          {/* ACTIONS */}

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              {driver
                ? "Save Changes"
                : "Add Driver"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================
   DRIVER DETAILS MODAL
============================================ */

function DriverDetailsModal({
  driver,
  onClose,
}: {
  driver: Driver;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
          <div>
            <p className="text-sm font-semibold text-orange-600">
              DRIVER PROFILE
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {driver.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Driver ID: {driver.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {/* STATUS */}

          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                driver.status,
              )}`}
            >
              {capitalize(driver.status)}
            </span>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getAvailabilityClass(
                driver.availability,
              )}`}
            >
              {capitalize(driver.availability)}
            </span>
          </div>

          {/* PERSONAL */}

          <DetailsSection title="Personal Information">
            <Detail
              label="Name"
              value={driver.name}
            />

            <Detail
              label="Email"
              value={driver.email}
            />

            <Detail
              label="Phone"
              value={driver.phone}
            />

            <Detail
              label="National ID"
              value={
                driver.nationalId || "Not provided"
              }
            />
          </DetailsSection>

          {/* LICENSE */}

          <DetailsSection title="License Information">
            <Detail
              label="License Number"
              value={driver.licenseNumber}
            />

            <Detail
              label="License Expiry"
              value={driver.licenseExpiry}
            />

            <Detail
              label="Documents"
              value={
                driver.documentsSubmitted
                  ? "Submitted"
                  : "Not Submitted"
              }
            />
          </DetailsSection>

          {/* VEHICLE */}

          <DetailsSection title="Vehicle Information">
            <Detail
              label="Vehicle Type"
              value={driver.vehicleType}
            />

            <Detail
              label="Vehicle Number"
              value={driver.vehicleNumber}
            />

            <Detail
              label="Experience"
              value={`${driver.experienceYears} years`}
            />
          </DetailsSection>

          {/* PERFORMANCE */}

          <DetailsSection title="Performance">
            <Detail
              label="Rating"
              value={`⭐ ${Number(
                driver.rating || 0,
              ).toFixed(1)}`}
            />

            <Detail
              label="Total Trips"
              value={String(
                driver.totalTrips || 0,
              )}
            />

            <Detail
              label="Total Earnings"
              value={`৳${Number(
                driver.totalEarnings || 0,
              ).toLocaleString()}`}
            />
          </DetailsSection>

          {/* CREATED */}

          <DetailsSection title="Account Information">
            <Detail
              label="User ID"
              value={driver.userId}
            />

            <Detail
              label="Created At"
              value={formatDate(driver.createdAt)}
            />
          </DetailsSection>

          <div className="mt-7 flex justify-end border-t border-slate-100 pt-5">
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   DETAILS SECTION
============================================ */

function DetailsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <h3 className="border-b border-slate-100 pb-3 text-base font-bold text-slate-900">
        {title}
      </h3>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

/* ============================================
   DETAIL
============================================ */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

/* ============================================
   FIELD
============================================ */

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

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        min={
          type === "number"
            ? "0"
            : undefined
        }
        step={
          type === "number" &&
          label === "Rating"
            ? "0.1"
            : undefined
        }
        className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
      />
    </label>
  );
}

/* ============================================
   HELPERS
============================================ */

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value: string) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}