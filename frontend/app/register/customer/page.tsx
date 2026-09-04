"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Mail, Phone, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError("Please complete all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name,
        email,
        phone,
        password,
        role: "customer",
      });

      router.push("/login?registered=customer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <UserRound size={28} />
            </div>

            <p className="mt-6 text-sm font-semibold text-orange-600">
              CUSTOMER ACCOUNT
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Start booking trucks and managing your deliveries.
            </p>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <Field
                label="Full Name"
                icon={<UserRound size={18} />}
                value={name}
                onChange={setName}
                placeholder="Enter your full name"
              />

              <Field
                label="Email Address"
                type="email"
                icon={<Mail size={18} />}
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
              />

              <Field
                label="Phone Number"
                type="tel"
                icon={<Phone size={18} />}
                value={phone}
                onChange={setPhone}
                placeholder="01XXXXXXXXX"
              />

              <PasswordField
                label="Password"
                value={password}
                onChange={setPassword}
              />

              <PasswordField
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-orange-500 px-5 py-3.5 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Customer Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-orange-600">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required
          className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
        />
      </div>
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
      />
    </label>
  );
}
