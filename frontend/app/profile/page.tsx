"use client";

import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Phone,
  Plus,
  Truck,
  User,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { useBooking, type Booking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import RouteGuard from "@/components/auth/RouteGuard";

export default function ProfilePage() {
  return (
    <RouteGuard role="customer">
      <ProfileContent />
    </RouteGuard>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const { bookings } = useBooking();

  const totalBookings = bookings.length;

  const completedBookings = bookings.filter(
    (booking: Booking) => booking.status === "Delivered",
  ).length;

  const activeBookings = bookings.filter((booking: Booking) =>
    ["Confirmed", "Driver Assigned", "Picked Up", "In Transit"].includes(
      booking.status,
    ),
  ).length;

  const cancelledBookings = bookings.filter(
    (booking: Booking) => booking.status === "Cancelled",
  ).length;

  const totalSpent = bookings
    .filter((booking: Booking) => booking.status !== "Cancelled")
    .reduce(
      (total: number, booking: Booking) => total + booking.estimatedFare,
      0,
    );

  const recentBookings = bookings.slice(0, 5);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* HEADER */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-orange-500">MY ACCOUNT</p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                Profile Dashboard
              </h1>

              <p className="mt-3 text-slate-500">
                Manage your truck bookings and account activity.
              </p>
            </div>

            <Link
              href="/booking"
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 font-semibold text-white transition hover:bg-orange-600"
            >
              <Plus size={20} />
              Book a Truck
            </Link>
          </div>

          {/* PROFILE CARD */}
          <section className="mt-8 overflow-hidden rounded-2xl bg-slate-900 text-white shadow-sm">
            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                <User size={38} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-orange-400">
                  TRUCKLAGBE {(user?.role ?? "customer").toUpperCase()}
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Welcome back, {user?.name ?? "there"}!
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                  Track your deliveries, manage your bookings and view your
                  booking history from one place.
                </p>
              </div>

              <div className="w-fit rounded-xl bg-white/10 px-5 py-4">
                <p className="text-xs font-semibold text-slate-400">
                  TOTAL SPENT
                </p>

                <p className="mt-1 text-2xl font-bold text-orange-400">
                  ৳{totalSpent.toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Bookings"
              value={totalBookings}
              icon={<Truck size={23} />}
              description="All time bookings"
            />

            <StatCard
              label="Active"
              value={activeBookings}
              icon={<Clock size={23} />}
              description="Currently in progress"
            />

            <StatCard
              label="Completed"
              value={completedBookings}
              icon={<CheckCircle2 size={23} />}
              description="Successfully delivered"
            />

            <StatCard
              label="Cancelled"
              value={cancelledBookings}
              icon={<Package size={23} />}
              description="Cancelled bookings"
            />
          </section>

          {/* QUICK ACTIONS */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Quick Actions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Access the most important features quickly.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QuickAction
                href="/booking"
                icon={<Plus size={23} />}
                title="Book a Truck"
                description="Create a new delivery booking"
              />

              <QuickAction
                href="/bookings"
                icon={<Truck size={23} />}
                title="My Bookings"
                description="View all your bookings"
              />

              <QuickAction
                href="/tracking"
                icon={<MapPin size={23} />}
                title="Track Truck"
                description="Track your current delivery"
              />

              <QuickAction
                href="/trucks"
                icon={<Package size={23} />}
                title="Browse Trucks"
                description="Find the right vehicle"
              />
            </div>
          </section>

          {/* RECENT BOOKINGS */}
          <section className="mt-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Bookings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest truck booking activity.
                </p>
              </div>

              {bookings.length > 0 && (
                <Link
                  href="/bookings"
                  className="font-semibold text-orange-500 hover:text-orange-600"
                >
                  View All →
                </Link>
              )}
            </div>

            {recentBookings.length === 0 ? (
              <div className="mt-5 rounded-2xl bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <Truck size={30} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  No Bookings Yet
                </h3>

                <p className="mt-2 text-slate-500">
                  Start by booking a truck for your delivery.
                </p>

                <Link
                  href="/booking"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
                >
                  <Plus size={18} />
                  Book Your First Truck
                </Link>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {recentBookings.map((booking: Booking) => (
                  <article
                    key={booking.id}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="rounded-xl bg-orange-100 p-3 text-orange-500">
                          <Truck size={22} />
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-400">
                            {booking.id}
                          </p>

                          <h3 className="mt-1 font-bold text-slate-900">
                            {booking.truckName}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {booking.cargoType} • {booking.weight} KG
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={booking.status} />
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-5">
                      <div className="flex gap-3">
                        <MapPin
                          size={18}
                          className="mt-0.5 shrink-0 text-orange-500"
                        />

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-400">
                            ROUTE
                          </p>

                          <p className="mt-1 truncate text-sm font-medium text-slate-700">
                            {booking.pickupLocation}
                          </p>

                          <p className="my-1 text-xs text-slate-400">↓</p>

                          <p className="truncate text-sm font-medium text-slate-700">
                            {booking.dropLocation}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                      <div>
                        <p className="text-xs text-slate-400">Total Amount</p>

                        <p className="mt-1 font-bold text-orange-500">
                          ৳{booking.estimatedFare.toLocaleString()}
                        </p>
                      </div>

                      <Link
                        href={`/tracking?booking=${booking.id}`}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Track
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* ACCOUNT INFORMATION */}
          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-orange-100 p-3 text-orange-500">
                  <User size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Account Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Your TruckLagbe account details.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <InfoRow label="Name" value={user?.name} />
                <InfoRow label="Email" value={user?.email} />
                <InfoRow label="Phone" value={user?.phone} />
                <InfoRow label="Account type" value={user?.role} />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-orange-100 p-3 text-orange-500">
                  <Phone size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Need Help?
                  </h2>

                  <p className="text-sm text-slate-500">
                    Contact support for booking assistance.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Link
                  href="/contact"
                  className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
                >
                  Contact Support
                </Link>

                <Link
                  href="/bookings"
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  My Bookings
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}

function StatCard({ label, value, icon, description }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div className="rounded-xl bg-orange-100 p-3 text-orange-500">
          {icon}
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function QuickAction({ href, icon, title, description }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-slate-900">{title}</h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-blue-100 text-blue-700",
    "Driver Assigned": "bg-purple-100 text-purple-700",
    "On The Way": "bg-orange-100 text-orange-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-500">{label}</span>

      <span className="truncate text-sm font-semibold text-slate-800">
        {value || "Not provided"}
      </span>
    </div>
  );
}
