"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone, Send, Truck } from "lucide-react";

import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = 2026;

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/driver") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
                <Truck size={23} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  Truck<span className="text-orange-500">Lagbe</span>
                </h2>

                <p className="text-xs text-slate-500">Smart Logistics</p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Book reliable trucks for your business and personal deliveries.
              Find the right vehicle and manage your transportation easily.
            </p>

            {/* SOCIAL LINKS */}
            <div className="mt-6 flex items-center gap-3">
              <SocialButton
                href="#"
                label="Facebook"
                icon={
                  <FontAwesomeIcon icon={faFacebookF} className="text-base" />
                }
              />

              <SocialButton
                href="#"
                label="Instagram"
                icon={
                  <FontAwesomeIcon icon={faInstagram} className="text-base" />
                }
              />

              <SocialButton
                href="#"
                label="Twitter"
                icon={
                  <FontAwesomeIcon icon={faTwitter} className="text-base" />
                }
              />

              <SocialButton
                href="#"
                label="LinkedIn"
                icon={
                  <FontAwesomeIcon icon={faLinkedinIn} className="text-base" />
                }
              />
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-base font-bold text-white">Quick Links</h3>

            <ul className="mt-5 space-y-3">
              <FooterLink href="/" label="Home" />
              <FooterLink href="/trucks" label="Browse Trucks" />
              <FooterLink href="/booking" label="Book a Truck" />
              <FooterLink href="/bookings" label="My Bookings" />
              <FooterLink href="/tracking" label="Track Booking" />
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="text-base font-bold text-white">Our Services</h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li className="text-slate-400">Truck Booking</li>
              <li className="text-slate-400">Cargo Transportation</li>
              <li className="text-slate-400">Business Logistics</li>
              <li className="text-slate-400">Delivery Tracking</li>
              <li className="text-slate-400">Flexible Vehicle Options</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-base font-bold text-white">Contact Us</h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={19} className="mt-0.5 shrink-0 text-orange-500" />

                <p className="text-sm leading-6 text-slate-400">
                  Dhaka, Bangladesh
                </p>
              </div>

              <a
                href="tel:+8801700000000"
                className="flex items-center gap-3 text-sm text-slate-400 transition hover:text-orange-400"
              >
                <Phone size={19} className="shrink-0 text-orange-500" />
                +880 1700-000000
              </a>

              <a
                href="mailto:info@trucklagbe.com"
                className="flex items-center gap-3 text-sm text-slate-400 transition hover:text-orange-400"
              >
                <Mail size={19} className="shrink-0 text-orange-500" />
                info@trucklagbe.com
              </a>
            </div>

            <Link
              href="/booking"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              <Send size={17} />
              Book Now
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left">
          <p>© {currentYear} TruckLagbe. All rights reserved.</p>

          <div className="flex justify-center gap-5 sm:justify-end">
            <Link href="/privacy" className="transition hover:text-orange-400">
              Privacy Policy
            </Link>

            <Link href="/terms" className="transition hover:text-orange-400">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ================= SMALL COMPONENTS ================= */

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-slate-400 transition hover:text-orange-400"
      >
        {label}
      </Link>
    </li>
  );
}

function SocialButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-slate-400 transition hover:bg-orange-500 hover:text-white"
    >
      {icon}
    </a>
  );
}
