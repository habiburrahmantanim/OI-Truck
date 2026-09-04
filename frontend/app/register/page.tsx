"use client";

import Link from "next/link";
import { ArrowRight, Truck, UserRound } from "lucide-react";

import Navbar from "@/components/Navbar";

export function Success({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-3 leading-7 text-slate-500">{description}</p>
        <Link
          href={href}
          className="mt-7 inline-flex rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          {action}
        </Link>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-semibold text-orange-600">
              CREATE YOUR ACCOUNT
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Join OI-Truck Today
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Choose how you want to use the OI-Truck platform.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Link
              href="/register/customer"
              className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <UserRound size={32} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Register as Customer
              </h2>

              <p className="mt-3 leading-7 text-slate-500">
                Book trucks, manage deliveries, track your cargo and view your
                booking history.
              </p>

              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-orange-600">
                Create Customer Account
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </Link>

            <Link
              href="/driver/register"
              className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Truck size={32} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Join as Driver
              </h2>

              <p className="mt-3 leading-7 text-slate-500">
                Apply as a driver, receive assignments and manage your
                deliveries and earnings.
              </p>

              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-orange-600">
                Start Driver Application
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </Link>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              Login here
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
