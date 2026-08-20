"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Mail,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  UserX,
  Phone,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { User, UserRole } from "@/types/user";

export default function AdminUsersPage() {
  const { users, isLoaded, updateUser } = useAuth();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");

  /* =========================================
     FILTER USERS
  ========================================= */

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        query === "" ||
        String(user.name ?? "")
          .toLowerCase()
          .includes(query) ||
        String(user.email ?? "")
          .toLowerCase()
          .includes(query) ||
        String(user.phone ?? "")
          .toLowerCase()
          .includes(query) ||
        String(user.id ?? "")
          .toLowerCase()
          .includes(query);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  /* =========================================
     STATISTICS
  ========================================= */

  const totalUsers = users.length;

  const activeUsers = users.filter((user) => user.isActive).length;

  const inactiveUsers = users.filter((user) => !user.isActive).length;

  const customers = users.filter((user) => user.role === "customer").length;

  const drivers = users.filter((user) => user.role === "driver").length;

  const admins = users.filter((user) => user.role === "admin").length;

  /* =========================================
     TOGGLE USER STATUS
  ========================================= */

  function toggleUserStatus(user: User) {
    updateUser({
      ...user,
      isActive: !user.isActive,
    });
  }

  /* =========================================
     DATE FORMAT
  ========================================= */

  function formatDate(date?: string) {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  /* =========================================
     LOADING
  ========================================= */

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            USER MANAGEMENT
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Users
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage customers, drivers, administrators and user account access.
          </p>
        </div>

        <div className="w-fit rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
          Total: <span className="font-bold text-slate-900">{totalUsers}</span>
        </div>
      </div>

      {/* =========================================
          STATISTICS
      ========================================= */}

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Users size={22} />}
          label="Total Users"
          value={totalUsers}
          description="All registered users"
          color="orange"
        />

        <StatCard
          icon={<UserCheck size={22} />}
          label="Active Users"
          value={activeUsers}
          description="Currently active accounts"
          color="green"
        />

        <StatCard
          icon={<UserX size={22} />}
          label="Inactive Users"
          value={inactiveUsers}
          description="Suspended accounts"
          color="red"
        />

        <StatCard
          icon={<ShieldCheck size={22} />}
          label="Admins"
          value={admins}
          description={`${drivers} drivers • ${customers} customers`}
          color="violet"
        />
      </section>

      {/* =========================================
          ROLE SUMMARY
      ========================================= */}

      <section className="mt-4 grid gap-4 sm:grid-cols-3">
        <MiniStat label="Customers" value={customers} color="blue" />

        <MiniStat label="Drivers" value={drivers} color="violet" />

        <MiniStat label="Administrators" value={admins} color="orange" />
      </section>

      {/* =========================================
          SEARCH / FILTER
      ========================================= */}

      <section className="mt-7 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* SEARCH */}

          <div className="relative w-full md:max-w-xl">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, phone or user ID..."
              className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* ROLE FILTER */}

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value as "all" | UserRole)
            }
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          >
            <option value="all">All Roles</option>

            <option value="customer">Customers</option>

            <option value="driver">Drivers</option>

            <option value="admin">Administrators</option>
          </select>
        </div>

        {/* ACTIVE FILTER INFO */}

        {(search || roleFilter !== "all") && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>
              Showing{" "}
              <strong className="text-slate-900">{filteredUsers.length}</strong>{" "}
              of <strong className="text-slate-900">{users.length}</strong>{" "}
              users
            </span>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
              }}
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* =========================================
          USERS TABLE
      ========================================= */}

      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-900">All Users</h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredUsers.length} user
            {filteredUsers.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {filteredUsers.length === 0 ? (
          /* EMPTY STATE */

          <div className="py-16 text-center">
            <Users size={42} className="mx-auto text-slate-300" />

            <h3 className="mt-4 font-bold text-slate-800">No users found</h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or role filter.
            </p>

            {(search || roleFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("all");
                }}
                className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* TABLE */

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">User</th>

                  <th className="px-5 py-4 font-semibold">Contact</th>

                  <th className="px-5 py-4 font-semibold">Role</th>

                  <th className="px-5 py-4 font-semibold">Joined</th>

                  <th className="px-5 py-4 font-semibold">Status</th>

                  <th className="px-5 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    {/* USER */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {user.name || "Unknown User"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT */}

                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail size={14} className="shrink-0" />

                          <span className="max-w-[260px] truncate">
                            {user.email || "No email"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-500">
                          <Phone size={14} className="shrink-0" />

                          {user.phone || "No phone"}
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}

                    <td className="px-5 py-4">
                      <RoleBadge role={user.role} />
                    </td>

                    {/* DATE */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <CalendarDays size={15} />

                        {formatDate(user.createdAt)}
                      </div>
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      {user.isActive ? (
                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          Suspended
                        </span>
                      )}
                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(user)}
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ${
                          user.isActive
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {user.isActive ? (
                          <>
                            <UserX size={15} />
                            Suspend
                          </>
                        ) : (
                          <>
                            <UserCheck size={15} />
                            Activate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================
   STAT CARD
========================================= */

function StatCard({
  icon,
  label,
  value,
  description,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
  color: "orange" | "green" | "red" | "violet";
}) {
  const colors = {
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    violet: "bg-violet-100 text-violet-600",
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value.toLocaleString()}
          </p>
        </div>

        <div className={`rounded-lg p-2.5 ${colors[color]}`}>{icon}</div>
      </div>

      <p className="mt-4 text-xs text-slate-500">{description}</p>
    </article>
  );
}

/* =========================================
   MINI STAT
========================================= */

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "blue" | "violet" | "orange";
}) {
  const colors = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    violet: "border-violet-100 bg-violet-50 text-violet-700",
    orange: "border-orange-100 bg-orange-50 text-orange-700",
  };

  return (
    <div className={`rounded-lg border p-4 ${colors[color]}`}>
      <p className="text-sm font-medium">{label}</p>

      <p className="mt-1 text-2xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}

/* =========================================
   ROLE BADGE
========================================= */

function RoleBadge({ role }: { role: UserRole }) {
  const styles: Record<UserRole, string> = {
    customer: "bg-blue-100 text-blue-700",
    driver: "bg-violet-100 text-violet-700",
    admin: "bg-orange-100 text-orange-700",
  };

  const labels: Record<UserRole, string> = {
    customer: "Customer",
    driver: "Driver",
    admin: "Administrator",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[role]
      }`}
    >
      {labels[role]}
    </span>
  );
}
