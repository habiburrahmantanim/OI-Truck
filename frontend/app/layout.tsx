import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { BookingProvider } from "@/context/BookingContext";
import { DriverProvider } from "@/context/DriverContext";
import { TruckProvider } from "@/context/TruckContext";
import Footer from "@/components/Footer";
import CanvasCursor from "@/components/CanvasCursor";

export const metadata: Metadata = {
  title: "OI-Truck | Truck Lagbe",
  description: "Modern Truck Booking Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TruckProvider>
            <DriverProvider>
              <BookingProvider>
                {children}
                <CanvasCursor />
                <Footer />
              </BookingProvider>
            </DriverProvider>
          </TruckProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
