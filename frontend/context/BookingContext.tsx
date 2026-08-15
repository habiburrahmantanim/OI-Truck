"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* ================= TYPES ================= */

export type BookingStatus =
  | "Confirmed"
  | "Driver Assigned"
  | "Picked Up"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

export type Booking = {
  id: string;
  bookingId: string;

  truckId: number;
  truckName: string;
  truckCapacity: string;
  truckPrice: number;

  customerName: string;
  customerPhone: string;

  pickupLocation: string;
  dropLocation: string;

  cargoType: string;
  weight: string;

  pickupDate: string;
  pickupTime: string;

  distance: number;
  estimatedFare: number;

  status: BookingStatus;

  driverName?: string;
  driverPhone?: string;

  createdAt: string;
};

/* ================= CONTEXT ================= */

type BookingContextType = {
  bookings: Booking[];

  addBooking: (
    bookingData: Omit<Booking, "id" | "bookingId" | "status" | "createdAt">,
  ) => Booking;

  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;

  getBookingById: (bookingId: string) => Booking | undefined;

  cancelBooking: (bookingId: string) => void;

  clearBookings: () => void;

  isLoaded: boolean;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  /* LOAD BOOKINGS FROM LOCALSTORAGE */
  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem("trucklagbe-bookings");

      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /* SAVE BOOKINGS TO LOCALSTORAGE */
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("trucklagbe-bookings", JSON.stringify(bookings));
  }, [bookings, isLoaded]);

  /* ADD BOOKING */
  const addBooking = (
    bookingData: Omit<Booking, "id" | "bookingId" | "status" | "createdAt">,
  ): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: crypto.randomUUID(),
      bookingId: `TL-${Date.now().toString().slice(-8)}${Math.floor(
        Math.random() * 100,
      )
        .toString()
        .padStart(2, "0")}`,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };

    setBookings((previousBookings) => [newBooking, ...previousBookings]);

    return newBooking;
  };

  /* UPDATE STATUS */
  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((previousBookings) =>
      previousBookings.map((booking) =>
        booking.bookingId === bookingId ? { ...booking, status } : booking,
      ),
    );
  };

  /* GET BOOKING BY ID */
  const getBookingById = (bookingId: string): Booking | undefined => {
    return bookings.find(
      (booking) =>
        booking.bookingId.toLowerCase() === bookingId.trim().toLowerCase(),
    );
  };

  /* CANCEL BOOKING */
  const cancelBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, "Cancelled");
  };

  /* CLEAR BOOKINGS */
  const clearBookings = () => {
    setBookings([]);
    localStorage.removeItem("trucklagbe-bookings");
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBookingStatus,
        getBookingById,
        cancelBooking,
        clearBookings,
        isLoaded,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

/* ================= CUSTOM HOOK ================= */

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }

  return context;
}
