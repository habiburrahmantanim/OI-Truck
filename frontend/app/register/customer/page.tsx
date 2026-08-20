"use client";

import Link from "next/link";
import { Lock, Mail, Phone, Truck, UserRound } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { dashboardFor } from "@/components/auth/RouteGuard";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { register, user, isLoaded } = useAuth();

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Bounce already-authenticated users to their dashboard.
  useEffect(() => {
    if (isLoaded && user) {
      router.replace(dashboardFor(user.role));
    }
  }, [isLoaded, user, router]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setSubmitting(true);

    const form = new FormData(e.currentTarget);

    const result = register({
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      password: String(form.get("password") || ""),
      role: "customer",
    });

    if (!result.success) {
      setMessage(result.message || "Registration failed. Please try again.");
      setSubmitting(false);
      return;
    }

    // Customers are auto-logged-in by register(); go straight to the dashboard.
    router.replace("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-sm sm:p-8">
        <Link
          href="/register"
          className="flex items-center gap-2 text-lg font-bold text-slate-900"
        >
          <span className="rounded-lg bg-orange-500 p-2 text-white">
            <Truck size={19} />
          </span>
          Truck<span className="text-orange-500">Lagbe</span>
        </Link>

        <p className="mt-8 text-sm font-semibold text-orange-600">
          CUSTOMER ACCOUNT
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Create your account
        </h1>

        <p className="mt-3 text-slate-500">
          Save your details to book and manage deliveries.
        </p>

        {message && (
          <div className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {message}
          </div>
        )}

        <form onSubmit={submit} className="mt-8 space-y-5">
          <Input
            name="name"
            label="Full name"
            icon={<UserRound size={19} />}
            placeholder="Your full name"
          />

          <Input
            name="phone"
            label="Phone number"
            type="tel"
            icon={<Phone size={19} />}
            placeholder="+880 1XXX-XXXXXX"
          />

          <Input
            name="email"
            label="Email address"
            type="email"
            icon={<Mail size={19} />}
            placeholder="you@example.com"
          />

          <Input
            name="password"
            label="Password"
            type="password"
            icon={<Lock size={19} />}
            placeholder="At least 8 characters"
            minLength={8}
          />

          <label className="flex items-start gap-2 text-sm text-slate-500">
            <input
              required
              type="checkbox"
              className="mt-1 h-4 w-4 accent-orange-500"
            />
            I agree to the Terms of Service and Privacy Policy.
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 py-3.5 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create account"}
            <Truck size={19} />
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

function Input({
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
  placeholder: string;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <span className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-3 text-slate-400 focus-within:border-orange-500">
        {icon}
        <input
          required
          name={name}
          type={type}
          minLength={minLength}
          placeholder={placeholder}
          className="w-full text-sm text-slate-800 outline-none"
        />
      </span>
    </label>
  );
}
