"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { Booking, BookingStatus } from "@/types/booking";

export type { Booking, BookingStatus } from "@/types/booking";

interface BookingContextType {
  bookings: Booking[];
  isLoaded: boolean;
  addBooking: (booking: Booking) => void;
  getBookingById: (id: string) => Booking | undefined;

  updateBookingStatus: (id: string, status: BookingStatus) => void;

  updateBooking: (booking: Booking) => void;

  deleteBooking: (id: string) => void;
  cancelBooking: (id: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem("trucklagbe_bookings");

      if (savedBookings) {
        const parsedBookings = JSON.parse(savedBookings) as Booking[];
        setBookings(
          parsedBookings.map((booking) => ({
            ...booking,
            bookingId: booking.bookingId ?? booking.id,
            customerPhone: booking.customerPhone ?? booking.phone,
            dropLocation: booking.dropLocation ?? booking.deliveryLocation,
            estimatedFare: booking.estimatedFare ?? booking.totalPrice,
          })),
        );
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("trucklagbe_bookings", JSON.stringify(bookings));
  }, [bookings, isLoaded]);

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

  function updateBooking(updatedBooking: Booking) {
    setBookings((previousBookings) =>
      previousBookings.map((booking) =>
        booking.id === updatedBooking.id ? updatedBooking : booking,
      ),
    );
  }

  function deleteBooking(id: string) {
    setBookings((previousBookings) =>
      previousBookings.filter((booking) => booking.id !== id),
    );
  }

  function cancelBooking(id: string) {
    updateBookingStatus(id, "Cancelled");
  }

  return (
    <BookingContext.Provider
      value={{
        bookings,
        isLoaded,
        addBooking,
        getBookingById,
        updateBookingStatus,
        updateBooking,
        deleteBooking,
        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBookings must be used inside BookingProvider");
  }

  return context;
}

// Keep the singular hook as a compatibility alias for existing operation pages.
export const useBooking = useBookings;
