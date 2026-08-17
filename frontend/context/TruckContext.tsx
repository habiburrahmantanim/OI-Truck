"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { Truck } from "@/types/truck";
import { trucks as initialTrucks } from "@/data/data";

interface TruckContextType {
  trucks: Truck[];
  isLoaded: boolean;

  addTruck: (truck: Truck) => void;

  updateTruck: (truck: Truck) => void;

  deleteTruck: (id: number) => void;

  getTruckById: (id: number) => Truck | undefined;

  updateTruckAvailability: (id: number, available: boolean) => void;
}

const TruckContext = createContext<TruckContextType | undefined>(undefined);

export function TruckProvider({ children }: { children: ReactNode }) {
  const [trucks, setTrucks] = useState<Truck[]>(initialTrucks);

  const [isLoaded, setIsLoaded] = useState(false);

  /* LOAD */

  useEffect(() => {
    const savedTrucks = localStorage.getItem("trucklagbe_trucks");

    if (savedTrucks) {
      try {
        setTrucks(JSON.parse(savedTrucks));
      } catch (error) {
        console.error("Failed to load trucks", error);
      }
    }

    setIsLoaded(true);
  }, []);

  /* SAVE */

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("trucklagbe_trucks", JSON.stringify(trucks));
  }, [trucks, isLoaded]);

  function addTruck(truck: Truck) {
    setTrucks((previousTrucks) => [...previousTrucks, truck]);
  }

  function updateTruck(updatedTruck: Truck) {
    setTrucks((previousTrucks) =>
      previousTrucks.map((truck) =>
        truck.id === updatedTruck.id ? updatedTruck : truck,
      ),
    );
  }

  function deleteTruck(id: number) {
    setTrucks((previousTrucks) =>
      previousTrucks.filter((truck) => truck.id !== id),
    );
  }

  function getTruckById(id: number) {
    return trucks.find((truck) => truck.id === id);
  }

  function updateTruckAvailability(id: number, available: boolean) {
    setTrucks((previousTrucks) =>
      previousTrucks.map((truck) =>
        truck.id === id
          ? {
              ...truck,
              available,
            }
          : truck,
      ),
    );
  }

  return (
    <TruckContext.Provider
      value={{
        trucks,
        isLoaded,
        addTruck,
        updateTruck,
        deleteTruck,
        getTruckById,
        updateTruckAvailability,
      }}
    >
      {children}
    </TruckContext.Provider>
  );
}

export function useTrucks() {
  const context = useContext(TruckContext);

  if (!context) {
    throw new Error("useTrucks must be used inside TruckProvider");
  }

  return context;
}
