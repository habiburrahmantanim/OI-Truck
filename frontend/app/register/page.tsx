"use client";

import Link from "next/link";
import { CheckCircle2, Truck, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { dashboardFor } from "@/components/auth/RouteGuard";

export default function RegisterPage() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();

  // Bounce already-authenticated users to their dashboard.
  useEffect(() => {
    if (isLoaded && user) {
      router.replace(dashboardFor(user.role));
    }
  }, [isLoaded, user, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <section className="w-full max-w-3xl">
        <Link
          href="/"
          className="mx-auto flex w-fit items-center gap-2 text-xl font-bold text-slate-900"
        >
          <span className="rounded-lg bg-orange-500 p-2 text-white">
            <Truck size={21} />
          </span>
          Truck<span className="text-orange-500">Lagbe</span>
        </Link>

        <div className="mt-10 text-center">
          <p className="text-sm font-semibold text-orange-600">
            CREATE AN ACCOUNT
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Choose your account type
          </h1>

          <p className="mt-3 text-slate-500">
            Select the role that matches how you use TruckLagbe.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Choice
            href="/register/customer"
            icon={<UserRound size={30} />}
            title="Customer"
            text="Book trucks, manage deliveries, and track each booking."
            action="Register as customer"
          />

          <Choice
            href="/driver/register"
            icon={<Truck size={30} />}
            title="Driver"
            text="Submit your driver and vehicle details for admin verification."
            action="Register as driver"
          />
        </div>

        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-orange-600">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}

function Choice({
  href,
  icon,
  title,
  text,
  action,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  text: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-slate-200 bg-white p-7 transition hover:border-orange-300 hover:shadow-md"
    >
      <span className="inline-flex rounded-lg bg-orange-100 p-3 text-orange-600">
        {icon}
      </span>

      <h2 className="mt-5 text-xl font-bold text-slate-900">{title}</h2>

      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{text}</p>

      <span className="mt-6 inline-flex text-sm font-semibold text-orange-600 group-hover:text-orange-700">
        {action} &rarr;
      </span>
    </Link>
  );
}

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
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-sm">
        <span className="inline-flex rounded-full bg-green-100 p-4 text-green-600">
          <CheckCircle2 size={32} />
        </span>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">{title}</h1>

        <p className="mt-3 leading-7 text-slate-500">{description}</p>

        <Link
          href={href}
          className="mt-7 inline-flex rounded-md bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          {action}
        </Link>
      </div>
    </main>
  );
}
