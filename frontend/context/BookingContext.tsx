"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Booking,
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/types/booking";

export type {
  Booking,
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/types/booking";

/* =========================================
   CONTEXT TYPE
========================================= */

interface BookingContextType {
  bookings: Booking[];

  isLoaded: boolean;

  addBooking: (booking: Booking) => void;

  getBookingById: (id: string) => Booking | undefined;

  updateBookingStatus: (id: string, status: BookingStatus) => void;

  updatePaymentStatus: (
    id: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: PaymentMethod,
    paymentId?: string,
  ) => void;

  updateBooking: (booking: Booking) => void;

  deleteBooking: (id: string) => void;

  cancelBooking: (id: string) => void;
}

/* =========================================
   CONTEXT
========================================= */

const BookingContext = createContext<BookingContextType | undefined>(undefined);

/* =========================================
   PROVIDER
========================================= */

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);

  /* =========================================
     LOAD BOOKINGS
  ========================================= */

  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem("trucklagbe_bookings");

      if (savedBookings) {
        const parsedBookings = JSON.parse(savedBookings) as Booking[];

        const normalizedBookings = parsedBookings.map((booking) => ({
          ...booking,

          bookingId: booking.bookingId ?? booking.id,

          customerPhone: booking.customerPhone ?? booking.phone,

          dropLocation: booking.dropLocation ?? booking.deliveryLocation,

          estimatedFare:
            booking.estimatedFare ?? booking.totalPrice ?? booking.price,

          price:
            booking.price ?? booking.totalPrice ?? booking.estimatedFare ?? 0,

          paymentStatus: booking.paymentStatus ?? "Unpaid",
        }));

        setBookings(normalizedBookings);
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);

      setBookings([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /* =========================================
     SAVE BOOKINGS
  ========================================= */

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem("trucklagbe_bookings", JSON.stringify(bookings));
    } catch (error) {
      console.error("Failed to save bookings:", error);
    }
  }, [bookings, isLoaded]);

  /* =========================================
     ADD BOOKING
  ========================================= */

  function addBooking(booking: Booking) {
    const normalizedBooking: Booking = {
      ...booking,

      bookingId: booking.bookingId ?? booking.id,

      price: Number(booking.price) || 0,

      paymentStatus: booking.paymentStatus ?? "Unpaid",

      createdAt: booking.createdAt ?? new Date().toISOString(),
    };

    setBookings((previousBookings) => [normalizedBooking, ...previousBookings]);
  }

  /* =========================================
     GET BOOKING
  ========================================= */

  function getBookingById(id: string): Booking | undefined {
    return bookings.find(
      (booking) =>
        String(booking.id) === String(id) ||
        String(booking.bookingId) === String(id),
    );
  }

  /* =========================================
     UPDATE BOOKING STATUS
  ========================================= */

  function updateBookingStatus(id: string, status: BookingStatus) {
    setBookings((previousBookings) =>
      previousBookings.map((booking) =>
        String(booking.id) === String(id)
          ? {
              ...booking,

              status,

              updatedAt: new Date().toISOString(),
            }
          : booking,
      ),
    );
  }

  /* =========================================
     UPDATE PAYMENT STATUS
  ========================================= */

  function updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: PaymentMethod,
    paymentId?: string,
  ) {
    setBookings((previousBookings) =>
      previousBookings.map((booking) => {
        if (String(booking.id) !== String(id)) {
          return booking;
        }

        return {
          ...booking,

          paymentStatus,

          ...(paymentMethod
            ? {
                paymentMethod,
              }
            : {}),

          ...(paymentId
            ? {
                paymentId,
                transactionId: paymentId,
              }
            : {}),

          updatedAt: new Date().toISOString(),
        };
      }),
    );
  }

  /* =========================================
     UPDATE COMPLETE BOOKING
  ========================================= */

  function updateBooking(updatedBooking: Booking) {
    setBookings((previousBookings) =>
      previousBookings.map((booking) =>
        String(booking.id) === String(updatedBooking.id)
          ? {
              ...updatedBooking,

              updatedAt: new Date().toISOString(),
            }
          : booking,
      ),
    );
  }

  /* =========================================
     DELETE BOOKING
  ========================================= */

  function deleteBooking(id: string) {
    setBookings((previousBookings) =>
      previousBookings.filter((booking) => String(booking.id) !== String(id)),
    );
  }

  /* =========================================
     CANCEL BOOKING
  ========================================= */

  function cancelBooking(id: string) {
    updateBookingStatus(id, "Cancelled");
  }

  /* =========================================
     PROVIDER
  ========================================= */

  return (
    <BookingContext.Provider
      value={{
        bookings,

        isLoaded,

        addBooking,

        getBookingById,

        updateBookingStatus,

        updatePaymentStatus,

        updateBooking,

        deleteBooking,

        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

/* =========================================
   HOOK
========================================= */

export function useBookings() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBookings must be used inside BookingProvider");
  }

  return context;
}

/* =========================================
   COMPATIBILITY HOOK
========================================= */

export const useBooking = useBookings;
