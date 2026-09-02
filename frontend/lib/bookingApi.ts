import { api } from "@/lib/api";

import { Booking, CreateBookingData } from "@/types/booking";

interface DjangoBooking {
  id: number;
  booking_id: string;

  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;

  pickup_location: string;
  delivery_location: string;

  vehicle_type: string;
  vehicle_name?: string | null;
  truck_number?: string | null;
  truck_capacity?: string | null;

  booking_date: string;
  booking_time: string;

  notes?: string | null;

  price: string | number;

  status: Booking["status"];

  payment_status: Booking["paymentStatus"];
  payment_method?: Booking["paymentMethod"] | null;

  created_at: string;
  updated_at: string;
}

function mapBooking(booking: DjangoBooking): Booking {
  return {
    id: booking.id,
    bookingId: booking.booking_id,

    customerName: booking.customer_name,
    customerPhone: booking.customer_phone,
    customerEmail: booking.customer_email || undefined,

    pickupLocation: booking.pickup_location,
    deliveryLocation: booking.delivery_location,

    vehicleType: booking.vehicle_type,
    vehicleName: booking.vehicle_name || undefined,
    truckNumber: booking.truck_number || undefined,
    truckCapacity: booking.truck_capacity || undefined,

    bookingDate: booking.booking_date,
    bookingTime: booking.booking_time,

    notes: booking.notes || undefined,

    price: Number(booking.price),

    status: booking.status,

    paymentStatus: booking.payment_status,
    paymentMethod: booking.payment_method || undefined,

    createdAt: booking.created_at,
    updatedAt: booking.updated_at,
  };
}

export async function getBookings(token: string): Promise<Booking[]> {
  const response = await api.get<DjangoBooking[]>("/bookings/", token);

  return response.map(mapBooking);
}

export async function getBooking(id: number, token: string): Promise<Booking> {
  const response = await api.get<DjangoBooking>(`/bookings/${id}/`, token);

  return mapBooking(response);
}

export async function createBooking(
  data: CreateBookingData,
  token: string,
): Promise<Booking> {
  const response = await api.post<DjangoBooking>("/bookings/", data, token);

  return mapBooking(response);
}

export async function updateBooking(
  id: number,
  data: Partial<CreateBookingData>,
  token: string,
): Promise<Booking> {
  const response = await api.patch<DjangoBooking>(
    `/bookings/${id}/`,
    data,
    token,
  );

  return mapBooking(response);
}

export async function deleteBooking(id: number, token: string): Promise<void> {
  await api.delete(`/bookings/${id}/`, token);
}
