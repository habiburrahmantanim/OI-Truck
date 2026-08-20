"use client";

import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Truck } from "lucide-react";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { dashboardFor } from "@/components/auth/RouteGuard";

function LoginScreenSpinner() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

        <p className="mt-4 text-sm font-medium text-slate-500">Loading...</p>
      </div>
    </main>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, isLoaded } = useAuth();

  const nextParam = searchParams.get("next");

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Bounce already-authenticated users to their intended page or dashboard.
  useEffect(() => {
    if (isLoaded && user) {
      router.replace(nextParam || dashboardFor(user.role));
    }
  }, [isLoaded, user, nextParam, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    const result = login(email, password);

    if (!result.success || !result.user) {
      setMessage(result.message || "Unable to log in. Please try again.");
      setSubmitting(false);
      return;
    }

    router.replace(nextParam || dashboardFor(result.user.role));
  }

  // Avoid flashing the form while loading or before the bounce redirect fires.
  if (!isLoaded || user) {
    return <LoginScreenSpinner />;
  }

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      <section className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold">
          <span className="rounded-lg bg-orange-500 p-2.5">
            <Truck size={25} />
          </span>
          Truck<span className="text-orange-400">Lagbe</span>
        </Link>

        <div className="max-w-lg">
          <p className="text-sm font-semibold text-orange-400">WELCOME BACK</p>

          <h1 className="mt-4 text-5xl font-bold leading-tight">
            Log in and keep your deliveries moving.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Manage customer bookings or continue to your approved driver
            workspace.
          </p>
        </div>

        <p className="text-sm text-slate-500">TruckLagbe logistics platform</p>
      </section>

      <section className="flex min-h-screen items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 flex items-center gap-2 text-xl font-bold text-slate-900 lg:hidden"
          >
            <span className="rounded-lg bg-orange-500 p-2 text-white">
              <Truck size={20} />
            </span>
            Truck<span className="text-orange-500">Lagbe</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-600"
          >
            <ArrowLeft size={17} />
            Back to home
          </Link>

          <p className="mt-9 text-sm font-semibold text-orange-600">
            ACCOUNT ACCESS
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Log in to your account
          </h2>

          <p className="mt-3 text-slate-500">
            Enter the email and password you registered with.
          </p>

          {message && (
            <div className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </span>

              <span className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-3.5 text-slate-400 focus-within:border-orange-500">
                <Mail size={19} />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full text-slate-800 outline-none"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                Password
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="cursor-not-allowed text-xs text-slate-400"
                >
                  Forgot password? (coming soon)
                </button>
              </span>

              <span className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-3.5 text-slate-400 focus-within:border-orange-500">
                <Lock size={19} />
                <input
                  required
                  name="password"
                  type={showPassword ? "text" : "password"}
                  minLength={8}
                  placeholder="Your password"
                  className="w-full text-slate-800 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </span>
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" className="h-4 w-4 accent-orange-500" />
              Remember me
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 py-3.5 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Logging in..." : "Log in"}
              <Truck size={18} />
            </button>
          </form>

          <div className="mt-7 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
            New to TruckLagbe?{" "}
            <Link href="/register" className="font-semibold text-orange-600">
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginScreenSpinner />}>
      <LoginForm />
    </Suspense>
  );
}
