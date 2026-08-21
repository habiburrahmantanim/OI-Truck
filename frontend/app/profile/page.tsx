"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  Mail,
  Phone,
  Save,
  Shield,
  UserRound,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import AuthLoading from "@/components/auth/AuthLoading";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, isLoaded, updateUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <AuthLoading />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Please login first
            </h1>

            <p className="mt-2 text-slate-500">
              You need an account to view your profile.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white"
            >
              Go to Login
            </Link>
          </div>
        </main>
      </>
    );
  }

  function startEditing() {
    setName(user.name);
    setEditing(true);
  }

  function saveProfile() {
    if (!name.trim()) return;

    updateUser({
      ...user,
      name: name.trim(),
    });

    setEditing(false);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-orange-600">
                MY ACCOUNT
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                Profile
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage your personal account information.
              </p>
            </div>

            {!editing ? (
              <button
                onClick={startEditing}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={saveProfile}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white"
              >
                <Save size={18} />
                Save Changes
              </button>
            )}
          </div>

          <section className="mt-7 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <UserRound size={38} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {user.name}
                </h2>

                <p className="mt-1 capitalize text-slate-500">{user.role}</p>
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <ProfileItem
                icon={<Mail size={20} />}
                label="Email"
                value={user.email}
              />

              <ProfileItem
                icon={<Phone size={20} />}
                label="Phone"
                value={user.phone}
              />

              <ProfileItem
                icon={<Shield size={20} />}
                label="Account Role"
                value={user.role}
              />

              <ProfileItem
                icon={<CalendarDays size={20} />}
                label="Member Since"
                value={new Date(user.createdAt).toLocaleDateString("en-BD")}
              />
            </div>

            {editing && (
              <div className="mt-7 border-t border-slate-100 pt-6">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </span>

                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </label>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-orange-500">{icon}</div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-all font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}
