import { Driver } from "@/types/driver";

export const initialDrivers: Driver[] = [
  {
    id: "driver-001",

    userId: "driver-user-001",

    name: "Rahim Ahmed",
    email: "rahim@example.com",
    phone: "01900000000",

    licenseNumber: "DL-DHA-123456",
    licenseExpiry: "2030-12-31",

    nationalId: "1234567890",

    vehicleType: "Covered Van",
    vehicleNumber: "DHAKA METRO-TA-1234",

    experienceYears: 5,

    status: "approved",
    availability: "available",

    rating: 4.8,
    totalTrips: 125,
    totalEarnings: 250000,

    documentsSubmitted: true,

    createdAt: new Date().toISOString(),
  },

  {
    id: "driver-002",

    userId: "driver-user-002",

    name: "Karim Hasan",
    email: "karim@example.com",
    phone: "01600000000",

    licenseNumber: "DL-DHA-654321",
    licenseExpiry: "2029-10-15",

    nationalId: "9876543210",

    vehicleType: "Pickup Truck",
    vehicleNumber: "DHAKA METRO-TA-5678",

    experienceYears: 3,

    status: "pending",
    availability: "offline",

    rating: 0,
    totalTrips: 0,
    totalEarnings: 0,

    documentsSubmitted: true,

    createdAt: new Date().toISOString(),
  },
];