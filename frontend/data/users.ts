import { User } from "@/types/user";

export const initialUsers: User[] = [
  {
    id: "admin-001",
    name: "System Admin",
    email: "admin@trucklagbe.com",
    phone: "01700000000",
    password: "admin123",
    role: "admin",
    isActive: true,
    createdAt: new Date().toISOString(),
  },

  {
    id: "customer-001",
    name: "Demo Customer",
    email: "customer@trucklagbe.com",
    phone: "01800000000",
    password: "customer123",
    role: "customer",
    isActive: true,
    createdAt: new Date().toISOString(),
  },

  {
    id: "user-driver-001",
    name: "Demo Driver",
    email: "driver@trucklagbe.com",
    phone: "01911111111",
    password: "driver123",
    role: "driver",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];