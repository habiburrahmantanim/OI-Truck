import { User } from "@/types/user";

export const initialUsers: User[] = [
  {
    id: "user-admin-001",
    name: "OI-Truck Admin",
    email: "admin@trucklagbe.com",
    phone: "01700000000",
    password: "admin123",
    role: "admin",
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },

  {
    id: "user-customer-001",
    name: "Demo Customer",
    email: "customer@trucklagbe.com",
    phone: "01800000000",
    password: "customer123",
    role: "customer",
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },

  {
    id: "user-driver-001",
    name: "Rahim Ahmed",
    email: "driver@trucklagbe.com",
    phone: "01900000000",
    password: "driver123",
    role: "driver",
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];