import type { Metadata } from "next";
import { ReactNode } from "react";

import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { TruckProvider } from "@/context/TruckContext";
import { DriverProvider } from "@/context/DriverContext";
import { BookingProvider } from "@/context/BookingContext";

import Footer from "@/components/Footer";
import CanvasCursor from "@/components/CanvasCursor";

export const metadata: Metadata = {
  title: "OI-Truck | Truck Lagbe",
  description: "Truck booking and management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
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
