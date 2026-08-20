"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import { useBooking } from "@/context/BookingContext";
import RouteGuard from "@/components/auth/RouteGuard";

type PaymentMethod = "bKash" | "Nagad" | "Card" | "Cash";

export default function PaymentPage() {
  return (
    <RouteGuard role="customer">
      <PaymentContent />
    </RouteGuard>
  );
}

function PaymentContent() {
  const router = useRouter();
  const params = useParams();

  const { bookings, isLoaded, updateBooking } = useBooking();

  const [bookingId, setBookingId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bKash");

  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  /* =========================================
     GET BOOKING ID
  ========================================= */

  useEffect(() => {
    if (!params?.id) return;

    const id = Array.isArray(params.id) ? params.id[0] : String(params.id);

    setBookingId(id);
  }, [params]);

  /* =========================================
     FIND BOOKING
  ========================================= */

  const booking = bookings.find(
    (item) =>
      String(item.id) === bookingId || String(item.bookingId) === bookingId,
  );

  /* =========================================
     LOADING
  ========================================= */

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-5xl px-4 py-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="mt-4 text-sm text-gray-500">Loading payment...</p>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================
     BOOKING NOT FOUND
  ========================================= */

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
              💳
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Booking Not Found
            </h1>

            <p className="mt-2 text-gray-500">
              We couldn't find booking #{bookingId}.
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

  /* =========================================
     PRICE
  ========================================= */

  const price = Number(booking.price || 0);

  /* =========================================
     ALREADY PAID
  ========================================= */

  if (booking.paymentStatus === "Paid") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-xl px-4 py-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
              ✓
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Payment Already Completed
            </h1>

            <p className="mt-2 text-gray-500">
              This booking has already been paid.
            </p>

            <div className="mt-6 rounded-xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Booking ID</p>

              <p className="mt-1 font-bold text-gray-900">#{booking.id}</p>

              <p className="mt-4 text-sm text-gray-500">Amount</p>

              <p className="mt-1 text-2xl font-bold text-green-600">
                ৳{price.toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => router.push(`/bookings/${booking.id}`)}
              className="mt-6 w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              View Booking
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================
     PAYMENT
  ========================================= */

  function handlePayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    /* -----------------------------
       VALIDATION
    ----------------------------- */

    if (paymentMethod === "bKash") {
      if (!phone.trim()) {
        setError("Please enter your bKash phone number.");
        return;
      }

      if (phone.trim().length < 11) {
        setError("Please enter a valid phone number.");
        return;
      }
    }

    if (paymentMethod === "Nagad") {
      if (!phone.trim()) {
        setError("Please enter your Nagad phone number.");
        return;
      }

      if (phone.trim().length < 11) {
        setError("Please enter a valid phone number.");
        return;
      }
    }

    if (paymentMethod === "Card") {
      if (!cardNumber.trim()) {
        setError("Please enter your card number.");
        return;
      }

      if (!cardName.trim()) {
        setError("Please enter the card holder name.");
        return;
      }

      if (cardNumber.replace(/\s/g, "").length < 12) {
        setError("Please enter a valid card number.");
        return;
      }
    }

    /* =====================================
       START PAYMENT
    ===================================== */

    setProcessing(true);

    /*
      This is a FRONTEND DEMO payment.

      Later, replace this section with
      your real payment gateway/API.
    */

    setTimeout(() => {
      const paymentId = `PAY-${Date.now()}`;

      updateBooking({
        ...booking,

        paymentStatus: "Paid",

        paymentMethod,

        paymentId,

        updatedAt: new Date().toISOString(),
      });

      setProcessing(false);
      setSuccess(true);

      /*
        Give React/localStorage a moment
        to update before navigation.
      */

      setTimeout(() => {
        router.push(`/bookings/${booking.id}`);
      }, 1200);
    }, 1500);
  }

  /* =========================================
     SUCCESS SCREEN
  ========================================= */

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-xl px-4 py-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
              ✓
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Payment Successful
            </h1>

            <p className="mt-2 text-gray-500">
              Your payment has been completed successfully.
            </p>

            <div className="mt-6 rounded-xl bg-green-50 p-5">
              <p className="text-sm text-green-700">Amount Paid</p>

              <p className="mt-1 text-3xl font-bold text-green-700">
                ৳{price.toLocaleString()}
              </p>

              <p className="mt-3 text-sm text-green-700">
                Booking #{booking.id}
              </p>
            </div>

            <p className="mt-6 text-sm text-gray-400">
              Redirecting to your booking...
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================
     MAIN PAYMENT PAGE
  ========================================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push(`/bookings/${booking.id}`)}
            className="mb-5 text-sm font-semibold text-gray-500 transition hover:text-black"
          >
            ← Back to Booking
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>

          <p className="mt-2 text-gray-500">
            Pay for your truck booking securely.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* =====================================
              PAYMENT FORM
          ===================================== */}

          <form onSubmit={handlePayment} className="space-y-6 lg:col-span-2">
            {/* PAYMENT METHOD */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Payment Method
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {/* BKASH */}

                <PaymentMethodButton
                  active={paymentMethod === "bKash"}
                  onClick={() => setPaymentMethod("bKash")}
                  icon=" "
                  title="bKash"
                />

                {/* NAGAD */}

                <PaymentMethodButton
                  active={paymentMethod === "Nagad"}
                  onClick={() => setPaymentMethod("Nagad")}
                  icon="📱"
                  title="Nagad"
                />

                {/* CARD */}

                <PaymentMethodButton
                  active={paymentMethod === "Card"}
                  onClick={() => setPaymentMethod("Card")}
                  icon="💳"
                  title="Card"
                />
              </div>
            </section>

            {/* MOBILE PAYMENT */}

            {(paymentMethod === "bKash" || paymentMethod === "Nagad") && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  {paymentMethod} Payment
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Enter the mobile number associated with your {paymentMethod}{" "}
                  account.
                </p>

                <div className="mt-6">
                  <label className="text-sm font-semibold text-gray-700">
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </section>
            )}

            {/* CARD PAYMENT */}

            {paymentMethod === "Card" && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  Card Information
                </h2>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Card Holder Name
                    </label>

                    <input
                      type="text"
                      value={cardName}
                      onChange={(event) => setCardName(event.target.value)}
                      placeholder="John Doe"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Card Number
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(event) => setCardNumber(event.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* PAY BUTTON */}

            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-xl bg-black px-5 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing
                ? "Processing Payment..."
                : `Pay ৳${price.toLocaleString()}`}
            </button>

            <p className="text-center text-xs leading-5 text-gray-400">
              This is currently a frontend payment simulation. Connect a real
              payment gateway before using this in production.
            </p>
          </form>

          {/* =====================================
              ORDER SUMMARY
          ===================================== */}

          <aside>
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Booking Summary
              </h2>

              <div className="mt-6 space-y-5">
                <SummaryItem label="Booking ID" value={`#${booking.id}`} />

                <SummaryItem label="Vehicle" value={booking.vehicleType} />

                <SummaryItem label="Pickup" value={booking.pickupLocation} />

                <SummaryItem
                  label="Destination"
                  value={booking.deliveryLocation}
                />

                <SummaryItem
                  label="Pickup Date"
                  value={booking.date || "Not specified"}
                />

                <SummaryItem
                  label="Pickup Time"
                  value={booking.time || "Not specified"}
                />

                <div className="border-t border-gray-100 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Total</span>

                    <span className="text-2xl font-bold text-gray-900">
                      ৳{price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
  onClick,
  icon,
  title,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? "border-black bg-gray-50 ring-2 ring-black"
          : "border-gray-200 hover:border-gray-400"
      }`}
    >
      <div className="text-2xl">{icon}</div>

      <p className="mt-2 font-semibold text-gray-900">{title}</p>

      {active && (
        <p className="mt-1 text-xs font-medium text-green-600">Selected</p>
      )}
    </button>
  );
}

/* ============================================
   SUMMARY ITEM
============================================ */

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}
