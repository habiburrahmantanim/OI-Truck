"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { initialUsers } from "@/data/users";
import { User, UserRole } from "@/types/user";

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
}

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

  register: (data: RegisterData) => {
    success: boolean;
    message?: string;
    user?: User;
  };

  logout: () => void;

  updateUser: (updatedUser: User) => void;

  updateUserStatus: (userId: string, isActive: boolean) => void;

  getUsersByRole: (role: UserRole) => User[];

  getUserById: (id: string) => User | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "trucklagbe_users";
const CURRENT_USER_KEY = "trucklagbe_current_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  /* LOAD DATA */
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(USERS_KEY);
      const savedCurrentUser = localStorage.getItem(CURRENT_USER_KEY);

      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        setUsers(initialUsers);
      }

      if (savedCurrentUser) {
        setUser(JSON.parse(savedCurrentUser));
      }
    } catch (error) {
      console.error("Failed to load authentication data:", error);

      setUsers(initialUsers);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /* SAVE USERS */
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users, isLoaded]);

  /* SAVE CURRENT USER */
  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user, isLoaded]);

  function login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const foundUser = users.find(
      (item) =>
        item.email.toLowerCase() === normalizedEmail &&
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
        message: "Your account has been suspended.",
      };
    }

    const safeUser = { ...foundUser };

    setUser(safeUser);

    return {
      success: true,
      user: safeUser,
    };
  }

  function register(data: RegisterData) {
    const email = data.email.trim().toLowerCase();
    const phone = data.phone.trim();

    const exists = users.some(
      (item) => item.email.toLowerCase() === email || item.phone === phone,
    );

    if (exists) {
      return {
        success: false,
        message: "An account with this email or phone number already exists.",
      };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email,
      phone,
      password: data.password,
      role: data.role || "customer",
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setUsers((previousUsers) => [...previousUsers, newUser]);

    return {
      success: true,
      user: newUser,
    };
  }

  function logout() {
    setUser(null);
  }

  function updateUser(updatedUser: User) {
    setUsers((previousUsers) =>
      previousUsers.map((item) =>
        item.id === updatedUser.id ? updatedUser : item,
      ),
    );

    if (user?.id === updatedUser.id) {
      setUser(updatedUser);
    }
  }

  function updateUserStatus(userId: string, isActive: boolean) {
    const updatedUsers = users.map((item) =>
      item.id === userId
        ? {
            ...item,
            isActive,
          }
        : item,
    );

    setUsers(updatedUsers);

    if (user?.id === userId) {
      const updatedCurrentUser = updatedUsers.find(
        (item) => item.id === userId,
      );

      if (updatedCurrentUser) {
        setUser(updatedCurrentUser);
      }
    }
  }

  function getUsersByRole(role: UserRole) {
    return users.filter((item) => item.role === role);
  }

  function getUserById(id: string) {
    return users.find((item) => item.id === id);
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
        updateUserStatus,
        getUsersByRole,
        getUserById,
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
