"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { useAuth } from "@/context/AuthContext";

import { Truck, CreateTruckData } from "@/types/truck";

import {
  getTrucks,
  createTruck as createTruckApi,
  updateTruck as updateTruckApi,
  deleteTruck as deleteTruckApi,
} from "@/lib/truckApi";

interface TruckContextType {
  trucks: Truck[];
  loading: boolean;
  error: string | null;

  refreshTrucks: () => Promise<void>;

  addTruck: (data: CreateTruckData) => Promise<Truck>;

  updateTruck: (id: number, data: Partial<CreateTruckData>) => Promise<Truck>;

  deleteTruck: (id: number) => Promise<void>;
}

const TruckContext = createContext<TruckContextType | undefined>(undefined);

export function TruckProvider({ children }: { children: ReactNode }) {
  const { accessToken, isAuthenticated, loading: authLoading } = useAuth();

  const [trucks, setTrucks] = useState<Truck[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const refreshTrucks = async () => {
    if (!accessToken) {
      setTrucks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getTrucks(accessToken);

      setTrucks(data);
    } catch (err) {
      console.error("Failed to load trucks:", err);

      setError(err instanceof Error ? err.message : "Failed to load trucks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !accessToken) {
      setTrucks([]);
      setLoading(false);
      return;
    }

    refreshTrucks();
  }, [authLoading, isAuthenticated, accessToken]);

  const addTruck = async (data: CreateTruckData) => {
    if (!accessToken) {
      throw new Error("You must be logged in.");
    }

    try {
      setError(null);

      const truck = await createTruckApi(data, accessToken);

      setTrucks((current) => [truck, ...current]);

      return truck;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create truck.";

      setError(message);
      throw err;
    }
  };

  const updateTruck = async (id: number, data: Partial<CreateTruckData>) => {
    if (!accessToken) {
      throw new Error("You must be logged in.");
    }

    try {
      setError(null);

      const updated = await updateTruckApi(id, data, accessToken);

      setTrucks((current) =>
        current.map((truck) => (truck.id === id ? updated : truck)),
      );

      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update truck.";

      setError(message);
      throw err;
    }
  };

  const deleteTruck = async (id: number) => {
    if (!accessToken) {
      throw new Error("You must be logged in.");
    }

    try {
      setError(null);

      await deleteTruckApi(id, accessToken);

      setTrucks((current) => current.filter((truck) => truck.id !== id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete truck.";

      setError(message);
      throw err;
    }
  };

  return (
    <TruckContext.Provider
      value={{
        trucks,
        loading,
        error,
        refreshTrucks,
        addTruck,
        updateTruck,
        deleteTruck,
      }}
    >
      {children}
    </TruckContext.Provider>
  );
}

export function useTruck() {
  const context = useContext(TruckContext);

  if (!context) {
    throw new Error("useTruck must be used inside TruckProvider");
  }

  return context;
}

export const useTrucks = useTruck;
