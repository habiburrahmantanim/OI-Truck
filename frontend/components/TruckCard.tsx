"use client";

import Link from "next/link";
import { Truck, Package, ArrowRight } from "lucide-react";

interface TruckCardProps {
  truck: {
    id: number;
    name: string;
    capacity: string;
    description: string;
    price: number;
    image: string;
  };
}

export default function TruckCard({ truck }: TruckCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="h-48 overflow-hidden bg-slate-100">
        <img
          src={truck.image}
          alt={truck.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{truck.name}</h3>

            <p className="mt-1 text-sm text-slate-500">{truck.description}</p>
          </div>

          <Truck className="text-orange-500" size={28} />
        </div>

        <div className="mb-5 flex items-center gap-2 text-slate-600">
          <Package size={18} />
          <span>Capacity: {truck.capacity}</span>
        </div>

        <div className="flex items-center justify-between border-t pt-5">
          <div>
            <p className="text-xs text-slate-500">Starting from</p>
            <p className="text-xl font-bold text-orange-500">
              ৳{truck.price.toLocaleString()}
            </p>
          </div>

          <Link
            href={`/booking?truck=${truck.id}`}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-500"
          >
            Book
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}
