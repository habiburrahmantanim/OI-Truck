export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Driver Assigned"
  | "On The Way"
  | "Completed"
  | "Cancelled";

export interface Booking {
  id: string;

  // Customer
  customerName: string;
  phone: string;

  // Locations
  pickupLocation: string;
  deliveryLocation: string;

  // Cargo
  cargoType: string;
  weight: number;

  // Truck
  truckId: number;
  truckName: string;
  truckCapacity: string;

  // Booking
  pickupDate: string;
  pickupTime?: string;
  createdAt: string;

  // Payment
  baseFare: number;
  serviceFee: number;
  totalPrice: number;

  // Status
  status: BookingStatus;
}