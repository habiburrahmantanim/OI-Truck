"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { api } from "@/lib/api";
import { User, LoginResponse, RegisterResponse } from "@/types/auth";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone: string;
  role?: "CUSTOMER" | "DRIVER";
}

// Extended UI User interface to guarantee property mapping
export interface UIUser extends User {
  name: string;
  role: string;
}

interface AuthContextType {
  user: UIUser | null;
  accessToken: string | null;
  loading: boolean;
  isLoaded: boolean; // Added so Navbar can destructure `isLoaded`
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = "oi_truck_access";
const REFRESH_TOKEN_KEY = "oi_truck_refresh";
const USER_KEY = "oi_truck_user";

// Helper to normalize user properties (lowercase roles, fallback names)
function normalizeUser(rawUser: User | null): UIUser | null {
  if (!rawUser) return null;

  const fullName = [rawUser.first_name, rawUser.last_name]
    .filter(Boolean)
    .join(" ");

  return {
    ...rawUser,
    name: fullName || rawUser.username || "User",
    role: (rawUser.role || "customer").toLowerCase(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UIUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setAccessToken(null);
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      // Hydrate instantly from localStorage to avoid initial flash
      if (storedUser) {
        try {
          setUser(normalizeUser(JSON.parse(storedUser)));
        } catch {
          // Ignore parse errors
        }
      }

      if (!storedAccessToken) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await api.get<User>("/auth/me/", storedAccessToken);
        const normalized = normalizeUser(currentUser);

        setAccessToken(storedAccessToken);
        setUser(normalized);
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      } catch {
        if (storedRefreshToken) {
          try {
            const refreshed = await api.post<{ access: string }>(
              "/auth/refresh/",
              { refresh: storedRefreshToken },
            );

            localStorage.setItem(ACCESS_TOKEN_KEY, refreshed.access);
            setAccessToken(refreshed.access);

            const currentUser = await api.get<User>(
              "/auth/me/",
              refreshed.access,
            );
            const normalized = normalizeUser(currentUser);

            setUser(normalized);
            localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
          } catch {
            logout();
          }
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await api.post<LoginResponse>("/auth/login/", {
      username,
      password,
    });

    const normalized = normalizeUser(response.user);

    localStorage.setItem(ACCESS_TOKEN_KEY, response.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));

    setAccessToken(response.access);
    setUser(normalized);
  };

  const register = async (data: RegisterData) => {
    const response = await api.post<RegisterResponse>("/auth/register/", {
      ...data,
      role: data.role || "CUSTOMER",
    });

    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        isLoaded: !loading, // Maps loading boolean to isLoaded flag
        login,
        register,
        logout,
        isAuthenticated: !!user,
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
