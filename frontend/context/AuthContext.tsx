"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { User, UserRole } from "@/types/user";
import { initialUsers } from "@/data/users";

interface AuthContextType {
  user: User | null;
  users: User[];
  isLoaded: boolean;

  login: (
    email: string,
    password: string,
  ) => {
    success: boolean;
    message?: string;
    user?: User;
  };

  register: (userData: Omit<User, "id" | "createdAt" | "isActive">) => {
    success: boolean;
    message?: string;
    user?: User;
  };

  logout: () => void;

  updateUser: (updatedUser: User) => void;

  getUsersByRole: (role: UserRole) => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>(initialUsers);

  const [isLoaded, setIsLoaded] = useState(false);

  /* LOAD DATA */

  useEffect(() => {
    const savedUsers = localStorage.getItem("trucklagbe_users");

    const savedUser = localStorage.getItem("trucklagbe_current_user");

    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error("Failed to load users", error);
      }
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to load current user", error);
      }
    }

    setIsLoaded(true);
  }, []);

  /* SAVE USERS */

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("trucklagbe_users", JSON.stringify(users));
  }, [users, isLoaded]);

  /* LOGIN */

  function login(email: string, password: string) {
    const foundUser = users.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password,
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    if (!foundUser.isActive) {
      return {
        success: false,
        message: "Your account is currently inactive.",
      };
    }

    setUser(foundUser);

    localStorage.setItem("trucklagbe_current_user", JSON.stringify(foundUser));

    return {
      success: true,
      user: foundUser,
    };
  }

  /* REGISTER */

  function register(userData: Omit<User, "id" | "createdAt" | "isActive">) {
    const exists = users.some(
      (item) => item.email.toLowerCase() === userData.email.toLowerCase(),
    );

    if (exists) {
      return {
        success: false,
        message: "This email is already registered.",
      };
    }

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setUsers((previousUsers) => [...previousUsers, newUser]);

    return {
      success: true,
      message: "Registration successful.",
      user: newUser,
    };
  }

  /* LOGOUT */

  function logout() {
    setUser(null);

    localStorage.removeItem("trucklagbe_current_user");
  }

  /* UPDATE USER */

  function updateUser(updatedUser: User) {
    setUsers((previousUsers) =>
      previousUsers.map((item) =>
        item.id === updatedUser.id ? updatedUser : item,
      ),
    );

    if (user?.id === updatedUser.id) {
      setUser(updatedUser);

      localStorage.setItem(
        "trucklagbe_current_user",
        JSON.stringify(updatedUser),
      );
    }
  }

  function getUsersByRole(role: UserRole) {
    return users.filter((item) => item.role === role);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isLoaded,
        login,
        register,
        logout,
        updateUser,
        getUsersByRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
