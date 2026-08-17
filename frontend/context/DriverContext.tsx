"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { Driver, DriverAvailability, DriverStatus } from "@/types/driver";

import { initialDrivers } from "@/data/drivers";

interface DriverContextType {
  drivers: Driver[];
  isLoaded: boolean;

  addDriver: (driver: Driver) => void;

  updateDriver: (driver: Driver) => void;

  getDriverById: (id: string) => Driver | undefined;

  updateDriverStatus: (id: string, status: DriverStatus) => void;

  updateDriverAvailability: (
    id: string,
    availability: DriverAvailability,
  ) => void;

  deleteDriver: (id: string) => void;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export function DriverProvider({ children }: { children: ReactNode }) {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);

  const [isLoaded, setIsLoaded] = useState(false);

  /* LOAD */

  useEffect(() => {
    const savedDrivers = localStorage.getItem("trucklagbe_drivers");

    if (savedDrivers) {
      try {
        setDrivers(JSON.parse(savedDrivers));
      } catch (error) {
        console.error("Failed to load drivers", error);
      }
    }

    setIsLoaded(true);
  }, []);

  /* SAVE */

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("trucklagbe_drivers", JSON.stringify(drivers));
  }, [drivers, isLoaded]);

  function addDriver(driver: Driver) {
    setDrivers((previousDrivers) => [...previousDrivers, driver]);
  }

  function updateDriver(driver: Driver) {
    setDrivers((previousDrivers) =>
      previousDrivers.map((item) => (item.id === driver.id ? driver : item)),
    );
  }

  function getDriverById(id: string) {
    return drivers.find((driver) => driver.id === id);
  }

  function updateDriverStatus(id: string, status: DriverStatus) {
    setDrivers((previousDrivers) =>
      previousDrivers.map((driver) =>
        driver.id === id
          ? {
              ...driver,
              status,
            }
          : driver,
      ),
    );
  }

  function updateDriverAvailability(
    id: string,
    availability: DriverAvailability,
  ) {
    setDrivers((previousDrivers) =>
      previousDrivers.map((driver) =>
        driver.id === id
          ? {
              ...driver,
              availability,
            }
          : driver,
      ),
    );
  }

  function deleteDriver(id: string) {
    setDrivers((previousDrivers) =>
      previousDrivers.filter((driver) => driver.id !== id),
    );
  }

  return (
    <DriverContext.Provider
      value={{
        drivers,
        isLoaded,
        addDriver,
        updateDriver,
        getDriverById,
        updateDriverStatus,
        updateDriverAvailability,
        deleteDriver,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
}

export function useDrivers() {
  const context = useContext(DriverContext);

  if (!context) {
    throw new Error("useDrivers must be used inside DriverProvider");
  }

  return context;
}
