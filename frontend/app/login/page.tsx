"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Truck, User } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 2500);
  }

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <section className="hidden relative overflow-hidden bg-slate-950 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-slate-950" />

        <Link
          href="/"
          className="relative z-10 flex items-center gap-3 text-2xl font-bold text-white"
        >
          <div className="rounded-xl bg-orange-500 p-2.5">
            <Truck size={26} />
          </div>
          Truck<span className="text-orange-500">Lagbe</span>
        </Link>

        <div className="relative z-10 max-w-lg">
          <div className="mb-6 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300">
            Reliable Logistics, Made Simple
          </div>

          <h1 className="text-5xl font-bold leading-tight text-white">
            Move your goods
            <span className="block text-orange-500">with confidence.</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Book reliable trucks, track your deliveries and manage all your
            transportation needs from one place.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Easy and fast truck booking",
              "Track your delivery in real-time",
              "Manage all bookings in one dashboard",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-slate-300"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  ✓
                </div>

                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-500">
          © 2026 TruckLagbe. All rights reserved.
        </p>
      </section>

      {/* RIGHT SIDE */}
      <section className="flex min-h-screen items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md">
          {/* MOBILE LOGO */}
          <Link
            href="/"
            className="mb-10 flex items-center gap-2 text-2xl font-bold text-slate-900 lg:hidden"
          >
            <div className="rounded-xl bg-orange-500 p-2 text-white">
              <Truck size={22} />
            </div>
            Truck<span className="text-orange-500">Lagbe</span>
          </Link>

          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-500"
          >
            <ArrowLeft size={18} />
            Back to home
          </Link>

          {/* HEADING */}
          <div>
            <p className="font-semibold text-orange-500">
              {isLogin ? "WELCOME BACK" : "GET STARTED"}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {isLogin ? "Login to your account" : "Create your account"}
            </h2>

            <p className="mt-3 text-slate-500">
              {isLogin
                ? "Enter your details to manage your bookings."
                : "Create an account and start booking trucks easily."}
            </p>
          </div>

          {/* SUCCESS MESSAGE */}
          {submitted && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              {isLogin
                ? "Login successful! Redirecting..."
                : "Account created successfully!"}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5 transition focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100">
                  <User size={20} className="text-slate-400" />

                  <input
                    required
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full outline-none"
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5 transition focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100">
                <Mail size={20} className="text-slate-400" />

                <input
                  required
                  type="email"
                  placeholder="example@email.com"
                  className="w-full outline-none"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>

                {isLogin && (
                  <button
                    type="button"
                    className="text-xs font-semibold text-orange-500 hover:text-orange-600"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5 transition focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100">
                <Lock size={20} className="text-slate-400" />

                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* REMEMBER */}
            {isLogin && (
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="h-4 w-4 accent-orange-500" />
                Remember me
              </label>
            )}

            {/* TERMS */}
            {!isLogin && (
              <label className="flex items-start gap-2 text-sm leading-6 text-slate-500">
                <input
                  required
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-orange-500"
                />

                <span>I agree to the Terms of Service and Privacy Policy.</span>
              </label>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-bold text-white transition hover:bg-orange-600 active:scale-[0.98]"
            >
              {isLogin ? "Login" : "Create Account"}
              <Truck size={19} />
            </button>
          </form>

          {/* DIVIDER */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* SOCIAL LOGIN UI */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 font-bold">
              G
            </span>
            Continue with Google
          </button>

          {/* SWITCH */}
          <p className="mt-8 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setSubmitted(false);
              }}
              className="ml-2 font-bold text-orange-500 hover:text-orange-600"
            >
              {isLogin ? "Create Account" : "Login"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
