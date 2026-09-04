import { apiFetch } from "@/lib/api";
import { Payment, PaymentMethod, PaymentStatus } from "@/types/booking";

export interface CreatePaymentData {
  booking: number;
  method: PaymentMethod;
  status?: PaymentStatus;
}

export async function createPayment(
  data: CreatePaymentData,
  token: string,
): Promise<Payment> {
  return apiFetch<Payment>("/payments/", {
    method: "POST",
    token,
    body: JSON.stringify({
      booking: data.booking,
      method: data.method,
      status: data.status ?? "Pending",
    }),
  });
}

export async function getPayments(token: string): Promise<Payment[]> {
  return apiFetch<Payment[]>("/payments/", {
    method: "GET",
    token,
  });
}

export async function getPayment(id: number, token: string): Promise<Payment> {
  return apiFetch<Payment>(`/payments/${id}/`, {
    method: "GET",
    token,
  });
}
