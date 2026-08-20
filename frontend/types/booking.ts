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

export type PaymentMethod =
  | "bKash"
  | "Nagad"
  | "Card"
  | "Cash";

export interface Booking {
  /* =========================================
     BASIC BOOKING
  ========================================= */

  id: string;

  bookingId?: string;

  status: BookingStatus;

  /* =========================================
     CUSTOMER
  ========================================= */

  customerName: string;

  customerPhone?: string;

  phone?: string;

  customerEmail?: string;

  /* =========================================
     LOCATION
  ========================================= */

  pickupLocation: string;

  deliveryLocation: string;

  dropLocation?: string;

  /* =========================================
     VEHICLE
  ========================================= */

  vehicleType: string;

  vehicleName?: string;

  truckNumber?: string;

  truckCapacity?: string;

  vehicleId?: number | string;

  /* =========================================
     SCHEDULE
  ========================================= */

  date?: string;

  time?: string;

  /* =========================================
     FARE
  ========================================= */

  price: number;

  estimatedFare?: number;

  totalPrice?: number;

  /* =========================================
     PAYMENT
  ========================================= */

  paymentStatus: PaymentStatus;

  paymentMethod?: PaymentMethod;

  paymentId?: string;

  /* =========================================
     DRIVER
  ========================================= */

  driverName?: string;

  driverPhone?: string;

  driverId?: string;

  /* =========================================
     ADDITIONAL
  ========================================= */

  notes?: string;

  createdAt?: string;

  updatedAt?: string;
}