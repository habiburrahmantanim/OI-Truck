export type UserRole = "customer" | "driver" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;

  role: UserRole;

  avatar?: string;

  isActive: boolean;

  createdAt: string;
}