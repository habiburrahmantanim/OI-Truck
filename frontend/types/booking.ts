export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Driver Assigned"
  | "Assigned"
  | "On the Way"
  | "Picked Up"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

export interface Booking {
  id: string;
  /** Compatibility fields kept while older operation screens migrate to the canonical names. */
  bookingId: string;

  // Customer
  customerName: string;
  phone: string;
  customerPhone: string;

  // Locations
  pickupLocation: string;
  deliveryLocation: string;
  dropLocation: string;

  // Schedule
  pickupDate: string;
  pickupTime: string;

  // Cargo
  cargoType: string;
  weight: number;

  // Truck
  truckId: number;
  truckName: string;
  truckCapacity: string;

  // Driver
  driverId?: string;
  driverName?: string;
  driverPhone?: string;

  // Price
  baseFare: number;
  serviceFee: number;
  discount: number;
  totalPrice: number;
  estimatedFare: number;

  // Payment
  paymentMethod?: string;
  paymentStatus?: "Pending" | "Paid" | "Failed";

  // Booking
  status: BookingStatus;

  createdAt: string;
}
