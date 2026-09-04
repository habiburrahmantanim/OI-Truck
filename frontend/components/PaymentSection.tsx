"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createPayment } from "@/lib/paymentApi";
import { PaymentMethod } from "@/types/booking";

interface PaymentSectionProps {
  bookingId: number;
  amount: number;
  onPaymentSuccess?: () => void;
}

export default function PaymentSection({
  bookingId,
  amount,
  onPaymentSuccess,
}: PaymentSectionProps) {
  const { accessToken } = useAuth();

  const [method, setMethod] = useState<PaymentMethod>("bKash");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    if (!accessToken) {
      setMessage("Please login first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payment = await createPayment(
        {
          booking: bookingId,
          method,
          status: "Pending",
        },
        accessToken,
      );

      setMessage(`Payment created: ${payment.transaction_id}`);

      onPaymentSuccess?.();
    } catch (error) {
      console.error(error);

      setMessage(error instanceof Error ? error.message : "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 rounded-xl border p-6">
      <div>
        <h2 className="text-xl font-semibold">Payment</h2>

        <p className="text-sm text-gray-500">Amount: ৳{amount}</p>
      </div>

      <div className="space-y-2">
        <label className="font-medium">Payment Method</label>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as PaymentMethod)}
          className="w-full rounded-lg border p-3"
        >
          <option value="bKash">bKash</option>
          <option value="Nagad">Nagad</option>
          <option value="Card">Card</option>
          <option value="Cash">Cash</option>
        </select>
      </div>

      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className="w-full rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
