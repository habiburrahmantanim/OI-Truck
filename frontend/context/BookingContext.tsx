"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

/* ================= TYPES ================= */

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Assigned"
  | "On the Way"
  | "Picked Up"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

export interface Booking {
  id: string;

  // Customer
  customerName: string;
  phone: string;

  // Location
  pickupLocation: string;
  deliveryLocation: string;

  // Schedule
  pickupDate: string;
  pickupTime: string;

  // Cargo
  cargoType: string;
  weight: number;

  // Truck
  truckId: number;
  truckName: string;
  truckCapacity: string;

  // Price
  baseFare: number;
  serviceFee: number;
  discount: number;
  totalPrice: number;

  // Status
  status: BookingStatus;
  createdAt: string;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  getBookingById: (id: string) => Booking | undefined;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  deleteBooking: (id: string) => void;
}

/* ================= CONTEXT ================= */

const BookingContext = createContext<BookingContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load bookings from localStorage
  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem("trucklagbe_bookings");

      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save bookings to localStorage
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem("trucklagbe_bookings", JSON.stringify(bookings));
    } catch (error) {
      console.error("Failed to save bookings:", error);
    }
  }, [bookings, isLoaded]);

  /* ================= FUNCTIONS ================= */

  function addBooking(booking: Booking) {
    setBookings((previousBookings) => [booking, ...previousBookings]);
  }

  function getBookingById(id: string) {
    return bookings.find((booking) => booking.id === id);
  }

  function updateBookingStatus(id: string, status: BookingStatus) {
    setBookings((previousBookings) =>
      previousBookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status,
            }
          : booking,
      ),
    );
  }

  function deleteBooking(id: string) {
    setBookings((previousBookings) =>
      previousBookings.filter((booking) => booking.id !== id),
    );
  }

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        getBookingById,
        updateBookingStatus,
        deleteBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

/* ================= CUSTOM HOOK ================= */

export function useBookings() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBookings must be used inside BookingProvider");
  }

  return context;
}
