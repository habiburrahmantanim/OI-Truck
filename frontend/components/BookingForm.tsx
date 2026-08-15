"use client";
import { useState } from "react";

export default function BookingForm() { const [submitted, setSubmitted] = useState(false); if (submitted) return <p className="rounded-lg bg-green-50 p-4 text-green-800">Booking request received. We will confirm it shortly.</p>; return <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><input required placeholder="Pickup location" className="rounded-lg border p-3"/><input required placeholder="Delivery location" className="rounded-lg border p-3"/><input required type="date" className="rounded-lg border p-3"/><button className="rounded-lg bg-orange-500 p-3 font-bold text-white">Request booking</button></form>; }
