"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Mail,
  Phone,
  CalendarDays,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { User, UserRole } from "@/types/user";

export default function AdminUsersPage() {
  const { users, isLoaded, updateUser } = useAuth();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const customers = users.filter((user) => user.role === "customer").length;

  const drivers = users.filter((user) => user.role === "driver").length;

  const admins = users.filter((user) => user.role === "admin").length;

  const activeUsers = users.filter((user) => user.isActive).length;

  function toggleUserStatus(user: User) {
    updateUser({
      ...user,
      isActive: !user.isActive,
    });
  }

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
      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            USER MANAGEMENT
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Users
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage customers, drivers, and administrators.
          </p>
        </div>

        <div className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
          Total:{" "}
          <span className="font-bold text-slate-900">{users.length}</span>
        </div>
      </div>

      {/* STATS */}
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Users size={22} />}
          label="Total Users"
          value={users.length}
          color="orange"
        />

        <StatCard
          icon={<UserCheck size={22} />}
          label="Active Users"
          value={activeUsers}
          color="green"
        />

        <StatCard
          icon={<Users size={22} />}
          label="Customers"
          value={customers}
          color="blue"
        />

        <StatCard
          icon={<ShieldCheck size={22} />}
          label="Drivers"
          value={drivers}
          color="violet"
        />
      </section>

      {/* FILTERS */}
      <section className="mt-7 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* SEARCH */}
          <div className="relative w-full md:max-w-md">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* ROLE FILTER */}
          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value as "all" | UserRole)
            }
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-orange-500"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="driver">Drivers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </section>

      {/* USERS TABLE */}
      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-900">All Users</h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredUsers.length} user(s) found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {user.name}
                        </p>

                        <p className="text-xs text-slate-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* CONTACT */}
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail size={14} />
                        {user.email}
                      </div>

                      <div className="flex items-center gap-2 text-slate-500">
                        <Phone size={14} />
                        {user.phone}
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

                      {new Date(user.createdAt).toLocaleDateString("en-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
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

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <Users size={38} className="mx-auto text-slate-300" />

                    <h3 className="mt-3 font-bold text-slate-700">
                      No users found
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

/* =========================
   STAT CARD
========================= */

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "orange" | "green" | "blue" | "violet";
}) {
  const colors = {
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    violet: "bg-violet-100 text-violet-600",
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

/* =========================
   ROLE BADGE
========================= */

function RoleBadge({ role }: { role: UserRole }) {
  const styles = {
    customer: "bg-blue-100 text-blue-700",
    driver: "bg-violet-100 text-violet-700",
    admin: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[role]}`}
    >
      {role}
    </span>
  );
}
