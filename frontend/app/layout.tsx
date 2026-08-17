import type { Metadata } from "next";
import "./globals.css";

import { BookingProvider } from "@/context/BookingContext";
import CanvasCursor from "@/components/CanvasCursor";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Truck Lagbe",
  description: "Book trucks easily for your deliveries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <BookingProvider>
          <CanvasCursor />
          {children}
          <Footer />
        </BookingProvider>
      </body>
    </html>
  );
}
