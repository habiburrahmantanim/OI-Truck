"use client";

import Link from "next/link";
import {
  Car,
  CreditCard,
  FileCheck2,
  Lock,
  Mail,
  Phone,
  Truck,
  UserRound,
} from "lucide-react";
import { type FormEvent, useState } from "react";

import { Success } from "@/app/register/page";
import { useAuth } from "@/context/AuthContext";

export default function DriverRegisterPage() {
  const { register } = useAuth();

  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setSubmitting(true);

    const form = new FormData(e.currentTarget);

    // Creates an inactive driver User; admin approval activates the account.
    try {
      await register({
        name: String(form.get("name") || "").trim(),
        email: String(form.get("email") || "").trim(),
        phone: String(form.get("phone") || "").trim(),
        password: String(form.get("password") || ""),
        role: "driver",
      });

      setDone(true);
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (done)
    return (
      <Success
        title="Application submitted"
        description="Your driver application is pending admin review. You will be able to log in and access the driver panel once it has been approved."
        href="/login"
        action="Go to login"
      />
    );

  return (
    <main className="min-h-screen bg-slate-50 p-5 sm:p-8">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-sm sm:p-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-slate-900"
        >
          <span className="rounded-lg bg-orange-500 p-2 text-white">
            <Truck size={20} />
          </span>
          Truck<span className="text-orange-500">Lagbe</span>
        </Link>

        <p className="mt-10 text-sm font-semibold text-orange-600">
          DRIVER APPLICATION
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Register as a driver
        </h1>

        <p className="mt-3 text-slate-500">
          Submit your identity and vehicle details for verification.
        </p>

        {message && (
          <div className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {message}
          </div>
        )}

        <form onSubmit={submit} className="mt-8 space-y-8">
          <FormGroup title="Personal details">
            <Field
              name="name"
              label="Full name"
              icon={<UserRound size={18} />}
            />
            <Field
              name="phone"
              label="Phone number"
              type="tel"
              icon={<Phone size={18} />}
            />
            <Field
              name="email"
              label="Email address"
              type="email"
              icon={<Mail size={18} />}
            />
            <Field
              name="password"
              label="Password"
              type="password"
              minLength={8}
              icon={<Lock size={18} />}
            />
          </FormGroup>

          <FormGroup title="Verification">
            <Field
              name="license"
              label="Driving licence number"
              icon={<CreditCard size={18} />}
            />
            <Field
              name="nid"
              label="National ID number"
              icon={<FileCheck2 size={18} />}
            />
          </FormGroup>

          <FormGroup title="Vehicle details">
            <Field
              name="vehicle"
              label="Vehicle type"
              icon={<Car size={18} />}
              placeholder="e.g. Pickup Truck"
            />
            <Field
              name="registration"
              label="Vehicle registration number"
              icon={<Truck size={18} />}
              placeholder="e.g. DHAKA METRO-TA 13-4521"
            />
          </FormGroup>

          <label className="flex items-start gap-2 text-sm text-slate-500">
            <input
              required
              type="checkbox"
              className="mt-1 h-4 w-4 accent-orange-500"
            />
            I confirm these details are accurate and agree to verification.
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-orange-500 py-3.5 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit for review"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-orange-600">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

function FormGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="font-bold text-slate-900">{title}</legend>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({
  name,
  label,
  type = "text",
  icon,
  placeholder,
  minLength,
}: {
  name: string;
  label: string;
  type?: string;
  icon: React.ReactNode;
  placeholder?: string;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <span className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-3 text-slate-400 focus-within:border-orange-500">
        <span>{icon}</span>
        <input
          required
          name={name}
          type={type}
          minLength={minLength}
          placeholder={placeholder}
          className="min-w-0 flex-1 text-sm text-slate-800 outline-none"
        />
      </span>
    </label>
  );
}
