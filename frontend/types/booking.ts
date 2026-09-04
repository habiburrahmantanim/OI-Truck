export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Accepted"
  | "In Transit"
  | "Completed"
  | "Cancelled";

export type PaymentStatus =
  | "Unpaid"
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refunded";

export type PaymentMethod = "bKash" | "Nagad" | "Card" | "Cash";

export interface Booking {
  id: number;
  bookingId: string;

  customerName: string;
  customerPhone: string;
  customerEmail?: string;

  pickupLocation: string;
  deliveryLocation: string;

  vehicleType: string;
  vehicleName?: string;
  truckNumber?: string;
  truckCapacity?: string;

  bookingDate: string;
  bookingTime: string;

  notes?: string;

  price: number;

  status: BookingStatus;

  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;

  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;

  pickup_location: string;
  delivery_location: string;

  vehicle_type: string;
  vehicle_name?: string;
  truck_number?: string;
  truck_capacity?: string;

  booking_date: string;
  booking_time: string;

  notes?: string;

  price: number;

  payment_method?: PaymentMethod;
}

export type PaymentStatus =
  | "Unpaid"
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refunded";

export type PaymentMethod = "bKash" | "Nagad" | "Card" | "Cash";

export interface Payment {
  id: number;
  booking: number;
  booking_id: string;
  transaction_id: string;
  amount: string;
  method: PaymentMethod;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}