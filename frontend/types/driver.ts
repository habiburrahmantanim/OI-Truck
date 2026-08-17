export type DriverStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

export type DriverAvailability =
  | "available"
  | "busy"
  | "offline";

export interface Driver {
  id: string;

  userId: string;

  name: string;
  email: string;
  phone: string;

  licenseNumber: string;
  licenseExpiry: string;

  nationalId?: string;

  vehicleType: string;
  vehicleNumber: string;

  experienceYears: number;

  status: DriverStatus;
  availability: DriverAvailability;

  rating: number;
  totalTrips: number;
  totalEarnings: number;

  documentsSubmitted: boolean;

  createdAt: string;
}