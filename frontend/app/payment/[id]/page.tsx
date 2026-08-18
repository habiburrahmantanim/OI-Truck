"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useBooking } from "@/context/BookingContext";

type PaymentMethod = "card" | "mobile-banking" | "cash";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();

  const { bookings } = useBooking();

  const bookingId = Array.isArray(params.id) ? params.id[0] : String(params.id);

  const booking = bookings.find((item) => String(item.id) === bookingId);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("mobile-banking");

  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success"
  >("idle");

  const [error, setError] = useState("");

  /* --------------------------------
     BOOKING NOT FOUND
  -------------------------------- */

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
              💳
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Booking Not Found
            </h1>

            <p className="mt-2 text-gray-500">
              We could not find this booking.
            </p>

            <button
              onClick={() => router.push("/bookings")}
              className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              Back to My Bookings
            </button>
          </div>
        </main>
      </div>
    );
  }

  const total = Number(booking.price) || 0;

  /* --------------------------------
     PAYMENT SUBMIT
  -------------------------------- */

  function handlePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (paymentMethod === "mobile-banking" && phone.trim().length < 10) {
      setError("Please enter a valid mobile banking number.");
      return;
    }

    if (paymentMethod === "card") {
      if (cardNumber.replace(/\s/g, "").length < 12) {
        setError("Please enter a valid card number.");
        return;
      }

      if (!expiry.trim()) {
        setError("Please enter the card expiry date.");
        return;
      }

      if (cvv.trim().length < 3) {
        setError("Please enter a valid CVV.");
        return;
      }
    }

    setPaymentStatus("processing");

    /*
      Temporary frontend payment simulation.

      Later this should call:

      POST /api/payments

      and the backend should communicate
      with the actual payment gateway.
    */

    setTimeout(() => {
      setPaymentStatus("success");
    }, 1500);
  }

  /* --------------------------------
     SUCCESS
  -------------------------------- */

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
              ✓
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-green-600">
              Payment Successful
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Payment Completed
            </h1>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Your payment for booking #{booking.id} has been processed
              successfully.
            </p>

            <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-gray-50 p-5 text-left">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking</span>

                <span className="font-semibold">#{booking.id}</span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="text-gray-500">Amount</span>

                <span className="font-bold">৳{total.toLocaleString()}</span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="text-gray-500">Method</span>

                <span className="font-semibold">
                  {paymentMethod === "card"
                    ? "Card"
                    : paymentMethod === "mobile-banking"
                      ? "Mobile Banking"
                      : "Cash"}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => router.push(`/bookings/${booking.id}`)}
                className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                View Booking
              </button>

              <button
                onClick={() => router.push("/bookings")}
                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                My Bookings
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* --------------------------------
            HEADER
        -------------------------------- */}

        <div className="mb-8">
          <button
            onClick={() => router.push(`/bookings/${booking.id}`)}
            className="mb-4 text-sm font-semibold text-gray-500 hover:text-black"
          >
            ← Back to Booking
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>

          <p className="mt-2 text-gray-500">
            Complete your payment for booking #{booking.id}.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* =====================================
              PAYMENT FORM
          ===================================== */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>

            {/* Payment Methods */}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <PaymentMethodButton
                active={paymentMethod === "mobile-banking"}
                icon="📱"
                title="Mobile Banking"
                onClick={() => setPaymentMethod("mobile-banking")}
              />

              <PaymentMethodButton
                active={paymentMethod === "card"}
                icon="💳"
                title="Card"
                onClick={() => setPaymentMethod("card")}
              />

              <PaymentMethodButton
                active={paymentMethod === "cash"}
                icon="💵"
                title="Cash"
                onClick={() => setPaymentMethod("cash")}
              />
            </div>

            <form onSubmit={handlePayment} className="mt-8">
              {/* Mobile Banking */}

              {paymentMethod === "mobile-banking" && (
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Mobile Banking Number
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  />

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-gray-50 p-4 text-center font-semibold">
                      bKash
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4 text-center font-semibold">
                      Nagad
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4 text-center font-semibold">
                      Rocket
                    </div>
                  </div>
                </div>
              )}

              {/* Card */}

              {paymentMethod === "card" && (
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Card Number
                    </label>

                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(event) => setCardNumber(event.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Expiry Date
                      </label>

                      <input
                        type="text"
                        value={expiry}
                        onChange={(event) => setExpiry(event.target.value)}
                        placeholder="MM/YY"
                        className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        CVV
                      </label>

                      <input
                        type="password"
                        value={cvv}
                        onChange={(event) => setCvv(event.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cash */}

              {paymentMethod === "cash" && (
                <div className="rounded-xl bg-gray-50 p-5">
                  <div className="text-3xl">💵</div>

                  <h3 className="mt-3 font-bold text-gray-900">Cash Payment</h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    You can pay the driver in cash when the delivery is
                    completed.
                  </p>
                </div>
              )}

              {/* Error */}

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={paymentStatus === "processing"}
                className="mt-7 w-full rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paymentStatus === "processing"
                  ? "Processing Payment..."
                  : paymentMethod === "cash"
                    ? "Confirm Cash Payment"
                    : `Pay ৳${total.toLocaleString()}`}
              </button>

              <p className="mt-4 text-center text-xs text-gray-400">
                Payment processing will be connected to the real payment gateway
                in the backend.
              </p>
            </form>
          </section>

          {/* =====================================
              ORDER SUMMARY
          ===================================== */}

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Booking Summary
              </h2>

              <div className="mt-6 space-y-5">
                <SummaryRow label="Booking ID" value={`#${booking.id}`} />

                <SummaryRow
                  label="Vehicle"
                  value={String(booking.vehicleType)}
                />

                <SummaryRow
                  label="Pickup"
                  value={String(booking.pickupLocation)}
                />

                <SummaryRow
                  label="Destination"
                  value={String(booking.deliveryLocation)}
                />

                <div className="border-t border-gray-100 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total</span>

                    <span className="text-2xl font-bold text-gray-900">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-black p-6 text-white">
              <div className="text-2xl">🔒</div>

              <h3 className="mt-3 font-bold">Secure Payment</h3>

              <p className="mt-2 text-sm leading-6 text-gray-300">
                Your payment information will be securely processed when the
                real payment gateway is connected.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ============================================
   PAYMENT METHOD BUTTON
============================================ */

function PaymentMethodButton({
  active,
  icon,
  title,
  onClick,
}: {
  active: boolean;
  icon: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? "border-black bg-black text-white"
          : "border-gray-200 bg-white text-gray-900 hover:border-gray-400"
      }`}
    >
      <div className="text-xl">{icon}</div>

      <p className="mt-2 text-sm font-semibold">{title}</p>
    </button>
  );
}

/* ============================================
   SUMMARY ROW
============================================ */

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}
