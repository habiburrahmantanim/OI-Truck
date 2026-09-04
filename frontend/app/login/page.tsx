"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Truck } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();

  const { user, login, isLoaded } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /*
   * Redirect already logged-in users
   */
  useEffect(() => {
    if (!isLoaded || !user) return;

    redirectByRole(user.role);
  }, [user, isLoaded]);

  function redirectByRole(role: string) {
    switch (role) {
      case "admin":
        router.replace("/admin");
        break;

      case "driver":
        router.replace("/driver");
        break;

      case "customer":
      default:
        router.replace("/profile");
        break;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
      </div>
    );
  }

  /*
   * Don't show login form while redirecting
   */
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />

          <p className="mt-4 text-sm text-slate-500">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Truck size={22} />
            </span>
            OI-Truck
          </Link>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Login to manage your truck bookings.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 px-5 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/register/customer"
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-orange-700">
            Demo accounts
          </p>

          <div className="mt-3 space-y-2 text-xs text-slate-600">
            <p>
              <strong>Admin:</strong> admin@trucklagbe.com / admin123
            </p>

            <p>
              <strong>Customer:</strong> customer@trucklagbe.com / customer123
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
