"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { Booking, CreateBookingData } from "@/types/booking";

import {
  getBookings,
  createBooking as createBookingApi,
  updateBooking as updateBookingApi,
  deleteBooking as deleteBookingApi,
} from "@/lib/bookingApi";

import { useAuth } from "@/context/AuthContext";

interface BookingContextType {
  bookings: Booking[];

  loading: boolean;
  isLoaded: boolean;
  error: string | null;

  refreshBookings: () => Promise<void>;

  addBooking: (data: CreateBookingData) => Promise<Booking>;

  updateBooking: (
    id: number,
    data: Partial<CreateBookingData>,
  ) => Promise<Booking>;

  deleteBooking: (id: number) => Promise<void>;

  getBookingById: (id: number) => Booking | undefined;

  updateBookingStatus: (
    id: number,
    status: Booking["status"],
  ) => Promise<Booking>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const { accessToken, isAuthenticated, loading: authLoading } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const refreshBookings = async () => {
    if (!accessToken) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getBookings(accessToken);

      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings:", err);

      setError(err instanceof Error ? err.message : "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !accessToken) {
      setBookings([]);
      setLoading(false);
      return;
    }

    refreshBookings();
  }, [authLoading, isAuthenticated, accessToken]);

  const addBooking = async (data: CreateBookingData) => {
    if (!accessToken) {
      throw new Error("You must be logged in to create a booking.");
    }

    try {
      setError(null);

      const booking = await createBookingApi(data, accessToken);

      setBookings((current) => [booking, ...current]);

      return booking;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create booking.";

      setError(message);

      throw err;
    }
  };

  const updateBooking = async (
    id: number,
    data: Partial<CreateBookingData>,
  ) => {
    if (!accessToken) {
      throw new Error("You must be logged in.");
    }

    try {
      setError(null);

      const updated = await updateBookingApi(id, data, accessToken);

      setBookings((current) =>
        current.map((booking) => (booking.id === id ? updated : booking)),
      );

      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update booking.";

      setError(message);

      throw err;
    }
  };

  const deleteBooking = async (id: number) => {
    if (!accessToken) {
      throw new Error("You must be logged in.");
    }

    try {
      setError(null);

      await deleteBookingApi(id, accessToken);

      setBookings((current) => current.filter((booking) => booking.id !== id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete booking.";

      setError(message);

      throw err;
    }
  };

  const getBookingById = (id: number) => {
    return bookings.find((booking) => booking.id === id);
  };

  const updateBookingStatus = (id: number, status: Booking["status"]) =>
    updateBooking(id, { status });

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        isLoaded: !loading,
        error,
        refreshBookings,
        addBooking,
        updateBooking,
        deleteBooking,
        getBookingById,
        updateBookingStatus,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }

  return context;
}

export const useBookings = useBooking;
export type { Booking };
